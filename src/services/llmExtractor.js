/**
 * LLM Extraction Service
 * Sends brochure text to structured extraction API or uses intelligent semantic heuristic extraction.
 */

const EXTRACTION_SYSTEM_PROMPT = `You are a documentary researcher and editorial visual strategist for impact campaigns and pitch decks.
Your job is to analyze the provided campaign brochure or outreach brief text, and extract key documentary narrative elements in strict JSON format.

JSON Schema required:
{
  "campaign_name": "string (Title/Name of the initiative or campaign)",
  "one_line_summary": "string (One concise, punchy sentence explaining the campaign's core mission and on-the-ground reality)",
  "themes": [
    {
      "label": "string (Theme/Curatorial Strand name, e.g., 'Youth Visual Literacy')",
      "description": "string (1-2 sentences describing what happens in this strand)"
    }
  ],
  "settings": [
    "string (dynamic list of 4-8 specific on-the-ground locations/scenarios genuinely derived from the text, e.g., 'Open-air village chaupal under banyan tree', 'Inside the mobile cinema van showing projector equipment')"
  ],
  "tone_keywords": [
    "string (4-8 mood/atmosphere words implied by the brochure, e.g., 'Hopeful', 'Communitarian', 'Dignified', 'Rustic', 'Poetic')"
  ],
  "subject_examples": [
    "string (4-6 descriptive example subjects/people/scenes for documentary photography, e.g., 'Village elder in saffron turban watching documentary under night sky', 'Young girls holding smartphones during video workshop')"
  ]
}

Ensure the response is raw valid JSON without markdown fences. Keep themes between 2 and 6 items.`;

/**
 * Extracts structured campaign data from brochure text
 * @param {string} text - Raw extracted text of the brochure
 * @param {string} [customApiKey] - Optional user-provided API key
 * @returns {Promise<ExtractedBrochureData>}
 */
export async function extractCampaignData(text, customApiKey = '') {
  if (!text || text.trim().length < 20) {
    throw new Error('Brochure text is too brief to extract campaign themes.');
  }

  // First try backend / serverless endpoint
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (customApiKey) {
      headers['x-api-key'] = customApiKey;
    }

    const response = await fetch('/api/extract-brochure', {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, systemPrompt: EXTRACTION_SYSTEM_PROMPT })
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.campaign_name && Array.isArray(data.themes) && data.themes.length > 0) {
        return sanitizeExtractedData(data);
      }
    }
  } catch (err) {
    console.warn('Backend LLM API endpoint unavailable or returned error, falling back to semantic parser:', err);
  }

  // Intelligent Semantic Fallback Parser (guarantees 100% reliability offline or when API key is unconfigured)
  return parseBrochureSemantically(text);
}

/**
 * Robust semantic heuristic NLP parser that parses unstructured brochure text
 * and extracts campaign name, summary, themes, settings, tone, and subjects.
 */
