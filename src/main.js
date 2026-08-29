/**
 * Documentary Prompt Studio — Main Reactive Application Controller
 * Handles image prompt generation, video storyboard synthesis for Qwen,
 * shared campaign brochure context, and unified pitch deck persistence.
 */
import './style.css';
import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { renderUploadZone } from './components/UploadZone.js';
import { renderPromptBuilder } from './components/PromptBuilder.js';
import { renderVideoStoryboardBuilder } from './components/VideoStoryboardBuilder.js';
import { renderSavedPromptsDrawer } from './components/SavedPromptsDrawer.js';
import { renderManualEntryModal } from './components/ManualEntryModal.js';
import { showToast } from './components/Toast.js';

import { parseDocument } from './services/documentParser.js';
import { extractCampaignData, parseBrochureSemantically } from './services/llmExtractor.js';
import { composeDocumentaryPrompt, exportDeckPromptsMarkdown } from './services/promptComposer.js';
import {
  generateVideoStoryboard,
  regenerateSingleScenePrompt,
  exportStoryboardAsText,
  exportStoryboardAsMarkdown,
  NARRATIVE_ARCS
} from './services/videoStoryboardComposer.js';
import { SAMPLE_BROCHURES } from './services/sampleBrochures.js';

// Local storage session key for pitch deck prompts
const DECK_STORAGE_KEY = 'doc_prompt_studio_deck_v2';

