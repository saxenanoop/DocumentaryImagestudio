/**
 * CanvasPreview & Visualizer Component
 * Handles Prompt Studio Mode rendering & synthetic media visual display
 */

export function renderVisualPreviewCard(shot, brief, sampleImgUrl = null) {
  const isImageAvailable = Boolean(sampleImgUrl);
  const shotLens = shot.lens ? shot.lens.split(' ')[0] : '35mm';
  const shotRatio = brief.aspectRatio || '16:9';
  const filmStockName = brief.filmLook ? brief.filmLook.split('(')[0].trim() : 'Documentary Daylight';

  return `
    <div class="viewfinder-canvas" id="preview-${shot.id}">
      <div class="viewfinder-crop-marks"></div>
      
      <!-- Viewfinder Top HUD Bar -->
      <div class="viewfinder-hud-bar">
        <div class="hud-badge">
          <span class="hud-status-dot"></span>
          <span>PROMPT STUDIO</span>
        </div>
        <div class="hud-badge" style="letter-spacing: 0.05em;">
          <span>REC</span> • ${shotRatio}
        </div>
      </div>

      ${isImageAvailable ? `
        <img src="${sampleImgUrl}" alt="AI-generated documentary-style visual preview" class="visual-preview-img" style="width: 100%; height: 100%; object-fit: cover; position: relative; z-index: 1;" />
      ` : `
        <div class="viewfinder-placeholder">
          <!-- Aperture Lens SVG -->
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#64748B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"/>
            <path d="M12 3a9 9 0 0 1 6.36 2.64"/>
            <path d="M18.36 5.64 12 12"/>
            <path d="M21 12a9 9 0 0 1-2.64 6.36"/>
            <path d="M18.36 18.36 12 12"/>
            <path d="M12 21a9 9 0 0 1-6.36-2.64"/>
            <path d="M5.64 18.36 12 12"/>
            <path d="M3 12a9 9 0 0 1 2.64-6.36"/>
            <path d="M5.64 5.64 12 12"/>
          </svg>
          <div>
            <div style="font-weight: 600; font-size: 0.95rem; color: #F1F5F9; margin-bottom: 0.2rem;">Synthetic Visual Viewfinder</div>
            <p style="font-size: 0.8rem; color: #94A3B8; max-width: 320px; margin: 0 auto; line-height: 1.45;">
              Constructed following authentic <strong>${shotLens}</strong> optical principles. Copy prompt to render in your AI image generator.
            </p>
          </div>
        </div>
      `}

      <!-- Viewfinder Bottom Metadata Strip -->
      <div class="viewfinder-meta-strip">
        <span class="meta-chip">📷 LENS: ${shotLens}</span>
        <span class="meta-chip">🎞️ FILM: ${filmStockName}</span>
        <span class="meta-chip">📐 FORMAT: ${shotRatio}</span>
      </div>
    </div>
  `;
}

