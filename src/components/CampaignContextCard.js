/**
 * Campaign Context Card Component
 * Displays the extracted campaign summary as a reference card with collapse toggle & re-upload action.
 */

export function renderCampaignContextCard(campaignData, isCollapsed = false) {
  if (!campaignData) return '';

  return `
    <div class="campaign-context-card ${isCollapsed ? 'is-collapsed' : ''}" id="campaign-context-card">
      <div class="context-card-header">
        <div class="context-title-group">
          <div class="context-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span>Active Campaign Brief</span>
          </div>
          <h2 class="context-campaign-name">${campaignData.campaign_name || 'Documentary Initiative'}</h2>
        </div>

        <div class="context-header-actions">
          <button class="btn btn-sm btn-ghost btn-toggle-collapse" id="btn-toggle-context-card" aria-label="Toggle brief details">
            <span>${isCollapsed ? 'Show Full Brief' : 'Minimize Brief'}</span>
            <svg class="chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="${isCollapsed ? '6 9 12 15 18 9' : '18 15 12 9 6 15'}"/></svg>
          </button>

          <button class="btn btn-sm btn-outline" id="btn-upload-different" title="Upload another brochure without losing your saved prompts">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Switch Brochure</span>
          </button>
        </div>
      </div>

      <div class="context-card-body">
        <p class="context-summary">${campaignData.one_line_summary || ''}</p>
        
        <div class="context-meta-row">
          <div class="meta-item">
            <span class="meta-label">Strands Extracted:</span>
            <span class="meta-val">${campaignData.themes ? campaignData.themes.length : 0} themes</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Settings Derived:</span>
            <span class="meta-val">${campaignData.settings ? campaignData.settings.length : 0} locations</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Tone Keywords:</span>
            <span class="meta-val">${campaignData.tone_keywords ? campaignData.tone_keywords.slice(0, 4).join(', ') : 'Documentary'}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
