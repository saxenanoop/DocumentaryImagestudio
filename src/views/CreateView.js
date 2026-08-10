/**
 * Create View Component
 */
import { DOCUMENTARY_PRESETS } from '../presets.js';
import { getDraft, saveDraft } from '../storage.js';

export function renderCreateView(selectedPresetId = null) {
  // Check if draft exists or if a preset was selected
  let initialValues = {
    projectName: "Community Resilience Study",
    topic: "Sustainable Urban Agriculture & Local Food Security",
    subject: "Volunteers harvesting organic produce together in a city garden",
    location: "Community garden plot surrounded by residential neighborhoods",
    timeOfDay: "Late afternoon golden hour",
    lighting: "Warm direct sunlight with soft directional shadows",
    mood: "Collaborative, dignified, hopeful",
    visualStyle: "Unposed social realism, candid documentary photojournalism",
    filmLook: "Kodak Portra 400 35mm",
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
      <div style="margin-bottom: 2rem; text-align: center;">
        <h1 style="font-size: 2.25rem; margin-bottom: 0.5rem;">Create Documentary Visual</h1>
        <p class="text-muted" style="font-size: 1.05rem;">
          Describe the documentary scene you want to create. The app will build structured documentary-style prompts.
        </p>
      </div>

      <!-- Preset Quick Selection Chips -->
      <div class="card" style="margin-bottom: 2rem; padding: 1.25rem;">
        <div style="font-size: 0.875rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between;">
          <span>QUICK PRESETS</span>
          <span style="font-size: 0.775rem; font-weight: normal;">Click to autofill form</span>
        </div>
        <div class="preset-chips">
          ${DOCUMENTARY_PRESETS.map(preset => `
            <button type="button" class="chip ${selectedPresetId === preset.id ? 'active' : ''}" data-preset-autofill="${preset.id}">
              ${preset.title}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Main Form -->
      <form id="create-project-form" class="card" style="display: flex; flex-direction: column; gap: 1.75rem;">
        
        <!-- Section 1: Project Basics -->
        <div>
          <h3 style="font-size: 1.15rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 1rem; color: var(--primary);">
            1. Project Basics
          </h3>
          
          <div class="form-group">
            <label class="form-label" for="projectName">
              Project Name
              <span class="form-hint">Internal reference title</span>
            </label>
            <input type="text" id="projectName" class="form-control" value="${initialValues.projectName}" placeholder="e.g. Coastal Mangrove Defense Brief" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="topic">
              Documentary Topic
              <span class="form-hint">The central issue or story</span>
            </label>
            <input type="text" id="topic" class="form-control" value="${initialValues.topic}" placeholder="e.g. Traditional Seed Conservation & Food Security" required />
          </div>

          <div class="form-group">
            <label class="form-label" for="subject">
              Core Subject & Action
              <span class="form-hint">Who or what is taking place</span>
            </label>
            <textarea id="subject" class="form-control" rows="2" placeholder="e.g. Elderly weaver guiding young student through traditional wooden loom techniques" required>${initialValues.subject}</textarea>
          </div>
        </div>

        <!-- Section 2: Environment -->
        <div>
          <h3 style="font-size: 1.15rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 1rem; color: var(--primary);">
            2. Environment & Lighting
          </h3>

          <div class="form-group">
            <label class="form-label" for="location">
              Location / Environment
              <span class="form-hint">Specific physical setting</span>
            </label>
            <input type="text" id="location" class="form-control" value="${initialValues.location}" placeholder="e.g. Rustic wooden seed repository barn in rural valley" required />
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="timeOfDay">Time of Day</label>
              <select id="timeOfDay" class="form-control">
                <option value="Early morning sunrise & morning mist" ${initialValues.timeOfDay.includes('Early morning') ? 'selected' : ''}>Early Morning Sunrise</option>
                <option value="Late afternoon golden hour" ${initialValues.timeOfDay.includes('golden hour') || initialValues.timeOfDay.includes('Late afternoon') ? 'selected' : ''}>Late Afternoon Golden Hour</option>
                <option value="Midday natural daylight" ${initialValues.timeOfDay.includes('Midday') ? 'selected' : ''}>Midday Natural Light</option>
                <option value="Overcast diffused light" ${initialValues.timeOfDay.includes('Overcast') ? 'selected' : ''}>Overcast Soft Daylight</option>
                <option value="Blue hour twilight" ${initialValues.timeOfDay.includes('Blue hour') ? 'selected' : ''}>Blue Hour Twilight</option>
                <option value="Night atmosphere with artificial work lights" ${initialValues.timeOfDay.includes('Night') ? 'selected' : ''}>Night Worklights</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="lighting">Lighting Condition</label>
              <input type="text" id="lighting" class="form-control" value="${initialValues.lighting}" placeholder="e.g. Diffused window daylight filtering through wood" required />
            </div>
          </div>
        </div>

        <!-- Section 3: Mood and Style -->
        <div>
          <h3 style="font-size: 1.15rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem; margin-bottom: 1rem; color: var(--primary);">
            3. Mood, Aesthetics & Format
          </h3>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="mood">Mood / Emotion</label>
              <input type="text" id="mood" class="form-control" value="${initialValues.mood}" placeholder="e.g. Reverent, focused, collaborative" required />
            </div>

            <div class="form-group">
              <label class="form-label" for="visualStyle">Visual Style</label>
              <input type="text" id="visualStyle" class="form-control" value="${initialValues.visualStyle}" placeholder="e.g. Observational documentary photojournalism" required />
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label" for="filmLook">Film Stock Look</label>
              <select id="filmLook" class="form-control">
                <option value="Kodak Portra 400 35mm" ${initialValues.filmLook.includes('Portra 400') ? 'selected' : ''}>Kodak Portra 400 (Warm & Natural)</option>
                <option value="Fujifilm Pro 400H" ${initialValues.filmLook.includes('Fujifilm') ? 'selected' : ''}>Fujifilm Pro 400H (Cool Greens & Blues)</option>
                <option value="Kodak Tri-X 400 Black & White" ${initialValues.filmLook.includes('Tri-X') ? 'selected' : ''}>Kodak Tri-X 400 (Classic B&W Grain)</option>
                <option value="Cinestill 800T" ${initialValues.filmLook.includes('Cinestill') ? 'selected' : ''}>Cinestill 800T (Atmospheric Tungsten)</option>
                <option value="Kodak Ektar 100" ${initialValues.filmLook.includes('Ektar') ? 'selected' : ''}>Kodak Ektar 100 (Vivid Sharp Detail)</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Aspect Ratio</label>
              <input type="hidden" id="aspectRatio" value="${initialValues.aspectRatio}" />
              <div class="segmented-control">
                <button type="button" class="segmented-option ${initialValues.aspectRatio === '16:9' ? 'active' : ''}" data-ratio="16:9">16:9</button>
                <button type="button" class="segmented-option ${initialValues.aspectRatio === '4:3' ? 'active' : ''}" data-ratio="4:3">4:3</button>
                <button type="button" class="segmented-option ${initialValues.aspectRatio === '1:1' ? 'active' : ''}" data-ratio="1:1">1:1</button>
                <button type="button" class="segmented-option ${initialValues.aspectRatio === '3:2' ? 'active' : ''}" data-ratio="3:2">3:2</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button Section -->
        <div style="padding-top: 1rem; border-top: 1px solid var(--border-light); text-align: center;">
          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/></svg>
            Generate Documentary Prompts
          </button>
          <p class="form-hint" style="margin-top: 0.75rem; text-align: center;">
            No login required. Prompts are created locally in your browser with ethical clarity.
          </p>
        </div>

      </form>
    </div>
  `;
}
