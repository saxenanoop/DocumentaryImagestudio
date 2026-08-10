/**
 * Header Component
 */
export function renderHeader(currentRoute = "home") {
  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="#home" class="brand-link" data-route="home">
          <div class="brand-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
              <circle cx="12" cy="13" r="3"/>
            </svg>
          </div>
          <div>
            <span class="brand-title">Documentary Image Studio</span>
          </div>
          <span class="ethical-pill">Ethical AI</span>
        </a>

        <nav>
          <ul class="nav-menu">
            <li>
              <a href="#home" class="nav-link ${currentRoute === 'home' ? 'active' : ''}" data-route="home">
                Home
              </a>
            </li>
            <li>
              <a href="#create" class="nav-link ${currentRoute === 'create' ? 'active' : ''}" data-route="create">
                Create Visual
              </a>
            </li>
            <li>
              <a href="#ethics" class="nav-link ${currentRoute === 'ethics' ? 'active' : ''}" data-route="ethics">
                Ethics Guidelines
              </a>
            </li>
            <li>
              <a href="#history" class="nav-link ${currentRoute === 'history' ? 'active' : ''}" data-route="history">
                Saved Drafts
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `;
}
