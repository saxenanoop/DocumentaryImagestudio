/**
 * Home View Component
 */
import { DOCUMENTARY_PRESETS } from '../presets.js';

export function renderHomeView() {
  return `
    <div class="container">
      
      <!-- Asymmetric Editorial Hero Section -->
      <section style="padding: 2rem 0 4rem 0;">
        <div class="grid-2" style="align-items: center; gap: 3rem;">
          
          <!-- Hero Left Column: Editorial Headline & Actions -->
          <div>
            <span class="ethical-pill" style="margin-bottom: 1.25rem; display: inline-flex; align-items: center; gap: 0.4rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
              No Login Required • Ethical Synthetic Media Studio
            </span>

            <h1 style="font-size: 2.85rem; line-height: 1.15; margin-bottom: 1.25rem; color: var(--text-main);">
              Create documentary-style AI visuals with ethical clarity
            </h1>

            <p style="font-size: 1.15rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; max-width: 560px;">
              A photojournalism-grade studio for NGOs, agencies, educators, and researchers to turn briefs into 3-shot documentary prompt plans based on authentic optics and film grain.
            </p>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.25rem;">
              <a href="#create" class="btn btn-primary btn-lg" data-route="create">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
                Create Documentary Visual
              </a>
              <a href="#ethics" class="btn btn-secondary btn-lg" data-route="ethics">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                View Ethics Guidelines
              </a>
            </div>

            <!-- Ethics Banner Callout -->
            <div class="ethics-banner">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <div>
                <strong style="color: var(--ethics-text);">Mandatory Synthetic Media Notice:</strong>
                <p style="margin: 0; font-size: 0.825rem; color: var(--ethics-text); opacity: 0.95;">
                  Outputs are synthetic illustrations intended for storyboarding & impact storytelling. Never present synthetic media as real photographic evidence.
                </p>
              </div>
            </div>
          </div>

          <!-- Hero Right Column: Camera Viewfinder Showcase HUD -->
          <div>
            <div class="viewfinder-canvas" style="min-height: 360px; box-shadow: var(--shadow-lg);">
              <div class="viewfinder-crop-marks"></div>
              <div class="viewfinder-hud-bar">
                <div class="hud-badge">
                  <span class="hud-status-dot"></span>
                  <span>OPTICAL FORMULA</span>
                </div>
                <div class="hud-badge">
                  <span>3-SHOT ARC</span> • 16:9
                </div>
              </div>

              <div class="viewfinder-placeholder" style="gap: 1rem; max-width: 360px;">
                <div style="width: 4rem; height: 4rem; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1.5px solid rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; color: var(--primary-border);">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <circle cx="12" cy="12" r="9"/>
                    <path d="M12 3a9 9 0 0 1 6.36 2.64"/>
                    <path d="M18.36 5.64 12 12"/>
                    <path d="M21 12a9 9 0 0 1-2.64 6.36"/>
                    <path d="M18.36 18.36 12 12"/>
                  </svg>
                </div>
                <div>
                  <div style="font-family: var(--font-serif); font-size: 1.2rem; color: #F8FAFC; margin-bottom: 0.35rem;">
                    3-Shot Storytelling Engine
                  </div>
                  <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.5;">
                    1. <strong>Establishing Shot</strong> (24mm Wide)<br/>
                    2. <strong>Medium Shot</strong> (35mm/50mm Human Agency)<br/>
                    3. <strong>Detail Shot</strong> (90mm Macro Texture)
                  </p>
                </div>
              </div>

              <div class="viewfinder-meta-strip">
                <span class="meta-chip">📷 PORTRA 400</span>
                <span class="meta-chip">🎞️ KODAK TRI-X</span>
                <span class="meta-chip">🌿 FUJIFILM PRO</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- 3-Step Process Section -->
      <section style="margin-bottom: 4.5rem;">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 2.1rem; margin-bottom: 0.5rem;">How It Works</h2>
          <p class="text-muted" style="font-size: 1.05rem;">Construct a complete 3-shot documentary narrative plan in under 60 seconds.</p>
        </div>

        <div class="grid-3">
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem 1.5rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); border: 1px solid var(--primary-border); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700; font-family: var(--font-mono);">
              01
            </div>
            <h3 style="font-size: 1.25rem;">Define Story & Agency</h3>
            <p class="text-muted" style="font-size: 0.9rem; line-height: 1.55;">
              Fill out a short brief specifying your documentary topic, environment, and core subject active leadership.
            </p>
          </div>

          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem 1.5rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); border: 1px solid var(--primary-border); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700; font-family: var(--font-mono);">
              02
            </div>
            <h3 style="font-size: 1.25rem;">Generate 3-Shot Arc</h3>
            <p class="text-muted" style="font-size: 0.9rem; line-height: 1.55;">
              The engine builds 3 structured documentary prompts: Establishing Wide, Medium Agency, and Detail Macro.
            </p>
          </div>

          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2rem 1.5rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); border: 1px solid var(--primary-border); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700; font-family: var(--font-mono);">
              03
            </div>
            <h3 style="font-size: 1.25rem;">Copy & Disclose</h3>
            <p class="text-muted" style="font-size: 0.9rem; line-height: 1.55;">
              One-click prompt export for your AI generator with mandatory synthetic media disclosure captions.
            </p>
          </div>
        </div>
      </section>

      <!-- Target Audience Section -->
      <section class="card" style="background: var(--bg-subtle); border-color: var(--border-medium); margin-bottom: 4.5rem; padding: 2.75rem; text-align: center;">
        <h2 style="font-size: 1.75rem; margin-bottom: 0.75rem;">Built for Impact Storytellers</h2>
        <p style="font-size: 1.05rem; color: var(--text-muted); max-width: 680px; margin: 0 auto 1.75rem auto;">
          Designed for NGOs, campaign strategists, educators, researchers, and media professionals creating ethical pre-visualizations.
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem;">
          <span class="chip">NGO Campaign Managers</span>
          <span class="chip">Documentary Researchers</span>
          <span class="chip">Educational Storytellers</span>
          <span class="chip">Climate Communications</span>
          <span class="chip">Ethical Media Designers</span>
        </div>
      </section>

      <!-- Contact Sheet Preset Quick-Start Grid -->
      <section style="margin-bottom: 3.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.75rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.85rem; margin-bottom: 0.25rem;">Documentary Style Presets</h2>
            <p class="text-muted" style="font-size: 0.95rem;">Select a contact sheet preset to pre-fill your documentary brief instantly.</p>
          </div>
          <a href="#create" class="btn btn-secondary btn-sm" data-route="create">
            Custom Brief →
          </a>
        </div>

        <div class="grid-3">
          ${DOCUMENTARY_PRESETS.map(preset => `
            <div class="preset-card" data-preset-id="${preset.id}">
              <div>
                <div class="preset-card-film-perforation">[ ❚ ❚ ❚ ❚ ❚ ❚ ❚ ]</div>
                <span class="preset-card-film-tag">${preset.category || 'DOCUMENTARY PRESET'}</span>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
                  <h3 style="font-size: 1.2rem; color: var(--primary); font-family: var(--font-serif);">${preset.title}</h3>
                  <svg class="preset-icon-aperture" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary);"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 6.36 2.64"/><path d="M18.36 5.64 12 12"/><path d="M21 12a9 9 0 0 1-2.64 6.36"/><path d="M18.36 18.36 12 12"/></svg>
                </div>
                <p class="text-muted" style="font-size: 0.875rem; line-height: 1.55; margin-bottom: 1.25rem;">${preset.description}</p>
              </div>
              <div style="font-size: 0.825rem; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 0.35rem; font-family: var(--font-sans);">
                Launch Preset Brief →
              </div>
            </div>
          `).join('')}
        </div>
      </section>

    </div>
  `;
}

