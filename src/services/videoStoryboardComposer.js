/**
 * Video Storyboard Composer Service
 * Generates structured pitch video storyboards and Qwen AI video generation prompts
 * with narrative arc structuring, camera motion direction, timing, and voiceover cues.
 */

export const NARRATIVE_ARCS = [
  {
    id: "problem-solution-impact",
    label: "Problem → Solution → Impact",
    tagline: "Classic Pitch Arc",
    desc: "Establishes the frontline reality, introduces grassroots intervention, and demonstrates measurable human transformation.",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
  },
  {
    id: "day-in-the-life",
    label: "Day-in-the-Life",
    tagline: "Chronological Journey",
    desc: "Follows an observational journey from dawn awakening through midday collaboration to dusk reflection.",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
  },
  {
    id: "testimonial-led",
    label: "Testimonial-Led",
    tagline: "Frontline Voices",
    desc: "Centers intimate character perspectives, personal agency, and intergenerational community trust.",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`
  },
  {
    id: "cta-led",
    label: "Call-to-Action-Led",
    tagline: "Urgent Mobilization",
    desc: "Hook-driven urgency spotlighting why immediate partnership and scale matter right now.",
    icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  }
];

export const TRANSITION_OPTIONS = [
  { id: "hard-cut", label: "Hard Cut", desc: "Crisp instant cut matching rhythm and action" },
  { id: "cross-dissolve", label: "Cross-Dissolve", desc: "Smooth visual blend showing narrative transition" },
  { id: "match-cut", label: "Match Cut", desc: "Graphic or motion continuity between subjects" },
  { id: "fade-black", label: "Fade through Black", desc: "Editorial punctuation marking time passage" },
  { id: "whip-pan", label: "Whip Pan", desc: "Kinetic directional sweep connecting spaces" }
];

export const CAMERA_MOTION_PATTERNS = [
  {
    id: "slow-push-in",
    label: "Slow push-in on subject",
    phrase: "Slow deliberate push-in camera movement tracking towards the subject, creating increasing intimacy and focus"
  },
  {
    id: "handheld-tracking",
    label: "Handheld tracking follow shot",
    phrase: "Authentic handheld tracking camera moving fluidly alongside the subject at natural eye-level walking pace"
  },
  {
    id: "static-wide",
    label: "Observational static wide shot",
    phrase: "Locked-off wide observational shot capturing natural environmental motion, wind movement, and spatial scale"
  },
  {
    id: "sweeping-pan",
    label: "High-angle panoramic sweep",
    phrase: "Smooth elevated pan gliding horizontally to reveal the broad geographical landscape and community surroundings"
  },
  {
    id: "rack-focus",
    label: "Rack focus hands to eyes",
    phrase: "Subtle organic rack focus transitioning sharp focus from working hands in foreground to candid facial expression"
  },
  {
    id: "slow-dolly-orbit",
    label: "Slow curved dolly orbit",
    phrase: "Slow curved dolly motion circling the gathering, maintaining natural eye level and unforced perspective"
  },
  {
    id: "low-angle-static",
    label: "Low-angle candid hero shot",
    phrase: "Low-angle static camera angle framing subject against the sky, conveying dignified grounded leadership"
  }
];

/**
 * Structural narrative arc roles generator
 */
function getArcBeats(arcId, sceneCount) {
  switch (arcId) {
    case "day-in-the-life":
      return [
        { role: "Dawn: Awakening & Landscape", emotion: "Quiet anticipation", lighting: "Early sunrise / morning mist", motion: "static-wide" },
        { role: "Morning: Preparation & Field Gathering", emotion: "Purposeful focus", lighting: "Crisp early daylight", motion: "handheld-tracking" },
        { role: "Morning: Active Work & Technical Hands", emotion: "Diligent expertise", lighting: "Natural direct daylight", motion: "rack-focus" },
        { role: "Midday: Collaborative Problem-Solving", emotion: "Dynamic teamwork", lighting: "Overcast soft light", motion: "slow-dolly-orbit" },
        { role: "Afternoon: Grassroots Progress & Shared Effort", emotion: "Resilient momentum", lighting: "Warm afternoon light", motion: "handheld-tracking" },
        { role: "Golden Hour: Tangible Results in the Field", emotion: "Quiet fulfillment", lighting: "Golden hour low-sun", motion: "slow-push-in" },
        { role: "Dusk: Multigenerational Community Gathering", emotion: "Communal warmth", lighting: "Twilight with lantern glow", motion: "slow-dolly-orbit" },
        { role: "Night: Looking Ahead to Tomorrow", emotion: "Hopeful resolve", lighting: "Night ambient / warm worklights", motion: "slow-push-in" }
      ];

    case "testimonial-led":
      return [
        { role: "Subject Intro: Eye-to-Eye Connection", emotion: "Intimate dignity", lighting: "Natural window daylight", motion: "slow-push-in" },
        { role: "The Reality: Personal Daily Obstacle", emotion: "Honest vulnerability", lighting: "Overcast environmental light", motion: "handheld-tracking" },
        { role: "The Turning Point: Taking Agency", emotion: "Focused determination", lighting: "Crisp directional daylight", motion: "rack-focus" },
        { role: "In Action: Operating the Grassroots Initiative", emotion: "Empowered capability", lighting: "Natural daylight", motion: "handheld-tracking" },
        { role: "Intergenerational Transfer: Guiding Others", emotion: "Generous mentorship", lighting: "Warm afternoon ambient", motion: "slow-dolly-orbit" },
        { role: "Community Resonance: Collective Ownership", emotion: "Joyful solidarity", lighting: "Golden hour sunlight", motion: "sweeping-pan" },
        { role: "Lasting Impact: Dignified Future", emotion: "Grounded pride", lighting: "Warm dusk glow", motion: "low-angle-static" },
        { role: "Direct Vision: Words for Partners", emotion: "Unwavering conviction", lighting: "Soft diffused natural light", motion: "slow-push-in" }
      ];

    case "cta-led":
      return [
        { role: "The Urgency: Why This Moment Matters", emotion: "Compelling urgency", lighting: "High contrast daylight", motion: "handheld-tracking" },
        { role: "The Frontline Challenge: What Is at Stake", emotion: "Grounded gravity", lighting: "Overcast soft light", motion: "static-wide" },
        { role: "The Solution: Community-Led Infrastructure", emotion: "Pragmatic hope", lighting: "Clean directional sunlight", motion: "slow-push-in" },
        { role: "Methodology in Motion: Verified Field Operations", emotion: "Operational precision", lighting: "Natural daylight", motion: "rack-focus" },
        { role: "Evidence of Change: Lives Transformed", emotion: "Tangible triumph", lighting: "Golden hour sunlight", motion: "handheld-tracking" },
        { role: "Scalability: Ready for Expansion", emotion: "Expansive momentum", lighting: "Sweeping horizon light", motion: "sweeping-pan" },
        { role: "Call to Action: Join the Mission", emotion: "Direct invitation", lighting: "Clear open daylight", motion: "low-angle-static" },
        { role: "Closing Pledge: Dignity Sustained", emotion: "Resolute promise", lighting: "Warm golden twilight", motion: "slow-push-in" }
      ];

    case "problem-solution-impact":
    default:
      return [
        { role: "Hook & Context: Establishing the Ground Reality", emotion: "Observational clarity", lighting: "Natural morning daylight", motion: "static-wide" },
        { role: "The Obstacle: Systemic Challenge Faced", emotion: "Quiet resilience", lighting: "Overcast textured light", motion: "handheld-tracking" },
        { role: "The Catalyst: Community Initiative Arrives", emotion: "Emergent optimism", lighting: "Crisp natural daylight", motion: "slow-push-in" },
        { role: "Frontline Action: Collaborative Implementation", emotion: "Industrious focus", lighting: "Direct daylight with natural shadows", motion: "rack-focus" },
        { role: "Skill & Ownership: Local Leaders at Work", emotion: "Dignified capability", lighting: "Warm afternoon light", motion: "handheld-tracking" },
        { role: "Measurable Impact: Tangible Shift in Daily Life", emotion: "Empowered joy", lighting: "Golden hour sunlight", motion: "slow-dolly-orbit" },
        { role: "Community Ripple: Intergenerational Growth", emotion: "Enduring stability", lighting: "Warm sunset ambient", motion: "sweeping-pan" },
        { role: "Call to Scale: Sustaining the Horizon", emotion: "Inspiring resolve", lighting: "Dusk glow with lantern accents", motion: "low-angle-static" }
      ];
  }
}

/**
 * Maps scene count to appropriate arc roles
 */
function interpolateArcBeats(arcId, sceneCount) {
  const masterBeats = getArcBeats(arcId, sceneCount);
  if (sceneCount === masterBeats.length) return masterBeats;

  const result = [];
  for (let i = 0; i < sceneCount; i++) {
    const fractionalIndex = (i / (sceneCount - 1 || 1)) * (masterBeats.length - 1);
    const nearestIndex = Math.min(Math.round(fractionalIndex), masterBeats.length - 1);
    const baseBeat = masterBeats[nearestIndex];

    // Give specific beat numbers
    let roleName = baseBeat.role;
    if (sceneCount > masterBeats.length && i >= masterBeats.length) {
      roleName = `Deep Dive: Field Action Phase ${i - masterBeats.length + 2}`;
    }

    result.push({
      ...baseBeat,
      role: roleName
    });
  }
  return result;
}

/**
 * Distributes target total duration cleanly across scenes
 */
function calculateSceneDurations(totalSeconds, sceneCount) {
  const baseSec = Math.floor(totalSeconds / sceneCount);
  let remainder = totalSeconds % sceneCount;

  const durations = [];
  for (let i = 0; i < sceneCount; i++) {
    let dur = baseSec;
    // Distribute remainder towards early establishing and climactic ending scenes
    if (remainder > 0 && (i === 0 || i === sceneCount - 1 || i === Math.floor(sceneCount / 2))) {
      dur += 1;
      remainder--;
    } else if (remainder > 0) {
      dur += 1;
      remainder--;
    }
    durations.push(Math.max(4, dur));
  }
  return durations;
}

/**
 * Constructs a continuous, Qwen-optimized natural-language video prompt
 */
export function composeQwenVideoPrompt({
  sceneNumber = 1,
  role = "",
  campaignName = "",
  theme = null,
  setting = "",
  subject = "",
  motionStyle = "slow-push-in",
  lighting = "Natural daylight",
  toneKeywords = [],
  aspectRatio = "16:9",
  ethicalLock = true
}) {
  const motionObj = CAMERA_MOTION_PATTERNS.find(m => m.id === motionStyle) || CAMERA_MOTION_PATTERNS[0];
  const themeLabel = theme?.label || "Community Initiative";
  const themeDesc = theme?.description || "";
  
  const tones = (toneKeywords && toneKeywords.length > 0) 
    ? toneKeywords.slice(0, 3).join(', ').toLowerCase() 
    : "authentic, observational, and dignified";

  const actionPhrases = [
    `actively working together with steady, practiced movements`,
    `sharing an unscripted moment of collaboration and mutual focus`,
    `demonstrating authentic agency and technical capability in their daily environment`,
    `engaging in candid dialogue and collaborative field problem-solving`,
    `walking with purpose while observing the on-the-ground transformation`,
    `guiding younger community members through hands-on participation`
  ];
  const chosenAction = actionPhrases[(sceneNumber - 1) % actionPhrases.length];

  const lines = [];

  // 1. Cinematic Opening & Lens
  lines.push(`Cinematic documentary video clip (1080p, 24fps).`);

  // 2. Camera Motion & Framing
  lines.push(`${motionObj.phrase}.`);

  // 3. Subject Action & Narrative Core
  if (subject && subject.trim()) {
    lines.push(`Subject: ${subject.trim()}, ${chosenAction}.`);
  } else {
    lines.push(`Subject: Local community members representing '${themeLabel}', ${chosenAction}.`);
  }

  // 4. Setting & Spatial Reality
  if (setting && setting.trim()) {
    lines.push(`Location & Environment: Set in ${setting.trim()}. Realistic spatial depth with subtle ambient motion in the background.`);
  }

  // 5. Lighting & Atmosphere
  lines.push(`Lighting & Mood: Captured in ${lighting.toLowerCase()}, evoking a ${tones} atmosphere. Natural optical depth of field with organic color grading and gentle film grain.`);

  // 6. Ethical Documentary Realism Lock
  if (ethicalLock) {
    lines.push(`Documentary Realism Lock: Candid facial micro-expressions, unposed natural body language, authentic skin textures, respectful and dignified representation. No staged commercial smiling, no artificial studio lighting, no synthetic beauty filters.`);
  }

  // 7. Motion & Aspect parameters for Qwen
  lines.push(`Continuous natural motion dynamics, fluid camera stabilization, crisp physical physics. --ar ${aspectRatio}`);

  return lines.join(' ');
}

/**
 * Generates voiceover / on-screen subtitle caption suggestion
 */
function generateVoiceoverSuggestion(role, theme, campaignData, sceneIndex, totalScenes) {
  const campaignName = campaignData.campaign_name || "This initiative";
  const summary = campaignData.one_line_summary || "bringing lasting grassroots change";
  const themeLabel = theme?.label || "Community Leadership";

  if (sceneIndex === 0) {
    return `"${campaignName} begins where traditional solutions stop — directly with the people on the ground."`;
  }
  if (sceneIndex === totalScenes - 1) {
    return `"Join us in scaling ${themeLabel.toLowerCase()} — investing in dignity, resilience, and a self-reliant future."`;
  }
  if (sceneIndex === 1) {
    return `"Every day, communities face real structural challenges with quiet courage and ingenuity."`;
  }
  if (sceneIndex === Math.floor(totalScenes / 2)) {
    return `"Through ${themeLabel.toLowerCase()}, local leaders drive tangible, practical solutions built to last."`;
  }

  const variations = [
    `"Change is not delivered from the outside — it is cultivated by the hands that know the land best."`,
    `"Real impact is measured in shared skills, renewed confidence, and collective ownership."`,
    `"When communities own their tools, transformation becomes permanent."`,
    `"Behind every milestone is an unbroken thread of intergenerational trust and labor."`
  ];
  return variations[sceneIndex % variations.length];
}

/**
 * Main Generator for Full Storyboard
 */
export function generateVideoStoryboard(campaignData, setupOptions = {}) {
  if (!campaignData) return { scenes: [], targetDuration: 90, totalDuration: 0 };

  const {
    targetDuration = 90,
    sceneCount = 9,
    narrativeArc = "problem-solution-impact",
    selectedThemes = [],
    aspectRatio = "16:9",
    ethicalLock = true
  } = setupOptions;

  const themesPool = (campaignData.themes && campaignData.themes.length > 0)
    ? (selectedThemes.length > 0 
        ? campaignData.themes.filter(t => selectedThemes.includes(t.label)) 
        : campaignData.themes)
    : [{ label: "Community Storytelling", description: "Grassroots photojournalism" }];

  const settingsPool = (campaignData.settings && campaignData.settings.length > 0)
    ? campaignData.settings
    : ["Open-air community gathering space", "Field operations site"];

  const subjectsPool = (campaignData.subject_examples && campaignData.subject_examples.length > 0)
    ? campaignData.subject_examples
    : ["Community member actively leading local initiative"];

  const beats = interpolateArcBeats(narrativeArc, sceneCount);
  const durations = calculateSceneDurations(targetDuration, sceneCount);

  const scenes = beats.map((beat, idx) => {
    const sceneNum = idx + 1;
    const isLast = sceneNum === sceneCount;
    const theme = themesPool[idx % themesPool.length] || themesPool[0];
    const setting = settingsPool[idx % settingsPool.length] || settingsPool[0];
    const subject = subjectsPool[idx % subjectsPool.length] || subjectsPool[0];
    const duration = durations[idx] || 10;
    
    // Select default transition (omit on last)
    let transition = "cross-dissolve";
    if (idx === 0) transition = "hard-cut";
    else if (idx === sceneCount - 2) transition = "fade-black";
    else if (idx % 2 === 0) transition = "hard-cut";

    const motionStyle = beat.motion || "slow-push-in";
    const lighting = beat.lighting || "Natural daylight";

    const visualPrompt = composeQwenVideoPrompt({
      sceneNumber: sceneNum,
      role: beat.role,
      campaignName: campaignData.campaign_name,
      theme,
      setting,
      subject,
      motionStyle,
      lighting,
      toneKeywords: campaignData.tone_keywords,
      aspectRatio,
      ethicalLock
    });

    const voiceover = generateVoiceoverSuggestion(beat.role, theme, campaignData, idx, sceneCount);

    return {
      id: `scene-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      sceneNumber: sceneNum,
      role: `${beat.role}`,
      theme: theme.label,
      setting,
      subject,
      duration,
      transition: isLast ? "none" : transition,
      motionStyle,
      lighting,
      visualPrompt,
      voiceover,
      isEditing: false
    };
  });

  const totalDuration = scenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);

  return {
    targetDuration,
    narrativeArc,
    totalDuration,
    scenes
  };
}