function loadSavedPrompts() {
  try {
    const raw = localStorage.getItem(DECK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistSavedPrompts(prompts) {
  try {
    localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(prompts));
  } catch (err) {
    console.warn('Failed to save pitch deck prompts to localStorage:', err);
  }
}

// Global Application State (Single Shared Source of Truth)
const state = {
  activeMode: 'image-prompts', // 'image-prompts' | 'video-storyboard'
  campaignData: null,
  isParsing: false,
  parseProgress: { stage: '', percent: 0 },
  parseError: null,
  isContextCollapsed: false,
  isDrawerOpen: false,
  isManualModalOpen: false,
  savedPrompts: loadSavedPrompts(),
  builderState: {
    selectedThemeIndex: 0,
    setting: '',
    isCustomSetting: false,
    customSetting: '',
    subject: '',
    selectedMoods: [],
    lighting: 'Natural daylight',
    composition: 'Environmental portrait',
    cameraStyle: '35mm documentary prime lens',
    aspectRatio: '16:9',
    ethicalLock: true,
    includeNegative: true
  },
  storyboardState: {
    targetDuration: 90,
    sceneCount: 9,
    narrativeArc: 'problem-solution-impact',
    selectedThemes: [],
    scenes: [],
    isGenerated: false
  }
};

/**
 * Initializes builder & storyboard states when a new campaign is parsed
 */
function initBuilderFromCampaign(data) {
  const themes = data.themes || [];
  const settings = data.settings || [];
  const toneKeywords = data.tone_keywords || [];
  const subjectExamples = data.subject_examples || [];

  state.campaignData = data;
  state.isParsing = false;
  state.parseError = null;
  state.isContextCollapsed = false;

  state.builderState = {
    selectedThemeIndex: 0,
    setting: settings[0] || 'Open-air community gathering space',
    isCustomSetting: false,
    customSetting: '',
    subject: '',
    selectedMoods: toneKeywords.slice(0, 4),
    lighting: 'Natural daylight',
    composition: 'Environmental portrait',
    cameraStyle: '35mm documentary prime lens',
    aspectRatio: '16:9',
    ethicalLock: true,
    includeNegative: true
  };

  state.storyboardState = {
    targetDuration: 90,
    sceneCount: 9,
    narrativeArc: 'problem-solution-impact',
    selectedThemes: themes.map(t => t.label),
    scenes: [],
    isGenerated: false
  };
}

/**
 * Main Application Renderer
 */
function renderApp() {
  const appEl = document.getElementById('app');
  if (!appEl) return;

  const hasCampaign = !!state.campaignData;

  let mainContentHtml = '';
  if (!hasCampaign) {
    if (state.activeMode === 'video-storyboard') {
      mainContentHtml = renderVideoStoryboardBuilder(state);
    } else {
      mainContentHtml = renderUploadZone(state);
    }
  } else {
    if (state.activeMode === 'video-storyboard') {
      mainContentHtml = renderVideoStoryboardBuilder(state);
    } else {
      mainContentHtml = renderPromptBuilder(state);
    }
  }

  appEl.innerHTML = `
    ${renderHeader(state)}
    <main class="main-content">
      ${mainContentHtml}
    </main>
    ${renderFooter()}
    ${renderSavedPromptsDrawer(state.savedPrompts, state.isDrawerOpen)}
    ${renderManualEntryModal(state.isManualModalOpen)}
  `;

  attachEventListeners();
}

/**
 * Attach Dynamic DOM Event Listeners
 */
function attachEventListeners() {
  // 1. Header Navigation, Mode Switcher & Drawer Toggle
  const btnBrandHome = document.getElementById('nav-brand-home');
  if (btnBrandHome) {
    btnBrandHome.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mode Switcher Tabs
  const tabModeImage = document.getElementById('tab-mode-image');
  const tabModeVideo = document.getElementById('tab-mode-video');

  if (tabModeImage) {
    tabModeImage.addEventListener('click', () => {
      if (state.activeMode !== 'image-prompts') {
        state.activeMode = 'image-prompts';
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  if (tabModeVideo) {
    tabModeVideo.addEventListener('click', () => {
      if (state.activeMode !== 'video-storyboard') {
        state.activeMode = 'video-storyboard';
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  const btnToggleDrawer = document.getElementById('btn-toggle-deck-drawer');
  if (btnToggleDrawer) {
    btnToggleDrawer.addEventListener('click', () => {
      state.isDrawerOpen = true;
      renderApp();
    });
  }

  const btnOpenDeckFromPreview = document.getElementById('btn-open-deck-drawer-from-preview');
  if (btnOpenDeckFromPreview) {
    btnOpenDeckFromPreview.addEventListener('click', () => {
      state.isDrawerOpen = true;
      renderApp();
    });
  }

  const btnCloseDrawer = document.getElementById('btn-close-deck-drawer');
  const drawerBackdrop = document.getElementById('deck-drawer-backdrop');
  if (btnCloseDrawer) {
    btnCloseDrawer.addEventListener('click', () => {
      state.isDrawerOpen = false;
      renderApp();
    });
  }
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) {
        state.isDrawerOpen = false;
        renderApp();
      }
    });
  }

  // 2. Upload Actions & Multi-Brochure Support
  const btnHeaderUploadNew = document.getElementById('btn-header-upload-new');
  const btnUploadDifferent = document.getElementById('btn-upload-different');
  const handleUploadNew = () => {
    state.campaignData = null;
    state.parseError = null;
    state.activeMode = 'image-prompts';
    renderApp();
    showToast('Ready for new brochure upload. Saved deck items preserved!', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (btnHeaderUploadNew) btnHeaderUploadNew.addEventListener('click', handleUploadNew);
  if (btnUploadDifferent) btnUploadDifferent.addEventListener('click', handleUploadNew);

  // 3. Dropzone & File Input Handling
  const dropzone = document.getElementById('upload-dropzone');
  const fileInput = document.getElementById('brochure-file-input');

  if (dropzone && fileInput) {
    dropzone.addEventListener('click', () => fileInput.click());

    dropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropzone.classList.add('is-dragover');
    });

    dropzone.addEventListener('dragleave', () => {
      dropzone.classList.remove('is-dragover');
    });

    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('is-dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileProcessing(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileProcessing(e.target.files[0]);
      }
    });
  }

  // 4. Sample Brochure Triggers
  document.querySelectorAll('.sample-card').forEach(card => {
    card.addEventListener('click', () => {
      const sampleId = card.getAttribute('data-sample-id');
      const sample = SAMPLE_BROCHURES.find(s => s.id === sampleId);
      if (sample) {
        handleSampleProcessing(sample);
      }
    });
  });

  // Storyboard Empty State Quick Triggers
  const btnGotoUploadStep = document.getElementById('btn-goto-upload-step');
  if (btnGotoUploadStep) {
    btnGotoUploadStep.addEventListener('click', () => {
      state.activeMode = 'image-prompts';
      renderApp();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('.btn-sample-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      const sampleKey = btn.getAttribute('data-sample-quick');
      let sample = SAMPLE_BROCHURES.find(s => s.id.includes(sampleKey) || s.title.toLowerCase().includes(sampleKey));
      if (!sample) sample = SAMPLE_BROCHURES[0];
      if (sample) {
        handleSampleProcessing(sample, 'video-storyboard');
      }
    });
  });

  // 5. Manual Entry Modal Triggers
  const btnOpenManualDirect = document.getElementById('btn-open-manual-entry-direct');
  const btnOpenManualError = document.getElementById('btn-open-manual-entry');
  const btnCloseModal = document.getElementById('btn-close-manual-modal');
  const btnCancelModal = document.getElementById('btn-cancel-manual-modal');
  const modalBackdrop = document.getElementById('manual-modal-backdrop');

  const openManualModal = () => {
    state.isManualModalOpen = true;
    renderApp();
  };
  const closeManualModal = () => {
    state.isManualModalOpen = false;
    renderApp();
  };

  if (btnOpenManualDirect) btnOpenManualDirect.addEventListener('click', openManualModal);
  if (btnOpenManualError) btnOpenManualError.addEventListener('click', openManualModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeManualModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeManualModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeManualModal();
    });
  }

  const manualForm = document.getElementById('manual-entry-form');
  if (manualForm) {
    manualForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pastedText = document.getElementById('manual-paste-text')?.value || '';
      const customName = document.getElementById('manual-campaign-name')?.value || '';
      const customSummary = document.getElementById('manual-summary')?.value || '';
      const rawThemes = document.getElementById('manual-themes-raw')?.value || '';
      const rawSettings = document.getElementById('manual-settings-raw')?.value || '';

      if (pastedText.trim().length > 25) {
        state.isManualModalOpen = false;
        handleRawTextExtraction(pastedText);
      } else if (customName.trim()) {
        const themeList = rawThemes ? rawThemes.split(',').map(t => ({ label: t.trim(), description: `Documentary focus on ${t.trim()}` })).filter(t => t.label) : [
          { label: "Community Storytelling", description: "Observational photojournalism." }
        ];
        const settingList = rawSettings ? rawSettings.split(',').map(s => s.trim()).filter(Boolean) : [
          "Open-air community setting", "Field operations site"
        ];

        const manualData = {
          campaign_name: customName.trim(),
          one_line_summary: customSummary.trim() || "Community-driven outreach and storytelling initiative.",
          themes: themeList,
          settings: settingList,
          tone_keywords: ["Dignified", "Authentic", "Communitarian", "Hopeful"],
          subject_examples: ["Community member actively participating in local endeavor"]
        };

        state.isManualModalOpen = false;
        initBuilderFromCampaign(manualData);
        renderApp();
        showToast('Manual campaign initialized', 'success');
      } else {
        showToast('Please paste brochure text or enter a campaign name', 'error');
      }
    });
  }

  // 6. Campaign Context Card Collapse Toggle
  const btnToggleContextCard = document.getElementById('btn-toggle-context-card');
  if (btnToggleContextCard) {
    btnToggleContextCard.addEventListener('click', () => {
      state.isContextCollapsed = !state.isContextCollapsed;
      renderApp();
    });
  }

  // =========================================================================
  // IMAGE PROMPT BUILDER EVENT LISTENERS
  // =========================================================================
  if (state.activeMode === 'image-prompts') {
    // Theme Cards Selection
    document.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-theme-index'), 10);
        state.builderState.selectedThemeIndex = idx;
        updateLivePromptPreview();
        renderApp();
      });
    });

    // Setting Controls
    const settingSelect = document.getElementById('setting-select');
    const customSettingInput = document.getElementById('custom-setting-input');
    if (settingSelect) {
      settingSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === '__custom__') {
          state.builderState.isCustomSetting = true;
          const container = document.getElementById('custom-setting-container');
          if (container) container.classList.remove('is-hidden');
        } else {
          state.builderState.isCustomSetting = false;
          state.builderState.setting = val;
          const container = document.getElementById('custom-setting-container');
          if (container) container.classList.add('is-hidden');
        }
        updateLivePromptPreview();
      });
    }

    if (customSettingInput) {
      customSettingInput.addEventListener('input', (e) => {
        state.builderState.customSetting = e.target.value;
        updateLivePromptPreview();
      });
    }

    // Subject Input & Suggestion Trigger
    const subjectInput = document.getElementById('subject-input');
    if (subjectInput) {
      subjectInput.addEventListener('input', (e) => {
        state.builderState.subject = e.target.value;
        updateLivePromptPreview();
      });
    }

    const btnUseSuggestedSubject = document.getElementById('btn-use-suggested-subject');
    if (btnUseSuggestedSubject && state.campaignData) {
      btnUseSuggestedSubject.addEventListener('click', () => {
        const examples = state.campaignData.subject_examples || [];
        const currentIdx = state.builderState.selectedThemeIndex || 0;
        const suggested = examples[currentIdx % examples.length] || examples[0] || '';
        if (suggested) {
          state.builderState.subject = suggested;
          if (subjectInput) subjectInput.value = suggested;
          updateLivePromptPreview();
          showToast('Inserted suggested subject', 'info');
        }
      });
    }

    // Mood Chips Selection
    document.querySelectorAll('#mood-chips-container .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const mood = chip.getAttribute('data-mood');
        let moods = state.builderState.selectedMoods || [];
        if (moods.includes(mood)) {
          moods = moods.filter(m => m !== mood);
        } else {
          moods = [...moods, mood];
        }
        state.builderState.selectedMoods = moods;
        chip.classList.toggle('chip-selected');
        chip.innerHTML = moods.includes(mood) ? `✓ ${mood}` : mood;
        updateLivePromptPreview();
      });
    });

    // Lighting Chips Selection
    document.querySelectorAll('#lighting-chips-container .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const lighting = chip.getAttribute('data-lighting');
        state.builderState.lighting = lighting;
        document.querySelectorAll('#lighting-chips-container .chip').forEach(c => {
          const isCur = c.getAttribute('data-lighting') === lighting;
          c.classList.toggle('chip-selected', isCur);
          const label = c.getAttribute('data-lighting');
          c.innerHTML = isCur ? `● ${label}` : label;
        });
        updateLivePromptPreview();
      });
    });

    // Composition Chips Selection
    document.querySelectorAll('#composition-chips-container .chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const composition = chip.getAttribute('data-composition');
        state.builderState.composition = composition;
        document.querySelectorAll('#composition-chips-container .chip').forEach(c => {
          const isCur = c.getAttribute('data-composition') === composition;
          c.classList.toggle('chip-selected', isCur);
          const label = c.getAttribute('data-composition');
          c.innerHTML = isCur ? `● ${label}` : label;
        });
        updateLivePromptPreview();
      });
    });

    // Aspect Ratio & Camera Controls
    document.querySelectorAll('#ratio-segmented .segmented-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ratio = btn.getAttribute('data-ratio');
        state.builderState.aspectRatio = ratio;
        document.querySelectorAll('#ratio-segmented .segmented-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        updateLivePromptPreview();
      });
    });

    const cameraSelect = document.getElementById('camera-style-select');
    if (cameraSelect) {
      cameraSelect.addEventListener('change', (e) => {
        state.builderState.cameraStyle = e.target.value;
        updateLivePromptPreview();
      });
    }

    // Ethical Lock Toggle
    const toggleEthicalLock = document.getElementById('toggle-ethical-lock');
    if (toggleEthicalLock) {
      toggleEthicalLock.addEventListener('change', (e) => {
        state.builderState.ethicalLock = e.target.checked;
        updateLivePromptPreview();
      });
    }

    // Live Prompt Actions: Copy & Save to Deck
    const btnCopyLivePrompt = document.getElementById('btn-copy-live-prompt');
    if (btnCopyLivePrompt) {
      btnCopyLivePrompt.addEventListener('click', () => {
        const textarea = document.getElementById('live-prompt-textarea');
        if (textarea) {
          copyToClipboard(textarea.value, 'Prompt copied to clipboard!', btnCopyLivePrompt);
        }
      });
    }

    const btnSaveToDeck = document.getElementById('btn-save-to-deck');
    if (btnSaveToDeck && state.campaignData) {
      btnSaveToDeck.addEventListener('click', () => {
        const currentTheme = state.campaignData.themes[state.builderState.selectedThemeIndex] || { label: "General" };
        const currentSetting = state.builderState.isCustomSetting 
          ? state.builderState.customSetting 
          : (state.builderState.setting || state.campaignData.settings[0] || "");
        
        const promptText = document.getElementById('live-prompt-textarea')?.value || getLivePromptText();

        const newSavedPrompt = {
          id: 'prompt-' + Date.now(),
          type: 'image',
          campaignName: state.campaignData.campaign_name,
          themeLabel: currentTheme.label,
          setting: currentSetting,
          lighting: state.builderState.lighting,
          moodKeywords: state.builderState.selectedMoods,
          composition: state.builderState.composition,
          promptText,
          timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        state.savedPrompts.unshift(newSavedPrompt);
        persistSavedPrompts(state.savedPrompts);
        renderApp();
        showToast(`Saved still prompt to Pitch Deck (${state.savedPrompts.length} total)`, 'success');
      });
    }

    const btnResetBuilder = document.getElementById('btn-reset-builder');
    if (btnResetBuilder && state.campaignData) {
      btnResetBuilder.addEventListener('click', () => {
        initBuilderFromCampaign(state.campaignData);
        renderApp();
        showToast('Builder fields reset to brochure defaults', 'info');
      });
    }
  }

  // =========================================================================
  // VIDEO STORYBOARD BUILDER EVENT LISTENERS
  // =========================================================================
  if (state.activeMode === 'video-storyboard' && state.campaignData) {
    // 1. Duration Slider
    const durationSlider = document.getElementById('slider-target-duration');
    const targetDurationVal = document.getElementById('target-duration-val');
    const inputSceneCount = document.getElementById('input-scene-count');
    const sceneCountBadge = document.getElementById('scene-count-badge');

    if (durationSlider) {
      durationSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        state.storyboardState.targetDuration = val;
        if (targetDurationVal) {
          const m = Math.floor(val / 60);
          const s = val % 60;
          targetDurationVal.textContent = val;
          const unit = targetDurationVal.nextElementSibling;
          if (unit) unit.textContent = `sec (${s > 0 ? `${m}m ${s}s` : `${m}m`})`;
        }

        // Auto-calculate suggested scene count (~10s / scene)
        const autoCount = Math.max(4, Math.min(16, Math.round(val / 10)));
        state.storyboardState.sceneCount = autoCount;
        if (inputSceneCount) inputSceneCount.value = autoCount;
        if (sceneCountBadge) sceneCountBadge.textContent = `${autoCount} scenes`;

        updateLivePacingDisplay();
      });
    }

    // 2. Scene Count Stepper & Input
    const btnSceneCountDec = document.getElementById('btn-scene-count-dec');
    const btnSceneCountInc = document.getElementById('btn-scene-count-inc');

    if (btnSceneCountDec) {
      btnSceneCountDec.addEventListener('click', () => {
        let cur = parseInt(state.storyboardState.sceneCount || 8, 10);
        if (cur > 4) {
          cur -= 1;
          state.storyboardState.sceneCount = cur;
          if (inputSceneCount) inputSceneCount.value = cur;
          if (sceneCountBadge) sceneCountBadge.textContent = `${cur} scenes`;
        }
      });
    }

    if (btnSceneCountInc) {
      btnSceneCountInc.addEventListener('click', () => {
        let cur = parseInt(state.storyboardState.sceneCount || 8, 10);
        if (cur < 16) {
          cur += 1;
          state.storyboardState.sceneCount = cur;
          if (inputSceneCount) inputSceneCount.value = cur;
          if (sceneCountBadge) sceneCountBadge.textContent = `${cur} scenes`;
        }
      });
    }

    if (inputSceneCount) {
      inputSceneCount.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 4) val = 4;
        if (val > 16) val = 16;
        state.storyboardState.sceneCount = val;
        e.target.value = val;
        if (sceneCountBadge) sceneCountBadge.textContent = `${val} scenes`;
      });
    }

    // 3. Narrative Arc Selector Chips
    document.querySelectorAll('.arc-card-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const arcId = chip.getAttribute('data-arc-id');
        state.storyboardState.narrativeArc = arcId;
        document.querySelectorAll('.arc-card-chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        renderApp();
      });
    });

    // 4. Themes Multi-Select Chips
    document.querySelectorAll('.theme-multi-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const label = chip.getAttribute('data-theme-label');
        let selected = state.storyboardState.selectedThemes || [];
        if (selected.includes(label)) {
          selected = selected.filter(l => l !== label);
        } else {
          selected = [...selected, label];
        }
        state.storyboardState.selectedThemes = selected;
        renderApp();
      });
    });

    const btnSelectAllThemes = document.getElementById('btn-select-all-themes');
    if (btnSelectAllThemes && state.campaignData) {
      btnSelectAllThemes.addEventListener('click', () => {
        state.storyboardState.selectedThemes = (state.campaignData.themes || []).map(t => t.label);
        renderApp();
      });
    }

    const btnDeselectAllThemes = document.getElementById('btn-deselect-all-themes');
    if (btnDeselectAllThemes) {
      btnDeselectAllThemes.addEventListener('click', () => {
        state.storyboardState.selectedThemes = [];
        renderApp();
      });
    }

    // 5. Generate Full Storyboard Actions
    const handleGenerateStoryboard = () => {
      const result = generateVideoStoryboard(state.campaignData, state.storyboardState);
      state.storyboardState.scenes = result.scenes;
      state.storyboardState.isGenerated = true;
      renderApp();
      showToast(`Generated ${result.scenes.length}-scene pitch video storyboard!`, 'success');

      // Scroll smoothly to the first scene card
      const firstCard = document.querySelector('.storyboard-scene-card');
      if (firstCard) {
        firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const btnGenerateFull = document.getElementById('btn-generate-full-storyboard');
    const btnGenerateCta = document.getElementById('btn-generate-storyboard-cta');
    if (btnGenerateFull) btnGenerateFull.addEventListener('click', handleGenerateStoryboard);
    if (btnGenerateCta) btnGenerateCta.addEventListener('click', handleGenerateStoryboard);

    // 6. Scene Field Live Editing
    document.querySelectorAll('.storyboard-scene-card input, .storyboard-scene-card textarea, .storyboard-scene-card select').forEach(input => {
      const field = input.getAttribute('data-scene-field');
      const sceneId = input.getAttribute('data-scene-id');
      if (!field || !sceneId) return;

      const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
      if (!scene) return;

      if (field === 'duration') {
        input.addEventListener('input', (e) => {
          let val = parseInt(e.target.value, 10);
          if (isNaN(val) || val < 1) val = 1;
          scene.duration = val;
          updateLivePacingDisplay();
        });
      } else {
        input.addEventListener('input', (e) => {
          scene[field] = e.target.value;
        });
        input.addEventListener('change', (e) => {
          scene[field] = e.target.value;
        });
      }
    });

    // 7. Scene Reorder (Up / Down)
    document.querySelectorAll('.btn-move-scene-up').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scenes = state.storyboardState.scenes;
        const idx = scenes.findIndex(s => s.id === sceneId);
        if (idx > 0) {
          const temp = scenes[idx];
          scenes[idx] = scenes[idx - 1];
          scenes[idx - 1] = temp;
          reindexScenes(scenes);
          renderApp();
          showToast('Scene moved up', 'info');
        }
      });
    });

    document.querySelectorAll('.btn-move-scene-down').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scenes = state.storyboardState.scenes;
        const idx = scenes.findIndex(s => s.id === sceneId);
        if (idx >= 0 && idx < scenes.length - 1) {
          const temp = scenes[idx];
          scenes[idx] = scenes[idx + 1];
          scenes[idx + 1] = temp;
          reindexScenes(scenes);
          renderApp();
          showToast('Scene moved down', 'info');
        }
      });
    });

    // 8. Delete Scene
    document.querySelectorAll('.btn-delete-scene').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scenes = state.storyboardState.scenes.filter(s => s.id !== sceneId);
        reindexScenes(scenes);
        state.storyboardState.scenes = scenes;
        renderApp();
        showToast('Scene deleted', 'info');
      });
    });

    // 9. Regenerate Single Scene
    document.querySelectorAll('.btn-regen-single-scene').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scenes = state.storyboardState.scenes;
        const idx = scenes.findIndex(s => s.id === sceneId);
        if (idx !== -1) {
          const orig = scenes[idx];
          const regenerated = regenerateSingleScenePrompt(
            orig,
            state.campaignData,
            state.storyboardState.narrativeArc,
            idx,
            scenes.length,
            state.storyboardState.selectedThemes
          );
          scenes[idx] = regenerated;
          renderApp();
          showToast(`Regenerated Scene #${orig.sceneNumber}`, 'success');
        }
      });
    });

    // 10. Copy Single Scene Prompt
    document.querySelectorAll('.btn-copy-scene-prompt').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scene = state.storyboardState.scenes.find(s => s.id === sceneId);
        if (scene && scene.visualPrompt) {
          copyToClipboard(scene.visualPrompt, `Scene #${scene.sceneNumber} prompt copied!`, btn);
        }
      });
    });

    // 11. Save Single Scene to Deck
    document.querySelectorAll('.btn-save-single-scene').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scene = state.storyboardState.scenes.find(s => s.id === sceneId);
        if (!scene || !state.campaignData) return;

        const savedSceneItem = {
          id: `saved-scene-${Date.now()}`,
          type: 'video-scene',
          campaignName: state.campaignData.campaign_name,
          themeLabel: scene.theme || 'Strand',
          sceneNumber: scene.sceneNumber,
          role: scene.role,
          duration: scene.duration,
          transition: scene.transition,
          motionStyle: scene.motionStyle,
          setting: scene.setting,
          voiceover: scene.voiceover,
          promptText: scene.visualPrompt,
          timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        state.savedPrompts.unshift(savedSceneItem);
        persistSavedPrompts(state.savedPrompts);
        renderApp();
        showToast(`Scene #${scene.sceneNumber} saved to pitch deck!`, 'success');
      });
    });

    // 12. Add Blank Scene Manually
    const handleAddScene = () => {
      const scenes = state.storyboardState.scenes || [];
      const newNum = scenes.length + 1;
      const themesPool = state.campaignData?.themes || [];
      const defaultTheme = themesPool[0]?.label || "Community";

      const newScene = {
        id: `scene-${Date.now()}-${newNum}`,
        sceneNumber: newNum,
        role: `Scene ${newNum} — Custom Narrative Moment`,
        theme: defaultTheme,
        setting: state.campaignData?.settings?.[0] || "Community workspace",
        subject: "Community members in active collaboration",
        duration: 10,
        transition: "cross-dissolve",
        motionStyle: "slow-push-in",
        lighting: "Natural daylight",
        visualPrompt: `Cinematic documentary video clip (1080p, 24fps). Slow deliberate push-in camera movement tracking towards the subject. Subject: Local community members actively collaborating with authentic agency. Location: On-the-ground setting with realistic natural depth. Lighting: Natural daylight, candid expression, dignified representation. Continuous natural motion dynamics. --ar 16:9`,
        voiceover: `"Every voice and contribution builds towards lasting community sovereignty."`
      };

      scenes.push(newScene);
      reindexScenes(scenes);
      state.storyboardState.scenes = scenes;
      renderApp();
      showToast('Added new scene to timeline', 'success');

      // Scroll to newly added card
      setTimeout(() => {
        const allCards = document.querySelectorAll('.storyboard-scene-card');
        const last = allCards[allCards.length - 1];
        if (last) last.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    };

    const btnAddSceneManual = document.getElementById('btn-add-scene-manual');
    const btnAddSceneBottom = document.getElementById('btn-add-scene-bottom');
    if (btnAddSceneManual) btnAddSceneManual.addEventListener('click', handleAddScene);
    if (btnAddSceneBottom) btnAddSceneBottom.addEventListener('click', handleAddScene);

    // 13. Copy Full Storyboard Text
    const btnCopyFullStoryboard = document.getElementById('btn-copy-full-storyboard');
    if (btnCopyFullStoryboard && state.campaignData) {
      btnCopyFullStoryboard.addEventListener('click', () => {
        const fullText = exportStoryboardAsText(state.storyboardState, state.campaignData);
        copyToClipboard(fullText, 'Full pitch storyboard copied to clipboard!', btnCopyFullStoryboard);
      });
    }

    // 14. Save Entire Storyboard to Pitch Deck Drawer
    const btnSaveStoryboardToDeck = document.getElementById('btn-save-storyboard-to-deck');
    if (btnSaveStoryboardToDeck && state.campaignData) {
      btnSaveStoryboardToDeck.addEventListener('click', () => {
        const scenes = state.storyboardState.scenes;
        if (!scenes || scenes.length === 0) return;

        const totalRuntime = scenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
        const arcObj = NARRATIVE_ARCS.find(a => a.id === state.storyboardState.narrativeArc);
        const fullText = exportStoryboardAsText(state.storyboardState, state.campaignData);

        const newSavedStoryboard = {
          id: `storyboard-${Date.now()}`,
          type: 'video-storyboard',
          campaignName: state.campaignData.campaign_name,
          arcTitle: arcObj?.label || 'Problem → Solution → Impact',
          narrativeArc: state.storyboardState.narrativeArc,
          targetDuration: state.storyboardState.targetDuration,
          totalDuration: totalRuntime,
          sceneCount: scenes.length,
          scenes: JSON.parse(JSON.stringify(scenes)),
          summaryText: `${scenes.length} Scenes (${totalRuntime}s total) | ${arcObj?.label || 'Pitch Arc'}`,
          promptText: fullText,
          timeAdded: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        state.savedPrompts.unshift(newSavedStoryboard);
        persistSavedPrompts(state.savedPrompts);
        renderApp();
        showToast(`Full Video Storyboard saved to Pitch Deck (${state.savedPrompts.length} total)`, 'success');
      });
    }
  }

  // =========================================================================
  // SAVED PROMPTS DRAWER ACTIONS (Common across both modes)
  // =========================================================================
  document.querySelectorAll('.btn-copy-card-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-prompt-id');
      const item = state.savedPrompts.find(p => p.id === pId);
      if (item) {
        copyToClipboard(item.promptText, 'Prompt copied to clipboard!', btn);
      }
    });
  });

  document.querySelectorAll('.btn-delete-card-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      const pId = btn.getAttribute('data-prompt-id');
      state.savedPrompts = state.savedPrompts.filter(p => p.id !== pId);
      persistSavedPrompts(state.savedPrompts);
      renderApp();
      showToast('Item removed from pitch deck', 'info');
    });
  });

  const btnCopyAllSaved = document.getElementById('btn-copy-all-saved');
  if (btnCopyAllSaved) {
    btnCopyAllSaved.addEventListener('click', () => {
      const md = exportDeckPromptsMarkdown(state.savedPrompts);
      copyToClipboard(md, 'All pitch deck prompts copied as Markdown!', btnCopyAllSaved);
    });
  }

  const btnExportMarkdown = document.getElementById('btn-export-markdown');
  if (btnExportMarkdown) {
    btnExportMarkdown.addEventListener('click', () => {
      const md = exportDeckPromptsMarkdown(state.savedPrompts);
      const filename = `Pitch_Deck_Documentary_Prompts_${new Date().toISOString().slice(0,10)}.md`;
      downloadFile(md, filename, 'text/markdown');
      showToast('Downloaded pitch deck .md sheet', 'success');
    });
  }

  const btnClearDeck = document.getElementById('btn-clear-saved-deck');
  if (btnClearDeck) {
    btnClearDeck.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all items from your pitch deck?')) {
        state.savedPrompts = [];
        persistSavedPrompts([]);
        renderApp();
        showToast('Pitch deck cleared', 'info');
      }
    });
  }
}

