/**
 * Home View
 */
import { DOCUMENTARY_PRESETS } from '../presets.js';

export function renderHomeView() {
  return `
    <div class="container">
      <!-- Hero Section -->
      <section style="padding: 3rem 0 2rem 0; text-align: center; max-width: 860px; margin: 0 auto;">
        <span class="badge" style="background-color: var(--primary-bg-subtle); color: var(--primary); font-weight: 600; font-size: 0.85rem; padding: 0.35rem 0.85rem; border-radius: 99px; display: inline-flex; align-items: center; gap: 0.4rem; margin-bottom: 1.25rem;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v20M2 12h20"/></svg>
          No Login Required • Ethical Synthetic Media
        </span>

        <h1 style="font-size: 3rem; line-height: 1.15; margin-bottom: 1.25rem; font-weight: 700; color: var(--text-main);">
          Create documentary-style AI visuals with ethical clarity
        </h1>

        <p style="font-size: 1.2rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; max-width: 720px; margin-left: auto; margin-right: auto;">
          A simple studio for NGOs, agencies, and educators to generate documentary-grade AI image prompts and synthetic documentary visuals based on real photographic principles.
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; margin-bottom: 2.5rem;">
          <a href="#create" class="btn btn-primary btn-lg" data-route="create">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            Create Documentary Visual
          </a>
          <a href="#ethics" class="btn btn-secondary btn-lg" data-route="ethics">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            View Ethics Guidelines
          </a>
        </div>

        <!-- Visible Ethics Notice -->
        <div class="ethics-banner" style="justify-content: center; text-align: left; max-width: 720px; margin: 0 auto 3rem auto;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <div>
            <strong>Mandatory Ethical Use Notice:</strong>
            <p style="margin: 0; font-size: 0.875rem;">This tool creates synthetic documentary-style images. Outputs should not be presented as real photographic evidence.</p>
          </div>
        </div>
      </section>

      <!-- 3-Step Process Section -->
      <section style="margin-bottom: 4rem;">
        <div class="text-center" style="margin-bottom: 2.5rem;">
          <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">How It Works</h2>
          <p class="text-muted">Generate a complete 3-shot documentary plan in under 60 seconds.</p>
        </div>

        <div class="grid-3">
          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
              1
            </div>
            <h3>Describe Subject</h3>
            <p class="text-muted" style="font-size: 0.925rem;">
              Fill in a short documentary brief specifying your topic, environment, time of day, and emotional mood.
            </p>
          </div>

          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
              2
            </div>
            <h3>Generate Shot Plan</h3>
            <p class="text-muted" style="font-size: 0.925rem;">
              The engine builds 3 structured documentary prompts: Establishing Shot, Medium Shot, and Detail Shot.
            </p>
          </div>

          <div class="card text-center" style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="width: 3.5rem; height: 3.5rem; border-radius: 50%; background: var(--primary-bg-subtle); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; font-weight: 700;">
              3
            </div>
            <h3>Copy & Disclose</h3>
            <p class="text-muted" style="font-size: 0.925rem;">
              Copy prompts for external generator use or direct preview with standard synthetic disclosure captions.
            </p>
          </div>
        </div>
      </section>

      <!-- Target Audience Section -->
      <section class="card" style="background: var(--bg-subtle); border-color: var(--border-medium); margin-bottom: 4rem; padding: 2.5rem; text-align: center;">
        <h2 style="font-size: 1.6rem; margin-bottom: 0.75rem;">Built for Impact Storytellers</h2>
        <p style="font-size: 1.05rem; color: var(--text-muted); max-width: 680px; margin: 0 auto 1.5rem auto;">
          “Built for NGOs, agencies, educators, documentary researchers, and impact storytelling teams.”
        </p>
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem;">
          <span class="chip" style="background: white;">NGO Campaign Managers</span>
          <span class="chip" style="background: white;">Documentary Researchers</span>
          <span class="chip" style="background: white;">Educational Content Creators</span>
          <span class="chip" style="background: white;">Impact Storytellers</span>
          <span class="chip" style="background: white;">Ethical Media Designers</span>
        </div>
      </section>

      <!-- Preset Quick-Start Grid -->
      <section style="margin-bottom: 3rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
          <div>
            <h2 style="font-size: 1.75rem; margin-bottom: 0.25rem;">Documentary Style Presets</h2>
            <p class="text-muted">Select a preset to pre-fill your documentary brief instantly.</p>
          </div>
          <a href="#create" class="btn btn-secondary btn-sm" data-route="create">
            Custom Brief →
          </a>
        </div>

        <div class="grid-3">
          ${DOCUMENTARY_PRESETS.map(preset => `
            <div class="card preset-card" style="cursor: pointer; display: flex; flex-direction: column; justify-content: space-between;" data-preset-id="${preset.id}">
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                  <h3 style="font-size: 1.15rem; color: var(--primary);">${preset.title}</h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </div>
                <p class="text-muted" style="font-size: 0.875rem; margin-bottom: 1rem;">${preset.description}</p>
              </div>
              <div style="font-size: 0.8rem; font-weight: 600; color: var(--primary);">
                Launch Brief →
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    </div>
  `;
}