/**
 * Regenerates a single scene prompt preserving its role and context
 */
export function regenerateSingleScenePrompt(scene, campaignData, arcId, index, totalScenes, selectedThemes = []) {
  if (!campaignData) return scene;

  const themesPool = (campaignData.themes && campaignData.themes.length > 0)
    ? (selectedThemes.length > 0 
        ? campaignData.themes.filter(t => selectedThemes.includes(t.label)) 
        : campaignData.themes)
    : [{ label: "Community Storytelling", description: "Grassroots photojournalism" }];

  const settingsPool = (campaignData.settings && campaignData.settings.length > 0)
    ? campaignData.settings
    : ["Open-air community gathering space"];

  const subjectsPool = (campaignData.subject_examples && campaignData.subject_examples.length > 0)
    ? campaignData.subject_examples
    : ["Community leader"];

  // Pick alternate motion and settings
  const motions = CAMERA_MOTION_PATTERNS.map(m => m.id);
  const randomMotion = motions[Math.floor(Math.random() * motions.length)];
  const alternateSetting = settingsPool[(index + Math.floor(Math.random() * settingsPool.length)) % settingsPool.length];
  const alternateSubject = subjectsPool[(index + Math.floor(Math.random() * subjectsPool.length)) % subjectsPool.length];
  const theme = themesPool[index % themesPool.length] || themesPool[0];

  const newVisualPrompt = composeQwenVideoPrompt({
    sceneNumber: scene.sceneNumber || (index + 1),
    role: scene.role,
    campaignName: campaignData.campaign_name,
    theme,
    setting: scene.setting || alternateSetting,
    subject: scene.subject || alternateSubject,
    motionStyle: randomMotion,
    lighting: scene.lighting || "Natural daylight",
    toneKeywords: campaignData.tone_keywords,
    aspectRatio: "16:9",
    ethicalLock: true
  });

  return {
    ...scene,
    motionStyle: randomMotion,
    visualPrompt: newVisualPrompt,
    voiceover: generateVoiceoverSuggestion(scene.role, theme, campaignData, index, totalScenes)
  };
}

