/**
 * Theme Selector Component
 * Renders dynamically extracted campaign themes / curatorial strands as interactive cards.
 */

export function renderThemeSelector(themes = [], selectedThemeIndex = 0) {
  if (!themes || themes.length === 0) {
    return `<div class="empty-themes-note">No specific themes extracted. Freeform mode active.</div>`;
  }

  return `
    <div class="theme-selector-wrapper">
      <div class="theme-cards-grid" role="radiogroup" aria-label="Curatorial Theme">
        ${themes.map((theme, index) => {
          const isSelected = index === selectedThemeIndex;
          return `
            <div 
              class="theme-card ${isSelected ? 'is-selected' : ''}" 
              data-theme-index="${index}" 
              role="radio" 
              aria-checked="${isSelected}" 
              tabindex="0"
            >
              <div class="theme-card-header">
                <span class="theme-card-indicator" aria-hidden="true"></span>
                <h4 class="theme-card-title">${theme.label}</h4>
              </div>
              <p class="theme-card-desc">${theme.description}</p>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}
