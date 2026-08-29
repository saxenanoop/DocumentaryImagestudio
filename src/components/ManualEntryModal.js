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
            <label class="field-label" for="manual-paste-text">
              <span>Paste Brochure / Campaign Text</span>
              <span class="field-hint">Paste full text to auto-extract structured themes</span>
            </label>
            <textarea 
              id="manual-paste-text" 
              class="form-textarea" 
              rows="5" 
              placeholder="Paste executive summary, program pillars, project description, or field locations here..."
            ></textarea>
          </div>

          <div class="modal-divider">
            <span>OR ENTER FIELDS DIRECTLY</span>
          </div>

          <div class="form-group-block">
            <label class="field-label" for="manual-campaign-name">Campaign / Project Name</label>
            <input type="text" id="manual-campaign-name" class="form-input" placeholder="e.g. SolarGrid Rural Micro-Utilities" />
          </div>

          <div class="form-group-block">
            <label class="field-label" for="manual-summary">One-Line Summary</label>
            <input type="text" id="manual-summary" class="form-input" placeholder="e.g. Decentralized solar energy powering women-led agricultural cooperatives" />
          </div>

          <div class="form-group-block">
            <label class="field-label" for="manual-themes-raw">
              <span>Key Themes / Strands</span>
              <span class="field-hint">Separate multiple themes with commas</span>
            </label>
            <input type="text" id="manual-themes-raw" class="form-input" placeholder="e.g. Women-Operated Milling Hubs, Clean Energy Tech Guild, Night Market Economy" />
          </div>

          <div class="form-group-block">
            <label class="field-label" for="manual-settings-raw">
              <span>Key Settings / Locations</span>
              <span class="field-hint">Separate with commas</span>
            </label>
            <input type="text" id="manual-settings-raw" class="form-input" placeholder="e.g. Cooperative grain milling room, Rooftop solar installation, Evening marketplace" />
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