/**
 * Exports all storyboard scenes as a clean formatted shot list for pasting into Qwen or pitch decks
 */
export function exportStoryboardAsText(storyboard, campaignData) {
  const campaignName = campaignData?.campaign_name || "Documentary Pitch Video";
  const arc = NARRATIVE_ARCS.find(a => a.id === storyboard.narrativeArc)?.label || "Problem → Solution → Impact";
  const totalSec = storyboard.scenes.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);

  let out = `================================================================================\n`;
  out += `DOCUMENTARY PITCH VIDEO STORYBOARD: ${campaignName.toUpperCase()}\n`;
  out += `Narrative Arc: ${arc} | Target Runtime: ${storyboard.targetDuration}s | Total Scheduled: ${totalSec}s (${storyboard.scenes.length} Scenes)\n`;
  out += `Generated for Qwen AI Video Generation via Documentary Prompt Studio\n`;
  out += `================================================================================\n\n`;

  storyboard.scenes.forEach((s, idx) => {
    const isLast = idx === storyboard.scenes.length - 1;
    out += `[SCENE ${s.sceneNumber}] — ${s.role.toUpperCase()}\n`;
    out += `Duration: ${s.duration}s | Motion: ${s.motionStyle || 'Natural documentary'} | Transition into Next: ${isLast ? 'END OF VIDEO (Fade to Black)' : s.transition}\n`;
    out += `Theme / Strand: ${s.theme || 'General'}\n\n`;
    out += `QWEN VIDEO PROMPT:\n${s.visualPrompt}\n\n`;
    if (s.voiceover) {
      out += `VOICEOVER / ON-SCREEN CAPTION:\n${s.voiceover}\n\n`;
    }
    out += `--------------------------------------------------------------------------------\n\n`;
  });

  out += `ETHICAL REALISM DIRECTIVE:\n`;
  out += `All video clips generated with these prompts enforce respectful, unposed human dignity, observational camera movement, and non-sensationalized storytelling.\n`;

  return out;
}

