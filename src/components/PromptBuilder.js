/**
 * Prompt Builder Component
 * Guided dynamic prompt composer with live real-time preview and pitch-deck actions.
 */
import { renderCampaignContextCard } from './CampaignContextCard.js';
import { renderThemeSelector } from './ThemeSelector.js';
import { LIGHTING_OPTIONS, COMPOSITION_OPTIONS, DEFAULT_TONE_CHIPS, composeDocumentaryPrompt } from '../services/promptComposer.js';

export function renderPromptBuilder(state) {
  const { campaignData, builderState, isContextCollapsed } = state;
  if (!campaignData) return '';

  const themes = campaignData.themes || [];
  const settings = campaignData.settings || [];
  const toneKeywords = campaignData.tone_keywords || [];
  const subjectExamples = campaignData.subject_examples || [];

  const selectedThemeIndex = builderState.selectedThemeIndex || 0;
  const currentTheme = themes[selectedThemeIndex] || { label: "General Storytelling", description: "" };

  // Calculate subject placeholder dynamically from extracted examples
  const suggestedSubject = subjectExamples[selectedThemeIndex % subjectExamples.length] || subjectExamples[0] || "Community members in active, unposed endeavors";

  // Build current live prompt text
  const livePrompt = composeDocumentaryPrompt({
    campaignName: campaignData.campaign_name,
    theme: currentTheme,
    setting: builderState.isCustomSetting ? builderState.customSetting : (builderState.setting || settings[0] || ""),
    subject: builderState.subject || suggestedSubject,
    moodKeywords: builderState.selectedMoods || toneKeywords.slice(0, 4),
    lighting: builderState.lighting || "Natural daylight",
    composition: builderState.composition || "Environmental portrait",
    cameraStyle: builderState.cameraStyle || "35mm photojournalism prime lens",
    ethicalLock: builderState.ethicalLock !== false,
    aspectRatio: builderState.aspectRatio || "16:9",
    includeNegative: builderState.includeNegative !== false
  });

  // Combine extracted tone keywords with default fallback pool for chips
  const allToneChips = Array.from(new Set([...toneKeywords, ...DEFAULT_TONE_CHIPS]));
  const activeMoods = builderState.selectedMoods || toneKeywords.slice(0, 4);

  return `
    <div class="prompt-builder-view container">
      <!-- Campaign Context Card (Collapsible) -->
      ${renderCampaignContextCard(campaignData, isContextCollapsed)}

      <div class="builder-workspace-grid">
        <!-- Left Column: The Guided Form Controls -->
        <div class="builder-form-panel">
          <div class="panel-section-title">
            <h3>Guided Prompt Configuration</h3>
            <p class="panel-subtitle">Fine-tune the documentary visual parameters for your pitch deck</p>
          </div>

          <!-- 1. Theme Selector -->
          ${renderThemeSelector(themes, selectedThemeIndex)}

          <!-- 2. Scene / Setting Selection -->
          <div class="form-group-block">
            <div class="field-header">
              <label class="field-label" for="setting-select">
                <span class="field-num">2</span>
                <span>On-The-Ground Scene / Setting</span>
              </label>
              <span class="field-hint">Specific documentary environment derived from the brochure</span>
            </div>

            <div class="setting-controls">
              <select class="form-select" id="setting-select" aria-label="Select setting">
                ${settings.map(s => `
                  <option value="${s}" ${(!builderState.isCustomSetting && builderState.setting === s) ? 'selected' : ''}>
                    ${s}
                  </option>
                `).join('')}
                <option value="__custom__" ${builderState.isCustomSetting ? 'selected' : ''}>
                  ✏️ Custom specific location...
                </option>
              </select>

              <div class="custom-setting-wrap ${builderState.isCustomSetting ? '' : 'is-hidden'}" id="custom-setting-container">
                <input 
                  type="text" 
                  id="custom-setting-input" 
                  class="form-input" 
                  placeholder="e.g. Inside a solar equipment testing yurt at sunset" 
                  value="${builderState.customSetting || ''}"
                />
              </div>
            </div>
          </div>

          <!-- 3. Subject Focus (Free text with dynamic placeholder) -->
          <div class="form-group-block">
            <div class="field-header">
              <label class="field-label" for="subject-input">
                <span class="field-num">3</span>
                <span>Subject & Human Agency</span>
              </label>
              <span class="field-hint">People, actions, gestures or interactions in the frame</span>
            </div>
            
            <div class="subject-input-wrapper">
              <textarea 
                id="subject-input" 
                class="form-textarea" 
                rows="2" 
                placeholder="${suggestedSubject}"
              >${builderState.subject || ''}</textarea>
              
              <div class="subject-suggestions-bar">
                <span class="suggestion-label">Suggested from brochure:</span>
                <button type="button" class="btn-chip-suggestion" id="btn-use-suggested-subject" title="Click to fill with suggested subject">
                  "${suggestedSubject}"
                </button>
              </div>
            </div>
          </div>

          <!-- 4. Mood & Atmosphere (Chips) -->
          <div class="form-group-block">
            <div class="field-header">
              <label class="field-label">
                <span class="field-num">4</span>
                <span>Mood & Atmosphere</span>
              </label>
              <span class="field-hint">Select or toggle emotional tone words</span>
            </div>

            <div class="chips-group" id="mood-chips-container">
              ${allToneChips.map(tone => {
                const isSelected = activeMoods.includes(tone);
                return `
                  <button 
                    type="button" 
                    class="chip ${isSelected ? 'chip-selected' : ''}" 
                    data-mood="${tone}"
                    aria-pressed="${isSelected}"
                  >
                    ${isSelected ? '✓ ' : ''}${tone}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 5. Lighting & Time of Day -->
          <div class="form-group-block">
            <div class="field-header">
              <label class="field-label">
                <span class="field-num">5</span>
                <span>Lighting & Time of Day</span>
              </label>
              <span class="field-hint">Authentic natural and available light conditions</span>
            </div>

            <div class="chips-group" id="lighting-chips-container">
              ${LIGHTING_OPTIONS.map(opt => {
                const isSelected = (builderState.lighting || "Natural daylight") === opt.label;
                return `
                  <button 
                    type="button" 
                    class="chip ${isSelected ? 'chip-selected' : ''}" 
                    data-lighting="${opt.label}"
                    title="${opt.desc}"
                    aria-pressed="${isSelected}"
                  >
                    ${isSelected ? '● ' : ''}${opt.label}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 6. Composition & Framing -->
          <div class="form-group-block">
            <div class="field-header">
              <label class="field-label">
                <span class="field-num">6</span>
                <span>Composition & Framing</span>
              </label>
              <span class="field-hint">Perspective, scale, and photographic distance</span>
            </div>

            <div class="chips-group" id="composition-chips-container">
              ${COMPOSITION_OPTIONS.map(opt => {
                const isSelected = (builderState.composition || "Environmental portrait") === opt.label;
                return `
                  <button 
                    type="button" 
                    class="chip ${isSelected ? 'chip-selected' : ''}" 
                    data-composition="${opt.label}"
                    title="${opt.desc}"
                    aria-pressed="${isSelected}"
                  >
                    ${isSelected ? '● ' : ''}${opt.label}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 7. Aspect Ratio & Technical Settings -->
          <div class="form-group-block">
            <div class="field-header">
              <label class="field-label">
                <span class="field-num">7</span>
                <span>Aspect Ratio & Camera Perspective</span>
              </label>
            </div>

            <div class="ratio-segmented-row">
              <div class="segmented-control" id="ratio-segmented">
                ${['16:9', '4:3', '3:2', '1:1'].map(r => `
                  <button 
                    type="button" 
                    class="segmented-btn ${(builderState.aspectRatio || '16:9') === r ? 'is-active' : ''}" 
                    data-ratio="${r}"
                  >
                    ${r}
                  </button>
                `).join('')}
              </div>

              <select class="form-select form-select-sm" id="camera-style-select" aria-label="Camera lens profile">
                <option value="35mm documentary prime lens" ${builderState.cameraStyle === '35mm documentary prime lens' ? 'selected' : ''}>35mm Prime (Classic Photojournalism)</option>
                <option value="50mm natural perspective prime lens" ${builderState.cameraStyle === '50mm natural perspective prime lens' ? 'selected' : ''}>50mm Prime (Human Eye Perspective)</option>
                <option value="24mm documentary wide-angle lens" ${builderState.cameraStyle === '24mm documentary wide-angle lens' ? 'selected' : ''}>24mm Wide Angle (Broad Context)</option>
                <option value="85mm f/2.0 candid portrait lens" ${builderState.cameraStyle === '85mm f/2.0 candid portrait lens' ? 'selected' : ''}>85mm Portrait (Subtle Bokeh & Intimacy)</option>
              </select>
            </div>
          </div>

          <!-- 8. Ethical & Style Guardrail Lock (Always-on, toggleable) -->
          <div class="ethical-lock-card">
            <div class="ethical-lock-header">
              <div class="lock-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="lock-text">
                <div class="lock-title">Documentary Realism & Ethical Representation Lock</div>
                <div class="lock-desc">Enforces respectful, dignified agency; removes plastic skin, staged smiles, and commercial stock-photo tropes.</div>
              </div>
              <label class="toggle-switch">
                <input type="checkbox" id="toggle-ethical-lock" ${builderState.ethicalLock !== false ? 'checked' : ''} />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>

        <!-- Right Column: Live Prompt Preview & Pitch Deck Output Actions -->
        <div class="builder-preview-panel">
          <div class="preview-sticky-wrap">
            <div class="preview-card">
              <div class="preview-card-header">
                <div class="preview-header-meta">
                  <span class="live-pill"><span class="pulse-dot"></span> Live Natural Language Prompt</span>
                  <span class="strand-badge">${currentTheme.label}</span>
                </div>
              </div>

              <div class="preview-prompt-box">
                <textarea 
                  id="live-prompt-textarea" 
                  class="live-prompt-display" 
                  readonly 
                  aria-label="Assembled documentary prompt text"
                >${livePrompt}</textarea>
              </div>

              <div class="preview-footer-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>Ready to paste into Midjourney, Stable Diffusion, Flux, or DALL-E for your pitch deck.</span>
              </div>

              <div class="preview-actions-bar">
                <button class="btn btn-primary btn-block" id="btn-save-to-deck">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  <span>Save to Pitch Deck</span>
                </button>

                <div class="actions-secondary-row">
                  <button class="btn btn-outline" id="btn-copy-live-prompt">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    <span>Copy Prompt</span>
                  </button>

                  <button class="btn btn-ghost" id="btn-reset-builder" title="Reset fields to extracted defaults">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                    <span>Reset Fields</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Pitch Deck Session Mini Quick Stats -->
            <div class="deck-session-card">
              <div class="session-card-header">
                <span class="session-label">Session Pitch Deck:</span>
                <span class="session-count-tag">${state.savedPrompts.length} prompt${state.savedPrompts.length === 1 ? '' : 's'} saved</span>
              </div>
              <button class="btn btn-sm btn-outline btn-block" id="btn-open-deck-drawer-from-preview">
                <span>View & Export Pitch Deck Prompts</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
