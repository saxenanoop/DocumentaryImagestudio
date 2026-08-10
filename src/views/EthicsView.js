/**
 * Ethics View Component
 * Ethical use guidelines and mandatory attribution standards for synthetic documentary media.
 */

export function renderEthicsView() {
  const standardDisclosure = "AI-generated synthetic documentary image. This is not a photograph of a real person, event, or place.";

  return `
    <div class="container-narrow">
      <div style="margin-bottom: 2.5rem; text-align: center;">
        <span class="badge" style="background-color: var(--ethics-bg); color: var(--ethics-text); border: 1px solid var(--ethics-border); font-weight: 600; font-size: 0.85rem; padding: 0.35rem 0.85rem; border-radius: 99px; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1rem;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          Ethical Framing Standard
        </span>
        <h1 style="font-size: 2.5rem; margin-bottom: 0.75rem;">Ethical Use Guidelines</h1>
        <p class="text-muted" style="font-size: 1.1rem; max-width: 640px; margin: 0 auto;">
          Principles for using synthetic AI media in impact campaigns, educational materials, and pre-visualization without deceiving the public.
        </p>
      </div>

      <!-- Highlighted Standard Disclosure Box -->
      <div class="card" style="background: var(--ethics-bg); border: 2px solid var(--ethics-text); margin-bottom: 2.5rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
          <span style="font-size: 0.8rem; font-weight: 700; color: var(--ethics-text); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 0.35rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            Recommended Standard Disclosure
          </span>
          <button type="button" class="btn btn-secondary btn-sm btn-copy-caption" data-caption-text="${standardDisclosure}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy Disclosure Snippet
          </button>
        </div>
        <div style="font-family: var(--font-serif); font-size: 1.15rem; font-style: italic; color: var(--ethics-text); line-height: 1.5; padding: 0.5rem 0;">
          "${standardDisclosure}"
        </div>
      </div>

      <!-- Guidelines Content Cards -->
      <div style="display: flex; flex-direction: column; gap: 1.5rem;">
        
        <div class="card">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            1. Synthetic Media Transparency
          </h3>
          <p class="text-muted" style="line-height: 1.6;">
            AI-generated images possess documentary aesthetics (available light, film grain, unposed framing) but are fundamentally <strong>synthetic illustrations</strong>. They should always be explicitly tagged as synthetic or AI-generated in all public campaigns, pitch decks, and educational releases.
          </p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            2. Do Not Present as Real Evidence
          </h3>
          <p class="text-muted" style="line-height: 1.6;">
            Never use this studio to fabricate news events, generate misleading photographic proof, or present synthetic images as real historical evidence. Impact storytelling relies on public trust; misrepresenting synthetic imagery damages institutional credibility.
          </p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            3. Respect for People & Communities
          </h3>
          <p class="text-muted" style="line-height: 1.6;">
            Prompts generated by this studio focus on dignity, agency, and collaborative realism. Avoid generating images that exploit suffering, reinforce harmful cultural stereotypes, or depict recognizable living individuals without permission.
          </p>
        </div>

        <div class="card">
          <h3 style="font-size: 1.3rem; margin-bottom: 0.75rem; color: var(--primary); display: flex; align-items: center; gap: 0.5rem;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            4. Handling Sensitive & Humanitarian Topics
          </h3>
          <p class="text-muted" style="line-height: 1.6;">
            When illustrating sensitive subjects such as disaster response, climate vulnerability, or healthcare access, prioritize representative systemic concepts rather than sensationalized distress. Use the included disclosure tags prominently alongside all published visuals.
          </p>
        </div>

      </div>

      <div style="text-align: center; margin-top: 3rem;">
        <a href="#create" class="btn btn-primary btn-lg" data-route="create">
          Create Ethical Visual →
        </a>
      </div>

    </div>
  `;
}
