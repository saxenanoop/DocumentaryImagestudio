/**
 * Header Masthead Component
 * Editorial header with product identity, mode navigation switcher, and saved deck drawer trigger
 */

export function renderHeader(state) {
  const savedCount = state.savedPrompts ? state.savedPrompts.length : 0;
  const hasActiveCampaign = !!state.campaignData;
  const activeMode = state.activeMode || 'image-prompts';

  return `
    <header class="studio-header">
      <div class="header-inner container">
        <div class="brand-block">
          <div class="brand-mark" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
              <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
              <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
              <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
              <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
              <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
            </svg>
          </div>
          <div class="brand-text">
            <a href="#" class="brand-title" id="nav-brand-home">Documentary Prompt Studio</a>
            <span class="brand-tagline">AI visual & video prompt builder for campaign pitch decks</span>
          </div>
        </div>

        <!-- Mode Navigation Switcher -->
        <nav class="mode-navigation" aria-label="Studio Mode Selection">
          <button 
            type="button" 
            class="mode-nav-tab ${activeMode === 'image-prompts' ? 'is-active' : ''}" 
            id="tab-mode-image"
            data-mode="image-prompts"
            aria-selected="${activeMode === 'image-prompts'}"
            role="tab"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>Image Prompts</span>
          </button>

          <button 
            type="button" 
            class="mode-nav-tab ${activeMode === 'video-storyboard' ? 'is-active' : ''}" 
            id="tab-mode-video"
            data-mode="video-storyboard"
            aria-selected="${activeMode === 'video-storyboard'}"
            role="tab"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            <span>Video Storyboard</span>
            <span class="mode-qwen-badge">Qwen</span>
          </button>
        </nav>

        <div class="header-actions">
          ${hasActiveCampaign ? `
            <button class="btn btn-secondary btn-sm" id="btn-header-upload-new" title="Upload a different brochure while keeping your saved prompts">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>Switch Brochure</span>
            </button>
          ` : ''}

          <button class="btn-deck-drawer ${savedCount > 0 ? 'has-items' : ''}" id="btn-toggle-deck-drawer" aria-label="Open saved pitch deck prompts drawer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>Pitch Deck</span>
            <span class="deck-count-badge" id="header-deck-count">${savedCount}</span>
          </button>
        </div>
      </div>
    </header>
  `;
}
