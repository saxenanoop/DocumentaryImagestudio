/**
 * Documentary Prompt Composer
 * Composes rich natural language AI image prompts for pitch decks following photojournalism principles.
 */

export const LIGHTING_OPTIONS = [
  { id: "natural-daylight", label: "Natural daylight", desc: "Clear, authentic daylight revealing true environmental color" },
  { id: "golden-hour", label: "Golden hour", desc: "Warm low-angle sun casting long shadows and amber highlights" },
  { id: "dusk-evening", label: "Dusk / evening", desc: "Twilight blue ambient with warm lantern or practical light accents" },
  { id: "overcast-soft", label: "Overcast soft light", desc: "Diffused cloud cover, even gentle shadows, and rich tonal depth" },
  { id: "warm-ambient", label: "Warm ambient light", desc: "Cozy interior tungsten, projector spill, or soft fire glow" }
];

export const COMPOSITION_OPTIONS = [
  { id: "environmental-portrait", label: "Environmental portrait", desc: "Subject in their natural workspace/setting with meaningful context" },
  { id: "candid-close-up", label: "Candid close-up", desc: "Intimate focus on unposed facial emotion, eyes, and micro-expressions" },
  { id: "wide-establishing", label: "Wide establishing shot", desc: "Expansive perspective establishing geographical landscape and community scale" },
  { id: "crowd-group", label: "Crowd / group view", desc: "Multigenerational community gathering showing collective action and energy" },
  { id: "rule-of-thirds", label: "Rule-of-thirds action", desc: "Dynamic off-center framing capturing active movement and narrative flow" }
];

export const DEFAULT_TONE_CHIPS = [
  "Dignified", "Authentic", "Communitarian", "Hopeful", "Observational", "Rustic", "Poetic", "Resilient"
];

/**
 * Composes a full natural language prompt from active builder parameters
 */
export function composeDocumentaryPrompt(params = {}) {
  const {
    campaignName = "",
    theme = null,
    setting = "",
    subject = "",
    moodKeywords = [],
    lighting = "Natural daylight",
    composition = "Environmental portrait",
    cameraStyle = "35mm documentary prime lens",
    ethicalLock = true,
    aspectRatio = "16:9",
    includeNegative = true
  } = params;

  const parts = [];

  // 1. Composition & Genre Framing
  const compPrefix = getCompositionPhrase(composition);
  parts.push(compPrefix);

  // 2. Subject & Narrative Focus
  if (subject && subject.trim()) {
    parts.push(`featuring ${subject.trim()}`);
  } else {
    parts.push(`capturing community members in active, unposed endeavors`);
  }

  // 3. Campaign & Theme Context
  if (theme && theme.label) {
    parts.push(`for the '${theme.label}' initiative`);
  } else if (campaignName) {
    parts.push(`for '${campaignName}'`);
  }

  // 4. On-the-Ground Location / Setting
  if (setting && setting.trim()) {
    parts.push(`set in ${setting.trim()}`);
  }

  // 5. Lighting & Atmosphere
  const lightingPhrase = getLightingPhrase(lighting);
  const moodPhrase = moodKeywords.length > 0 
    ? `${moodKeywords.join(', ').toLowerCase()} atmosphere`
    : 'authentic observational mood';
  
  parts.push(`captured under ${lightingPhrase}, evoking a ${moodPhrase}`);

  // 6. Camera & Documentary Imperfections
  parts.push(`shot on ${cameraStyle || '35mm documentary prime lens f/2.8'} at natural eye-level perspective`);
  parts.push(`authentic documentary film grain, natural optical depth of field, organic color grading, candid gesture, unposed posture`);

  // 7. Ethical / Style Guardrail Lock
  if (ethicalLock) {
    parts.push(`respectful and dignified representation of subjects, non-sensationalized storytelling, no staged or commercial stock photo aesthetics`);
  }

  // Assemble Main Prompt
  let assembledText = parts.join(', ') + `. --ar ${aspectRatio}`;

  // 8. Negative Avoidance Clause
  if (includeNegative) {
    const negativeClause = `\n\n[Negative / Avoid]: commercial stock photo look, staged smiling for camera, artificial studio flash, plastic airbrushed skin, oversaturated neon, fake HDR, cartoonish 3D render, poverty porn tropes, sensationalized distress, watermark, extra limbs.`;
    assembledText += negativeClause;
  }

  return assembledText;
}

function getCompositionPhrase(composition) {
  switch (composition) {
    case "Wide establishing shot":
      return "Wide-angle establishing documentary photograph";
    case "Candid close-up":
      return "Intimate candid close-up documentary photograph";
    case "Environmental portrait":
      return "Documentary environmental portrait";
    case "Crowd / group view":
      return "Observational group documentary photograph";
    case "Rule-of-thirds action":
      return "Candid rule-of-thirds documentary photojournalism shot";
    default:
      return "Editorial documentary photograph";
  }
}

