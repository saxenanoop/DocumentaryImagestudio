/**
 * Manual Entry Modal Component
 * Fallback modal allowing users to manually supply campaign details or paste brochure text directly.
 */

export function renderManualEntryModal(isOpen = false) {
  return `
    <div class="modal-backdrop ${isOpen ? 'is-open' : ''}" id="manual-modal-backdrop" aria-hidden="${!isOpen}">
      <div class="manual-modal-dialog" role="dialog" aria-label="Manual Brief Entry" aria-modal="true">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3 class="modal-title">Manual Campaign Setup</h3>
            <p class="modal-subtitle">Paste brochure text or define campaign themes manually</p>
          </div>
          <button class="btn-close-modal" id="btn-close-manual-modal" aria-label="Close modal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <form id="manual-entry-form" class="modal-form">
          <div class="form-group-block">
            <label class="field-label" for="manual-paste-text" style="display: flex; justify-content: space-between; align-items: center;">
              <span>Paste Brochure / Campaign Text</span>
              <span class="badge font-mono" style="background: rgba(66, 133, 244, 0.15); color: #8AB4F8; font-size: 0.7rem; padding: 2px 7px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px;">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z"/></svg>
                Google Gemini Active
              </span>
            </label>
            <span class="field-hint" style="margin-bottom: 0.4rem; display: block;">Paste full text to auto-extract structured themes via Gemini AI</span>
            <textarea 
              id="manual-paste-text" 
              class="form-textarea" 
              rows="4" 
              placeholder="Paste executive summary, program pillars, project description, or field locations here..."
            ></textarea>
            <div class="field-error-msg" id="err-manual-paste-text" style="display: none;"></div>
          </div>

          <div class="modal-divider">
            <span>OR ENTER REQUIRED FIELDS DIRECTLY</span>
          </div>

          <div class="form-group-block">
            <label class="field-label" for="manual-campaign-name">
              <span>Campaign / Project Name</span>
              <span class="required-star" title="Required">*</span>
            </label>
            <input type="text" id="manual-campaign-name" class="form-input" placeholder="e.g. SolarGrid Rural Micro-Utilities" />
            <div class="field-error-msg" id="err-manual-campaign-name" style="display: none;"></div>
          </div>

          <div class="form-group-block">
            <label class="field-label" for="manual-summary">
              <span>One-Line Summary</span>
              <span class="required-star" title="Required">*</span>
            </label>
            <input type="text" id="manual-summary" class="form-input" placeholder="e.g. Decentralized solar energy powering women-led agricultural cooperatives" />
            <div class="field-error-msg" id="err-manual-summary" style="display: none;"></div>
          </div>

          <div class="form-group-block">
            <label class="field-label" for="manual-themes-raw">
              <span>Key Themes / Strands</span>
              <span class="required-star" title="Required">*</span>
              <span class="field-hint">Separate multiple themes with commas</span>
            </label>
            <input type="text" id="manual-themes-raw" class="form-input" placeholder="e.g. Women-Operated Milling Hubs, Clean Energy Tech Guild, Night Market Economy" />
            <div class="field-error-msg" id="err-manual-themes-raw" style="display: none;"></div>
          </div>

          <div class="form-group-block">
            <label class="field-label" for="manual-settings-raw">
              <span>Key Settings / Locations</span>
              <span class="required-star" title="Required">*</span>
              <span class="field-hint">Separate with commas</span>
            </label>
            <input type="text" id="manual-settings-raw" class="form-input" placeholder="e.g. Cooperative grain milling room, Rooftop solar installation, Evening marketplace" />
            <div class="field-error-msg" id="err-manual-settings-raw" style="display: none;"></div>
          </div>

          <div class="modal-actions-bar">
            <button type="button" class="btn btn-ghost" id="btn-cancel-manual-modal">Cancel</button>
            <button type="submit" class="btn btn-primary" id="btn-submit-manual-entry">
              <span>Process Brief & Launch Builder</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}