/**
 * Re-indexes scene numbers and ensures transition on last scene is disabled
 */
function reindexScenes(scenes) {
  scenes.forEach((s, idx) => {
    s.sceneNumber = idx + 1;
    if (idx === scenes.length - 1) {
      s.transition = 'none';
    } else if (!s.transition || s.transition === 'none') {
      s.transition = 'cross-dissolve';
    }
  });
}

/**
 * Updates live pacing display toolbar in real time without tearing down DOM
 */
function updateLivePacingDisplay() {
  const scenes = state.storyboardState.scenes || [];
  const target = state.storyboardState.targetDuration || 90;
  const currentTotal = scenes.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);
  const delta = currentTotal - target;

  const runtimeDisplay = document.getElementById('live-runtime-display');
  const pacingPill = document.getElementById('live-pacing-pill');
  const pacingFill = document.querySelector('.pacing-bar-fill');

  if (runtimeDisplay) runtimeDisplay.textContent = `${currentTotal}s`;

  if (pacingPill && pacingFill) {
    let pacingClass = 'pacing-on-track';
    let pacingLabel = `✓ On Track (${currentTotal}s)`;

    if (Math.abs(delta) <= 3) {
      pacingClass = 'pacing-on-track';
      pacingLabel = `✓ On Track (${currentTotal}s)`;
    } else if (delta > 3) {
      pacingClass = 'pacing-over';
      pacingLabel = `▲ Over Target (+${delta}s)`;
    } else {
      pacingClass = 'pacing-under';
      pacingLabel = `▼ Under Target (${delta}s)`;
    }

    pacingPill.className = `pacing-status-pill ${pacingClass}`;
    pacingPill.textContent = pacingLabel;

    pacingFill.className = `pacing-bar-fill ${pacingClass}`;
    const percent = Math.min(100, Math.round((currentTotal / target) * 100));
    pacingFill.style.width = `${percent}%`;
  }
}