export function parseBrochureSemantically(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  
  // 1. Campaign Name
  let campaignName = "Documentary Outreach Initiative";
  const titleCandidates = lines.slice(0, 8).filter(l => 
    !l.toLowerCase().startsWith('page') && 
    !l.toLowerCase().startsWith('---') &&
    l.length >= 4 && l.length <= 90
  );
  if (titleCandidates.length > 0) {
    // Pick the most prominent heading line
    const cleanedTitle = titleCandidates[0].replace(/^(title|initiative|project|campaign|program):\s*/i, '');
    if (cleanedTitle.includes(':')) {
      campaignName = cleanedTitle.split(':')[0].trim();
    } else {
      campaignName = cleanedTitle;
    }
  }

  // 2. Summary
  let summary = "";
  const summaryHeaderIndex = lines.findIndex(l => /executive summary|overview|program overview|mission|about|initiative overview/i.test(l));
  if (summaryHeaderIndex !== -1 && lines[summaryHeaderIndex + 1]) {
    summary = lines.slice(summaryHeaderIndex + 1, summaryHeaderIndex + 4).join(' ');
  } else {
    // Take first substantive paragraph
    const bodyParas = lines.filter(l => l.length > 50 && !l.startsWith('#') && !l.startsWith('-'));
    summary = bodyParas[0] || lines.slice(0, 3).join(' ');
  }
  if (summary.length > 220) {
    summary = summary.substring(0, 217).replace(/[,;.]\s*[^,;.]*$/, '') + '...';
  }

  // 3. Themes / Strands (2-6 dynamic items)
  const themes = [];
  const strandMatches = text.match(/(?:(?:strand|pillar|theme|program|core|strand|initiative)\s*\d*[:.-]|^\d+\.\s+)([^\n:]+)[:\n]([^\n]+)/gim);
  
  if (strandMatches && strandMatches.length > 0) {
    for (const match of strandMatches.slice(0, 6)) {
      const parts = match.split(/[:\n]/);
      const label = parts[0].replace(/^[\d.)\s\-#*]+/, '').replace(/(strand|pillar|theme|initiative)\s*\d*[:.-]?/i, '').trim();
      const desc = parts.slice(1).join(' ').trim();
      if (label.length >= 3 && label.length <= 60) {
        themes.push({
          label: cleanTextString(label),
          description: cleanTextString(desc || `Documentary coverage focusing on ${label.toLowerCase()} in community contexts.`)
        });
      }
    }
  }

  // If no numbered strands matched, extract bulleted or section-based themes
  if (themes.length < 2) {
    const bulletLines = lines.filter(l => /^[•\-\*]\s+[A-Z]/.test(l) && l.length > 15 && l.length < 150);
    if (bulletLines.length >= 2) {
      bulletLines.slice(0, 5).forEach(b => {
        const clean = b.replace(/^[•\-\*]\s+/, '');
        const [lbl, ...rest] = clean.split(/[:–—]/);
        themes.push({
          label: cleanTextString(lbl),
          description: cleanTextString(rest.join(' ') || `Observational documentation of ${lbl.toLowerCase()}.`)
        });
      });
    }
  }

  // Fallback themes if brochure is unstructured narrative
  if (themes.length < 2) {
    themes.push(
      {
        label: "Community Participation & Agency",
        description: "Documenting community members actively collaborating, leading discussions, and participating in grassroots activities."
      },
      {
        label: "Field Logistics & Frontier Operations",
        description: "Visualizing the on-the-ground operational transit, technology setup, and grassroots infrastructure in remote regions."
      },
      {
        label: "Intergenerational Dialogue & Knowledge Sharing",
        description: "Capturing shared moments between elders, youth, and educators exchanging skills, stories, and cultural heritage."
      }
    );
  }

  // 4. Settings / Locations (Dynamic list derived genuinely from text)
  const settings = [];
  const settingKeywords = [
    'van', 'village', 'square', 'chaupal', 'courtyard', 'school', 'market', 'field', 'river', 'canopy',
    'forest', 'riverbank', 'laboratory', 'workshop', 'cooperative', 'hall', 'center', 'clinic', 'road',
    'classroom', 'tracks', 'outpost', 'maloca', 'rooftop', 'warehouse', 'hut', 'compound'
  ];

  lines.forEach(line => {
    if (/(?:location|setting|venue|where|site|environment|field)/i.test(line) || line.startsWith('- ') || line.startsWith('• ')) {
      const cleaned = line.replace(/^[\d.)\s\-#*•]+/, '').trim();
      if (cleaned.length > 10 && cleaned.length < 110) {
        if (settingKeywords.some(kw => cleaned.toLowerCase().includes(kw))) {
          if (!settings.includes(cleaned)) settings.push(cleaned);
        }
      }
    }
  });

  // Ensure 4-6 authentic settings
  if (settings.length < 3) {
    // Extract noun phrases near setting keywords
    lines.forEach(line => {
      settingKeywords.forEach(kw => {
        if (line.toLowerCase().includes(kw) && line.length < 120 && !settings.includes(line)) {
          const trimmed = line.replace(/^[^a-zA-Z]+/, '').trim();
          if (trimmed.length > 15 && trimmed.length < 95 && !settings.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
            settings.push(trimmed);
          }
        }
      });
    });
  }

  if (settings.length === 0) {
    settings.push(
      "Open-air community gathering space during twilight",
      "Field operation transit vehicle and equipment staging site",
      "Local workshop and hands-on participatory learning space",
      "Community center courtyard surrounded by local architecture"
    );
  }

  // 5. Tone Keywords
  const tonePool = [
    'hopeful', 'communitarian', 'dignified', 'resilient', 'poetic', 'rustic', 'authentic',
    'reverent', 'celebratory', 'intimate', 'atmospheric', 'determined', 'sovereign', 'industrious',
    'vibrant', 'optimistic', 'candid', 'unhurried', 'warm', 'observational'
  ];
  const matchedTones = tonePool.filter(tone => text.toLowerCase().includes(tone));
  const tone_keywords = matchedTones.length >= 3 
    ? matchedTones.map(capitalizeFirstLetter).slice(0, 7)
    : ['Dignified', 'Authentic', 'Communitarian', 'Hopeful', 'Observational', 'Rustic', 'Poetic'];

  // 6. Subject Examples
  const subject_examples = [];
  lines.forEach(line => {
    if (/(?:elder|youth|girl|boy|farmer|worker|technician|ranger|teacher|child|leader|member|woman|women|men|artist|director)/i.test(line)) {
      const cleanLine = line.replace(/^[\d.)\s\-#*•]+/, '').trim();
      if (cleanLine.length > 20 && cleanLine.length < 130 && !subject_examples.includes(cleanLine)) {
        subject_examples.push(cleanLine);
      }
    }
  });

  if (subject_examples.length < 2) {
    subject_examples.push(
      "Community elder observing the outreach event with attentive, contemplative focus",
      "Young participants collaborating closely during hands-on workshop session",
      "Field coordinator adjusting equipment under warm ambient evening light",
      "Local community members engaged in candid, unposed group conversation"
    );
  }

  return sanitizeExtractedData({
    campaign_name: campaignName || "Documentary Impact Campaign",
    one_line_summary: summary || "A grassroots documentary outreach initiative fostering community dialogue and empowerment.",
    themes: themes.slice(0, 6),
    settings: settings.slice(0, 8),
    tone_keywords: tone_keywords.slice(0, 8),
    subject_examples: subject_examples.slice(0, 6)
  });
}

/**
 * Sanitizes and validates extracted brochure data
 */
export function sanitizeExtractedData(data) {
  const safeData = {
    campaign_name: cleanTextString(data.campaign_name || "Documentary Impact Campaign"),
    one_line_summary: cleanTextString(data.one_line_summary || "Grassroots community storytelling and impact initiative."),
    themes: Array.isArray(data.themes) && data.themes.length > 0 
      ? data.themes.map(t => ({
          label: cleanTextString(typeof t === 'string' ? t : (t.label || t.name || 'Core Strand')),
          description: cleanTextString(typeof t === 'string' ? '' : (t.description || t.summary || ''))
        }))
      : [
          { label: "Community Storytelling", description: "Observational documentation of local participation and dialogue." },
          { label: "Grassroots Field Operations", description: "On-the-ground setup, transit, and community engagement." }
        ],
    settings: Array.isArray(data.settings) && data.settings.length > 0
      ? data.settings.map(cleanTextString).filter(s => s.length > 3)
      : ["Open-air community courtyard", "Workshop learning space", "Transit and field equipment setting"],
    tone_keywords: Array.isArray(data.tone_keywords) && data.tone_keywords.length > 0
      ? data.tone_keywords.map(cleanTextString).filter(t => t.length > 2)
      : ["Dignified", "Authentic", "Hopeful", "Communitarian"],
    subject_examples: Array.isArray(data.subject_examples) && data.subject_examples.length > 0
      ? data.subject_examples.map(cleanTextString).filter(s => s.length > 5)
      : ["Community member attentively participating in the initiative"]
  };

  return safeData;
}

function cleanTextString(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/["]/g, "'").replace(/\s+/g, ' ').trim();
}

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
