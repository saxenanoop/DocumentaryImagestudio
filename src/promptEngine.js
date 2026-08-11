/**
 * Documentary Prompt Engine
 * Constructs documentary-grade AI image prompts based on real documentary photography principles
 * and strict dignity & ethics guardrails.
 */

/**
 * Builds the 3 shot plan (Establishing, Medium, Detail) from a project brief.
 * @param {Object} brief - The form input brief object
 * @returns {Array} Array of 3 shot objects
 */
export function generateShotPlan(brief = {}) {
  // Sanitize all inputs with robust fallback defaults to prevent empty values or gaps
  const projectName = (brief.projectName && brief.projectName.trim()) || "Documentary Visual Story";
  const topic = (brief.topic && brief.topic.trim()) || "Community Resilience & Social Impact";
  const subject = (brief.subject && brief.subject.trim()) || "Community members actively collaborating together";
  const location = (brief.location && brief.location.trim()) || "Local community setting";
  const timeOfDay = (brief.timeOfDay && brief.timeOfDay.trim()) || "Late afternoon golden hour";
  const lighting = (brief.lighting && brief.lighting.trim()) || "Warm available natural light";
  const mood = (brief.mood && brief.mood.trim()) || "Dignified, collaborative, hopeful";
  const visualStyle = (brief.visualStyle && brief.visualStyle.trim()) || "Unposed social realism, candid documentary photojournalism";
  const filmLook = (brief.filmLook && brief.filmLook.trim()) || "Warm & Hopeful Daylight (Kodak Portra 400 35mm)";
  const aspectRatio = (brief.aspectRatio && brief.aspectRatio.trim()) || "16:9";

  // Dignity & Respect Safeguard Prompt Component
  const dignitySafeguard = "dignified posture, active community agency, respectful observational distance, un-sensationalized storytelling";

  // Shot 1: Establishing Shot
  const establishingShot = {
    id: "establishing",
    title: "1. Establishing Shot (Environment & Scale)",
    shotType: "Wide Angle Establishing Shot",
    description: "Establishes the geographical environment, spatial scale, and broader community context.",
    lens: "24mm f/8 wide-angle photojournalism lens",
    focus: "deep depth of field, sharp environmental detail from foreground to horizon",
    prompt: constructPrompt({
      shotTypePrefix: "Wide angle environmental documentary photograph,",
      subjectAction: `establishing view of ${location} for a documentary story on ${topic}, featuring ${subject}`,
      environmentContext: `in the broader community context of ${location}`,
      timeLighting: `during ${timeOfDay}, lit by ${lighting}`,
      cameraLens: "shot on 24mm f/8 wide-angle lens with deep depth of field",
      filmStock: filmLook,
      imperfections: "natural atmospheric haze, subtle lens dust, authentic environmental clutter, unposed spatial balance",
      style: `${visualStyle}, candid documentary realism, strong sense of place, non-commercial editorial aesthetic, ${dignitySafeguard}`,
      aspectRatio
    }),
    disclosureCaption: `Synthetic documentary image created with AI to illustrate ${topic}. This is not a photograph of a real person, event, or place.`
  };

  // Shot 2: Medium / Interaction Shot
  const mediumShot = {
    id: "medium",
    title: "2. Medium / Interaction Shot (Human Relation & Agency)",
    shotType: "Medium 35mm Storytelling Shot",
    description: "Captures human action, emotional connection, and unposed agency within the space.",
    lens: "35mm or 50mm f/2.8 prime lens",
    focus: "natural focus on subject with soft environmental background falloff",
    prompt: constructPrompt({
      shotTypePrefix: "Candid medium-shot documentary photograph,",
      subjectAction: `${subject} engaged in authentic active endeavor, illustrating ${topic}`,
      environmentContext: `set within ${location}`,
      timeLighting: `captured in ${timeOfDay} under ${lighting}`,
      cameraLens: "shot on 35mm f/2.8 prime lens at eye level",
      filmStock: filmLook,
      imperfections: "natural skin textures, un-airbrushed details, subtle motion blur on hands, candid body language, organic available light highlights",
      style: `${visualStyle}, emotional authenticity, ${mood} atmosphere, human-centered photojournalism, ${dignitySafeguard}`,
      aspectRatio
    }),
    disclosureCaption: `Synthetic documentary image created with AI to illustrate ${topic}. This is not a photograph of a real person, event, or place.`
  };

  // Shot 3: Detail Shot
  const detailShot = {
    id: "detail",
    title: "3. Detail Shot (Tactile Emotion & Artifacts)",
    shotType: "Macro Close-Up Detail Shot",
    description: "Focuses on tactile textures, hands, tools, or emotional artifacts that deepen the narrative.",
    lens: "90mm f/2.8 macro or 85mm f/1.8 lens",
    focus: "shallow depth of field, crisp focus on object or hands with creamy background bokeh",
    prompt: constructPrompt({
      shotTypePrefix: "Close-up detail documentary photograph,",
      subjectAction: `macro focus on working hands, worn tools, textures, or key artifacts belonging to ${subject}`,
      environmentContext: `in the immediate setting of ${location}`,
      timeLighting: `illuminated by ${lighting} during ${timeOfDay}`,
      cameraLens: "shot on 90mm f/2.8 macro lens with shallow depth of field and soft background bokeh",
      filmStock: filmLook,
      imperfections: "visible surface grain, tactile wear and tear, micro dust particles, natural specular reflections",
      style: `${visualStyle}, tactile emotional resonance, intimate observational documentary photography, ${dignitySafeguard}`,
      aspectRatio
    }),
    disclosureCaption: `Synthetic documentary image created with AI to illustrate ${topic}. This is not a photograph of a real person, event, or place.`
  };

  return [establishingShot, mediumShot, detailShot];
}