/**
 * Calculates current live still prompt string
 */
function getLivePromptText() {
  if (!state.campaignData) return '';
  const currentTheme = state.campaignData.themes[state.builderState.selectedThemeIndex] || { label: "General", description: "" };
  const subjectExamples = state.campaignData.subject_examples || [];
  const suggestedSubject = subjectExamples[state.builderState.selectedThemeIndex % subjectExamples.length] || subjectExamples[0] || "";

  return composeDocumentaryPrompt({
    campaignName: state.campaignData.campaign_name,
    theme: currentTheme,
    setting: state.builderState.isCustomSetting ? state.builderState.customSetting : (state.builderState.setting || state.campaignData.settings[0] || ""),
    subject: state.builderState.subject || suggestedSubject,
    moodKeywords: state.builderState.selectedMoods,
    lighting: state.builderState.lighting,
    composition: state.builderState.composition,
    cameraStyle: state.builderState.cameraStyle,
    ethicalLock: state.builderState.ethicalLock,
    aspectRatio: state.builderState.aspectRatio,
    includeNegative: state.builderState.includeNegative
  });
}

/**
 * Real-time reactive update of live prompt text without whole-page DOM tear down
 */
function updateLivePromptPreview() {
  const textarea = document.getElementById('live-prompt-textarea');
  if (textarea) {
    textarea.value = getLivePromptText();
  }
}

