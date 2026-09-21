/**
 * Saved Prompts Drawer Component
 * Slide-out drawer tracking saved pitch deck prompts across single or multiple brochures,
 * supporting both still-image prompts and multi-scene video storyboards.
 */

export function renderSavedPromptsDrawer(savedPrompts = [], isOpen = false) {
  return `
    <div class="drawer-backdrop ${isOpen ? 'is-open' : ''}" id="deck-drawer-backdrop" aria-hidden="${!isOpen}">
      <aside class="saved-prompts-drawer ${isOpen ? 'is-open' : ''}" id="saved-prompts-drawer" role="dialog" aria-label="Your Deck Drawer" aria-modal="true">
        <div class="drawer-header">
          <div class="drawer-header-title">
            <div class="drawer-badge-row">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <h3>Your Deck</h3>
            </div>
            <span class="drawer-count-pill">${savedPrompts.length} item${savedPrompts.length === 1 ? '' : 's'}</span>
          </div>

          <button class="btn-close-drawer" id="btn-close-deck-drawer" aria-label="Close Deck drawer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="drawer-body">
          ${savedPrompts.length === 0 ? `
            <div class="drawer-empty-state">
              <div class="empty-icon">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              </div>
              <h4>Your Deck is Empty</h4>
              <p>Configure prompts or video storyboards and click <strong>"Save to Deck"</strong> to collect them here.</p>
              <p class="empty-hint">Saved items persist across campaign changes throughout your entire session.</p>
            </div>
          ` : `
            <div class="drawer-actions-bar">
              <button class="btn btn-sm btn-primary" id="btn-copy-all-saved" title="Copy all prompts to clipboard">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span>Copy Deck Prompts</span>
              </button>
              <button class="btn btn-sm btn-outline" id="btn-export-markdown" title="Export prompt sheet as Markdown (.md)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                <span>Export .MD</span>
              </button>
              <button type="button" class="btn btn-sm btn-ghost btn-danger-ghost" id="btn-clear-saved-deck" title="Clear all saved prompts from Deck">
                <span>Clear all</span>
              </button>
            </div>

            <div class="saved-cards-list">
              ${savedPrompts.map((item) => renderSavedDeckCard(item)).join('')}
            </div>
          `}
        </div>
      </aside>
    </div>
  `;
}

/**
 * Renders individual Saved Deck Card with Type Badge and specific payload preview
 */
function renderSavedDeckCard(item) {
  const itemType = item.type || 'image';

  if (itemType === 'video-storyboard') {
    const sceneCount = item.scenes?.length || item.sceneCount || 0;
    return `
      <div class="saved-prompt-card saved-storyboard-card" data-prompt-id="${item.id}">
        <div class="saved-card-header">
          <div class="saved-meta-tags">
            <span class="type-indicator-badge badge-video-storyboard">
              🎬 Video Storyboard (${sceneCount} Clips • ${item.totalDuration || 90}s)
            </span>
            <span class="campaign-tag" title="Campaign Origin">${item.campaignName || 'Campaign'}</span>
          </div>
          <span class="card-timestamp">${item.timeAdded || ''}</span>
        </div>

        <div class="saved-card-body">
          <div class="storyboard-drawer-meta">
            <div class="storyboard-arc-pill">Arc: ${item.arcTitle || item.narrativeArc || 'Problem → Solution → Impact'}</div>
          </div>
          <div class="saved-prompt-preview font-mono text-xs">${item.promptText || item.summaryText || ''}</div>
        </div>

        <div class="saved-card-footer">
          <div class="setting-pill-small">${sceneCount} scenes • ${item.totalDuration || 90}s runtime</div>
          <div class="card-btn-group">
            <button class="btn btn-sm btn-ghost btn-copy-card-prompt" data-prompt-id="${item.id}" title="Copy full storyboard text">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </button>
            <button class="btn btn-sm btn-ghost btn-delete-card-prompt" data-prompt-id="${item.id}" title="Remove from deck">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (itemType === 'video-scene') {
    return `
      <div class="saved-prompt-card saved-scene-card" data-prompt-id="${item.id}">
        <div class="saved-card-header">
          <div class="saved-meta-tags">
            <span class="type-indicator-badge badge-video-scene">
              🎥 Video Scene #${item.sceneNumber || '1'} (${item.duration || 10}s)
            </span>
            <span class="theme-tag">${item.themeLabel || 'Strand'}</span>
          </div>
          <span class="card-timestamp">${item.timeAdded || ''}</span>
        </div>

        <div class="saved-card-body">
          <div class="scene-role-tag">${item.role || 'Documentary Scene'}</div>
          <div class="saved-prompt-preview">${item.promptText}</div>
          ${item.voiceover ? `<div class="saved-voiceover-preview"><strong>VO:</strong> ${item.voiceover}</div>` : ''}
        </div>

        <div class="saved-card-footer">
          <div class="setting-pill-small">${item.setting || 'Location'}</div>
          <div class="card-btn-group">
            <button class="btn btn-sm btn-ghost btn-copy-card-prompt" data-prompt-id="${item.id}" title="Copy scene prompt">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </button>
            <button class="btn btn-sm btn-ghost btn-delete-card-prompt" data-prompt-id="${item.id}" title="Remove from deck">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Default: Still Image Prompt
  return `
    <div class="saved-prompt-card saved-image-card" data-prompt-id="${item.id}">
      <div class="saved-card-header">
        <div class="saved-meta-tags">
          <span class="type-indicator-badge badge-image">📷 Still Image Prompt</span>
          <span class="theme-tag">${item.themeLabel || 'Strand'}</span>
        </div>
        <span class="card-timestamp">${item.timeAdded || ''}</span>
      </div>

      <div class="saved-card-body">
        <div class="saved-prompt-preview">${item.promptText}</div>
      </div>

      <div class="saved-card-footer">
        <div class="setting-pill-small" title="Setting">${item.setting || 'Documentary Setting'}</div>
        <div class="card-btn-group">
          <button class="btn btn-sm btn-ghost btn-copy-card-prompt" data-prompt-id="${item.id}" title="Copy this prompt">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy</span>
          </button>
          <button class="btn btn-sm btn-ghost btn-delete-card-prompt" data-prompt-id="${item.id}" title="Remove from deck">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>
    </div>
  `;
}
