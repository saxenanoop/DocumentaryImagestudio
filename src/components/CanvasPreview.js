/**
 * CanvasPreview & Visualizer Component
 * Handles Prompt Studio Mode rendering & synthetic media visual display
 */

export function renderVisualPreviewCard(shot, brief, sampleImgUrl = null) {
  const isImageAvailable = Boolean(sampleImgUrl);

  return `
    <div class="visual-preview-area" id="preview-${shot.id}">
      ${isImageAvailable ? `
        <img src="${sampleImgUrl}" alt="AI-generated documentary-style image" class="visual-preview-img" />
        <div class="preview-overlay-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FEF3C7" stroke-width="2">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
          </svg>
          AI-Generated Synthetic Visual
        </div>
      ` : `
        <div class="preview-placeholder">
          <!-- Viewfinder Overlay Graphics -->
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6B7280" stroke-width="1.5">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
          <div style="font-weight: 600; font-size: 0.95rem; color: #E5E7EB;">Prompt Studio Mode</div>
          <p style="font-size: 0.825rem; color: #9CA3AF; max-width: 320px; margin: 0 auto; line-height: 1.4;">
            Direct image generation is not available in this environment. Copy the prompt below and use it in your preferred AI image tool.
          </p>
          <div style="display: flex; gap: 0.5rem; margin-top: 0.25rem;">
            <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; color: #D1D5DB;">
              Lens: ${shot.lens.split(' ')[0]}
            </span>
            <span style="font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; color: #D1D5DB;">
              Aspect Ratio: ${brief.aspectRatio || '16:9'}
            </span>
          </div>
        </div>
      `}
    </div>
  `;
}