/**
 * Handles uploaded file reading, parsing, and LLM extraction
 */
async function handleFileProcessing(file) {
  state.isParsing = true;
  state.parseError = null;
  state.parseProgress = { stage: 'Reading document file...', percent: 15 };
  renderApp();

  try {
    const parseResult = await parseDocument(file, (stage, percent) => {
      state.parseProgress = { stage, percent: Math.round(percent * 0.5) };
      renderApp();
    });

    state.parseProgress = { stage: 'Extracting campaign themes and settings...', percent: 65 };
    renderApp();

    const campaignData = await extractCampaignData(parseResult.text);

    state.parseProgress = { stage: 'Configuring prompt & storyboard studio...', percent: 100 };
    renderApp();

    setTimeout(() => {
      initBuilderFromCampaign(campaignData);
      renderApp();
      showToast(`Extracted: ${campaignData.campaign_name}`, 'success');
    }, 400);

  } catch (err) {
    console.error('File parsing failed:', err);
    state.isParsing = false;
    state.parseError = err.message || 'Failed to parse brochure document.';
    renderApp();
    showToast(state.parseError, 'error', 5000);
  }
}

/**
 * Handles 1-click sample brochure selection
 */
async function handleSampleProcessing(sample, targetMode = null) {
  state.isParsing = true;
  state.parseError = null;
  state.parseProgress = { stage: `Loading sample: ${sample.title}...`, percent: 30 };
  renderApp();

  try {
    setTimeout(async () => {
      state.parseProgress = { stage: 'Analyzing curatorial strands & documentary tone...', percent: 75 };
      renderApp();

      const campaignData = await extractCampaignData(sample.rawText);

      setTimeout(() => {
        initBuilderFromCampaign(campaignData);
        if (targetMode) state.activeMode = targetMode;
        renderApp();
        showToast(`Loaded ${sample.title}`, 'success');
      }, 350);
    }, 300);
  } catch (err) {
    state.isParsing = false;
    state.parseError = err.message;
    renderApp();
  }
}