function getLightingPhrase(lighting) {
  switch (lighting) {
    case "Natural daylight":
      return "clean available natural daylight with crisp environmental detail";
    case "Golden hour":
      return "warm late-afternoon golden hour sunlight casting long organic shadows";
    case "Dusk / evening":
      return "atmospheric dusk twilight with subtle warm practical lantern highlights";
    case "Overcast soft light":
      return "gentle diffused overcast sky offering soft shadows and rich color tones";
    case "Warm ambient light":
      return "intimate warm ambient interior lighting with natural specular spill";
    default:
      return "natural available observational light";
  }
}

/**
 * Formats a saved pitch deck session into a clean Markdown document for download/copy
 * supporting Still Images, Full Video Storyboards, and Individual Video Scenes.
 */
export function exportDeckPromptsMarkdown(savedPrompts = []) {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let md = `# Documentary Pitch Deck Assets\n`;
  md += `*Generated with Documentary Prompt Studio*\n`;
  md += `*Date: ${dateStr} | Total Items in Deck: ${savedPrompts.length}*\n\n`;
  md += `---\n\n`;

  if (savedPrompts.length === 0) {
    md += `*No saved prompts in current deck session.*\n`;
    return md;
  }

  savedPrompts.forEach((item, index) => {
    const itemType = item.type || 'image';

    if (itemType === 'video-storyboard') {
      const sceneCount = item.scenes?.length || item.sceneCount || 0;
      md += `### ${index + 1}. 🎬 Video Storyboard: ${item.campaignName || 'Pitch Video'} (${sceneCount} Clips • ${item.totalDuration || 90}s)\n`;
      md += `- **Type:** Complete Video Storyboard Sequence\n`;
      md += `- **Narrative Arc:** ${item.arcTitle || item.narrativeArc || 'Problem → Solution → Impact'}\n`;
      md += `- **Total Runtime:** \`${item.totalDuration || 90}s\` (${sceneCount} scenes)\n\n`;
      
      if (item.scenes && Array.isArray(item.scenes)) {
        item.scenes.forEach(s => {
          md += `#### Scene ${s.sceneNumber}: ${s.role} (\`${s.duration}s\`)\n`;
          md += `* **Motion:** ${s.motionStyle || 'Natural documentary'} | **Transition:** \`${s.transition}\` | **Theme:** ${s.theme || 'General'}\n\n`;
          md += `\`\`\`text\n${s.visualPrompt}\n\`\`\`\n\n`;
          if (s.voiceover) {
            md += `> **Voiceover / Caption:** ${s.voiceover}\n\n`;
          }
        });
      } else {
        md += `\`\`\`text\n${item.promptText}\n\`\`\`\n\n`;
      }
      md += `---\n\n`;

    } else if (itemType === 'video-scene') {
      md += `### ${index + 1}. 🎥 Video Scene #${item.sceneNumber || '1'}: ${item.role || 'Documentary Clip'} (\`${item.duration || 10}s\`)\n`;
      md += `- **Type:** Individual Video Scene Prompt\n`;
      md += `- **Theme / Strand:** ${item.themeLabel || 'General'}\n`;
      md += `- **Setting:** ${item.setting || 'Not specified'}\n`;
      md += `- **Camera Motion:** ${item.motionStyle || 'Documentary observation'}\n`;
      md += `- **Transition into Next:** \`${item.transition || 'None'}\`\n\n`;
      md += `\`\`\`text\n${item.promptText}\n\`\`\`\n\n`;
      if (item.voiceover) {
        md += `> **Voiceover / Caption:** ${item.voiceover}\n\n`;
      }
      md += `---\n\n`;

    } else {
      // Still Image Prompt
      md += `### ${index + 1}. 📷 Still Image: ${item.title || item.themeLabel || 'Documentary Visual Prompt'}\n`;
      md += `- **Type:** Still Image Prompt\n`;
      md += `- **Campaign:** ${item.campaignName || 'General Outreach'}\n`;
      md += `- **Theme / Strand:** ${item.themeLabel || 'General'}\n`;
      md += `- **Setting:** ${item.setting || 'Not specified'}\n`;
      md += `- **Lighting / Mood:** ${item.lighting || 'Natural'} | ${item.moodKeywords?.join(', ') || 'Authentic'}\n`;
      md += `- **Composition:** ${item.composition || 'Environmental Portrait'}\n\n`;
      md += `\`\`\`text\n${item.promptText}\n\`\`\`\n\n`;
      md += `---\n\n`;
    }
  });

  md += `*Ethical Note: These prompts are designed for concept pitch decks and storyboard illustration with synthetic media disclosure.*\n`;
  return md;
}
