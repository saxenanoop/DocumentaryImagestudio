/**
 * Home View Component — Editorial Narrative & Trust Architecture
 * Flow: Hero → Problem/Credibility → How It Works → Disclosure/Ethics → Use Cases/Audience → Presets CTA
 */
import { DOCUMENTARY_PRESETS } from '../presets.js';

export function renderHomeView() {
  return `
    <div class="container">
      
      <!-- 1. Editorial Cover Story Hero Section -->
      <section style="padding: 1.5rem 0 3.5rem 0;">
        <div class="grid-2" style="align-items: center; gap: 3.5rem;">
          
          <!-- Left Column: Editorial Headline & Storytelling Actions -->
          <div>
            <div style="font-family: var(--font-mono); font-size: 0.725rem; color: var(--accent-amber); font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;">
              <span>ISO 400</span> • <span>35MM F/2.8</span> • <span>ETHICAL AI VISUAL STUDIO</span>
            </div>

            <h1 style="font-size: 3.25rem; line-height: 1.08; margin-bottom: 1.35rem; color: var(--text-main);">
              Ethical visual storytelling for impact & dignity
            </h1>

            <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.65; margin-bottom: 2.25rem; max-width: 540px;">
              A documentary-grade prompt studio for NGOs, researchers, educators, and photojournalists to construct authentic 3-shot narrative plans with optical clarity and mandatory synthetic disclosures.
            </p>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2.25rem;">
              <a href="#create" class="btn btn-primary btn-lg" data-route="create">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14"/></svg>
                Create Documentary Visual
              </a>
              <a href="#ethics" class="btn btn-secondary btn-lg" data-route="ethics">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                Ethics Manifesto
              </a>
            </div>
          </div>

          <!-- Right Column: Interactive Darkroom Viewfinder Showcase Canvas -->
          <div>
            <div class="viewfinder-canvas" style="min-height: 380px; box-shadow: var(--shadow-lg);">
              <div class="viewfinder-crop-marks"></div>
              <div class="viewfinder-hud-bar">
                <div class="hud-badge">
                  <span class="hud-status-dot"></span>
                  <span>LIVE VIEWFINDER</span>
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
                  <div style="font-family: var(--font-serif); font-size: 1.25rem; color: #F8FAFC; margin-bottom: 0.35rem;">
                    3-Shot Storytelling Engine
                  </div>
                  <p style="font-size: 0.85rem; color: #94A3B8; line-height: 1.55;">
                    1. <strong>Establishing Shot</strong> (24mm Environmental Scale)<br/>
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

      <!-- 2. Problem & Credibility Section: Signature Ethical Disclosure Badge -->
      <section style="margin-top: 1rem; margin-bottom: 3.5rem;">
        <div class="ethics-banner">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <strong style="color: var(--disclosure-text); font-size: 0.95rem; display: block; margin-bottom: 0.2rem;">
              Mandatory Ethical Media Transparency Standard:
            </strong>
            <p style="margin: 0; font-size: 0.875rem; color: var(--disclosure-text); opacity: 0.95; line-height: 1.55;">
              All generated prompts automatically include standardized disclosures stating: <em>"Synthetic documentary image created with AI to illustrate concept. Not a photograph of a real person or event."</em> Built specifically to maintain truth & credibility for non-profit communications and newsroom storyboarding.
            </p>
          </div>
        </div>
      </section>

      <div class="editorial-divider"></div>

      <!-- 3. How It Works: Vertical Photo-Essay Sequence Section -->
      <section style="margin-bottom: 4.5rem;">
        <div style="max-width: 640px; margin-bottom: 3.5rem;">
          <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">
            DOCUMENTARY WORKFLOW
          </span>
          <h2 style="font-size: 2.1rem; margin-bottom: 0.75rem;">How the Story Engine Works</h2>
          <p class="text-muted" style="font-size: 1.05rem;">Moving from raw brief to a complete photojournalism prompt sheet in three deliberate steps.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 3rem;">
          <!-- Step 01 -->
          <div style="display: grid; grid-template-columns: 80px 1fr; gap: 2rem; align-items: flex-start; padding-bottom: 2.5rem; border-bottom: 1px solid var(--border-light);">
            <div style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 700; color: var(--primary); background: var(--primary-bg-subtle); border: 1px solid var(--primary-border); width: 64px; height: 64px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
              01
            </div>
            <div>
              <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">Define Brief & Active Subject Agency</h3>
              <p class="text-muted" style="font-size: 0.975rem; line-height: 1.6; max-width: 680px;">
                Specify documentary topic, environmental context, time of day, and active subject leadership. The engine enforces dignity guardrails, avoiding passive victim tropes and sensationalism.
              </p>
            </div>
          </div>

          <!-- Step 02 -->
          <div style="display: grid; grid-template-columns: 80px 1fr; gap: 2rem; align-items: flex-start; padding-bottom: 2.5rem; border-bottom: 1px solid var(--border-light);">
            <div style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 700; color: var(--primary); background: var(--primary-bg-subtle); border: 1px solid var(--primary-border); width: 64px; height: 64px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
              02
            </div>
            <div>
              <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">Construct the 3-Shot Narrative Arc</h3>
              <p class="text-muted" style="font-size: 0.975rem; line-height: 1.6; max-width: 680px;">
                The prompt engine automatically generates three optically distinct prompts: Establishing Wide (24mm), Medium Interaction (35mm/50mm), and Detail Artifact (90mm Macro) based on authentic film stocks.
              </p>
            </div>
          </div>

          <!-- Step 03 -->
          <div style="display: grid; grid-template-columns: 80px 1fr; gap: 2rem; align-items: flex-start;">
            <div style="font-family: var(--font-mono); font-size: 1.75rem; font-weight: 700; color: var(--primary); background: var(--primary-bg-subtle); border: 1px solid var(--primary-border); width: 64px; height: 64px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;">
              03
            </div>
            <div>
              <h3 style="font-size: 1.4rem; margin-bottom: 0.5rem;">One-Click Copy & Mandatory Disclosure</h3>
              <p class="text-muted" style="font-size: 0.975rem; line-height: 1.6; max-width: 680px;">
                Copy prompts directly into Midjourney, Stable Diffusion, or DALL-E, along with copyable ethical disclosure captions to ensure full transparency for your audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div class="editorial-divider"></div>

      <!-- 4. Disclosure & Ethics Manifesto Callout Section -->
      <section style="margin-bottom: 4.5rem; background: var(--bg-surface); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 2.75rem;">
        <div style="display: grid; grid-template-columns: 1fr 320px; gap: 2.5rem; align-items: center;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">
              ETHICAL GUARDBOUNDS
            </span>
            <h2 style="font-size: 2.0rem; margin-bottom: 0.75rem;">Dignity & Non-Sensationalism Guidelines</h2>
            <p class="text-muted" style="font-size: 0.975rem; line-height: 1.6; max-width: 600px;">
              Our prompt generator intentionally embeds subject agency, un-sensationalized storytelling, and respectful observational camera distances into every prompt prompt formula.
            </p>
          </div>
          <div style="text-align: right;">
            <a href="#ethics" class="btn btn-primary btn-lg" data-route="ethics">
              Read Ethics Manifesto →
            </a>
          </div>
        </div>
      </section>

      <div class="editorial-divider"></div>

      <!-- 5. Use Cases & Target Impact Storytellers Section -->
      <section style="margin-bottom: 4.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; flex-wrap: wrap; gap: 1.5rem;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--accent-amber); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">
              IMPACT COMMUNITY
            </span>
            <h2 style="font-size: 2.0rem;">Built for Purpose & Impact Storytellers</h2>
          </div>
          <p class="text-muted" style="font-size: 0.95rem; max-width: 480px; margin: 0;">
            Created for professionals who require ethical visual pre-visualization without compromising human dignity.
          </p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 0.65rem;">
          <span class="chip">NGO Campaign Managers</span>
          <span class="chip">Documentary Researchers</span>
          <span class="chip">Educational Storytellers</span>
          <span class="chip">Climate Communications</span>
          <span class="chip">Ethical Media Designers</span>
          <span class="chip">Humanitarian Communications</span>
        </div>
      </section>

      <div class="editorial-divider"></div>

      <!-- 6. Archival Presets & Primary Call-to-Action Section -->
      <section style="margin-bottom: 4rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.25rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--primary); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 0.5rem;">
              ARCHIVAL PRESETS
            </span>
            <h2 style="font-size: 2.1rem; margin-bottom: 0.35rem;">Documentary Contact Sheet Presets</h2>
            <p class="text-muted" style="font-size: 0.975rem;">Select a pre-configured contact sheet brief to initiate your documentary plan.</p>
          </div>
          <a href="#create" class="btn btn-secondary" data-route="create">
            Custom Story Brief →
          </a>
        </div>

        <div class="grid-3">
          ${DOCUMENTARY_PRESETS.map(preset => `
            <div class="preset-card" data-preset-id="${preset.id}">
              <div>
                <div class="preset-card-film-perforation">[ ❚ ❚ ❚ ❚ ❚ ❚ ❚ ]</div>
                <span class="preset-card-film-tag">${preset.category || 'DOCUMENTARY PRESET'}</span>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
                  <h3 style="font-size: 1.25rem; color: var(--primary); font-family: var(--font-serif);">${preset.title}</h3>
                  <svg class="preset-icon-aperture" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: var(--primary);"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 6.36 2.64"/><path d="M18.36 5.64 12 12"/><path d="M21 12a9 9 0 0 1-2.64 6.36"/><path d="M18.36 18.36 12 12"/></svg>
                </div>
                <p class="text-muted" style="font-size: 0.875rem; line-height: 1.6; margin-bottom: 1.35rem;">${preset.description}</p>
              </div>
              <div style="font-size: 0.825rem; font-weight: 700; color: var(--primary); display: flex; align-items: center; gap: 0.35rem; font-family: var(--font-sans);">
                Launch Contact Sheet Brief →
              </div>
            </div>
          `).join('')}
        </div>
      </section>

    </div>
  `;
}