/**
 * Handles raw text direct extraction
 */
async function handleRawTextExtraction(text) {
  state.isParsing = true;
  state.parseError = null;
  state.parseProgress = { stage: 'Analyzing pasted text...', percent: 50 };
  renderApp();

  try {
    const campaignData = await extractCampaignData(text);
    initBuilderFromCampaign(campaignData);
    renderApp();
    showToast(`Extracted: ${campaignData.campaign_name}`, 'success');
  } catch (err) {
    state.isParsing = false;
    state.parseError = err.message;
    renderApp();
  }
}

/**
 * Clipboard Copy Helper
 */
function copyToClipboard(text, successMsg, targetBtn = null) {
  const triggerSuccess = () => {
    showToast(successMsg, 'success');
    if (targetBtn) {
      const origHtml = targetBtn.innerHTML;
      targetBtn.classList.add('btn-copy-success');
      targetBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>Copied!</span>`;
      setTimeout(() => {
        targetBtn.classList.remove('btn-copy-success');
        targetBtn.innerHTML = origHtml;
      }, 2000);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(triggerSuccess).catch(() => fallbackCopy(text, successMsg, targetBtn));
  } else {
    fallbackCopy(text, successMsg, targetBtn);
  }
}

function fallbackCopy(text, successMsg, targetBtn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast(successMsg, 'success');
  } catch {
    showToast('Failed to copy', 'error');
  }
  document.body.removeChild(ta);
}

/**
 * Download file helper
 */
function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

// Boot application
document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
