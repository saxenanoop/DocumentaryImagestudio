/**
 * Prompt Builder Component (Two-Pane Studio with Progressive Steps)
 * Left pane: Progressive 3-step accordion (Theme -> Subject & Setting -> Look & Aesthetics)
 * Right pane: Sticky live prompt preview with stable height + Deck actions
 */
import { renderCampaignContextCard } from './CampaignContextCard.js';
import { renderThemeSelector } from './ThemeSelector.js';
import { LIGHTING_OPTIONS, COMPOSITION_OPTIONS, DEFAULT_TONE_CHIPS, composeDocumentaryPrompt } from '../services/promptComposer.js';

export function renderPromptBuilder(state) {
  const { campaignData, builderState, isBriefExpanded } = state;
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

  const allToneChips = Array.from(new Set([...toneKeywords, ...DEFAULT_TONE_CHIPS]));
  const activeMoods = builderState.selectedMoods || toneKeywords.slice(0, 4);

  // Progressive Stepper state (1: Theme, 2: Subject & Setting, 3: Look & Aesthetics)
  const activeStep = builderState.activeStep || 1;

  // Formatted one-line summaries for collapsed states
  const step1Summary = currentTheme.label;
  const currentSetting = builderState.isCustomSetting 
    ? (builderState.customSetting || 'Custom location') 
    : (builderState.setting || settings[0] || 'Open-air community setting');
  const currentSubject = (builderState.subject || suggestedSubject).trim();
  const truncatedSubject = currentSubject.length > 36 ? currentSubject.slice(0, 36) + '...' : currentSubject;
  const truncatedSetting = currentSetting.length > 26 ? currentSetting.slice(0, 26) + '...' : currentSetting;
  const step2Summary = `Subject: ${truncatedSubject} • Location: ${truncatedSetting}`;

  const cameraClean = (builderState.cameraStyle || '35mm documentary prime lens').split('(')[0].replace('documentary prime lens', 'Prime').replace('photojournalism', '').trim();
  const lightingClean = builderState.lighting || 'Natural daylight';
  const compClean = builderState.composition || 'Environmental portrait';
  const ratioClean = builderState.aspectRatio || '16:9';
  const step3Summary = `${cameraClean} • ${lightingClean} • ${compClean} • ${ratioClean}`;

  return `
    <div class="prompt-builder-view">
      <!-- Slim Sticky Campaign Brief Bar (Directly under Header) -->
      ${renderCampaignContextCard(campaignData, isBriefExpanded)}

      <!-- Main Two-Pane Studio Workspace -->
      <div class="studio-workspace-container container">
        <div class="studio-layout-grid">

          <!-- Left Pane: Guided Progressive Steps -->
          <div class="studio-left-pane">
            <div class="studio-pane-header">
              <h2 class="studio-pane-title">Image Prompt Studio</h2>
              <p class="studio-pane-subtitle">Craft documentary photojournalistic prompts step-by-step</p>
            </div>

            <div class="studio-stepper-container">

              <!-- STEP 1: Curatorial Theme / Strand -->
              <section class="studio-step-card ${activeStep === 1 ? 'is-expanded' : 'is-collapsed'}" id="step-card-1">
                <header class="studio-step-header" data-step="1" tabindex="0" role="button" aria-expanded="${activeStep === 1}">
                  <div class="step-header-left">
                    <span class="step-number-pill ${activeStep > 1 ? 'is-completed' : ''}">${activeStep > 1 ? '✓' : '1'}</span>
                    <div class="step-title-group">
                      <h3 class="step-title">Curatorial Theme / Strand</h3>
                      ${activeStep !== 1 ? `
                        <div class="step-collapsed-summary">
                          <span class="summary-label">Selected:</span>
                          <span class="summary-value">${step1Summary}</span>
                        </div>
                      ` : `
                        <span class="step-hint">Select the narrative strand you are building visual prompts for</span>
                      `}
                    </div>
                  </div>
                  <div class="step-header-right">
                    ${activeStep !== 1 ? `
                      <button type="button" class="btn-step-edit" data-step-target="1" title="Edit theme">
                        <span>Edit</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>
                    ` : ''}
                  </div>
                </header>

                ${activeStep === 1 ? `
                  <div class="studio-step-body">
                    ${renderThemeSelector(themes, selectedThemeIndex)}

                    <div class="step-nav-footer">
                      <button type="button" class="btn btn-primary btn-step-continue" data-next-step="2">
                        <span>Continue to Subject & Location</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </div>
                  </div>
                ` : ''}
              </section>

              <!-- STEP 2: Subject + Location -->
              <section class="studio-step-card ${activeStep === 2 ? 'is-expanded' : 'is-collapsed'}" id="step-card-2">
                <header class="studio-step-header" data-step="2" tabindex="0" role="button" aria-expanded="${activeStep === 2}">
                  <div class="step-header-left">
                    <span class="step-number-pill ${activeStep > 2 ? 'is-completed' : ''}">${activeStep > 2 ? '✓' : '2'}</span>
                    <div class="step-title-group">
                      <h3 class="step-title">Subject & Location</h3>
                      ${activeStep !== 2 ? `
                        <div class="step-collapsed-summary">
                          <span class="summary-label">Summary:</span>
                          <span class="summary-value">${step2Summary}</span>
                        </div>
                      ` : `
                        <span class="step-hint">Define frontline human agency and documentary physical environment</span>
                      `}
                    </div>
                  </div>
                  <div class="step-header-right">
                    ${activeStep !== 2 ? `
                      <button type="button" class="btn-step-edit" data-step-target="2" title="Edit subject and location">
                        <span>Edit</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>
                    ` : ''}
                  </div>
                </header>

                ${activeStep === 2 ? `
                  <div class="studio-step-body">
                    <!-- Location / Setting -->
                    <div class="form-group-block">
                      <div class="field-header">
                        <label class="field-label" for="setting-select">
                          <span>On-The-Ground Setting / Location</span>
                        </label>
                        <span class="field-hint">Authentic physical backdrop derived from brochure</span>
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

                    <!-- Subject Focus -->
                    <div class="form-group-block">
                      <div class="field-header">
                        <label class="field-label" for="subject-input">
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

                    <div class="step-nav-footer step-nav-split">
                      <button type="button" class="btn btn-ghost btn-step-back" data-prev-step="1">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                        <span>Back to Theme</span>
                      </button>
                      <button type="button" class="btn btn-primary btn-step-continue" data-next-step="3">
                        <span>Continue to Look & Aesthetics</span>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    </div>
                  </div>
                ` : ''}
              </section>

              <!-- STEP 3: Look & Aesthetics -->
              <section class="studio-step-card ${activeStep === 3 ? 'is-expanded' : 'is-collapsed'}" id="step-card-3">
                <header class="studio-step-header" data-step="3" tabindex="0" role="button" aria-expanded="${activeStep === 3}">
                  <div class="step-header-left">
                    <span class="step-number-pill">3</span>
                    <div class="step-title-group">
                      <h3 class="step-title">Look & Camera Aesthetics</h3>
                      ${activeStep !== 3 ? `
                        <div class="step-collapsed-summary">
                          <span class="summary-label">Selected:</span>
                          <span class="summary-value">${step3Summary}</span>
                        </div>
                      ` : `
                        <span class="step-hint">Lighting, photographic lens, composition framing, and ratio</span>
                      `}
                    </div>
                  </div>
                  <div class="step-header-right">
                    ${activeStep !== 3 ? `
                      <button type="button" class="btn-step-edit" data-step-target="3" title="Edit look and aesthetics">
                        <span>Edit</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                      </button>
                    ` : ''}
                  </div>
                </header>

                ${activeStep === 3 ? `
                  <div class="studio-step-body">
                    <!-- Mood & Atmosphere -->
                    <div class="form-group-block">
                      <div class="field-header">
                        <label class="field-label">
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

                    <!-- Lighting & Time of Day -->
                    <div class="form-group-block">
                      <div class="field-header">
                        <label class="field-label">
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

                    <!-- Composition & Framing -->
                    <div class="form-group-block">
                      <div class="field-header">
                        <label class="field-label">
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

                    <!-- Aspect Ratio & Camera Lens -->
                    <div class="form-group-block">
                      <div class="field-header">
                        <label class="field-label">
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

                    <!-- Ethical & Style Guardrail Lock -->
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

                    <div class="step-nav-footer step-nav-split">
                      <button type="button" class="btn btn-ghost btn-step-back" data-prev-step="2">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
                        <span>Back to Subject & Location</span>
                      </button>
                      <span class="step-complete-pill">✓ Prompt assembled in right pane</span>
                    </div>
                  </div>
                ` : ''}
              </section>

            </div>
          </div>

          <!-- Right Pane: Sticky Studio Output & Deck Actions -->
          <aside class="studio-right-pane">
            <div class="studio-preview-sticky">
              <div class="preview-card">
                <div class="preview-card-header">
                  <div class="preview-header-meta">
                    <span class="live-pill"><span class="pulse-dot"></span> Live Prompt</span>
                    <span class="strand-badge">${currentTheme.label}</span>
                    <span class="ratio-badge">${builderState.aspectRatio || '16:9'}</span>
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
                  <span>Ready to paste into Midjourney, Stable Diffusion, Flux, or DALL-E.</span>
                </div>

                <div class="preview-actions-bar">
                  <button type="button" class="btn btn-primary btn-block" id="btn-save-to-deck">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                    <span>Save to Deck</span>
                  </button>

                  <div class="actions-secondary-row">
                    <button type="button" class="btn btn-outline" id="btn-copy-live-prompt">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                      <span>Copy Prompt</span>
                    </button>

                    <button type="button" class="btn btn-outline" id="btn-export-deck-direct" title="Export Deck prompts to Markdown (.md)">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      <span>Export Deck</span>
                    </button>
                  </div>

                  <div class="actions-tertiary-row" style="display: flex; justify-content: flex-end; margin-top: 0.15rem;">
                    <button type="button" class="btn btn-ghost btn-sm" id="btn-reset-builder" title="Reset fields to extracted defaults" style="font-size: 0.78rem; padding: 0.25rem 0.5rem; color: var(--text-tertiary);">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                      <span>Reset Fields</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Deck Session Mini Quick Stats Card -->
              <div class="deck-session-card">
                <div class="session-card-header">
                  <span class="session-label">Session Deck:</span>
                  <span class="session-count-tag">${state.savedPrompts.length} prompt${state.savedPrompts.length === 1 ? '' : 's'} saved</span>
                </div>
                <button type="button" class="btn btn-sm btn-outline btn-block" id="btn-open-deck-drawer-from-preview">
                  <span>View & Export Deck</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  `;
}
