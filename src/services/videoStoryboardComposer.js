/**
 * Video Storyboard Composer Service
 * Generates structured pitch video storyboards and video generation prompts (Qwen, Kling, Runway Gen-3, Sora)
 * with narrative arc structuring, granular camera dynamics, lighting, lens optics, and sound design.
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
    label: "Handheld tracking follow",
    phrase: "Authentic handheld tracking camera moving fluidly alongside the subject at natural eye-level walking pace"
  },
  {
    id: "static-wide",
    label: "Observational static wide",
    phrase: "Locked-off wide observational shot capturing natural environmental motion, wind movement, and spatial scale"
  },
  {
    id: "sweeping-pan",
    label: "Panoramic horizontal sweep",
    phrase: "Smooth elevated pan gliding horizontally to reveal the broad geographical landscape and community surroundings"
  },
  {
    id: "rack-focus",
    label: "Rack focus hands to face",
    phrase: "Subtle organic rack focus transitioning sharp focus from working hands in foreground to candid facial expression"
  },
  {
    id: "slow-dolly-orbit",
    label: "Slow curved dolly orbit",
    phrase: "Slow curved dolly motion circling the gathering, maintaining natural eye level and unforced perspective"
  },
  {
    id: "low-angle-static",
    label: "Low-angle candid hero",
    phrase: "Low-angle static camera angle framing subject against the sky, conveying dignified grounded leadership"
  },
  {
    id: "crane-jib-rise",
    label: "Gentle crane / jib vertical rise",
    phrase: "Gentle crane rise ascending smoothly from eye-level subject interaction to reveal the wider community environment"
  }
];

export const CAMERA_LENS_OPTIONS = [
  { id: "24mm-wide", label: "24mm Wide Angle", desc: "Deep depth of field capturing broad context & environment" },
  { id: "35mm-prime", label: "35mm Photojournalism", desc: "Classic documentary perspective with balanced subject & space" },
  { id: "50mm-prime", label: "50mm Natural Eye", desc: "True human optical perspective without distortion" },
  { id: "85mm-portrait", label: "85mm Intimate Prime", desc: "Shallow depth of field separating subject from soft background" },
  { id: "drone-aerial", label: "Aerial Gimbal", desc: "High-altitude cinematic perspective capturing terrain geometry" }
];

export const LIGHTING_CONDITIONS = [
  { id: "natural-daylight", label: "Natural daylight", desc: "Crisp natural sun with true environmental colors" },
  { id: "golden-hour", label: "Golden hour", desc: "Low-angled warm amber sun casting long soft shadows" },
  { id: "dusk-evening", label: "Dusk / evening twilight", desc: "Moody twilight sky with warm lantern or window accents" },
  { id: "overcast-diffused", label: "Overcast soft light", desc: "Gentle diffused sky offering even skin tones and soft shadows" },
  { id: "warm-ambient", label: "Warm ambient interior", desc: "Tungsten, firelight, or projector glow with intimate specular spill" }
];

export const PACING_OPTIONS = [
  { id: "realtime", label: "24fps Real-time", desc: "Natural documentary tempo matching human conversation and rhythm" },
  { id: "slowmo", label: "60fps Slow-Motion", desc: "Subtle poetic deceleration emphasizing emotional weight and micro-gestures" },
  { id: "dynamic", label: "Active Cadence", desc: "Brisk observational momentum capturing industrious community activity" }
];

export const ATMOSPHERE_OPTIONS = [
  { id: "film-grain", label: "Documentary Film Grain", desc: "Organic 35mm textural grain" },
  { id: "sun-flare", label: "Natural Sun Flare", desc: "Specular optical flare across lens" },
  { id: "morning-mist", label: "Atmospheric Mist / Haze", desc: "Soft environmental moisture in air" },
  { id: "dust-motes", label: "Sunlit Dust Motes", desc: "Subtle floating particulate in light shafts" },
  { id: "rain-wet", label: "Glistening Rain & Wet Reflections", desc: "Reflective surfaces and droplet textures" }
];

export const VIDEO_MODEL_OPTIONS = [
  { id: "gemini", label: "Google Gemini", badge: "Veo AI" },
  { id: "qwen", label: "Qwen Video", badge: "Primary" },
  { id: "kling", label: "Kling AI", badge: "Kinetic" },
  { id: "runway", label: "Runway Gen-3", badge: "Cinematic" },
  { id: "sora", label: "OpenAI Sora", badge: "Photoreal" },
  { id: "luma", label: "Luma Dream", badge: "Fluid" }
];

/**
 * Structural narrative arc roles generator
 */
