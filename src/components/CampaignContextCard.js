/**
 * Campaign Brief Sticky Bar Component
 * Slim sticky chip under header with campaign identity, tone chips, and on-demand expandable brief.
 */

export function renderCampaignContextCard(campaignData, isExpanded = false) {
  if (!campaignData) return '';

  const toneChips = (campaignData.tone_keywords || []).slice(0, 3);
  const themesCount = campaignData.themes ? campaignData.themes.length : 0;
  const settingsCount = campaignData.settings ? campaignData.settings.length : 0;

  return `
    <div class="campaign-brief-sticky-bar ${isExpanded ? 'is-expanded' : ''}" id="campaign-brief-bar">
      <div class="container brief-bar-inner">
        <div class="brief-chip-group">
          <div class="brief-lead-row">
            <div class="brief-lead-tag">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>Active Brief</span>
            </div>
            <span class="brief-separator">/</span>
            <span class="brief-campaign-name" title="${campaignData.campaign_name || ''}">${campaignData.campaign_name || 'Documentary Initiative'}</span>
          </div>

          ${toneChips.length > 0 ? `
            <div class="brief-tone-pills">
              ${toneChips.map(tone => `<span class="brief-tone-chip">${tone}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <div class="brief-actions">
          <button 
            type="button" 
            class="btn-brief-toggle" 
            id="btn-toggle-context-card" 
            aria-expanded="${isExpanded}"
            title="Toggle full campaign brief"
          >
            <span>${isExpanded ? 'Hide Brief' : 'View Brief'}</span>
            <svg class="chevron-icon ${isExpanded ? 'is-rotated' : ''}" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="${isExpanded ? '18 15 12 9 6 15' : '6 9 12 15 18 9'}"/></svg>
          </button>
        </div>
      </div>

      ${isExpanded ? `
        <div class="brief-expanded-dropdown">
          <div class="container">
            <div class="brief-expanded-card">
              <div class="brief-expanded-body">
                <p class="brief-summary-text">${campaignData.one_line_summary || 'Documentary outreach and storytelling initiative.'}</p>
                <div class="brief-meta-pills-row">
                  <span class="brief-stat-pill"><strong>${themesCount}</strong> thematic strands</span>
                  <span class="brief-stat-pill"><strong>${settingsCount}</strong> field locations</span>
                  <span class="brief-stat-pill"><strong>Tone:</strong> ${(campaignData.tone_keywords || ['Authentic', 'Documentary']).join(', ')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ` : ''}
    </div>
  `;
}
