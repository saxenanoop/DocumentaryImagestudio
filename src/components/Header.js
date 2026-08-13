/**
 * Header Component
 */
export function renderHeader(currentRoute = "home") {
  return `
    <header class="site-header">
      <div class="container header-inner">
        <a href="#home" class="brand-link" data-route="home" title="Documentary Image Studio Home">
          <div class="brand-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="9"/>
              <path d="M12 3a9 9 0 0 1 6.36 2.64"/>
              <path d="M18.36 5.64 12 12"/>
              <path d="M21 12a9 9 0 0 1-2.64 6.36"/>
              <path d="M18.36 18.36 12 12"/>
              <path d="M12 21a9 9 0 0 1-6.36-2.64"/>
              <path d="M5.64 18.36 12 12"/>
              <path d="M3 12a9 9 0 0 1 2.64-6.36"/>
              <path d="M5.64 5.64 12 12"/>
              <circle cx="12" cy="12" r="3" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <div class="brand-title">Documentary Image Studio</div>
            <div class="brand-subtitle">Ethical AI Visuals for Impact Storytelling</div>
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

