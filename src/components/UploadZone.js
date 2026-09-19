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
        <div class="hero-eyebrow">Outreach & Pitch Deck Visuals</div>
        <h1 class="hero-title">Transform Campaign Brochures into Documentary Visual Prompts</h1>
        <p class="hero-description">
          Stop scrolling stock photos. Upload any outreach brochure, field brief, or campaign document to auto-extract themes and generate authentic documentary-style AI image prompts tailored for your pitch deck.
        </p>
      </div>

      <div class="upload-box-wrapper">
        <div class="upload-dropzone" id="upload-dropzone" tabindex="0" role="button" aria-label="Click or drag and drop a campaign brochure">
          <input type="file" id="brochure-file-input" class="visually-hidden" accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown" />
          
          <div class="dropzone-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <polyline points="9 15 12 12 15 15"></polyline>
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
            <span class="sample-label">Or explore with a sample brochure:</span>
            <button class="btn-text-link" id="btn-open-manual-entry-direct">Or start with a blank brief</button>
          </div>
          <div class="sample-grid">
            ${SAMPLE_BROCHURES.map(sample => `
              <button class="sample-card" data-sample-id="${sample.id}" type="button">
                <div class="sample-card-tag">${sample.tag}</div>
                <div class="sample-card-title">${sample.title}</div>
                <div class="sample-card-desc">${sample.subtitle}</div>
                <div class="sample-card-action">
                  <span>Load Sample</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
