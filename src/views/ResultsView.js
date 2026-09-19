/**
 * Results View Component
 * Displays the 3-shot documentary plan with prompt studio tools, storytelling arc badges, and ethical disclosure captions.
 */
import { renderVisualPreviewCard } from '../components/CanvasPreview.js';

export function renderResultsView(projectData) {
  const { brief, shots } = projectData;

  // Determine sample images matching presets if applicable
  const getSampleForShot = (shotId) => {
    if (brief.topic && (brief.topic.toLowerCase().includes('seed') || brief.topic.toLowerCase().includes('food') || brief.topic.toLowerCase().includes('urban') || brief.topic.toLowerCase().includes('agriculture'))) {
      if (shotId === 'establishing') return '/samples/social_doc.jpg';
      if (shotId === 'medium') return '/samples/social_doc.jpg';
      if (shotId === 'detail') return '/samples/detail_doc.jpg';
    }
    if (brief.topic && (brief.topic.toLowerCase().includes('climate') || brief.topic.toLowerCase().includes('water') || brief.topic.toLowerCase().includes('wetland') || brief.topic.toLowerCase().includes('mangrove'))) {
      if (shotId === 'establishing') return '/samples/climate_doc.jpg';
      if (shotId === 'medium') return '/samples/climate_doc.jpg';
      if (shotId === 'detail') return '/samples/detail_doc.jpg';
    }
    return null; // Prompt studio mode fallback
  };

  return `
    <div class="container">
      <!-- Darkroom Studio Control Toolbar -->
      <div class="darkroom-toolbar">
        <div class="darkroom-toolbar-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary-border);"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 6.36 2.64"/><path d="M18.36 5.64 12 12"/><path d="M21 12a9 9 0 0 1-2.64 6.36"/><path d="M18.36 18.36 12 12"/></svg>
          Documentary Shot Plan • 3 Narrative Shots
        </div>
        <div class="darkroom-toolbar-actions">
          <button type="button" class="btn btn-secondary btn-sm" id="btn-copy-all-prompts">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            Copy All Prompts
          </button>
          <button type="button" class="btn btn-primary btn-sm" id="btn-download-sheet">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Sheet (.md)
          </button>
          <a href="#create" class="btn btn-ghost btn-sm" style="color: #94A3B8;" data-route="create">
            + New Brief
          </a>
        </div>
      </div>

      <!-- Project Brief Summary Card -->
      <div class="card" style="margin-bottom: 2rem; border-left: 4px solid var(--primary); background: var(--bg-surface); padding: 1.85rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.45rem; margin-bottom: 0.35rem; color: var(--primary);">${brief.projectName || brief.topic}</h2>
            <p class="text-muted" style="font-size: 0.95rem;">Topic: <strong style="color: var(--text-main);">${brief.topic}</strong></p>
          </div>
          <a href="#create" class="btn btn-secondary btn-sm" data-route="create">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Edit Story Brief
          </a>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; font-size: 0.875rem; border-top: 1px solid var(--border-light); padding-top: 1.15rem;">
          <div>
            <span class="text-muted" style="display: block; font-size: 0.775rem; font-family: var(--font-mono); text-transform: uppercase;">Subject & Agency:</span>
            <strong style="color: var(--text-main); line-height: 1.4; display: block; margin-top: 0.2rem;">${brief.subject}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block; font-size: 0.775rem; font-family: var(--font-mono); text-transform: uppercase;">Environment:</span>
            <strong style="color: var(--text-main); line-height: 1.4; display: block; margin-top: 0.2rem;">${brief.location}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block; font-size: 0.775rem; font-family: var(--font-mono); text-transform: uppercase;">Mood & Framing:</span>
            <strong style="color: var(--text-main); line-height: 1.4; display: block; margin-top: 0.2rem;">${brief.mood}</strong>
          </div>
          <div>
            <span class="text-muted" style="display: block; font-size: 0.775rem; font-family: var(--font-mono); text-transform: uppercase;">Film Stock & Ratio:</span>
            <strong style="color: var(--text-main); line-height: 1.4; display: block; margin-top: 0.2rem;">${brief.filmLook ? brief.filmLook.split('(')[0].trim() : ''} (${brief.aspectRatio || '16:9'})</strong>
          </div>
        </div>
      </div>

      <!-- Storytelling Arc Guide Legend -->
      <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.25rem; background: var(--bg-subtle); padding: 1.15rem 1.35rem; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem; width: 100%; font-family: var(--font-mono);">
          <span>📸 DOCUMENTARY NARRATIVE ARC</span>
          <span style="font-weight: normal; font-size: 0.75rem; font-family: var(--font-sans);">(Textbook 3-Shot Visual Structure)</span>
        </div>
        <div style="display: flex; gap: 2rem; flex-wrap: wrap; font-size: 0.875rem; color: var(--text-main);">
          <div>🗺️ <strong>1. Establishing Shot:</strong> Context & Scale (24mm Wide)</div>
          <div>🤝 <strong>2. Medium Shot:</strong> Human Relationship & Action (35mm/50mm)</div>
          <div>🔍 <strong>3. Detail Shot:</strong> Tactile Emotion & Objects (90mm Macro)</div>
        </div>
      </div>

      <!-- Prompt Studio Active Notice Banner -->
      <div class="notice-pill" style="width: 100%; justify-content: space-between; flex-wrap: wrap; margin-bottom: 2.25rem;">
        <div style="display: flex; align-items: center; gap: 0.7rem;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          <span><strong>Prompt Studio Active:</strong> Prompts are constructed using real documentary photography principles. Copy and paste into Midjourney, DALL-E, Stable Diffusion, or your preferred AI image generator.</span>
        </div>
      </div>

      <!-- 3 Shot Cards -->
      <div style="display: flex; flex-direction: column; gap: 2.5rem;">
        ${shots.map(shot => {
          const sampleImg = getSampleForShot(shot.id);
          return `
            <div class="card shot-card" id="card-${shot.id}" style="padding: 2rem;">
              
              <!-- Shot Header -->
              <div class="shot-card-header">
                <div>
                  <span class="shot-badge">${shot.shotType}</span>
                  <h3 style="font-size: 1.4rem; margin-top: 0.4rem; color: var(--text-main); font-family: var(--font-serif);">${shot.title}</h3>
                  <p class="text-muted" style="font-size: 0.925rem; margin-top: 0.15rem;">${shot.description}</p>
                </div>
                <button type="button" class="btn btn-secondary btn-sm btn-copy-prompt" data-prompt-id="${shot.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy Prompt
                </button>
              </div>

              <!-- Content Grid: Prompt Left, Visual Preview Right -->
              <div class="grid-2" style="align-items: start; gap: 1.75rem;">
                
                <!-- Left: Editable Prompt & Details -->
                <div style="display: flex; flex-direction: column; gap: 1.25rem;">
                  <div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.45rem;">
                      <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-family: var(--font-mono);">
                        Generated Documentary Prompt
                      </label>
                      <span style="font-size: 0.775rem; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 0.25rem;">
                        ✏️ Click box to edit
                      </span>
                    </div>
                    <div class="prompt-box">
                      <textarea class="prompt-textarea" id="prompt-text-${shot.id}">${shot.prompt}</textarea>
                    </div>
                  </div>

                  <!-- Mandatory Ethical Disclosure Box -->
                  <div class="disclosure-box">
                    <div style="display: flex; align-items: center; gap: 0.45rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; font-family: var(--font-mono); color: var(--ethics-text);">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      Mandatory Ethical Disclosure Caption
                    </div>
                    <div class="disclosure-text">
                      "${shot.disclosureCaption}"
                    </div>
                    <button type="button" class="btn btn-secondary btn-sm btn-copy-caption" data-caption-text="${shot.disclosureCaption}" style="align-self: flex-start; padding: 0.35rem 0.75rem; font-size: 0.8rem; background: var(--bg-surface);">
                      Copy Caption Snippet
                    </button>
                  </div>
                </div>

                <!-- Right: Visualizer & Synthetic Media Area -->
                <div>
                  <label style="font-size: 0.775rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.06em; font-family: var(--font-mono); display: block; margin-bottom: 0.45rem;">
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

