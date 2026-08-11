/**
 * Create View Component (2-Step Progressive Disclosure Wizard)
 */
import { DOCUMENTARY_PRESETS } from '../presets.js';
import { getDraft } from '../storage.js';

export function renderCreateView(selectedPresetId = null, currentStep = 1) {
  // Check if draft exists or if a preset was selected
  let initialValues = {
    projectName: "Community Resilience Study",
    topic: "Sustainable Urban Agriculture & Local Food Security",
    subject: "Volunteers actively harvesting and cataloging organic produce together in a city garden",
    location: "Community garden plot surrounded by residential neighborhoods",
    timeOfDay: "Late afternoon golden hour",
    lighting: "Warm direct sunlight with soft directional shadows",
    mood: "Collaborative, dignified, hopeful",
    visualStyle: "Unposed social realism, candid documentary photojournalism",
    filmLook: "Warm & Hopeful Daylight (Kodak Portra 400 35mm)",
    aspectRatio: "16:9"
  };

  const draft = getDraft();
  if (draft) {
    initialValues = { ...initialValues, ...draft };
  }

  if (selectedPresetId) {
    const preset = DOCUMENTARY_PRESETS.find(p => p.id === selectedPresetId);
    if (preset) {
      initialValues = { ...initialValues, ...preset.defaults };
    }
  }

  return `
    <div class="container-narrow">
      <div style="margin-bottom: 1.5rem; text-align: center;">
        <h1 style="font-size: 2.25rem; margin-bottom: 0.5rem;">Create Documentary Visual</h1>
        <p class="text-muted" style="font-size: 1.05rem;">
          Build structured documentary-style prompts designed for authentic impact storytelling.
        </p>
      </div>

      <!-- Step Wizard Progress Indicator -->
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.875rem; font-weight: 600; color: var(--text-muted);">
          <span style="${currentStep === 1 ? 'color: var(--primary); font-weight: 700;' : ''}">
            Step 1: Story Brief & Subject
          </span>
          <span style="${currentStep === 2 ? 'color: var(--primary); font-weight: 700;' : ''}">
            Step 2: Mood & Aesthetics
          </span>
        </div>
        <div style="height: 6px; background: var(--border-light); border-radius: 99px; overflow: hidden; display: flex;">
          <div style="width: ${currentStep === 1 ? '50%' : '100%'}; background: var(--primary); transition: width 0.3s ease;"></div>
        </div>
      </div>

      <!-- Dignity & Ethics Tip Callout -->
      <div class="ethics-banner" style="margin-bottom: 1.75rem; background: var(--primary-bg-subtle); border-color: var(--primary-border); color: var(--primary-hover);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <div style="font-size: 0.85rem;">
          <strong>Dignity & Ethics Tip:</strong> Focus on <strong>subject agency and active community leadership</strong> rather than passive victimhood or sensationalized distress.
        </div>
      </div>

      <!-- Form Container -->
      <form id="create-project-form" class="card" style="display: flex; flex-direction: column; gap: 1.5rem;">
        <input type="hidden" id="wizard-step" value="${currentStep}" />

        ${currentStep === 1 ? `
          <!-- STEP 1: Story Brief & Active Agency -->
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 1.25rem;">
              <h3 style="font-size: 1.2rem; color: var(--primary); font-family: var(--font-sans); font-weight: 700;">
                1. Story Brief & Active Agency
              </h3>
              <span class="badge" style="background: var(--bg-subtle); color: var(--text-muted); font-size: 0.75rem;">Step 1 of 2</span>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="projectName">
                Project / Campaign Title
                <span class="form-hint">Internal reference for your team</span>
              </label>
              <input type="text" id="projectName" class="form-control" value="${initialValues.projectName}" placeholder="e.g. Coastal Mangrove Restoration Brief" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="topic">
                Documentary Topic / Issue
                <span class="form-hint">The central story or theme</span>
              </label>
              <input type="text" id="topic" class="form-control" value="${initialValues.topic}" placeholder="e.g. Traditional Seed Conservation & Food Security" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="subject">
                Core Subject & Active Agency
                <span class="form-hint">What is the subject actively doing, leading, or building?</span>
              </label>
              <textarea id="subject" class="form-control" rows="3" placeholder="e.g. Master artisan weaver passionately guiding a young apprentice at a wooden handloom" required>${initialValues.subject}</textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="location">
                Location / Environment
                <span class="form-hint">Specific physical or geographical setting</span>
              </label>
              <input type="text" id="location" class="form-control" value="${initialValues.location}" placeholder="e.g. Rustic wooden seed repository barn in a mountain valley" required />
            </div>

            <!-- Step 1 Navigation Button -->
            <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light); text-align: right;">
              <button type="button" class="btn btn-primary btn-lg" id="btn-next-step" style="width: 100%;">
                Next: Mood & Aesthetics →
              </button>
            </div>
          </div>
        ` : `
          <!-- STEP 2: Mood, Aesthetics & Format -->
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 1.25rem;">
              <h3 style="font-size: 1.2rem; color: var(--primary); font-family: var(--font-sans); font-weight: 700;">
                2. Mood, Aesthetics & Format
              </h3>
              <span class="badge" style="background: var(--bg-subtle); color: var(--text-muted); font-size: 0.75rem;">Step 2 of 2</span>
            </div>

            <!-- Preset Quick Selection Chips -->
            <div style="margin-bottom: 1.5rem; background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
              <div style="font-size: 0.825rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; display: flex; align-items: center; justify-content: space-between;">
                <span>DOCUMENTARY CATEGORY PRESETS</span>
                <span style="font-size: 0.75rem; font-weight: normal;">Click to autofill style settings</span>
              </div>
              <div class="preset-chips" style="margin-bottom: 0;">
                ${DOCUMENTARY_PRESETS.map(preset => `
                  <button type="button" class="chip ${selectedPresetId === preset.id ? 'active' : ''}" data-preset-autofill="${preset.id}">
                    ${preset.title}
                  </button>
                `).join('')}
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="timeOfDay">
                  Time of Day
                  <span class="form-hint" title="Natural available light cycle">ℹ️</span>
                </label>
                <select id="timeOfDay" class="form-control">
                  <option value="Early morning sunrise & morning mist" ${initialValues.timeOfDay.includes('Early morning') ? 'selected' : ''}>Early Morning Sunrise & Mist</option>
                  <option value="Late afternoon golden hour" ${initialValues.timeOfDay.includes('golden hour') || initialValues.timeOfDay.includes('Late afternoon') ? 'selected' : ''}>Late Afternoon Golden Hour</option>
                  <option value="Midday natural daylight" ${initialValues.timeOfDay.includes('Midday') ? 'selected' : ''}>Midday Natural Light</option>
                  <option value="Overcast diffused light" ${initialValues.timeOfDay.includes('Overcast') ? 'selected' : ''}>Overcast Soft Daylight</option>
                  <option value="Blue hour twilight" ${initialValues.timeOfDay.includes('Blue hour') ? 'selected' : ''}>Blue Hour Twilight</option>
                  <option value="Night atmosphere with artificial work lights" ${initialValues.timeOfDay.includes('Night') ? 'selected' : ''}>Night Worklights</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="lighting">
                  Lighting Condition
                  <span class="form-hint">Available light quality</span>
                </label>
                <input type="text" id="lighting" class="form-control" value="${initialValues.lighting}" placeholder="e.g. Diffused window daylight filtering through wood" required />
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label" for="mood">Emotional Mood</label>
                <input type="text" id="mood" class="form-control" value="${initialValues.mood}" placeholder="e.g. Collaborative, dignified, hopeful" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="visualStyle">Visual Framing Style</label>
                <input type="text" id="visualStyle" class="form-control" value="${initialValues.visualStyle}" placeholder="e.g. Unposed observational photojournalism" required />
              </div>
            </div>

            <!-- Intent-Based Film Stock Dropdown -->
            <div class="form-group">
              <label class="form-label" for="filmLook">
                Color & Tone Intent (Film Look)
                <span class="form-hint">Controls warmth, grain, and color emotion</span>
              </label>
              <select id="filmLook" class="form-control">
                <option value="Warm & Hopeful Daylight (Kodak Portra 400 35mm)" ${initialValues.filmLook.includes('Portra 400') || initialValues.filmLook.includes('Warm') ? 'selected' : ''}>
                  ☀️ Warm & Hopeful Daylight (Kodak Portra 400)
                </option>
                <option value="Cool & Natural Greens (Fujifilm Pro 400H)" ${initialValues.filmLook.includes('Fujifilm') || initialValues.filmLook.includes('Cool') ? 'selected' : ''}>
                  🌿 Cool & Natural Greens (Fujifilm Pro 400H)
                </option>
                <option value="Classic B&W Historic Journal (Kodak Tri-X 400)" ${initialValues.filmLook.includes('Tri-X') || initialValues.filmLook.includes('B&W') ? 'selected' : ''}>
                  📷 Classic B&W Historic Journal (Kodak Tri-X 400)
                </option>
                <option value="Moody Night & Industrial Worklight (Cinestill 800T)" ${initialValues.filmLook.includes('Cinestill') || initialValues.filmLook.includes('Moody') ? 'selected' : ''}>
                  🌃 Moody Night & Worklight (Cinestill 800T)
                </option>
                <option value="Vivid Sharp Detail & Earth Tones (Kodak Ektar 100)" ${initialValues.filmLook.includes('Ektar') || initialValues.filmLook.includes('Vivid') ? 'selected' : ''}>
                  🌾 Vivid Sharp Detail & Earth Tones (Kodak Ektar 100)
                </option>
              </select>
            </div>

            <!-- Aspect Ratio Segmented Control with Shape Icons -->
            <div class="form-group">
              <label class="form-label">Aspect Ratio / Media Format</label>
              <input type="hidden" id="aspectRatio" value="${initialValues.aspectRatio}" />
              <div class="segmented-control">
                <button type="button" class="segmented-option ${initialValues.aspectRatio === '16:9' ? 'active' : ''}" data-ratio="16:9" title="Widescreen Video & Banners">
                  ▭ 16:9 (Widescreen)
                </button>
                <button type="button" class="segmented-option ${initialValues.aspectRatio === '4:3' ? 'active' : ''}" data-ratio="4:3" title="Editorial Reports & Documents">
                  🔲 4:3 (Editorial)
                </button>
                <button type="button" class="segmented-option ${initialValues.aspectRatio === '1:1' ? 'active' : ''}" data-ratio="1:1" title="Square Social Feed">
                  ◽ 1:1 (Square)
                </button>
                <button type="button" class="segmented-option ${initialValues.aspectRatio === '3:2' ? 'active' : ''}" data-ratio="3:2" title="Classic Photography Print">
                  🖼️ 3:2 (Print)
                </button>
              </div>
            </div>

            <!-- Step 2 Navigation Buttons -->
            <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-light);">
              <button type="button" class="btn btn-secondary btn-lg" id="btn-back-step" style="flex: 1;">
                ← Back: Story Brief
              </button>
              <button type="submit" class="btn btn-primary btn-lg" style="flex: 2;">
                Generate Documentary Prompts ✨
              </button>
            </div>
          </div>
        `}

      </form>
    </div>
  `;
}