function getArcBeats(arcId, sceneCount) {
  switch (arcId) {
    case "day-in-the-life":
      return [
        { role: "Dawn: Awakening & Landscape", emotion: "Quiet anticipation", lighting: "Natural daylight", motion: "static-wide", lens: "24mm-wide" },
        { role: "Morning: Preparation & Field Gathering", emotion: "Purposeful focus", lighting: "Natural daylight", motion: "handheld-tracking", lens: "35mm-prime" },
        { role: "Morning: Active Work & Technical Hands", emotion: "Diligent expertise", lighting: "Natural daylight", motion: "rack-focus", lens: "50mm-prime" },
        { role: "Midday: Collaborative Problem-Solving", emotion: "Dynamic teamwork", lighting: "Overcast soft light", motion: "slow-dolly-orbit", lens: "35mm-prime" },
        { role: "Afternoon: Grassroots Progress & Shared Effort", emotion: "Resilient momentum", lighting: "Golden hour", motion: "handheld-tracking", lens: "35mm-prime" },
        { role: "Golden Hour: Tangible Results in the Field", emotion: "Quiet fulfillment", lighting: "Golden hour", motion: "slow-push-in", lens: "50mm-prime" },
        { role: "Dusk: Multigenerational Community Gathering", emotion: "Communal warmth", lighting: "Dusk / evening twilight", motion: "slow-dolly-orbit", lens: "35mm-prime" },
        { role: "Night: Looking Ahead to Tomorrow", emotion: "Hopeful resolve", lighting: "Warm ambient interior", motion: "slow-push-in", lens: "85mm-portrait" }
      ];

    case "testimonial-led":
      return [
        { role: "Subject Intro: Eye-to-Eye Connection", emotion: "Intimate dignity", lighting: "Natural daylight", motion: "slow-push-in", lens: "50mm-prime" },
        { role: "The Reality: Personal Daily Obstacle", emotion: "Honest vulnerability", lighting: "Overcast soft light", motion: "handheld-tracking", lens: "35mm-prime" },
        { role: "The Turning Point: Taking Agency", emotion: "Focused determination", lighting: "Natural daylight", motion: "rack-focus", lens: "50mm-prime" },
        { role: "In Action: Operating the Grassroots Initiative", emotion: "Empowered capability", lighting: "Natural daylight", motion: "handheld-tracking", lens: "35mm-prime" },
        { role: "Intergenerational Transfer: Guiding Others", emotion: "Generous mentorship", lighting: "Golden hour", motion: "slow-dolly-orbit", lens: "35mm-prime" },
        { role: "Community Resonance: Collective Ownership", emotion: "Joyful solidarity", lighting: "Golden hour", motion: "sweeping-pan", lens: "24mm-wide" },
        { role: "Lasting Impact: Dignified Future", emotion: "Grounded pride", lighting: "Dusk / evening twilight", motion: "low-angle-static", lens: "50mm-prime" },
        { role: "Direct Vision: Words for Partners", emotion: "Unwavering conviction", lighting: "Natural daylight", motion: "slow-push-in", lens: "85mm-portrait" }
      ];

    case "cta-led":
      return [
        { role: "The Urgency: Why This Moment Matters", emotion: "Compelling urgency", lighting: "Natural daylight", motion: "handheld-tracking", lens: "35mm-prime" },
        { role: "The Frontline Challenge: What Is at Stake", emotion: "Grounded gravity", lighting: "Overcast soft light", motion: "static-wide", lens: "24mm-wide" },
        { role: "The Solution: Community-Led Infrastructure", emotion: "Pragmatic hope", lighting: "Natural daylight", motion: "slow-push-in", lens: "35mm-prime" },
        { role: "Methodology in Motion: Verified Field Operations", emotion: "Operational precision", lighting: "Natural daylight", motion: "rack-focus", lens: "50mm-prime" },
        { role: "Evidence of Change: Lives Transformed", emotion: "Tangible triumph", lighting: "Golden hour", motion: "handheld-tracking", lens: "35mm-prime" },
        { role: "Scalability: Ready for Expansion", emotion: "Expansive momentum", lighting: "Golden hour", motion: "sweeping-pan", lens: "24mm-wide" },
        { role: "Call to Action: Join the Mission", emotion: "Direct invitation", lighting: "Natural daylight", motion: "low-angle-static", lens: "35mm-prime" },
        { role: "Closing Pledge: Dignity Sustained", emotion: "Resolute promise", lighting: "Dusk / evening twilight", motion: "slow-push-in", lens: "50mm-prime" }
      ];

    case "problem-solution-impact":
    default:
      return [
        { role: "Hook & Context: Establishing the Ground Reality", emotion: "Observational clarity", lighting: "Natural daylight", motion: "static-wide", lens: "24mm-wide" },
        { role: "The Obstacle: Systemic Challenge Faced", emotion: "Quiet resilience", lighting: "Overcast soft light", motion: "handheld-tracking", lens: "35mm-prime" },
        { role: "The Catalyst: Community Initiative Arrives", emotion: "Emergent optimism", lighting: "Natural daylight", motion: "slow-push-in", lens: "35mm-prime" },
        { role: "Frontline Action: Collaborative Implementation", emotion: "Industrious focus", lighting: "Natural daylight", motion: "rack-focus", lens: "50mm-prime" },
        { role: "Skill & Ownership: Local Leaders at Work", emotion: "Dignified capability", lighting: "Golden hour", motion: "handheld-tracking", lens: "35mm-prime" },
        { role: "Measurable Impact: Tangible Shift in Daily Life", emotion: "Empowered joy", lighting: "Golden hour", motion: "slow-dolly-orbit", lens: "35mm-prime" },
        { role: "Community Ripple: Intergenerational Growth", emotion: "Enduring stability", lighting: "Dusk / evening twilight", motion: "sweeping-pan", lens: "24mm-wide" },
        { role: "Call to Scale: Sustaining the Horizon", emotion: "Inspiring resolve", lighting: "Warm ambient interior", motion: "low-angle-static", lens: "50mm-prime" }
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
 * Constructs a rich, reactive natural-language video prompt with all user controls
 */
export function composeQwenVideoPrompt({
  sceneNumber = 1,
  role = "",
  campaignName = "",
  theme = null,
  setting = "",
  subject = "",
  motionStyle = "slow-push-in",
  lensStyle = "35mm-prime",
  lighting = "Natural daylight",
  pacing = "realtime",
  atmospheres = ["film-grain"],
  toneKeywords = [],
  aspectRatio = "16:9",
  targetModel = "qwen",
  ethicalLock = true,
  audioCue = ""
}) {
  const motionObj = CAMERA_MOTION_PATTERNS.find(m => m.id === motionStyle) || CAMERA_MOTION_PATTERNS[0];
  const lensObj = CAMERA_LENS_OPTIONS.find(l => l.id === lensStyle) || CAMERA_LENS_OPTIONS[1];
  const pacingObj = PACING_OPTIONS.find(p => p.id === pacing) || PACING_OPTIONS[0];

  const themeLabel = typeof theme === 'string' ? theme : (theme?.label || "Community Initiative");
  
  const tones = (toneKeywords && toneKeywords.length > 0) 
    ? toneKeywords.slice(0, 3).join(', ').toLowerCase() 
    : "authentic, observational, and dignified";

  const lines = [];

  // Model prefix optimization
  if (targetModel === 'gemini') {
    lines.push(`Cinematic documentary video clip, Google Gemini Video / Veo photoreal cinematography (${aspectRatio}, 1080p, ${pacing === 'slowmo' ? '60fps slow-motion' : '24fps'}).`);
  } else if (targetModel === 'kling') {
    lines.push(`Cinematic documentary video clip, Kling AI 1.5 photoreal.`);
  } else if (targetModel === 'runway') {
    lines.push(`Documentary video shot on 35mm cinema prime, Runway Gen-3 photoreal.`);
  } else if (targetModel === 'sora') {
    lines.push(`Ultra-realistic observational documentary cinematography.`);
  } else if (targetModel === 'luma') {
    lines.push(`Documentary cinema video sequence, Luma Dream Machine photoreal motion (${aspectRatio}).`);
  } else {
    lines.push(`Documentary cinema video clip (${aspectRatio}, 1080p, ${pacing === 'slowmo' ? '60fps slow-motion' : '24fps'}).`);
  }

  // Camera Motion & Optical Framing
  lines.push(`Camera Movement & Optics: ${motionObj.phrase}, captured on ${lensObj.label} (${lensObj.desc}). ${pacingObj.desc}.`);

  // Subject Action & Narrative Agency
  if (subject && subject.trim()) {
    lines.push(`Subject: ${subject.trim()}. Authentic unposed movements, engaged in natural frontline work and interaction.`);
  } else {
    lines.push(`Subject: Local community members representing '${themeLabel}', actively engaged in authentic collaboration with steady, natural movements.`);
  }

  // Location & Environmental Context
  if (setting && setting.trim()) {
    lines.push(`Location & Setting: Set in ${setting.trim()}. Realistic spatial atmosphere with authentic depth and unscripted environmental background action.`);
  }

  // Lighting & Mood
  lines.push(`Lighting & Ambiance: Captured in ${lighting.toLowerCase()}, evoking a ${tones} atmosphere. Natural optical falloff, organic color grading, visible real-world textures.`);

  // Atmosphere & Imperfections
  if (atmospheres && atmospheres.length > 0) {
    const atmoPhrases = atmospheres.map(a => {
      const found = ATMOSPHERE_OPTIONS.find(opt => opt.id === a);
      return found ? found.label.toLowerCase() : a;
    });
    lines.push(`Atmospheric Texture: Organic observational realism featuring ${atmoPhrases.join(', ')}.`);
  }

  // Ethical Documentary Realism Lock
  if (ethicalLock) {
    lines.push(`Documentary Realism & Dignity Lock: Candid micro-expressions, unposed natural body language, authentic skin tones, respectful representation of subjects. No staged commercial smiling, no artificial studio lighting, no synthetic beauty filters, no rubbery AI motion artifacts.`);
  }

  // Audio / Foley Cue if present
  if (audioCue && audioCue.trim()) {
    lines.push(`[Audio Cue / Sound Design: ${audioCue.trim()}]`);
  }

  return lines.join(' ');
}

/**
 * Generates the full multi-scene storyboard sequence
 */
export function generateVideoStoryboard(campaignData, options = {}) {
  const targetDuration = options.targetDuration || 90;
  const sceneCount = options.sceneCount || 8;
  const narrativeArc = options.narrativeArc || "problem-solution-impact";
  const selectedThemes = options.selectedThemes || [];
  const targetModel = options.targetModel || "qwen";
  const aspectRatio = options.aspectRatio || "16:9";

  const allThemes = campaignData.themes || [];
  const activeThemes = allThemes.filter(t => selectedThemes.length === 0 || selectedThemes.includes(t.label));
  const availableThemes = activeThemes.length > 0 ? activeThemes : allThemes;
  const settings = campaignData.settings || ["Community gathering space"];
  const toneKeywords = campaignData.tone_keywords || ["Dignified", "Authentic", "Hopeful"];
  const subjectExamples = campaignData.subject_examples || [];

  const beats = interpolateArcBeats(narrativeArc, sceneCount);
  const durations = calculateSceneDurations(targetDuration, sceneCount);

  const scenes = [];

  for (let i = 0; i < sceneCount; i++) {
    const beat = beats[i] || beats[0];
    const theme = availableThemes[i % availableThemes.length] || { label: "Grassroots Action", description: "" };
    const setting = settings[i % settings.length] || settings[0];
    const subject = subjectExamples[i % (subjectExamples.length || 1)] || `Community member participating in ${theme.label}`;
    const duration = durations[i];
    const motionStyle = beat.motion || "slow-push-in";
    const lensStyle = beat.lens || "35mm-prime";
    const lighting = beat.lighting || "Natural daylight";
    const transition = (i === sceneCount - 1) ? "none" : (i % 3 === 0 ? "cross-dissolve" : "hard-cut");

    const voiceoverIdeas = [
      `"In every corner of our community, change begins not from above, but from the hands that work the soil."`,
      `"When you put tools directly into local hands, the distance between problem and solution disappears."`,
      `"This isn't about charity. It's about dignity, capability, and generational ownership."`,
      `"From early morning light to evening gatherings, every moment represents another step toward self-reliance."`,
      `"Together, we are not just witnessing change. We are building the foundation for what comes next."`
    ];
    const voiceover = voiceoverIdeas[i % voiceoverIdeas.length];

    const audioCues = [
      "Natural morning breeze, rustle of dry leaves, distant bird calls",
      "Rhythmic sound of hand tools, quiet focused footsteps on earth",
      "Animated local dialogue, children laughing in background, soft wind",
      "Hum of field solar equipment, crisp metallic click, steady breathing",
      "Evening chorus of crickets, crackle of tea stall fire, warm murmur of community debate"
    ];
    const audioCue = audioCues[i % audioCues.length];

    const visualPrompt = composeQwenVideoPrompt({
      sceneNumber: i + 1,
      role: beat.role,
      campaignName: campaignData.campaign_name,
      theme,
      setting,
      subject,
      motionStyle,
      lensStyle,
      lighting,
      pacing: "realtime",
      atmospheres: ["film-grain"],
      toneKeywords,
      aspectRatio,
      targetModel,
      ethicalLock: true,
      audioCue
    });

    scenes.push({
      id: `scene-${Date.now()}-${i + 1}`,
      sceneNumber: i + 1,
      role: beat.role,
      emotion: beat.emotion || "Authentic engagement",
      duration,
      theme: theme.label,
      setting,
      subject,
      motionStyle,
      lensStyle,
      lighting,
      pacing: "realtime",
      atmospheres: ["film-grain"],
      targetModel,
      aspectRatio,
      ethicalLock: true,
      transition,
      voiceover,
      audioCue,
      visualPrompt
    });
  }

  return {
    targetDuration,
    actualDuration: scenes.reduce((sum, s) => sum + s.duration, 0),
    narrativeArc,
    sceneCount: scenes.length,
    scenes
  };
}

/**
 * Regenerates an individual scene prompt based on its updated parameters
 */
export function regenerateSingleScenePrompt(scene, campaignData) {
  const themeObj = (campaignData.themes || []).find(t => t.label === scene.theme) || { label: scene.theme || "Community Action" };

  return composeQwenVideoPrompt({
    sceneNumber: scene.sceneNumber,
    role: scene.role,
    campaignName: campaignData.campaign_name,
    theme: themeObj,
    setting: scene.setting,
    subject: scene.subject,
    motionStyle: scene.motionStyle || "slow-push-in",
    lensStyle: scene.lensStyle || "35mm-prime",
    lighting: scene.lighting || "Natural daylight",
    pacing: scene.pacing || "realtime",
    atmospheres: scene.atmospheres || ["film-grain"],
    toneKeywords: campaignData.tone_keywords || [],
    aspectRatio: scene.aspectRatio || "16:9",
    targetModel: scene.targetModel || "qwen",
    ethicalLock: scene.ethicalLock !== false,
    audioCue: scene.audioCue || ""
  });
}

/**
 * Exports complete storyboard as clean text for clipboard copying
 */
export function exportStoryboardAsText(storyboardState, campaignData) {
  const scenes = storyboardState.scenes || [];
  const arc = NARRATIVE_ARCS.find(a => a.id === storyboardState.narrativeArc);
  const totalRuntime = scenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);

  let out = `DOCUMENTARY PITCH VIDEO STORYBOARD: ${campaignData.campaign_name || 'Campaign Video'}\n`;
  out += `Arc: ${arc?.label || 'Problem → Solution → Impact'} | Total Planned Runtime: ${totalRuntime}s (${scenes.length} Scenes)\n`;
  out += `Target Model: ${storyboardState.targetModel?.toUpperCase() || 'QWEN VIDEO'} | Aspect Ratio: ${storyboardState.aspectRatio || '16:9'}\n`;
  out += `--------------------------------------------------------------------------------\n\n`;

  scenes.forEach(s => {
    out += `[SCENE ${s.sceneNumber}] ${s.role.toUpperCase()} (${s.duration} SECONDS)\n`;
    out += `Theme: ${s.theme} | Location: ${s.setting}\n`;
    out += `Motion: ${s.motionStyle} | Lens: ${s.lensStyle || '35mm'} | Light: ${s.lighting}\n`;
    if (s.transition && s.transition !== 'none') out += `Transition into next shot: ${s.transition}\n`;
    if (s.voiceover) out += `Voiceover / Narration: ${s.voiceover}\n`;
    if (s.audioCue) out += `Audio / Foley: ${s.audioCue}\n`;
    out += `\nVideo Prompt:\n${s.visualPrompt}\n\n`;
    out += `--------------------------------------------------------------------------------\n\n`;
  });

  return out;
}

/**
 * Exports storyboard as structured Markdown
 */
export function exportStoryboardAsMarkdown(storyboardState, campaignData) {
  const scenes = storyboardState.scenes || [];
  const arc = NARRATIVE_ARCS.find(a => a.id === storyboardState.narrativeArc);
  const totalRuntime = scenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);

  let md = `# 🎬 Documentary Pitch Video Storyboard: ${campaignData.campaign_name}\n\n`;
  md += `> **Narrative Structure:** ${arc?.label || 'Classic Pitch'}  \n`;
  md += `> **Total Duration:** ${totalRuntime}s (${scenes.length} Scenes) | **Aspect Ratio:** ${storyboardState.aspectRatio || '16:9'}  \n`;
  md += `> **Target AI Generator:** ${storyboardState.targetModel?.toUpperCase() || 'Qwen Video'}\n\n`;
  md += `---\n\n`;

  scenes.forEach(s => {
    md += `### Clip ${s.sceneNumber}: ${s.role} \`[${s.duration}s]\`\n\n`;
    md += `- **Curatorial Strand:** ${s.theme}\n`;
    md += `- **Location / Setting:** ${s.setting}\n`;
    md += `- **Camera Motion & Lens:** ${s.motionStyle} (${s.lensStyle || '35mm prime'})\n`;
    md += `- **Lighting & Pacing:** ${s.lighting} | ${s.pacing || '24fps'}\n`;
    if (s.transition && s.transition !== 'none') {
      md += `- **Transition:** ${s.transition}\n`;
    }
    if (s.voiceover) {
      md += `- **Voiceover:** *"${s.voiceover}"*\n`;
    }
    if (s.audioCue) {
      md += `- **Sound Design:** \`${s.audioCue}\`\n`;
    }
    md += `\n\`\`\`text\n${s.visualPrompt}\n\`\`\`\n\n`;
    md += `---\n\n`;
  });

  return md;
}
