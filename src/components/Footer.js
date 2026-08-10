/**
 * Footer Component
 */
export function renderFooter() {
  const currentYear = new Date().getFullYear();
  return `
    <footer class="site-footer">
      <div class="container footer-content">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          <strong style="font-family: var(--font-serif); font-size: 1.1rem;">Documentary Image Studio</strong>
        </div>

        <p class="footer-text" style="max-width: 600px;">
          Designed for NGOs, agencies, educators, documentary researchers, and impact storytelling teams to turn briefs into structured documentary prompts with ethical clarity.
        </p>

        <p class="footer-text" style="font-size: 0.8rem; color: var(--text-light);">
          Synthetic Documentary Visual Disclosure: All generated prompts and images are synthetic media intended for storyboarding, pre-visualization, and educational illustration.
        </p>

        <ul class="footer-nav">
          <li><a href="#create" data-route="create">Create Visual</a></li>
          <li><a href="#ethics" data-route="ethics">Ethics Guidelines</a></li>
          <li><a href="#history" data-route="history">Saved Drafts</a></li>
        </ul>

        <p class="footer-text" style="font-size: 0.75rem; margin-top: 0.5rem;">
          © ${currentYear} Documentary Image Studio. Open, ethical, no-login MVP.
        </p>
      </div>
    </footer>
  `;
}
