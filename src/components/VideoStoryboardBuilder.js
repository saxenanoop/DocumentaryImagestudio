/**
 * Video Storyboard Builder Component
 * Storyboard generator for Qwen AI video generation with narrative arc configuration,
 * vertical shot sequence timeline, running pacing total, and pitch deck integration.
 */
import { renderCampaignContextCard } from './CampaignContextCard.js';
import { NARRATIVE_ARCS, TRANSITION_OPTIONS, CAMERA_MOTION_PATTERNS } from '../services/videoStoryboardComposer.js';

export function renderVideoStoryboardBuilder(state) {
  const { campaignData, storyboardState, isContextCollapsed } = state;

  // 1. If no brochure is uploaded, show the upload guidance empty state
  if (!campaignData) {
    return renderStoryboardEmptyState();
  }

  const themes = campaignData.themes || [];
  const targetDuration = storyboardState.targetDuration || 90;
  const sceneCount = storyboardState.sceneCount || Math.max(4, Math.round(targetDuration / 10));
  const activeArc = storyboardState.narrativeArc || 'problem-solution-impact';
  const selectedThemes = storyboardState.selectedThemes || themes.map(t => t.label);
  const scenes = storyboardState.scenes || [];
  const hasScenes = scenes.length > 0;

  // Calculate live running total duration
  const currentTotalDuration = scenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  const durationDelta = currentTotalDuration - targetDuration;
  
  let pacingStatus = 'on-track';
  let pacingLabel = '● On Track';
  let pacingClass = 'pacing-on-track';

  if (hasScenes) {
    if (Math.abs(durationDelta) <= 3) {
      pacingStatus = 'on-track';
      pacingLabel = `✓ On Track (${currentTotalDuration}s)`;
      pacingClass = 'pacing-on-track';
    } else if (durationDelta > 3) {
      pacingStatus = 'over';
      pacingLabel = `▲ Over Target (+${durationDelta}s)`;
      pacingClass = 'pacing-over';
    } else {
      pacingStatus = 'under';
      pacingLabel = `▼ Under Target (${durationDelta}s)`;
      pacingClass = 'pacing-under';
    }
  }

  const pacingPercent = targetDuration > 0 ? Math.min(100, Math.round((currentTotalDuration / targetDuration) * 100)) : 0;

  return `
    <div class="video-storyboard-view container">
      <!-- Campaign Context Card (Reused from session) -->
      ${renderCampaignContextCard(campaignData, isContextCollapsed)}

      <!-- Storyboard Setup Panel -->
      <section class="storyboard-setup-card">
        <div class="setup-header">
          <div class="setup-title-group">
            <div class="setup-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <div>
              <h3 class="setup-title">Pitch Video Storyboard Setup</h3>
              <p class="setup-desc">Configure your 1–2 minute video narrative arc before generating Qwen scene prompts</p>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-generate-full-storyboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>${hasScenes ? 'Regenerate Storyboard' : 'Generate Video Storyboard'}</span>
          </button>
        </div>

        <div class="setup-grid">
          <!-- 1. Target Video Length Slider -->
          <div class="setup-item-block">
            <div class="setup-label-row">
              <label for="slider-target-duration" class="setup-label">
                <span class="setup-num">1</span>
                <span>Target Video Length</span>
              </label>
              <div class="duration-badge-readout">
                <span class="duration-number" id="target-duration-val">${targetDuration}</span>
                <span class="duration-unit">sec (${formatDurationMinutes(targetDuration)})</span>
              </div>
            </div>
            
            <div class="slider-wrapper">
              <input 
                type="range" 
                id="slider-target-duration" 
                min="60" 
                max="120" 
                step="5" 
                value="${targetDuration}" 
                class="duration-range-slider"
                aria-label="Target Video Length in seconds"
              />
              <div class="slider-ticks">
                <span>60s (1 min)</span>
                <span>75s</span>
                <span>90s (Standard)</span>
                <span>105s</span>
                <span>120s (2 min)</span>
              </div>
            </div>
          </div>

          <!-- 2. Scene Count -->
          <div class="setup-item-block">
            <div class="setup-label-row">
              <label for="input-scene-count" class="setup-label">
                <span class="setup-num">2</span>
                <span>Scene Count</span>
              </label>
              <span class="scene-count-badge" id="scene-count-badge">${sceneCount} scenes</span>
            </div>

            <div class="stepper-input-row">
              <button type="button" class="btn-stepper" id="btn-scene-count-dec" aria-label="Decrease scene count">−</button>
              <input 
                type="number" 
                id="input-scene-count" 
                min="4" 
                max="16" 
                value="${sceneCount}" 
                class="form-input stepper-input"
                aria-label="Number of scenes in storyboard"
              />
              <button type="button" class="btn-stepper" id="btn-scene-count-inc" aria-label="Increase scene count">+</button>
            </div>
            <p class="setup-helper-text">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Calculated at ~8–12 seconds per scene for tight documentary pitch pacing. Adjust as desired.</span>
            </p>
          </div>

          <!-- 3. Narrative Arc Selector -->
          <div class="setup-item-block setup-full-col">
            <div class="setup-label-row">
              <label class="setup-label">
                <span class="setup-num">3</span>
                <span>Narrative Arc & Story Structure</span>
              </label>
              <span class="setup-hint">Shapes the dramatic role and sequence of each clip</span>
            </div>

            <div class="arc-chips-grid" id="arc-chips-container">
              ${NARRATIVE_ARCS.map(arc => {
                const isSelected = activeArc === arc.id;
                return `
                  <button 
                    type="button" 
                    class="arc-card-chip ${isSelected ? 'is-selected' : ''}" 
                    data-arc-id="${arc.id}"
                    aria-pressed="${isSelected}"
                  >
                    <div class="arc-chip-header">
                      <span class="arc-icon">${arc.icon}</span>
                      <span class="arc-chip-title">${arc.label}</span>
                      ${isSelected ? '<span class="arc-active-pill">Active Arc</span>' : ''}
                    </div>
                    <p class="arc-chip-desc">${arc.desc}</p>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 4. Themes Multi-Select -->
          <div class="setup-item-block setup-full-col">
            <div class="setup-label-row">
              <label class="setup-label">
                <span class="setup-num">4</span>
                <span>Draw Scenes from Themes / Strands</span>
              </label>
              <div class="theme-select-actions">
                <button type="button" class="btn-text-action" id="btn-select-all-themes">Select All</button>
                <span class="theme-actions-sep">•</span>
                <button type="button" class="btn-text-action" id="btn-deselect-all-themes">Clear</button>
              </div>
            </div>

            <div class="themes-multi-chips" id="storyboard-themes-container">
              ${themes.map(t => {
                const isSelected = selectedThemes.includes(t.label);
                return `
                  <button 
                    type="button" 
                    class="theme-multi-chip ${isSelected ? 'is-selected' : ''}" 
                    data-theme-label="${escapeAttr(t.label)}"
                    aria-pressed="${isSelected}"
                  >
                    <span class="chip-checkbox">${isSelected ? '✓' : ''}</span>
                    <span class="chip-label">${t.label}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- Persistent Running Total & Pacing Toolbar -->
      ${hasScenes ? `
        <div class="storyboard-pacing-bar sticky-pacing-toolbar" id="storyboard-pacing-bar">
          <div class="pacing-metrics-group">
            <div class="pacing-metric-item">
              <span class="pacing-metric-label">Scheduled Runtime:</span>
              <span class="pacing-metric-val font-mono" id="live-runtime-display">${currentTotalDuration}s</span>
              <span class="pacing-target-hint">/ ${targetDuration}s Target</span>
            </div>

            <div class="pacing-status-pill ${pacingClass}" id="live-pacing-pill">
              ${pacingLabel}
            </div>

            <div class="pacing-bar-track" title="${currentTotalDuration}s of ${targetDuration}s scheduled">
              <div class="pacing-bar-fill ${pacingClass}" style="width: ${pacingPercent}%"></div>
            </div>

            <span class="pacing-summary-note font-mono">
              ${scenes.length} clips • avg ${(currentTotalDuration / (scenes.length || 1)).toFixed(1)}s/shot
            </span>
          </div>

          <div class="pacing-actions-group">
            <button class="btn btn-sm btn-outline" id="btn-add-scene-manual" title="Insert a new scene into storyboard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add Scene</span>
            </button>

            <button class="btn btn-sm btn-outline" id="btn-copy-full-storyboard" title="Copy entire shot list to clipboard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy Full Storyboard</span>
            </button>

            <button class="btn btn-sm btn-primary" id="btn-save-storyboard-to-deck" title="Save this entire storyboard to Pitch Deck Drawer">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>Save to Pitch Deck</span>
            </button>
          </div>
        </div>
      ` : ''}

      <!-- Storyboard Timeline Sequence -->
      <section class="storyboard-timeline-section">
        ${!hasScenes ? `
          <div class="storyboard-empty-prompt-card">
            <div class="empty-icon-film">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
            </div>
            <h3>Ready to Generate Your Pitch Storyboard</h3>
            <p>Click <strong>"Generate Video Storyboard"</strong> above to break your campaign narrative into a sequence of ${sceneCount} Qwen-optimized documentary scenes.</p>
            <button class="btn btn-primary btn-lg" id="btn-generate-storyboard-cta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Generate ${sceneCount}-Scene Storyboard</span>
            </button>
          </div>
        ` : `
          <div class="timeline-sequence-container">
            <div class="timeline-spine" aria-hidden="true"></div>

            <div class="storyboard-cards-list">
              ${scenes.map((scene, idx) => renderSceneCard(scene, idx, scenes.length)).join('')}
            </div>

            <div class="timeline-add-scene-footer">
              <button class="btn btn-outline btn-block" id="btn-add-scene-bottom">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>Add Another Scene to Timeline</span>
              </button>
            </div>
          </div>
        `}
      </section>
    </div>
  `;
}

/**
 * Renders individual Storyboard Scene Card with full inline editing and controls
 */
function renderSceneCard(scene, index, totalScenes) {
  const isFirst = index === 0;
  const isLast = index === totalScenes - 1;

  return `
    <article class="storyboard-scene-card" data-scene-id="${scene.id}" data-scene-index="${index}">
      <!-- Timeline Node Marker -->
      <div class="timeline-node-marker font-mono" aria-label="Scene ${scene.sceneNumber}">
        <span>${scene.sceneNumber}</span>
      </div>

      <div class="scene-card-inner">
        <!-- Scene Card Header -->
        <header class="scene-card-header">
          <div class="scene-title-row">
            <div class="scene-number-pill">Scene ${scene.sceneNumber}</div>
            <input 
              type="text" 
              class="scene-role-input form-input-clean" 
              data-scene-field="role" 
              data-scene-id="${scene.id}"
              value="${escapeAttr(scene.role || `Scene ${scene.sceneNumber}`)}"
              placeholder="e.g. Establishing the Ground Reality"
              aria-label="Scene ${scene.sceneNumber} role in the narrative arc"
            />
          </div>

          <div class="scene-header-controls">
            <!-- Duration Stepper / Input -->
            <div class="scene-duration-control" title="Scene duration in seconds">
              <label for="dur-${scene.id}" class="visually-hidden">Scene ${scene.sceneNumber} Duration</label>
              <input 
                type="number" 
                id="dur-${scene.id}"
                min="3" 
                max="30" 
                value="${scene.duration || 10}" 
                class="form-input scene-duration-input font-mono" 
                data-scene-field="duration"
                data-scene-id="${scene.id}"
              />
              <span class="duration-sec-tag">sec</span>
            </div>

            <!-- Reorder Controls -->
            <div class="reorder-btn-group">
              <button 
                type="button" 
                class="btn-icon-control btn-move-scene-up" 
                data-scene-id="${scene.id}" 
                data-direction="up"
                ${isFirst ? 'disabled' : ''} 
                title="Move scene up"
                aria-label="Move scene ${scene.sceneNumber} up"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
              </button>

              <button 
                type="button" 
                class="btn-icon-control btn-move-scene-down" 
                data-scene-id="${scene.id}" 
                data-direction="down"
                ${isLast ? 'disabled' : ''} 
                title="Move scene down"
                aria-label="Move scene ${scene.sceneNumber} down"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>

            <!-- Delete Scene -->
            <button 
              type="button" 
              class="btn-icon-control btn-delete-scene" 
              data-scene-id="${scene.id}" 
              title="Delete scene"
              aria-label="Delete scene ${scene.sceneNumber}"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </header>

        <!-- Scene Visual Prompt (Qwen Ready) -->
        <div class="scene-prompt-section">
          <div class="prompt-section-header">
            <div class="prompt-format-tag">
              <span class="qwen-pill">Qwen Video Prompt</span>
              <span class="theme-tag-pill">${scene.theme || 'Strand'}</span>
            </div>
            <span class="prompt-guide-hint">Describes camera motion, subjects, setting & documentary realism</span>
          </div>

          <textarea 
            class="form-textarea scene-prompt-textarea" 
            data-scene-field="visualPrompt"
            data-scene-id="${scene.id}"
            rows="4"
            aria-label="Visual prompt for scene ${scene.sceneNumber}"
          >${scene.visualPrompt || ''}</textarea>
        </div>

        <!-- Camera Behavior & Transition Selectors -->
        <div class="scene-technical-grid">
          <!-- Camera Movement Selector -->
          <div class="tech-select-item">
            <label class="tech-field-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
              <span>Camera Motion</span>
            </label>
            <select class="form-select form-select-sm scene-motion-select" data-scene-field="motionStyle" data-scene-id="${scene.id}">
              ${CAMERA_MOTION_PATTERNS.map(m => `
                <option value="${m.id}" ${scene.motionStyle === m.id ? 'selected' : ''}>
                  ${m.label}
                </option>
              `).join('')}
            </select>
          </div>

          <!-- Transition Selector -->
          <div class="tech-select-item">
            <label class="tech-field-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
              <span>Transition into Next Scene</span>
            </label>
            ${isLast ? `
              <div class="transition-last-badge">
                <span>End of Video (Fade to Black)</span>
              </div>
            ` : `
              <select class="form-select form-select-sm scene-transition-select" data-scene-field="transition" data-scene-id="${scene.id}">
                ${TRANSITION_OPTIONS.map(t => `
                  <option value="${t.id}" ${scene.transition === t.id ? 'selected' : ''}>
                    ${t.label}
                  </option>
                `).join('')}
              </select>
            `}
          </div>
        </div>

        <!-- On-Screen Text / Voiceover Suggestion -->
        <div class="scene-voiceover-section">
          <div class="voiceover-header">
            <label class="voiceover-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
              <span>Voiceover / On-Screen Text Suggestion (Optional)</span>
            </label>
            <span class="voiceover-hint">Suggested narration matching campaign tone</span>
          </div>

          <textarea 
            class="form-textarea voiceover-textarea" 
            data-scene-field="voiceover"
            data-scene-id="${scene.id}"
            rows="2"
            placeholder="e.g. 'Real change is cultivated by the hands that know the land best.'"
            aria-label="Voiceover suggestion for scene ${scene.sceneNumber}"
          >${scene.voiceover || ''}</textarea>
        </div>

        <!-- Scene Action Footer Bar -->
        <footer class="scene-card-footer">
          <div class="scene-footer-meta">
            <span class="scene-meta-indicator">Clip #${scene.sceneNumber} • ${scene.duration}s</span>
          </div>

          <div class="scene-footer-actions">
            <!-- Regenerate Single Scene -->
            <button 
              type="button" 
              class="btn btn-sm btn-ghost btn-regen-single-scene" 
              data-scene-id="${scene.id}"
              title="Regenerate this scene prompt while preserving its role"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Regenerate Scene</span>
            </button>

            <!-- Save Single Scene to Deck -->
            <button 
              type="button" 
              class="btn btn-sm btn-outline btn-save-single-scene" 
              data-scene-id="${scene.id}"
              title="Save this scene clip prompt to pitch deck drawer"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>Save Scene</span>
            </button>

            <!-- Copy Scene Prompt -->
            <button 
              type="button" 
              class="btn btn-sm btn-secondary btn-copy-scene-prompt" 
              data-scene-id="${scene.id}"
              title="Copy Qwen visual prompt for this scene"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy Prompt</span>
            </button>
          </div>
        </footer>
      </div>
    </article>
  `;
}

/**
 * Empty Guidance state shown when no brochure is yet uploaded in the session
 */
function renderStoryboardEmptyState() {
  return `
    <div class="video-storyboard-view container">
      <div class="storyboard-no-brochure-card">
        <div class="empty-icon-film">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
        </div>

        <h2 class="empty-state-title">Upload a Brochure to Build Your Pitch Video Storyboard</h2>
        <p class="empty-state-subtitle">
          The Video Storyboard Builder automatically sequences 60–120s pitch videos based on your campaign's extracted themes, settings, and documentary narrative.
        </p>

        <div class="empty-state-actions-row">
          <button class="btn btn-primary btn-lg" id="btn-goto-upload-step">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span>Upload Campaign Brochure</span>
          </button>
          
          <span class="or-divider">or try a sample brief:</span>
        </div>

        <div class="quick-samples-bar">
          <button class="btn-sample-pill" data-sample-quick="frontier-solar">
            ⚡ Frontier Solar Outreach
          </button>
          <button class="btn-sample-pill" data-sample-quick="ocean-mangrove">
            🌊 Coastal Wetland Defense
          </button>
          <button class="btn-sample-pill" data-sample-quick="mobile-literacy">
            📚 Rural Mobile Literacy
          </button>
        </div>
      </div>
    </div>
  `;
}

function formatDurationMinutes(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function escapeAttr(str) {
  return String(str || '').replace(/"/g, '&quot;');
}
