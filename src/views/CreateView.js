/**
 * Create View Component (DOM-Preserved 2-Step Wizard)
 */
import { DOCUMENTARY_PRESETS } from '../presets.js';
import { getDraft } from '../storage.js';

export function renderCreateView(selectedPresetId = null, currentStep = 1) {
  // Start with clean initial values unless draft or preset is loaded
  let initialValues = {
    projectName: "",
    topic: "",
    subject: "",
    location: "",
    timeOfDay: "Late afternoon golden hour",
    lighting: "",
    mood: "",
    visualStyle: "",
    filmLook: "Warm & Hopeful Daylight (Kodak Portra 400 35mm)",
    aspectRatio: "16:9"
  };

  const draft = getDraft();
  if (draft && Object.keys(draft).length > 0) {
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
      <div style="margin-bottom: 2rem; text-align: center;">
        <h1 style="font-size: 2.35rem; margin-bottom: 0.5rem;">Create Documentary Visual Plan</h1>
        <p class="text-muted" style="font-size: 1.05rem; max-width: 600px; margin: 0 auto;">
          Build structured documentary-style prompts designed for authentic optics, active human agency, and ethical storytelling.
        </p>
      </div>

      <!-- Step Wizard Progress Indicator -->
      <div class="wizard-step-bar">
        <div class="wizard-step-item ${currentStep === 1 ? 'active' : ''}">
          <span class="wizard-step-num">1</span>
          <span>Story Brief & Subject Agency</span>
        </div>
        <div style="width: 2rem; height: 1px; background: var(--border-medium);"></div>
        <div class="wizard-step-item ${currentStep === 2 ? 'active' : ''}">
          <span class="wizard-step-num">2</span>
          <span>Lighting, Optics & Film Stock</span>
        </div>
      </div>

      <!-- Dignity & Ethics Tip Callout -->
      <div class="ethics-banner" style="margin-bottom: 2rem; background: var(--primary-bg-subtle); border-color: var(--primary-border); color: var(--primary-hover);">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
        </svg>
        <div style="font-size: 0.85rem; line-height: 1.45;">
          <strong>Dignity & Ethics Framing:</strong> Focus on <strong>subject agency, active community leadership, and unposed authenticity</strong> rather than passive distress or sensationalism.
        </div>
      </div>

      <!-- Main Form (All inputs preserved in DOM) -->
      <form id="create-project-form" class="card" style="display: flex; flex-direction: column; gap: 1.5rem; padding: 2.25rem;">
        <input type="hidden" id="wizard-step" value="${currentStep}" />

        <!-- STEP 1 CONTAINER -->
        <div id="step-1-container" class="${currentStep === 1 ? '' : 'step-hidden'}">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.25rem; color: var(--primary); font-family: var(--font-serif); font-weight: 700;">
              1. Story Brief & Active Agency
            </h3>
            <span class="shot-badge">Step 1 of 2</span>
          </div>

          <!-- Preset Quick Selection Chips -->
          <div style="margin-bottom: 1.75rem; background: var(--bg-subtle); padding: 1.15rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.65rem; display: flex; align-items: center; justify-content: space-between; font-family: var(--font-mono);">
              <span>QUICK AUTOFILL PRESETS</span>
              <span style="font-weight: normal; font-size: 0.75rem;">Click chip to populate sample brief</span>
            </div>
            <div class="preset-chips" style="margin-bottom: 0;">
              ${DOCUMENTARY_PRESETS.map(preset => `
                <button type="button" class="chip ${selectedPresetId === preset.id ? 'active' : ''}" data-preset-autofill="${preset.id}">
                  ${preset.title}
                </button>
              `).join('')}
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label" for="projectName">
              Project / Campaign Title
              <span class="form-hint">Internal reference name</span>
            </label>
            <input type="text" id="projectName" class="form-control" value="${initialValues.projectName}" placeholder="e.g. Mangrove Coastal Community Brief" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="topic">
              Documentary Topic / Issue
              <span class="form-hint">The core story or systemic issue</span>
            </label>
            <input type="text" id="topic" class="form-control" value="${initialValues.topic}" placeholder="e.g. Traditional Seed Conservation & Food Sovereignty" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="subject">
              Core Subject & Active Agency
              <span class="form-hint">What is the subject actively doing, leading, or building?</span>
            </label>
            <textarea id="subject" class="form-control" rows="3" placeholder="e.g. Master artisan weaver passionately guiding a young apprentice at a traditional wooden loom" required>${initialValues.subject}</textarea>
          </div>

          <div class="form-group">
            <label class="form-label" for="location">
              Location / Environment
              <span class="form-hint">Specific physical, architectural, or geographical setting</span>
            </label>
            <input type="text" id="location" class="form-control" value="${initialValues.location}" placeholder="e.g. High-altitude seed vault barn in a sunlit mountain valley" required />
          </div>

          <div style="margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border-light); text-align: right;">
            <button type="button" class="btn btn-primary btn-lg" id="btn-next-step" style="width: 100%;">
              Next: Optics & Film Look →
            </button>
          </div>
        </div>

        <!-- STEP 2 CONTAINER -->
        <div id="step-2-container" class="${currentStep === 2 ? '' : 'step-hidden'}">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--border-light); padding-bottom: 0.75rem; margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.25rem; color: var(--primary); font-family: var(--font-serif); font-weight: 700;">
              2. Lighting, Aesthetics & Aspect Ratio
            </h3>
            <span class="shot-badge">Step 2 of 2</span>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="timeOfDay">
                Time of Day / Atmosphere
              </label>
              <select id="timeOfDay" class="form-control">
                <option value="Early morning sunrise & morning mist" ${initialValues.timeOfDay.includes('Early morning') ? 'selected' : ''}>Early Morning Sunrise & Mist</option>
                <option value="Late afternoon golden hour" ${initialValues.timeOfDay.includes('golden hour') || initialValues.timeOfDay.includes('Late afternoon') ? 'selected' : ''}>Late Afternoon Golden Hour</option>
                <option value="Midday natural daylight" ${initialValues.timeOfDay.includes('Midday') ? 'selected' : ''}>Midday Natural Daylight</option>
                <option value="Overcast diffused light" ${initialValues.timeOfDay.includes('Overcast') ? 'selected' : ''}>Overcast Soft Daylight</option>
                <option value="Blue hour twilight" ${initialValues.timeOfDay.includes('Blue hour') ? 'selected' : ''}>Blue Hour Twilight</option>
                <option value="Night atmosphere with artificial work lights" ${initialValues.timeOfDay.includes('Night') ? 'selected' : ''}>Night Worklights</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="lighting">
                Lighting Condition
              </label>
              <input type="text" id="lighting" class="form-control" value="${initialValues.lighting}" placeholder="e.g. Warm sunlight filtering through wooden slats" />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="mood">Emotional Tone</label>
              <input type="text" id="mood" class="form-control" value="${initialValues.mood}" placeholder="e.g. Collaborative, dignified, hopeful" />
            </div>

            <div class="form-group">
              <label class="form-label" for="visualStyle">Framing Style</label>
              <input type="text" id="visualStyle" class="form-control" value="${initialValues.visualStyle}" placeholder="e.g. Unposed observational photojournalism" />
            </div>
          </div>

          <!-- Intent-Based Film Stock Dropdown -->
          <div class="form-group">
            <label class="form-label" for="filmLook">
              Color & Grain Intent (Film Stock Emulation)
              <span class="form-hint">Controls color warmth, grain density, and tone</span>
            </label>
            <select id="filmLook" class="form-control">
              <option value="Warm & Hopeful Daylight (Kodak Portra 400 35mm)" ${initialValues.filmLook.includes('Portra 400') || initialValues.filmLook.includes('Warm') ? 'selected' : ''}>
                ☀️ Warm & Hopeful Daylight (Kodak Portra 400 35mm)
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

          <!-- Aspect Ratio Segmented Control with SVG Frame Icons -->
          <div class="form-group">
            <label class="form-label">Aspect Ratio / Optical Frame</label>
            <input type="hidden" id="aspectRatio" value="${initialValues.aspectRatio}" />
            <div class="segmented-control">
              <button type="button" class="segmented-option ${initialValues.aspectRatio === '16:9' ? 'active' : ''}" data-ratio="16:9" title="Widescreen 16:9 Video & Banners">
                <span class="ratio-frame-icon ratio-frame-16-9"></span> 16:9
              </button>
              <button type="button" class="segmented-option ${initialValues.aspectRatio === '4:3' ? 'active' : ''}" data-ratio="4:3" title="Editorial 4:3 Document Reports">
                <span class="ratio-frame-icon ratio-frame-4-3"></span> 4:3
              </button>
              <button type="button" class="segmented-option ${initialValues.aspectRatio === '1:1' ? 'active' : ''}" data-ratio="1:1" title="Square 1:1 Social Feed">
                <span class="ratio-frame-icon ratio-frame-1-1"></span> 1:1
              </button>
              <button type="button" class="segmented-option ${initialValues.aspectRatio === '3:2' ? 'active' : ''}" data-ratio="3:2" title="Classic 3:2 Photography Print">
                <span class="ratio-frame-icon ratio-frame-3-2"></span> 3:2
              </button>
            </div>
          </div>

          <div style="display: flex; gap: 1rem; margin-top: 2rem; padding-top: 1.25rem; border-top: 1px solid var(--border-light);">
            <button type="button" class="btn btn-secondary btn-lg" id="btn-back-step" style="flex: 1;">
              ← Back: Story Brief
            </button>
            <button type="submit" class="btn btn-primary btn-lg" style="flex: 2;">
              Generate 3-Shot Documentary Prompts ✨
            </button>
          </div>
        </div>

      </form>
    </div>
  `;
}

