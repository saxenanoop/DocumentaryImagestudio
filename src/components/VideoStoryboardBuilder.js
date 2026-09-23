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
  const scenes = storyboardState.scenes || [];
  const hasScenes = scenes.length > 0;

  // Ensure active selected scene is valid
  let selectedSceneId = storyboardState.selectedSceneId;
  if (!selectedSceneId || !scenes.some(s => s.id === selectedSceneId)) {
    selectedSceneId = hasScenes ? scenes[0].id : null;
    storyboardState.selectedSceneId = selectedSceneId;
  }

  const selectedIndex = hasScenes ? scenes.findIndex(s => s.id === selectedSceneId) : -1;
  const selectedScene = selectedIndex !== -1 ? scenes[selectedIndex] : null;
  const isAdvancedOpen = Boolean(storyboardState.isAdvancedOpen);

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
      <!-- Campaign Context Reference Card (Slim Sticky Bar) -->
      ${renderCampaignContextCard(campaignData, isContextCollapsed)}

      <!-- 1. Sticky Director Bar: Pinned at top of Storyboard -->
      <section class="storyboard-director-bar" id="storyboard-director-bar">
        <div class="director-bar-inner">
          <div class="director-params-group">
            <!-- Target Video Length -->
            <div class="director-param-item">
              <label for="select-target-duration" class="director-param-label">Target Length</label>
              <div class="director-select-wrap">
                <select id="select-target-duration" class="form-select form-select-sm director-select" aria-label="Target video duration">
                  <option value="60" ${targetDuration === 60 ? 'selected' : ''}>60s (1m)</option>
                  <option value="75" ${targetDuration === 75 ? 'selected' : ''}>75s (1m 15s)</option>
                  <option value="90" ${targetDuration === 90 ? 'selected' : ''}>90s (Standard)</option>
                  <option value="105" ${targetDuration === 105 ? 'selected' : ''}>105s (1m 45s)</option>
                  <option value="120" ${targetDuration === 120 ? 'selected' : ''}>120s (2m)</option>
                </select>
              </div>
            </div>

            <!-- Scene Count Stepper -->
            <div class="director-param-item">
              <label for="input-scene-count" class="director-param-label">Scene Count</label>
              <div class="director-stepper">
                <button type="button" class="btn-stepper-sm" id="btn-scene-count-dec" aria-label="Decrease scene count">−</button>
                <input 
                  type="number" 
                  id="input-scene-count" 
                  min="4" 
                  max="16" 
                  value="${sceneCount}" 
                  class="director-stepper-input font-mono"
                  aria-label="Scene count"
                />
                <button type="button" class="btn-stepper-sm" id="btn-scene-count-inc" aria-label="Increase scene count">+</button>
              </div>
            </div>

            <!-- Target Video Model Pills -->
            <div class="director-param-item">
              <label class="director-param-label">Video Model</label>
              <div class="director-model-scroll-wrapper">
                <div class="director-pills-row" id="video-model-selector">
                  ${VIDEO_MODEL_OPTIONS.map(m => {
                    const isSelected = targetModel === m.id;
                    return `
                      <button 
                        type="button" 
                        class="director-pill-btn director-model-pill ${isSelected ? 'is-active' : ''}" 
                        data-model-id="${m.id}"
                        title="${m.label} (${m.badge})"
                      >
                        <span class="pill-title">${m.label.replace('Google ', '')}</span>
                        <span class="pill-model-badge">${m.badge}</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- Aspect Ratio -->
            <div class="director-param-item">
              <label class="director-param-label">Ratio</label>
              <div class="director-ratio-row" id="video-ratio-segmented">
                ${['16:9', '9:16', '4:3'].map(r => `
                  <button 
                    type="button" 
                    class="ratio-pill-btn ${aspectRatio === r ? 'is-active' : ''}" 
                    data-ratio="${r}"
                  >
                    ${r}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Narrative Arc Dropdown -->
            <div class="director-param-item director-arc-item">
              <label for="select-narrative-arc" class="director-param-label">Narrative Arc</label>
              <select id="select-narrative-arc" class="form-select form-select-sm director-select" aria-label="Narrative Arc">
                ${NARRATIVE_ARCS.map(arc => `
                  <option value="${arc.id}" ${activeArc === arc.id ? 'selected' : ''}>
                    ${arc.label}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- Primary Actions -->
          <div class="director-actions-group">
            <button class="btn btn-sm btn-primary" id="btn-generate-full-storyboard" title="Regenerate full storyboard arc">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span>${hasScenes ? 'Regenerate Entire Storyboard' : 'Generate Video Storyboard'}</span>
            </button>

            ${hasScenes ? `
              <button class="btn btn-sm btn-outline" id="btn-save-storyboard-to-deck" title="Save entire storyboard to Deck">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span>Save to Deck</span>
              </button>

              <button class="btn btn-sm btn-ghost" id="btn-copy-full-storyboard" title="Copy entire shot list to clipboard">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span>Copy All</span>
              </button>
            ` : ''}
          </div>
        </div>
      </section>

      ${!hasScenes ? `
        <!-- Storyboard Empty State / Call to Action -->
        <section class="storyboard-empty-prompt-card">
          <div class="empty-icon-film">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
          </div>
          <h3>Configure Your Pitch Video Storyboard</h3>
          <p>Generate a structured sequence of <strong>${sceneCount} documentary clips</strong> with camera dynamics, optical lenses, pacing, and sound cues derived directly from your brochure.</p>
          <button class="btn btn-primary btn-lg" id="btn-generate-storyboard-cta">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            <span>Generate ${sceneCount}-Scene Video Storyboard</span>
          </button>
        </section>
      ` : `
        <!-- 2. Pacing Toolbar with Rebalance Durations Action -->
        <div class="storyboard-pacing-bar" id="storyboard-pacing-bar">
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
            <button type="button" class="btn btn-sm btn-outline pacing-rebalance-btn ${durationDelta > 0 ? 'is-over-target' : ''}" id="btn-rebalance-durations" style="${durationDelta === 0 ? 'display: none;' : ''}" title="Fit to ${targetDuration}s: evenly redistributes scene lengths (${durationDelta > 0 ? '+' + durationDelta + 's over' : durationDelta + 's under'})">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18M3 9l9-6 9 6M6 14l6 6 6-6"/></svg>
              <span>Rebalance durations</span>
            </button>

            <button class="btn btn-sm btn-outline" id="btn-add-scene-manual" title="Insert a new scene into storyboard">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add Scene</span>
            </button>
          </div>
        </div>

        <!-- 3. Horizontal Timeline Strip -->
        <section class="storyboard-timeline-strip-wrapper">
          <div class="timeline-strip-header">
            <div class="timeline-strip-title">
              <span class="strip-icon">🎞️</span>
              <span>Sequence Timeline</span>
              <span class="strip-count font-mono">${scenes.length} Clips</span>
            </div>
            <span class="timeline-strip-hint">Click any clip to edit below</span>
          </div>

          <div class="timeline-strip-scroll" id="timeline-strip-scroll" tabindex="0" aria-label="Horizontal sequence timeline">
            ${scenes.map((scene, idx) => {
              const isSelected = scene.id === selectedSceneId;
              const sceneNum = idx + 1;
              return `
                <div 
                  class="timeline-scene-tile ${isSelected ? 'is-active-scene' : ''}" 
                  data-scene-id="${scene.id}" 
                  data-scene-index="${idx}"
                  role="button" 
                  tabindex="0"
                  aria-pressed="${isSelected}"
                  title="Select Scene #${sceneNum}: ${escapeAttr(scene.role || `Scene ${sceneNum}`)}"
                >
                  <div class="tile-top-row">
                    <span class="tile-num-badge font-mono">#${sceneNum}</span>
                    <span class="tile-duration font-mono">${scene.duration || 10}s</span>
                  </div>
                  <div class="tile-role-text" title="${escapeAttr(scene.role || `Scene ${sceneNum}`)}">
                    ${escapeAttr(scene.role || `Scene ${sceneNum}`)}
                  </div>
                  <div class="tile-bottom-row">
                    <span class="tile-motion-tag">${cleanMotionLabel(scene.motionStyle)}</span>
                    ${isSelected ? '<span class="tile-active-indicator">Editing</span>' : ''}
                  </div>
                </div>
              `;
            }).join('')}

            <button type="button" class="timeline-add-scene-tile" id="btn-add-scene-tile" title="Add another scene to timeline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span>Add Clip</span>
            </button>
          </div>
        </section>

        <!-- 4. Single-Scene Editor: Focused on the SELECTED Scene Only -->
        ${selectedScene ? `
          <section class="selected-scene-editor-container" id="selected-scene-editor-container">
            ${renderSelectedSceneEditor(selectedScene, selectedIndex, scenes.length, themes, settings, isAdvancedOpen)}
          </section>
        ` : ''}
      `}
    </div>
  `;
}

/**
 * Renders the focused editor for the single selected scene
 */
function renderSelectedSceneEditor(scene, index, totalScenes, themes, settings, isAdvancedOpen) {
  const isFirst = index === 0;
  const isLast = index === totalScenes - 1;
  const sceneNum = index + 1;

  const currentTheme = scene.theme || (themes[0]?.label || "General");
  const currentMotion = scene.motionStyle || "slow-push-in";
  const currentLens = scene.lensStyle || "35mm-prime";
  const currentLight = scene.lighting || "Natural daylight";
  const currentPacing = scene.pacing || "realtime";

  return `
    <article class="single-scene-editor-card" data-scene-id="${scene.id}" data-scene-index="${index}">
      <!-- Scene Editor Header -->
      <header class="scene-editor-header">
        <div class="editor-header-left">
          <div class="scene-pill-badge font-mono">Clip #${sceneNum} of ${totalScenes}</div>
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

        <div class="editor-header-controls">
          <!-- Duration Stepper -->
          <div class="scene-duration-pill" title="Scene length in seconds">
            <label for="dur-${scene.id}" class="visually-hidden">Clip ${sceneNum} Duration</label>
            <input 
              type="number" 
              id="dur-${scene.id}"
              min="3" 
              max="60" 
              value="${scene.duration || 10}" 
              class="form-input-clean scene-duration-input font-mono" 
              data-scene-field="duration"
              data-scene-id="${scene.id}"
            />
            <span class="duration-sec-tag">sec</span>
          </div>

          <!-- Reorder Earlier / Later -->
          <div class="reorder-btn-group">
            <button 
              type="button" 
              class="btn-icon-control btn-move-scene-up" 
              data-scene-id="${scene.id}" 
              ${isFirst ? 'disabled' : ''} 
              title="Move scene earlier in timeline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>

            <button 
              type="button" 
              class="btn-icon-control btn-move-scene-down" 
              data-scene-id="${scene.id}" 
              ${isLast ? 'disabled' : ''} 
              title="Move scene later in timeline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
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
            title="Delete this scene"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
          </button>
        </div>
      </header>

      <!-- DEFAULT VISIBLE CONTROLS: Location, Subject, Motion, Prompt -->
      <div class="editor-core-fields">
        <!-- Row 1: Location & Strand -->
        <div class="editor-row-2col">
          <!-- Setting / Location -->
          <div class="director-field-item">
            <label class="director-label">
              <span class="director-tag">Location</span>
              <span>On-The-Ground Setting</span>
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

          <!-- Strand Theme -->
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
            <span>Camera Movement & Dynamics</span>
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

        <!-- Row 4: Live Assembled Video Prompt -->
        <div class="scene-prompt-block">
          <div class="prompt-meta-header">
            <div class="prompt-badges-wrap">
              <span class="live-pill"><span class="pulse-dot"></span> Live Video Prompt</span>
              <span class="model-tag">${(scene.targetModel || 'Qwen').toUpperCase()}</span>
              <span class="strand-tag">${currentTheme}</span>
              <span class="ratio-tag">${scene.aspectRatio || '16:9'}</span>
            </div>
            <div class="prompt-actions-wrap">
              <button type="button" class="btn btn-sm btn-ghost btn-copy-scene-prompt" data-scene-id="${scene.id}" title="Copy video prompt">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                <span>Copy</span>
              </button>
              <button type="button" class="btn btn-sm btn-outline btn-save-single-scene" data-scene-id="${scene.id}" title="Save scene to Deck">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span>Save to Deck</span>
              </button>
            </div>
          </div>

          <textarea 
            class="form-textarea scene-prompt-textarea live-video-prompt-display" 
            data-scene-field="visualPrompt"
            data-scene-id="${scene.id}"
            rows="3"
            aria-label="Visual prompt for scene ${sceneNum}"
          >${scene.visualPrompt || ''}</textarea>
        </div>
      </div>

      <!-- ADVANCED PARAMETERS DISCLOSURE: Lens, FPS, Transition, Audio -->
      <div class="advanced-disclosure-section">
        <button type="button" class="advanced-disclosure-toggle" id="btn-toggle-advanced-disclosure">
          <div class="disclosure-left">
            <svg class="disclosure-chevron ${isAdvancedOpen ? 'is-expanded' : ''}" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            <span class="disclosure-title">${isAdvancedOpen ? 'Hide Advanced Director Parameters' : 'More Director Parameters (Lens, Cadence, Cut & Audio)'}</span>
          </div>
          <span class="disclosure-hint">${isAdvancedOpen ? 'Close optics & audio' : 'Optical lenses, FPS speed, transitions, voiceover & sound design'}</span>
        </button>

        ${isAdvancedOpen ? `
          <div class="advanced-disclosure-body">
            <!-- Lens & Lighting -->
            <div class="editor-row-2col">
              <!-- Optical Lens -->
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
                  <span>Atmospheric Lighting</span>
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

            <!-- Pacing & Transitions -->
            <div class="editor-row-2col">
              <!-- Cadence / FPS -->
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
                    <span>Fade through Black (End of Pitch Video)</span>
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

            <!-- Voiceover & Sound Design -->
            <div class="editor-row-2col">
              <div class="director-field-item">
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

              <div class="director-field-item">
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
          </div>
        ` : ''}
      </div>

      <!-- Editor Footer Actions -->
      <footer class="scene-editor-footer">
        <div class="footer-meta font-mono">
          <span>Clip #${sceneNum} • ${scene.duration}s • ${cleanMotionLabel(scene.motionStyle)} • ${scene.aspectRatio || '16:9'}</span>
        </div>

        <div class="footer-actions">
          <button 
            type="button" 
            class="btn btn-sm btn-ghost btn-regen-single-scene" 
            data-scene-id="${scene.id}" 
            title="Re-compose this scene prompt from its parameters"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>Re-compose Prompt</span>
          </button>
        </div>
      </footer>
    </article>
  `;
}

function cleanMotionLabel(motionId) {
  const map = {
    'slow-push-in': 'Push-In',
    'handheld-tracking': 'Handheld',
    'static-wide': 'Static Wide',
    'slow-dolly-orbit': 'Dolly Orbit',
    'rack-focus': 'Rack Focus',
    'aerial-reveal': 'Aerial Reveal'
  };
  return map[motionId] || motionId || 'Motion';
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
        <div class="sample-brochures-header">
          <h3>Try a campaign:</h3>
          <p class="sample-brochures-sub">Explore pre-extracted impact brochures to test video storyboards immediately</p>
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

        <div class="sample-manual-footer">
          <button type="button" class="btn-text-link" id="btn-open-manual-entry-direct">Or start with a blank campaign brief</button>
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