/**
 * Exports storyboard as Markdown document (.md)
 */
export function exportStoryboardAsMarkdown(storyboard, campaignData) {
  const campaignName = campaignData?.campaign_name || "Documentary Pitch Video";
  const arc = NARRATIVE_ARCS.find(a => a.id === storyboard.narrativeArc)?.label || "Problem → Solution → Impact";
  const totalSec = storyboard.scenes.reduce((acc, s) => acc + (Number(s.duration) || 0), 0);
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let md = `# Documentary Pitch Video Storyboard: ${campaignName}\n\n`;
  md += `* **Campaign:** ${campaignName}\n`;
  md += `* **Narrative Arc:** ${arc}\n`;
  md += `* **Target Runtime:** ${storyboard.targetDuration}s (Actual Scheduled: ${totalSec}s)\n`;
  md += `* **Scene Count:** ${storyboard.scenes.length} clips\n`;
  md += `* **Generated on:** ${dateStr} for Qwen AI Video Generation\n\n`;
  md += `> **Pitch Video Mission:** ${campaignData?.one_line_summary || 'Authentic community outreach and photojournalism.'}\n\n`;
  md += `---\n\n`;

  storyboard.scenes.forEach((s, idx) => {
    const isLast = idx === storyboard.scenes.length - 1;
    md += `### Scene ${s.sceneNumber}: ${s.role}\n\n`;
    md += `* **Duration:** \`${s.duration}s\`\n`;
    md += `* **Camera Motion:** ${s.motionStyle || 'Observational'}\n`;
    md += `* **Transition into Next:** ${isLast ? '*End of Video*' : `\`${s.transition}\``}\n`;
    md += `* **Theme:** ${s.theme || 'Community'}\n\n`;
    
    md += `#### Qwen Video Generation Prompt\n`;
    md += `\`\`\`text\n${s.visualPrompt}\n\`\`\`\n\n`;

    if (s.voiceover) {
      md += `> **Voiceover / On-Screen Caption:**  \n> ${s.voiceover}\n\n`;
    }

    md += `---\n\n`;
  });

  md += `\n*Produced with Documentary Prompt Studio — Video Storyboard Builder for Pitch Decks.*`;
  return md;
}
