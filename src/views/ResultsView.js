/**
 * Results View Component
 * Displays the 3-shot documentary plan with prompt studio tools and disclosure captions.
 */
import { renderVisualPreviewCard } from '../components/CanvasPreview.js';

export function renderResultsView(projectData) {
  const { brief, shots } = projectData;

  // Determine sample images matching presets if applicable
  const getSampleForShot = (shotId) => {
    if (brief.topic.toLowerCase().includes('seed') || brief.topic.toLowerCase().includes('food') || brief.topic.toLowerCase().includes('urban')) {
      if (shotId === 'establishing') return '/samples/social_doc.jpg';
      if (shotId === 'medium') return '/samples/social_doc.jpg';
      if (shotId === 'detail') return '/samples/detail_doc.jpg';
    }
    if (brief.topic.toLowerCase().includes('climate') || brief.topic.toLowerCase().includes('water') || brief.topic.toLowerCase().includes('wetland')) {
      if (shotId === 'establishing') return '/samples/climate_doc.jpg';
      if (shotId === 'medium') return '/samples/climate_doc.jpg';
      if (shotId === 'detail') return '/samples/detail_doc.jpg';
    }
    return null; // Prompt studio mode fallback
  };

  return `
    <div class="container">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge" style="background-color: var(--primary-bg-subtle); color: var(--primary); font-weight: 600; font-size: 0.8rem; padding: 0.25rem 0.6rem; border-radius: 99px; display: inline-block; margin-bottom: 0.5rem;">
            Documentary Shot Plan • 3 Shots Generated
          </span>
          <h1 style="font-size: 2.25rem;">Your Documentary Shot Plan</h1>
          <p class="text-muted">Review, edit, and copy documentary-grade AI image prompts constructed for your brief.</p>
        </div>

        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button type="button" class="btn btn-secondary" id="btn-copy-all-prompts">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy All Prompts
          </button>
          <button type="button" class="btn btn-primary" id="btn-download-sheet">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Prompt Sheet (.md)
          </button>
          <a href="#create" class="btn btn-ghost" data-route="create">
            Start New Project
          </a>
        </div>
      </div>

      <!-- Project Summary Card -->
      <div class="card" style="margin-bottom: 2.5rem; background: var(--bg-surface); border-left: 4px solid var(--primary);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
          <div>
            <h2 style="font-size: 1.35rem; margin-bottom: 0.25rem;">${brief.projectName || brief.topic}</h2>
            <p class="text-muted" style="font-size: 0.9rem;">Topic: <strong>${brief.topic}</strong></p>
          </div>
          <a href="#create" class="btn btn-secondary btn-sm" data-route="create">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Edit Brief
          </a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-size: 0.875rem; border-top: 1px solid var(--border-light); padding-top: 1rem;">
          <div>
            <span class="text-muted" style="display: block;">Subject:</span>
            <strong>${brief.subject}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block;">Environment:</span>
            <strong>${brief.location}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block;">Style & Mood:</span>
            <strong>${brief.mood}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block;">Film Stock:</span>
            <strong>${brief.filmLook} (${brief.aspectRatio})</strong>
          </div>
        </div>
      </div>

      <!-- Prompt Studio Mode Banner -->
      <div class="notice-pill" style="width: 100%; justify-content: space-between; flex-wrap: wrap;">
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span><strong>Prompt Studio Active:</strong> Prompts are constructed using real documentary photography principles. Copy and paste into Midjourney, DALL-E, Stable Diffusion, or your preferred AI image generator.</span>
        </div>
      </div>

      <!-- 3 Shot Cards -->
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        ${shots.map(shot => {
          const sampleImg = getSampleForShot(shot.id);
          return `
            <div class="card shot-card" id="card-${shot.id}">
              
              <!-- Shot Header -->
              <div class="shot-card-header">
                <div>
                  <span class="shot-badge">${shot.shotType}</span>
                  <h3 style="font-size: 1.35rem; margin-top: 0.35rem;">${shot.title}</h3>
                  <p class="text-muted" style="font-size: 0.9rem;">${shot.description}</p>
                </div>
                <button type="button" class="btn btn-secondary btn-sm btn-copy-prompt" data-prompt-id="${shot.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Prompt
                </button>
              </div>

              <!-- Content Grid: Prompt Left, Visual Preview Right -->
              <div class="grid-2" style="align-items: start;">
                
                <!-- Left: Editable Prompt & Details -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div>
                    <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">
                      Generated Documentary Prompt (Editable)
                    </label>
                    <div class="prompt-box">
                      <textarea class="prompt-textarea" id="prompt-text-${shot.id}">${shot.prompt}</textarea>
                    </div>
                  </div>

                  <!-- Mandatory Ethical Disclosure Box -->
                  <div class="disclosure-box">
                    <div style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.775rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      Mandatory Ethical Disclosure Caption
                    </div>
                    <div class="disclosure-text">
                      "${shot.disclosureCaption}"
                    </div>
                    <button type="button" class="btn btn-ghost btn-sm btn-copy-caption" data-caption-text="${shot.disclosureCaption}" style="align-self: flex-start; padding: 0.2rem 0.5rem; font-size: 0.775rem;">
                      Copy Caption
                    </button>
                  </div>
                </div>

                <!-- Right: Visualizer & Synthetic Media Area -->
                <div>
                  <label style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.4rem;">
                    Synthetic Visual Canvas
                  </label>
                  ${renderVisualPreviewCard(shot, brief, sampleImg)}
                </div>

              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}
