/**
 * Video Storyboard Builder Component
 * Storyboard studio for Qwen, Kling, and Runway AI video generation with full granular control
 * on themes, settings, subjects, camera dynamics, lens optics, lighting, pacing, and sound design.
 */
import { renderCampaignContextCard } from './CampaignContextCard.js';
import {
  NARRATIVE_ARCS,
  TRANSITION_OPTIONS,
  CAMERA_MOTION_PATTERNS,
  CAMERA_LENS_OPTIONS,
  LIGHTING_CONDITIONS,
  PACING_OPTIONS,
  ATMOSPHERE_OPTIONS,
  VIDEO_MODEL_OPTIONS
} from '../services/videoStoryboardComposer.js';
import { SAMPLE_BROCHURES } from '../services/sampleBrochures.js';

export function renderVideoStoryboardBuilder(state) {
  const { campaignData, storyboardState, isContextCollapsed, isParsing, parseProgress, parseError } = state;

  // 1. If parsing is in progress, show the dedicated loading animation
  if (isParsing) {
    return `
      <div class="video-storyboard-view container">
        <div class="parsing-card">
          <div class="parsing-spinner-wrap">
            <div class="editorial-spinner" role="status" aria-label="Parsing document"></div>
          </div>
          <h2 class="parsing-title">Structuring Video Storyboard</h2>
          <p class="parsing-subtext">${parseProgress.stage || 'Analyzing campaign narrative strands for pitch video...'}</p>
          
          <div class="progress-track" aria-hidden="true">
            <div class="progress-fill" style="width: ${parseProgress.percent || 30}%"></div>
          </div>

          <div class="parsing-steps-list">
            <div class="parsing-step ${parseProgress.percent >= 25 ? 'step-active' : ''}">
              <span class="step-dot"></span>
              <span>1. Extracting brochure narrative beats & emotional arc</span>
            </div>
            <div class="parsing-step ${parseProgress.percent >= 60 ? 'step-active' : ''}">
              <span class="step-dot"></span>
              <span>2. Generating scene-by-scene camera motion and pacing</span>
            </div>
            <div class="parsing-step ${parseProgress.percent >= 90 ? 'step-active' : ''}">
              <span class="step-dot"></span>
              <span>3. Composing AI video prompts & sound design cues</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. If no brochure is uploaded yet, render the embedded Video Storyboard Upload & Sample Hub (NO REDIRECT!)
  if (!campaignData) {
    return renderStoryboardUploadHub(parseError);
  }

  const themes = campaignData.themes || [];
  const settings = campaignData.settings || [];
  const targetDuration = storyboardState.targetDuration || 90;
  const sceneCount = storyboardState.sceneCount || Math.max(4, Math.round(targetDuration / 10));
  const activeArc = storyboardState.narrativeArc || 'problem-solution-impact';
  const targetModel = storyboardState.targetModel || 'qwen';
  const aspectRatio = storyboardState.aspectRatio || '16:9';
  const selectedThemes = storyboardState.selectedThemes || themes.map(t => t.label);
  const scenes = storyboardState.scenes || [];
  const hasScenes = scenes.length > 0;

  // Calculate live running total duration
  const currentTotalDuration = scenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  const durationDelta = currentTotalDuration - targetDuration;
  
  let pacingLabel = '● On Track';
  let pacingClass = 'pacing-on-track';

  if (hasScenes) {
    if (Math.abs(durationDelta) <= 3) {
      pacingLabel = `✓ On Track (${currentTotalDuration}s)`;
      pacingClass = 'pacing-on-track';
    } else if (durationDelta > 3) {
      pacingLabel = `▲ Over Target (+${durationDelta}s)`;
      pacingClass = 'pacing-over';
    } else {
      pacingLabel = `▼ Under Target (${durationDelta}s)`;
      pacingClass = 'pacing-under';
    }
  }

  const pacingPercent = targetDuration > 0 ? Math.min(100, Math.round((currentTotalDuration / targetDuration) * 100)) : 0;

  return `
    <div class="video-storyboard-view container">
      <!-- Campaign Context Reference Card -->
      ${renderCampaignContextCard(campaignData, isContextCollapsed)}

      <!-- Storyboard Global Setup & Arc Controller -->
      <section class="storyboard-setup-card">
        <div class="setup-header">
          <div class="setup-title-group">
            <div class="setup-icon-badge">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
            </div>
            <div>
              <h3 class="setup-title">Pitch Video Storyboard Director</h3>
              <p class="setup-desc">Structure your 1–2 minute video narrative arc and generate granular, director-controlled scene prompts</p>
            </div>
          </div>

          <button class="btn btn-primary" id="btn-generate-full-storyboard">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>${hasScenes ? 'Regenerate Entire Storyboard' : 'Generate Video Storyboard'}</span>
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
                <span>60s (1m)</span>
                <span>75s</span>
                <span>90s (Standard)</span>
                <span>105s</span>
                <span>120s (2m)</span>
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
                class="form-input stepper-input font-mono"
                aria-label="Number of scenes in storyboard"
              />
              <button type="button" class="btn-stepper" id="btn-scene-count-inc" aria-label="Increase scene count">+</button>
            </div>
            <p class="setup-helper-text">
              <span>Auto-paced at ~8–12 seconds per clip for high-impact pitch delivery.</span>
            </p>
          </div>

          <!-- 3. Target Video AI Model & Aspect Ratio -->
          <div class="setup-item-block setup-full-col">
            <div class="setup-label-row">
              <label class="setup-label">
                <span class="setup-num">3</span>
                <span>Target Video Generator & Aspect Ratio</span>
              </label>
              <span class="setup-hint">Optimizes prompt phrasing for specific generative video models</span>
            </div>

            <div class="video-model-ratio-row">
              <div class="model-pills-group" id="video-model-selector">
                ${VIDEO_MODEL_OPTIONS.map(m => {
                  const isSelected = targetModel === m.id;
                  return `
                    <button 
                      type="button" 
                      class="model-pill-btn ${isSelected ? 'is-active' : ''}" 
                      data-model-id="${m.id}"
                    >
                      <span class="model-name">${m.label}</span>
                      <span class="model-badge">${m.badge}</span>
                    </button>
                  `;
                }).join('')}
              </div>

              <div class="ratio-segmented-group" id="video-ratio-segmented">
                ${[
                  { id: '16:9', label: '16:9 Landscape (Pitch Deck)' },
                  { id: '9:16', label: '9:16 Vertical (Reel/Mobile)' },
                  { id: '4:3', label: '4:3 Classic Documentary' }
                ].map(r => `
                  <button 
                    type="button" 
                    class="segmented-btn ${aspectRatio === r.id ? 'is-active' : ''}" 
                    data-ratio="${r.id}"
                  >
                    ${r.label}
                  </button>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- 4. Narrative Arc Selector -->
          <div class="setup-item-block setup-full-col">
            <div class="setup-label-row">
              <label class="setup-label">
                <span class="setup-num">4</span>
                <span>Narrative Arc & Story Structure</span>
              </label>
              <span class="setup-hint">Governs the dramatic progression and camera motivation of each beat</span>
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

          <!-- 5. Themes Multi-Select -->
          <div class="setup-item-block setup-full-col">
            <div class="setup-label-row">
              <label class="setup-label">
                <span class="setup-num">5</span>
                <span>Draw Scenes from Curatorial Strands</span>
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
              <span>Copy All Prompts</span>
            </button>

            <button class="btn btn-sm btn-primary" id="btn-save-storyboard-to-deck" title="Save this entire storyboard to Deck">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>Save to Deck</span>
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
            <h3>Configure Your Pitch Video Storyboard</h3>
            <p>Click below to generate a sequence of <strong>${sceneCount} documentary clips</strong> with camera motion, optical lenses, lighting, pacing, and sound cues derived directly from your brochure.</p>
            <button class="btn btn-primary btn-lg" id="btn-generate-storyboard-cta">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>Generate ${sceneCount}-Scene Video Storyboard</span>
            </button>
          </div>
        ` : `
          <div class="timeline-sequence-container">
            <div class="timeline-spine" aria-hidden="true"></div>

            <div class="storyboard-cards-list">
              ${scenes.map((scene, idx) => renderGranularSceneCard(scene, idx, scenes.length, themes, settings)).join('')}
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
 * Renders a rich scene card with GRANULAR CONTROLS (matching image prompts power)
 */
function renderGranularSceneCard(scene, index, totalScenes, themes, settings) {
  const isFirst = index === 0;
  const isLast = index === totalScenes - 1;
  const sceneNum = index + 1;

  const currentTheme = scene.theme || (themes[0]?.label || "General");
  const currentMotion = scene.motionStyle || "slow-push-in";
  const currentLens = scene.lensStyle || "35mm-prime";
  const currentLight = scene.lighting || "Natural daylight";
  const currentPacing = scene.pacing || "realtime";
  const currentAtmos = scene.atmospheres || ["film-grain"];

  return `
    <article class="storyboard-scene-card" data-scene-id="${scene.id}" data-scene-index="${index}">
      <!-- Timeline Node Marker -->
      <div class="timeline-node-marker font-mono" aria-label="Scene ${sceneNum}">
        <span>${sceneNum}</span>
      </div>

      <div class="scene-card-inner">
        <!-- Scene Card Header -->
        <header class="scene-card-header">
          <div class="scene-title-row">
            <div class="scene-number-pill">Clip #${sceneNum}</div>
            <input 
              type="text" 
              class="scene-role-input form-input-clean" 
              data-scene-field="role" 
              data-scene-id="${scene.id}"
              value="${escapeAttr(scene.role || `Scene ${sceneNum}`)}"
              placeholder="e.g. Establishing the Frontline Reality"
              aria-label="Scene ${sceneNum} role in pitch arc"
            />
          </div>

          <div class="scene-header-controls">
            <!-- Duration Stepper -->
            <div class="scene-duration-control" title="Scene duration in seconds">
              <label for="dur-${scene.id}" class="visually-hidden">Clip ${sceneNum} Duration</label>
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
                ${isFirst ? 'disabled' : ''} 
                title="Move scene earlier"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>
              </button>

              <button 
                type="button" 
                class="btn-icon-control btn-move-scene-down" 
                data-scene-id="${scene.id}" 
                ${isLast ? 'disabled' : ''} 
                title="Move scene later"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
            </div>

            <!-- Duplicate Scene -->
            <button 
              type="button" 
              class="btn-icon-control btn-duplicate-scene" 
              data-scene-id="${scene.id}" 
              title="Duplicate this scene"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>

            <!-- Delete Scene -->
            <button 
              type="button" 
              class="btn-icon-control btn-delete-scene" 
              data-scene-id="${scene.id}" 
              title="Delete scene"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </header>

        <!-- GRANULAR CONTROL SECTION: The Director Controls (Per Scene!) -->
        <div class="scene-director-panel">
          <!-- Row 1: Theme & Location -->
          <div class="director-row-2col">
            <!-- Theme Strand -->
            <div class="director-field-item">
              <label class="director-label">
                <span class="director-tag">Strand</span>
                <span>Curatorial Theme</span>
              </label>
              <select class="form-select form-select-sm scene-theme-select" data-scene-field="theme" data-scene-id="${scene.id}">
                ${themes.map(t => `
                  <option value="${escapeAttr(t.label)}" ${currentTheme === t.label ? 'selected' : ''}>
                    ${t.label}
                  </option>
                `).join('')}
              </select>
            </div>

            <!-- Setting / Location -->
            <div class="director-field-item">
              <label class="director-label">
                <span class="director-tag">Setting</span>
                <span>On-The-Ground Location</span>
              </label>
              <select class="form-select form-select-sm scene-setting-select" data-scene-field="setting" data-scene-id="${scene.id}">
                ${settings.map(s => `
                  <option value="${escapeAttr(s)}" ${scene.setting === s ? 'selected' : ''}>
                    ${s}
                  </option>
                `).join('')}
                <option value="__custom__" ${scene.isCustomSetting ? 'selected' : ''}>✏️ Custom Location...</option>
              </select>
              ${scene.isCustomSetting ? `
                <input 
                  type="text" 
                  class="form-input form-input-sm scene-custom-setting-input mt-1" 
                  data-scene-field="customSetting" 
                  data-scene-id="${scene.id}" 
                  placeholder="Enter specific setting..." 
                  value="${escapeAttr(scene.customSetting || '')}"
                />
              ` : ''}
            </div>
          </div>

          <!-- Row 2: Subject & Human Agency -->
          <div class="director-field-item">
            <div class="director-label-with-action">
              <label class="director-label">
                <span class="director-tag">Subject</span>
                <span>Human Agency & Physical Action</span>
              </label>
              <button type="button" class="btn-text-action btn-insert-subject-action" data-scene-id="${scene.id}">
                Suggest Action
              </button>
            </div>
            <textarea 
              class="form-textarea scene-subject-textarea" 
              data-scene-field="subject" 
              data-scene-id="${scene.id}" 
              rows="2" 
              placeholder="e.g. Village youth holding smartphones steady while documenting oral histories..."
            >${scene.subject || ''}</textarea>
          </div>

          <!-- Row 3: Camera Motion Chips -->
          <div class="director-field-item">
            <label class="director-label">
              <span class="director-tag">Motion</span>
              <span>Camera Movement & Dynamic</span>
            </label>
            <div class="chips-group scene-motion-chips" data-scene-id="${scene.id}">
              ${CAMERA_MOTION_PATTERNS.map(m => {
                const isSelected = currentMotion === m.id;
                return `
                  <button 
                    type="button" 
                    class="chip chip-sm ${isSelected ? 'chip-selected' : ''}" 
                    data-scene-chip-field="motionStyle" 
                    data-scene-id="${scene.id}" 
                    data-chip-value="${m.id}"
                    title="${m.phrase}"
                  >
                    ${isSelected ? '● ' : ''}${m.label}
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Row 4: Lens Optics & Lighting Chips -->
          <div class="director-row-2col">
            <!-- Lens & Framing -->
            <div class="director-field-item">
              <label class="director-label">
                <span class="director-tag">Lens</span>
                <span>Optical Lens Profile</span>
              </label>
              <div class="chips-group scene-lens-chips" data-scene-id="${scene.id}">
                ${CAMERA_LENS_OPTIONS.map(l => {
                  const isSelected = currentLens === l.id;
                  return `
                    <button 
                      type="button" 
                      class="chip chip-sm ${isSelected ? 'chip-selected' : ''}" 
                      data-scene-chip-field="lensStyle" 
                      data-scene-id="${scene.id}" 
                      data-chip-value="${l.id}"
                      title="${l.desc}"
                    >
                      ${isSelected ? '✓ ' : ''}${l.label}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Lighting -->
            <div class="director-field-item">
              <label class="director-label">
                <span class="director-tag">Light</span>
                <span>Lighting & Atmospheric Time</span>
              </label>
              <div class="chips-group scene-lighting-chips" data-scene-id="${scene.id}">
                ${LIGHTING_CONDITIONS.map(lt => {
                  const isSelected = currentLight === lt.label;
                  return `
                    <button 
                      type="button" 
                      class="chip chip-sm ${isSelected ? 'chip-selected' : ''}" 
                      data-scene-chip-field="lighting" 
                      data-scene-id="${scene.id}" 
                      data-chip-value="${lt.label}"
                      title="${lt.desc}"
                    >
                      ${isSelected ? '● ' : ''}${lt.label}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- Row 5: Pacing & Atmosphere Realism -->
          <div class="director-row-2col">
            <!-- Pacing -->
            <div class="director-field-item">
              <label class="director-label">
                <span class="director-tag">Speed</span>
                <span>Cadence & Frame Rate</span>
              </label>
              <div class="chips-group scene-pacing-chips" data-scene-id="${scene.id}">
                ${PACING_OPTIONS.map(p => {
                  const isSelected = currentPacing === p.id;
                  return `
                    <button 
                      type="button" 
                      class="chip chip-sm ${isSelected ? 'chip-selected' : ''}" 
                      data-scene-chip-field="pacing" 
                      data-scene-id="${scene.id}" 
                      data-chip-value="${p.id}"
                    >
                      ${p.label}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Transition -->
            <div class="director-field-item">
              <label class="director-label">
                <span class="director-tag">Cut</span>
                <span>Transition to Next Clip</span>
              </label>
              ${isLast ? `
                <div class="transition-last-badge">
                  <span>Fade through Black (End of Video)</span>
                </div>
              ` : `
                <select class="form-select form-select-sm scene-transition-select" data-scene-field="transition" data-scene-id="${scene.id}">
                  ${TRANSITION_OPTIONS.map(t => `
                    <option value="${t.id}" ${scene.transition === t.id ? 'selected' : ''}>
                      ${t.label} (${t.desc})
                    </option>
                  `).join('')}
                </select>
              `}
            </div>
          </div>
        </div>

        <!-- LIVE ASSEMBLED VIDEO PROMPT (Reactive in real time!) -->
        <div class="scene-prompt-section">
          <div class="prompt-section-header">
            <div class="prompt-format-tag">
              <span class="live-pill"><span class="pulse-dot"></span> Live Video Prompt</span>
              <span class="qwen-pill">${(scene.targetModel || 'Qwen').toUpperCase()}</span>
              <span class="theme-tag-pill">${currentTheme}</span>
            </div>
            <button class="btn btn-sm btn-ghost btn-copy-scene-prompt" data-scene-id="${scene.id}" title="Copy prompt">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </button>
          </div>

          <textarea 
            class="form-textarea scene-prompt-textarea live-video-prompt-display" 
            data-scene-field="visualPrompt"
            data-scene-id="${scene.id}"
            rows="3"
            aria-label="Visual prompt for scene ${sceneNum}"
          >${scene.visualPrompt || ''}</textarea>
        </div>

        <!-- Voiceover & Sound Design (Foley) -->
        <div class="scene-audio-narrative-row">
          <!-- Voiceover -->
          <div class="audio-col">
            <label class="director-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>
              <span>Voiceover / Narration Line</span>
            </label>
            <input 
              type="text" 
              class="form-input form-input-sm scene-voiceover-input" 
              data-scene-field="voiceover"
              data-scene-id="${scene.id}"
              placeholder="e.g. 'Real change is cultivated by the hands that know the land best.'"
              value="${escapeAttr(scene.voiceover || '')}"
            />
          </div>

          <!-- Sound Design / Foley -->
          <div class="audio-col">
            <label class="director-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
              <span>Sound Design / Foley Ambiance</span>
            </label>
            <input 
              type="text" 
              class="form-input form-input-sm scene-audio-input" 
              data-scene-field="audioCue"
              data-scene-id="${scene.id}"
              placeholder="e.g. Desert wind rustling, footsteps on dry earth, quiet laughter..."
              value="${escapeAttr(scene.audioCue || '')}"
            />
          </div>
        </div>

        <!-- Scene Footer Actions -->
        <footer class="scene-card-footer">
          <div class="scene-footer-meta">
            <span class="scene-meta-indicator font-mono">Clip #${sceneNum} • ${scene.duration}s • ${scene.motionStyle}</span>
          </div>

          <div class="scene-footer-actions">
            <!-- Regenerate Single Scene -->
            <button 
              type="button" 
              class="btn btn-sm btn-ghost btn-regen-single-scene" 
              data-scene-id="${scene.id}" 
              title="Re-compose this scene prompt from its parameters"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span>Re-compose</span>
            </button>

            <!-- Save Single Scene to Deck -->
            <button 
              type="button" 
              class="btn btn-sm btn-outline btn-save-single-scene" 
              data-scene-id="${scene.id}"
              title="Save this scene clip prompt to Deck"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              <span>Save to Deck</span>
            </button>
          </div>
        </footer>
      </div>
    </article>
  `;
}

/**
 * Integrated Upload & Sample Hub directly in Video Storyboard (NO REDIRECT!)
 */
function renderStoryboardUploadHub(parseError) {
  return `
    <div class="video-storyboard-view container">
      <div class="editorial-hero">
        <div class="hero-eyebrow">Pitch Video Director</div>
        <h1 class="hero-title">Compose Documentary Video Storyboards from Any Brochure</h1>
        <p class="hero-description">
          Upload any campaign brochure, field report, or pitch brief to automatically generate a complete 60–120s documentary video sequence for <strong>Google Gemini</strong>, <strong>Qwen Video</strong>, <strong>Kling AI</strong>, and <strong>Runway Gen-3</strong> with full camera, lens, and pacing control.
        </p>
      </div>

      <div class="upload-box-wrapper">
        <div class="upload-dropzone" id="video-upload-dropzone" tabindex="0" role="button" aria-label="Drop campaign brochure to generate video storyboard">
          <input type="file" id="video-brochure-file-input" class="visually-hidden" accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown" />
          
          <div class="dropzone-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
          </div>

          <div class="dropzone-content">
            <h3 class="dropzone-heading">Drop your campaign brochure here to build a Video Storyboard, or <span class="dropzone-link">browse files</span></h3>
            <p class="dropzone-sub">Extracts frontline narrative beats, settings, and authentic action for video sequence generation.</p>
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
            <span class="sample-label">Or explore video storyboards with a sample brochure:</span>
            <button class="btn-text-link" id="btn-open-manual-entry-direct">Or start with a blank brief</button>
          </div>
          <div class="sample-grid">
            ${SAMPLE_BROCHURES.map(sample => `
              <button class="sample-card sample-card-video-trigger" data-sample-id="${sample.id}" type="button">
                <div class="sample-card-tag">${sample.tag} • Video Arc</div>
                <div class="sample-card-title">${sample.title}</div>
                <div class="sample-card-desc">${sample.subtitle}</div>
                <div class="sample-card-action">
                  <span>Build Video Storyboard</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                </div>
              </button>
            `).join('')}
          </div>
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
