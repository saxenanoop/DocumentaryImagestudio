/**
 * History / Saved Drafts View Component
 */
import { getProjectHistory, deleteProjectFromHistory } from '../storage.js';

export function renderHistoryView() {
  const history = getProjectHistory();

  return `
    <div class="container-narrow">
      <div style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-size: 2.25rem; margin-bottom: 0.25rem;">Saved Local Drafts</h1>
          <p class="text-muted">Projects and prompt plans stored locally in your browser cache.</p>
        </div>
        <a href="#create" class="btn btn-primary" data-route="create">
          + New Project
        </a>
      </div>

      ${history.length === 0 ? `
        <div class="card text-center" style="padding: 3rem 1.5rem;">
          <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--bg-subtle); display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; color: var(--text-muted);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <h3 style="font-size: 1.25rem; margin-bottom: 0.5rem;">No Saved Projects Yet</h3>
          <p class="text-muted" style="max-width: 400px; margin: 0 auto 1.5rem auto;">
            When you create documentary briefs, your shot plans will appear here for easy access and reuse.
          </p>
          <a href="#create" class="btn btn-primary" data-route="create">Create First Project</a>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 1rem;">
          ${history.map(item => `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;" id="history-item-${item.id}">
              <div>
                <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">
                  Saved ${new Date(item.createdAt).toLocaleDateString()}
                </span>
                <h3 style="font-size: 1.15rem; color: var(--text-main); margin: 0.2rem 0;">
                  ${item.brief.projectName || item.brief.topic}
                </h3>
                <p class="text-muted" style="font-size: 0.875rem;">
                  Topic: ${item.brief.topic} • ${item.shots ? item.shots.length : 3} Shots
                </p>
              </div>

              <div style="display: flex; gap: 0.5rem;">
                <button type="button" class="btn btn-secondary btn-sm btn-open-project" data-project-id="${item.id}">
                  Open Plan →
                </button>
                <button type="button" class="btn btn-ghost btn-sm btn-delete-project" data-project-id="${item.id}" style="color: var(--error-text);">
                  Delete
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}
