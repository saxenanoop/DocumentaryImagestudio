/**
 * Upload Zone Component
 * Prominent drag-and-drop zone, sample brochure triggers, and parsing loading state
 */
import { SAMPLE_BROCHURES } from '../services/sampleBrochures.js';

export function renderUploadZone(state) {
  const isParsing = state.isParsing;
  const parseProgress = state.parseProgress || { stage: '', percent: 0 };
  const parseError = state.parseError;

  if (isParsing) {
    return `
      <div class="upload-section container">
        <div class="parsing-card">
          <div class="parsing-spinner-wrap">
            <div class="editorial-spinner" role="status" aria-label="Parsing document"></div>
          </div>
          <h2 class="parsing-title">Extracting Campaign Intelligence</h2>
          <p class="parsing-subtext">${parseProgress.stage || 'Analyzing brochure text and narrative strands...'}</p>
          
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width: ${parseProgress.percent || 30}%"></div>
          </div>

          <div class="parsing-steps-list">
            <div class="parsing-step ${parseProgress.percent >= 25 ? 'step-active' : ''}">
              <span class="step-dot"></span>
              <span>1. Client-side document reading & text extraction</span>
            </div>
            <div class="parsing-step ${parseProgress.percent >= 60 ? 'step-active' : ''}">
              <span class="step-dot"></span>
              <span>2. Structuring campaign themes, strands & tone keywords</span>
            </div>
            <div class="parsing-step ${parseProgress.percent >= 90 ? 'step-active' : ''}">
              <span class="step-dot"></span>
              <span>3. Mapping on-the-ground documentary settings & subjects</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="upload-section container">
      <div class="editorial-hero">
        <div class="hero-eyebrow">
          <span class="eyebrow-aperture-dot"></span>
          <span>CAMPAIGN INTELLIGENCE • DOCUMENTARY OPTICS</span>
        </div>
        <h1 class="hero-title">Transform Campaign Brochures into Documentary Visual Prompts</h1>
        <p class="hero-description">
          Stop scrolling stock photos. Upload any outreach brochure, field brief, or campaign document to auto-extract themes and generate authentic documentary-style AI image prompts tailored for your deck.
        </p>
      </div>

      <div class="upload-box-wrapper">
        <div class="upload-dropzone" id="upload-dropzone" tabindex="0" role="button" aria-label="Click or drag and drop a campaign brochure">
          <span class="viewfinder-crosshair tl" aria-hidden="true"></span>
          <span class="viewfinder-crosshair tr" aria-hidden="true"></span>
          <span class="viewfinder-crosshair bl" aria-hidden="true"></span>
          <span class="viewfinder-crosshair br" aria-hidden="true"></span>
          <input type="file" id="brochure-file-input" class="visually-hidden" accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown" />
          
          <div class="dropzone-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
              <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
              <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
              <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
              <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
              <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
            </svg>
          </div>

          <div class="dropzone-content">
            <h3 class="dropzone-heading">Drop your campaign brochure here, or <span class="dropzone-link">browse files</span></h3>
            <p class="dropzone-sub">Accepts <strong>PDF</strong> (primary), <strong>DOCX</strong>, and plain text. Extracted 100% securely client-side.</p>
          </div>

          <div class="dropzone-pills">
            <span class="filetype-pill">PDF</span>
            <span class="filetype-pill">DOCX</span>
            <span class="filetype-pill">TXT / MD</span>
            <span class="filetype-pill" style="border-color: rgba(66, 133, 244, 0.4); color: #8AB4F8; background: rgba(66, 133, 244, 0.08);">⚡ Google Gemini Enabled</span>
          </div>
        </div>

        <!-- Compact 3-Step Process Strip: Upload → Themes → Prompts -->
        <div class="landing-flow-strip" aria-label="Workflow: Upload to Themes to Prompts">
          <div class="flow-step-item">
            <span class="flow-step-num font-mono">1</span>
            <div class="flow-step-text">
              <span class="flow-step-title">Upload</span>
              <span class="flow-step-desc">Brochure or field brief</span>
            </div>
          </div>
          <span class="flow-step-arrow" aria-hidden="true">→</span>
          <div class="flow-step-item">
            <span class="flow-step-num font-mono">2</span>
            <div class="flow-step-text">
              <span class="flow-step-title">Themes</span>
              <span class="flow-step-desc">Extracted strands & tone</span>
            </div>
          </div>
          <span class="flow-step-arrow" aria-hidden="true">→</span>
          <div class="flow-step-item">
            <span class="flow-step-num font-mono">3</span>
            <div class="flow-step-text">
              <span class="flow-step-title">Prompts</span>
              <span class="flow-step-desc">Deck visuals & storyboard</span>
            </div>
          </div>
        </div>

        ${parseError ? `
          <div class="parse-error-banner" role="alert">
            <div class="error-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div class="error-msg-wrap">
              <strong>Parsing Notice:</strong> ${parseError}
            </div>
            <button class="btn btn-sm btn-outline" id="btn-open-manual-entry">Fill manually instead</button>
          </div>
        ` : ''}

        <div class="sample-brochures-wrap">
          <div class="sample-header">
            <span class="sample-label">Try a curated field campaign:</span>
          </div>
          <div class="sample-grid">
            ${SAMPLE_BROCHURES.map(sample => `
              <button class="sample-card" data-sample-id="${sample.id}" type="button">
                <div class="sample-card-header">
                  <span class="sample-card-tag">${sample.tag}</span>
                  <span class="sample-card-badge font-mono">FIELD BRIEF</span>
                </div>
                <div class="sample-card-title">${sample.title}</div>
                <div class="sample-card-desc">${sample.subtitle}</div>
                <div class="sample-card-action">
                  <span>Load Sample</span>
                  <span class="btn-icon-bubble">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </span>
                </div>
              </button>
            `).join('')}
          </div>
          <div class="sample-manual-footer">
            <button type="button" class="btn-text-link" id="btn-open-manual-entry-direct">Or start with a blank campaign brief</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