/**
 * Standard prompt assembly string builder
 */
function constructPrompt({
  shotTypePrefix,
  subjectAction,
  environmentContext,
  timeLighting,
  cameraLens,
  filmStock,
  imperfections,
  style,
  aspectRatio
}) {
  const mainPrompt = `${shotTypePrefix} ${subjectAction}, ${environmentContext}. ${timeLighting}. ${cameraLens}, film stock look: ${filmStock}. Documentary realism: ${imperfections}, ${style}. --ar ${aspectRatio}`;
  
  const negativeAvoid = `Avoid: cartoon, 3D render, illustration, fake HDR, studio flash, perfect symmetry, airbrushed skin, commercial stock photo look, text overlay, watermark, extra fingers, distorted limbs, oversaturated colors, poverty porn, passive victim tropes, sensationalized distress.`;

  return `${mainPrompt}\n\n[Negative Prompt / Exclude]:\n${negativeAvoid}`;
}

/**
 * Formats the complete 3-shot plan into a clean, copyable Markdown report
 */
export function generatePromptSheetMarkdown(brief, shots) {
  const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  return `# DOCUMENTARY SHOT PLAN: ${brief.projectName || brief.topic}
*Generated by Documentary Image Studio | Ethical AI Visuals*
*Date: ${timestamp}*

---

## PROJECT BRIEF SUMMARY
- **Project Name:** ${brief.projectName || 'Untitled Project'}
- **Documentary Topic:** ${brief.topic}
- **Subject & Agency:** ${brief.subject}
- **Location / Environment:** ${brief.location}
- **Time & Lighting:** ${brief.timeOfDay} (${brief.lighting})
- **Mood & Style:** ${brief.mood} | ${brief.visualStyle}
- **Film Look & Aspect Ratio:** ${brief.filmLook} | Aspect Ratio: ${brief.aspectRatio}

---

## ETHICAL MANDATE & DISCLOSURE
> **NOTICE**: All prompts below are designed for synthetic media creation to illustrate educational or documentary concepts. Images generated from these prompts MUST include the standard synthetic disclosure:
> *"Synthetic documentary image created with AI to illustrate [Topic]. This is not a photograph of a real person, event, or place."*

---

${shots.map(shot => `
### ${shot.title}
**Shot Type:** ${shot.shotType}  
**Description:** ${shot.description}  
**Lens & Focus:** ${shot.lens} | ${shot.focus}  

\`\`\`
${shot.prompt}
\`\`\`

**Required Ethical Caption:**  
*${shot.disclosureCaption}*

---
`).join('\n')}

*Documentary Image Studio - Created for NGOs, Educators, Agencies & Impact Researchers.*
`;
}
