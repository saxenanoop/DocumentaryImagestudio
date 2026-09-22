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
  rebalanceSceneDurations,
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
  isBriefExpanded: false,
  isDrawerOpen: false,
  isManualModalOpen: false,
  savedPrompts: loadSavedPrompts(),
  builderState: {
    activeStep: 1,
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
    includeNegative: true,
    isPromptSheetExpanded: false
  },
  storyboardState: {
    targetDuration: 90,
    sceneCount: 9,
    narrativeArc: 'problem-solution-impact',
    selectedThemes: [],
    targetModel: 'qwen',
    aspectRatio: '16:9',
    selectedSceneId: null,
    isAdvancedOpen: false,
    scenes: [],
    isGenerated: false
  }
};

/**
 * Initializes builder & storyboard states when a new campaign is parsed
 */
function initBuilderFromCampaign(data, targetMode = null) {
  const themes = data.themes || [];
  const settings = data.settings || [];
  const toneKeywords = data.tone_keywords || [];
  const subjectExamples = data.subject_examples || [];

  state.campaignData = data;
  state.isParsing = false;
  state.parseError = null;
  state.isContextCollapsed = false;
  state.isBriefExpanded = false;

  if (targetMode) {
    state.activeMode = targetMode;
  }

  state.builderState = {
    activeStep: 1,
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
    includeNegative: true,
    isPromptSheetExpanded: false
  };

  state.storyboardState = {
    targetDuration: 90,
    sceneCount: 9,
    narrativeArc: 'problem-solution-impact',
    selectedThemes: themes.map(t => t.label),
    targetModel: 'qwen',
    aspectRatio: '16:9',
    selectedSceneId: null,
    isAdvancedOpen: false,
    scenes: [],
    isGenerated: false
  };

  // If active mode is video-storyboard, generate scenes immediately so user sees full controls
  if (state.activeMode === 'video-storyboard') {
    const gen = generateVideoStoryboard(data, state.storyboardState);
    state.storyboardState.scenes = gen.scenes;
    state.storyboardState.isGenerated = true;
    state.storyboardState.selectedSceneId = gen.scenes[0]?.id || null;
  }
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
    tabModeImage.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.activeMode !== 'image-prompts') {
        state.activeMode = 'image-prompts';
        if (window.location.hash !== '#image-prompts') {
          history.replaceState(null, '', '#image-prompts');
        }
        renderApp();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  if (tabModeVideo) {
    tabModeVideo.addEventListener('click', (e) => {
      e.preventDefault();
      if (state.activeMode !== 'video-storyboard') {
        state.activeMode = 'video-storyboard';
        if (window.location.hash !== '#video-storyboard') {
          history.replaceState(null, '', '#video-storyboard');
        }
        // Auto-generate scenes if campaign data is loaded but scenes not yet built
        if (state.campaignData && (!state.storyboardState.scenes || state.storyboardState.scenes.length === 0)) {
          const gen = generateVideoStoryboard(state.campaignData, state.storyboardState);
          state.storyboardState.scenes = gen.scenes;
          state.storyboardState.isGenerated = true;
          state.storyboardState.selectedSceneId = gen.scenes[0]?.id || null;
        }
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
  const btnHeaderUploadNewMobile = document.getElementById('btn-header-upload-new-mobile');
  const btnUploadDifferent = document.getElementById('btn-upload-different');
  const handleUploadNew = () => {
    state.campaignData = null;
    state.parseError = null;
    // Preserve current activeMode so user stays in video storyboard if they were there!
    renderApp();
    showToast('Ready to change campaign. Your saved deck stays!', 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  if (btnHeaderUploadNew) btnHeaderUploadNew.addEventListener('click', handleUploadNew);
  if (btnHeaderUploadNewMobile) {
    btnHeaderUploadNewMobile.addEventListener('click', () => {
      const dropdown = document.getElementById('header-overflow-dropdown');
      if (dropdown) dropdown.classList.remove('is-open');
      const btn = document.getElementById('btn-header-overflow-menu');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      handleUploadNew();
    });
  }
  if (btnUploadDifferent) btnUploadDifferent.addEventListener('click', handleUploadNew);

  // 2b. Mobile Header Overflow Menu Toggle & Outside Dismiss
  const btnHeaderOverflow = document.getElementById('btn-header-overflow-menu');
  const headerOverflowDropdown = document.getElementById('header-overflow-dropdown');
  if (btnHeaderOverflow && headerOverflowDropdown) {
    btnHeaderOverflow.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = headerOverflowDropdown.classList.toggle('is-open');
      btnHeaderOverflow.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Dismiss header overflow dropdown when clicking outside or pressing Escape
  document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('header-overflow-dropdown');
    const btn = document.getElementById('btn-header-overflow-menu');
    if (dropdown && dropdown.classList.contains('is-open')) {
      if (!dropdown.contains(e.target) && (!btn || !btn.contains(e.target))) {
        dropdown.classList.remove('is-open');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const dropdown = document.getElementById('header-overflow-dropdown');
      const btn = document.getElementById('btn-header-overflow-menu');
      if (dropdown && dropdown.classList.contains('is-open')) {
        dropdown.classList.remove('is-open');
        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      }
    }
  });

  // 3. Dropzone & File Input Handling (Main Upload Zone)
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
        handleFileProcessing(e.dataTransfer.files[0], 'image-prompts');
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileProcessing(e.target.files[0], 'image-prompts');
      }
    });
  }

  // 3b. Video Storyboard Embedded Upload Dropzone & File Input (NO REDIRECT!)
  const videoDropzone = document.getElementById('video-upload-dropzone');
  const videoFileInput = document.getElementById('video-brochure-file-input');

  if (videoDropzone && videoFileInput) {
    videoDropzone.addEventListener('click', () => videoFileInput.click());

    videoDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      videoDropzone.classList.add('is-dragover');
    });

    videoDropzone.addEventListener('dragleave', () => {
      videoDropzone.classList.remove('is-dragover');
    });

    videoDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      videoDropzone.classList.remove('is-dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileProcessing(e.dataTransfer.files[0], 'video-storyboard');
      }
    });

    videoFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileProcessing(e.target.files[0], 'video-storyboard');
      }
    });
  }

  // 4. Sample Brochure Triggers
  document.querySelectorAll('.sample-card:not(.sample-card-video-trigger)').forEach(card => {
    card.addEventListener('click', () => {
      const sampleId = card.getAttribute('data-sample-id');
      const sample = SAMPLE_BROCHURES.find(s => s.id === sampleId);
      if (sample) {
        handleSampleProcessing(sample, 'image-prompts');
      }
    });
  });

  document.querySelectorAll('.sample-card-video-trigger').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const sampleId = card.getAttribute('data-sample-id');
      const sample = SAMPLE_BROCHURES.find(s => s.id === sampleId);
      if (sample) {
        handleSampleProcessing(sample, 'video-storyboard');
      }
    });
  });

  // Storyboard Empty State Quick Triggers (Pills)
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
    const inputPaste = document.getElementById('manual-paste-text');
    const inputName = document.getElementById('manual-campaign-name');
    const inputSummary = document.getElementById('manual-summary');
    const inputThemes = document.getElementById('manual-themes-raw');
    const inputSettings = document.getElementById('manual-settings-raw');

    const setFieldError = (inputEl, errId, msg) => {
      if (inputEl) inputEl.classList.add('is-invalid');
      const errEl = document.getElementById(errId);
      if (errEl) {
        errEl.textContent = msg;
        errEl.style.display = 'block';
      }
    };

    const clearFieldError = (inputEl, errId) => {
      if (inputEl) inputEl.classList.remove('is-invalid');
      const errEl = document.getElementById(errId);
      if (errEl) {
        errEl.textContent = '';
        errEl.style.display = 'none';
      }
    };

    if (inputPaste) inputPaste.addEventListener('input', () => clearFieldError(inputPaste, 'err-manual-paste-text'));
    if (inputName) inputName.addEventListener('input', () => clearFieldError(inputName, 'err-manual-campaign-name'));
    if (inputSummary) inputSummary.addEventListener('input', () => clearFieldError(inputSummary, 'err-manual-summary'));
    if (inputThemes) inputThemes.addEventListener('input', () => clearFieldError(inputThemes, 'err-manual-themes-raw'));
    if (inputSettings) inputSettings.addEventListener('input', () => clearFieldError(inputSettings, 'err-manual-settings-raw'));

    manualForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFieldError(inputPaste, 'err-manual-paste-text');
      clearFieldError(inputName, 'err-manual-campaign-name');
      clearFieldError(inputSummary, 'err-manual-summary');
      clearFieldError(inputThemes, 'err-manual-themes-raw');
      clearFieldError(inputSettings, 'err-manual-settings-raw');

      const pastedText = inputPaste?.value?.trim() || '';
      const customName = inputName?.value?.trim() || '';
      const customSummary = inputSummary?.value?.trim() || '';
      const rawThemes = inputThemes?.value?.trim() || '';
      const rawSettings = inputSettings?.value?.trim() || '';

      if (pastedText.length >= 25) {
        state.isManualModalOpen = false;
        handleRawTextExtraction(pastedText);
        return;
      }

      // If user provided short text and no direct entry fields
      if (pastedText.length > 0 && !customName && !customSummary && !rawThemes && !rawSettings) {
        setFieldError(inputPaste, 'err-manual-paste-text', 'Pasted text must be at least 25 characters, or fill in the required fields below.');
        inputPaste?.focus();
        return;
      }

      // Validate required direct entry fields
      let hasError = false;
      let firstInvalid = null;

      if (!customName) {
        setFieldError(inputName, 'err-manual-campaign-name', 'Campaign name is required.');
        hasError = true;
        if (!firstInvalid) firstInvalid = inputName;
      }

      if (!customSummary) {
        setFieldError(inputSummary, 'err-manual-summary', 'One-line summary is required.');
        hasError = true;
        if (!firstInvalid) firstInvalid = inputSummary;
      }

      if (!rawThemes) {
        setFieldError(inputThemes, 'err-manual-themes-raw', 'At least one key theme is required.');
        hasError = true;
        if (!firstInvalid) firstInvalid = inputThemes;
      }

      if (!rawSettings) {
        setFieldError(inputSettings, 'err-manual-settings-raw', 'At least one key setting is required.');
        hasError = true;
        if (!firstInvalid) firstInvalid = inputSettings;
      }

      if (hasError) {
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Valid: build campaign data
      const themeList = rawThemes.split(',').map(t => ({ label: t.trim(), description: `Documentary focus on ${t.trim()}` })).filter(t => t.label);
      const settingList = rawSettings.split(',').map(s => s.trim()).filter(Boolean);

      const manualData = {
        campaign_name: customName,
        one_line_summary: customSummary,
        themes: themeList.length > 0 ? themeList : [{ label: customName, description: 'Documentary focus' }],
        settings: settingList.length > 0 ? settingList : ['Documentary field location'],
        tone_keywords: ["Dignified", "Authentic", "Communitarian", "Hopeful"],
        subject_examples: ["Community member actively participating in local endeavor"]
      };

      state.isManualModalOpen = false;
      initBuilderFromCampaign(manualData);
      renderApp();
      showToast('Manual campaign initialized', 'success');
    });
  }

  // 6. Campaign Brief Sticky Bar Toggle
  const btnToggleContextCard = document.getElementById('btn-toggle-context-card');
  if (btnToggleContextCard) {
    btnToggleContextCard.addEventListener('click', () => {
      state.isBriefExpanded = !state.isBriefExpanded;
      renderApp();
    });
  }

  // =========================================================================
  // IMAGE PROMPT BUILDER EVENT LISTENERS
  // =========================================================================
  if (state.activeMode === 'image-prompts') {
    // Stepper Navigation: Step Header Click
    document.querySelectorAll('.studio-step-header').forEach(header => {
      header.addEventListener('click', (e) => {
        if (e.target.closest('.btn-step-edit')) return;
        const step = parseInt(header.getAttribute('data-step'), 10);
        if (step && state.builderState.activeStep !== step) {
          state.builderState.activeStep = step;
          renderApp();
        }
      });
    });

    // Stepper Navigation: Step Edit Button Click
    document.querySelectorAll('.btn-step-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const step = parseInt(btn.getAttribute('data-step-target'), 10);
        if (step) {
          state.builderState.activeStep = step;
          renderApp();
        }
      });
    });

    // Stepper Navigation: Continue / Next Button Click
    document.querySelectorAll('.btn-step-continue').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nextStep = parseInt(btn.getAttribute('data-next-step'), 10);
        if (nextStep) {
          state.builderState.activeStep = nextStep;
          renderApp();
          const targetCard = document.getElementById(`step-card-${nextStep}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    });

    // Stepper Navigation: Back Button Click
    document.querySelectorAll('.btn-step-back').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const prevStep = parseInt(btn.getAttribute('data-prev-step'), 10);
        if (prevStep) {
          state.builderState.activeStep = prevStep;
          renderApp();
          const targetCard = document.getElementById(`step-card-${prevStep}`);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    });

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
        updateDeckHeaderBadge(state.savedPrompts.length);
        flashButtonSuccess(btnSaveToDeck, 'Saved to Deck!');
        showToast(`Saved still prompt to Deck (${state.savedPrompts.length} total)`, 'success');
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

    const btnExportDeckDirect = document.getElementById('btn-export-deck-direct');
    if (btnExportDeckDirect && state.campaignData) {
      btnExportDeckDirect.addEventListener('click', () => {
        if (!state.savedPrompts || state.savedPrompts.length === 0) {
          const currentTheme = state.campaignData.themes[state.builderState.selectedThemeIndex] || { label: "General" };
          const currentSetting = state.builderState.isCustomSetting 
            ? state.builderState.customSetting 
            : (state.builderState.setting || state.campaignData.settings[0] || "");
          const promptText = document.getElementById('live-prompt-textarea')?.value || getLivePromptText();

          state.savedPrompts.unshift({
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
          });
          persistSavedPrompts(state.savedPrompts);
        }
        const md = exportDeckPromptsMarkdown(state.savedPrompts);
        const filename = `Documentary_Deck_Prompts_${new Date().toISOString().slice(0, 10)}.md`;
        downloadFile(md, filename, 'text/markdown');
        showToast('Exported Deck to .md sheet', 'success');
        renderApp();
      });
    }

    // Mobile Live Prompt Bottom Sheet Toggle
    const btnToggleMobileSheet = document.getElementById('btn-toggle-mobile-sheet');
    if (btnToggleMobileSheet) {
      btnToggleMobileSheet.addEventListener('click', (e) => {
        e.preventDefault();
        state.builderState.isPromptSheetExpanded = !state.builderState.isPromptSheetExpanded;
        const pane = document.querySelector('.studio-right-pane');
        if (pane) {
          pane.classList.toggle('is-sheet-expanded', state.builderState.isPromptSheetExpanded);
          pane.classList.toggle('is-sheet-collapsed', !state.builderState.isPromptSheetExpanded);
          const toggleText = btnToggleMobileSheet.querySelector('.sheet-toggle-text');
          if (toggleText) {
            toggleText.textContent = state.builderState.isPromptSheetExpanded ? 'Hide' : 'View Full Prompt';
          }
          btnToggleMobileSheet.setAttribute('aria-expanded', state.builderState.isPromptSheetExpanded ? 'true' : 'false');
          const chevron = btnToggleMobileSheet.querySelector('.sheet-chevron');
          if (chevron) {
            chevron.classList.toggle('is-rotated', state.builderState.isPromptSheetExpanded);
          }
        }
      });
    }
  }

  // =========================================================================
  // VIDEO STORYBOARD BUILDER EVENT LISTENERS (PHASE 2: TIMELINE & SINGLE SCENE)
  // =========================================================================
  if (state.activeMode === 'video-storyboard' && state.campaignData) {
    // 1. Sticky Director Bar: Target Duration Select
    const selectTargetDuration = document.getElementById('select-target-duration');
    if (selectTargetDuration) {
      selectTargetDuration.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        state.storyboardState.targetDuration = val;
        // Auto-calculate suggested scene count (~10s / scene)
        const autoCount = Math.max(4, Math.min(16, Math.round(val / 10)));
        state.storyboardState.sceneCount = autoCount;
        renderApp();
      });
    }

    // 2. Sticky Director Bar: Scene Count Stepper & Input
    const btnSceneCountDec = document.getElementById('btn-scene-count-dec');
    const btnSceneCountInc = document.getElementById('btn-scene-count-inc');
    const inputSceneCount = document.getElementById('input-scene-count');

    if (btnSceneCountDec) {
      btnSceneCountDec.addEventListener('click', () => {
        let cur = parseInt(state.storyboardState.sceneCount || 8, 10);
        if (cur > 4) {
          cur -= 1;
          state.storyboardState.sceneCount = cur;
          if (inputSceneCount) inputSceneCount.value = cur;
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
      });
    }

    // 3. Sticky Director Bar: Video AI Model Selector Pills
    document.querySelectorAll('#video-model-selector .director-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const modelId = btn.getAttribute('data-model-id');
        state.storyboardState.targetModel = modelId;
        (state.storyboardState.scenes || []).forEach(scene => {
          scene.targetModel = modelId;
          scene.visualPrompt = regenerateSingleScenePrompt(scene, state.campaignData);
        });
        renderApp();
        showToast(`Optimized prompt syntax for ${modelId.toUpperCase()}`, 'info');
      });
    });

    // 4. Sticky Director Bar: Video Aspect Ratio Switcher
    document.querySelectorAll('#video-ratio-segmented .ratio-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const ratio = btn.getAttribute('data-ratio');
        state.storyboardState.aspectRatio = ratio;
        (state.storyboardState.scenes || []).forEach(scene => {
          scene.aspectRatio = ratio;
          scene.visualPrompt = regenerateSingleScenePrompt(scene, state.campaignData);
        });
        renderApp();
        showToast(`Set video aspect ratio to ${ratio}`, 'info');
      });
    });

    // 5. Sticky Director Bar: Narrative Arc Dropdown
    const selectNarrativeArc = document.getElementById('select-narrative-arc');
    if (selectNarrativeArc) {
      selectNarrativeArc.addEventListener('change', (e) => {
        state.storyboardState.narrativeArc = e.target.value;
        showToast('Updated narrative arc', 'info');
      });
    }

    // 6. Generate Full Storyboard Actions (Sticky Bar & Empty State CTA)
    const handleGenerateStoryboard = () => {
      if (state.storyboardState.scenes && state.storyboardState.scenes.length > 0) {
        const confirmed = window.confirm('Regenerate entire storyboard? This will replace all scene prompts and any manual edits you have made.');
        if (!confirmed) return;
      }
      const result = generateVideoStoryboard(state.campaignData, state.storyboardState);
      state.storyboardState.scenes = result.scenes;
      state.storyboardState.isGenerated = true;
      state.storyboardState.selectedSceneId = result.scenes[0]?.id || null;
      renderApp();
      showToast(`Generated ${result.scenes.length}-scene pitch video storyboard!`, 'success');

      // Scroll smoothly to single scene editor
      const editor = document.getElementById('selected-scene-editor-container');
      if (editor) {
        editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const btnGenerateFull = document.getElementById('btn-generate-full-storyboard');
    const btnGenerateCta = document.getElementById('btn-generate-storyboard-cta');
    if (btnGenerateFull) btnGenerateFull.addEventListener('click', handleGenerateStoryboard);
    if (btnGenerateCta) btnGenerateCta.addEventListener('click', handleGenerateStoryboard);

    // 7. Pacing Toolbar: Rebalance Durations
    const btnRebalance = document.getElementById('btn-rebalance-durations');
    if (btnRebalance) {
      btnRebalance.addEventListener('click', () => {
        const scenes = state.storyboardState.scenes || [];
        const target = state.storyboardState.targetDuration || 90;
        rebalanceSceneDurations(scenes, target);
        renderApp();
        showToast(`Rebalanced scene durations to match ${target}s target!`, 'success');
      });
    }

    // 8. Sequence Timeline Strip: Tile Selection
    document.querySelectorAll('.timeline-scene-tile').forEach(tile => {
      tile.addEventListener('click', () => {
        const sceneId = tile.getAttribute('data-scene-id');
        if (state.storyboardState.selectedSceneId !== sceneId) {
          state.storyboardState.selectedSceneId = sceneId;
          renderApp();
          const editor = document.getElementById('selected-scene-editor-container');
          if (editor) {
            editor.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
      tile.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tile.click();
        }
      });
    });

    // 9. Add Scene Actions (Strip tile & Pacing bar button)
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
        lensStyle: "35mm-prime",
        lighting: "Natural daylight",
        pacing: "realtime",
        targetModel: state.storyboardState.targetModel || 'qwen',
        aspectRatio: state.storyboardState.aspectRatio || '16:9',
        visualPrompt: `Cinematic documentary video clip (1080p, 24fps). Slow deliberate push-in camera movement tracking towards the subject. Subject: Local community members actively collaborating with authentic agency. Location: On-the-ground setting with realistic natural depth. Lighting: Natural daylight, candid expression, dignified representation. Continuous natural motion dynamics. --ar ${state.storyboardState.aspectRatio || '16:9'}`,
        voiceover: `"Every voice and contribution builds towards lasting community sovereignty."`,
        audioCue: "Ambient environmental tone, distant voices"
      };

      scenes.push(newScene);
      reindexScenes(scenes);
      state.storyboardState.scenes = scenes;
      state.storyboardState.selectedSceneId = newScene.id;
      renderApp();
      showToast('Added new clip to timeline', 'success');

      // Scroll timeline strip to right to show new tile
      setTimeout(() => {
        const strip = document.getElementById('timeline-strip-scroll');
        if (strip) strip.scrollLeft = strip.scrollWidth;
      }, 50);
    };

    const btnAddSceneManual = document.getElementById('btn-add-scene-manual');
    const btnAddSceneTile = document.getElementById('btn-add-scene-tile');
    if (btnAddSceneManual) btnAddSceneManual.addEventListener('click', handleAddScene);
    if (btnAddSceneTile) btnAddSceneTile.addEventListener('click', handleAddScene);

    // 10. Advanced Parameters Disclosure Toggle
    const btnToggleAdvanced = document.getElementById('btn-toggle-advanced-disclosure');
    if (btnToggleAdvanced) {
      btnToggleAdvanced.addEventListener('click', () => {
        state.storyboardState.isAdvancedOpen = !state.storyboardState.isAdvancedOpen;
        renderApp();
      });
    }

    // 11. Single Selected Scene Editor Controls
    // - Role Input
    document.querySelectorAll('input[data-scene-field="role"]').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const sceneId = inp.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          scene.role = e.target.value;
          const tile = document.querySelector(`.timeline-scene-tile[data-scene-id="${sceneId}"]`);
          if (tile) {
            const roleText = tile.querySelector('.tile-role-text');
            if (roleText) roleText.textContent = scene.role;
            tile.setAttribute('title', `Select Scene #${scene.sceneNumber}: ${scene.role}`);
          }
        }
      });
    });

    // - Duration Input
    document.querySelectorAll('input[data-scene-field="duration"]').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const sceneId = inp.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (!scene) return;
        let val = parseInt(e.target.value, 10);
        if (isNaN(val) || val < 1) val = 1;
        scene.duration = val;
        updateLivePacingDisplay();
        const tile = document.querySelector(`.timeline-scene-tile[data-scene-id="${sceneId}"]`);
        if (tile) {
          const durationTag = tile.querySelector('.tile-duration');
          if (durationTag) durationTag.textContent = `${scene.duration}s`;
        }
        const card = inp.closest('.single-scene-editor-card');
        const footerMeta = card ? card.querySelector('.footer-meta') : null;
        if (footerMeta) {
          footerMeta.textContent = `Clip #${scene.sceneNumber} • ${scene.duration}s • ${cleanMotionLabel(scene.motionStyle)} • ${scene.aspectRatio || '16:9'}`;
        }
      });
    });

    // - Reorder (Earlier / Later)
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
          state.storyboardState.selectedSceneId = sceneId;
          renderApp();
          showToast('Scene moved earlier in timeline', 'info');
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
          state.storyboardState.selectedSceneId = sceneId;
          renderApp();
          showToast('Scene moved later in timeline', 'info');
        }
      });
    });

    // - Duplicate Scene
    document.querySelectorAll('.btn-duplicate-scene').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scenes = state.storyboardState.scenes;
        const idx = scenes.findIndex(s => s.id === sceneId);
        if (idx !== -1) {
          const source = scenes[idx];
          const copy = JSON.parse(JSON.stringify(source));
          copy.id = `scene-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
          copy.role = `${source.role} (Continued)`;
          scenes.splice(idx + 1, 0, copy);
          reindexScenes(scenes);
          state.storyboardState.selectedSceneId = copy.id;
          renderApp();
          showToast(`Duplicated Scene #${source.sceneNumber}`, 'success');
        }
      });
    });

    // - Delete Scene
    document.querySelectorAll('.btn-delete-scene').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scenes = state.storyboardState.scenes;
        const idx = scenes.findIndex(s => s.id === sceneId);
        if (idx === -1) return;

        let nextSelectedId = null;
        if (scenes.length > 1) {
          if (idx > 0) {
            nextSelectedId = scenes[idx - 1].id;
          } else {
            nextSelectedId = scenes[idx + 1].id;
          }
        }

        const filtered = scenes.filter(s => s.id !== sceneId);
        reindexScenes(filtered);
        state.storyboardState.scenes = filtered;
        state.storyboardState.selectedSceneId = nextSelectedId;
        renderApp();
        showToast('Scene removed from timeline', 'info');
      });
    });

    // - Setting / Location Dropdown & Custom Input
    document.querySelectorAll('.scene-setting-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const sceneId = sel.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (!scene) return;

        const card = sel.closest('.single-scene-editor-card');
        if (e.target.value === '__custom__') {
          scene.isCustomSetting = true;
          scene.setting = scene.customSetting || 'Custom frontline location';
          let customInput = card ? card.querySelector('.scene-custom-setting-input') : null;
          if (!customInput && card) {
            const parent = sel.parentElement;
            const inp = document.createElement('input');
            inp.type = 'text';
            inp.className = 'form-input form-input-sm scene-custom-setting-input mt-1';
            inp.placeholder = 'Enter specific setting...';
            inp.value = scene.customSetting || '';
            inp.setAttribute('data-scene-id', sceneId);
            inp.addEventListener('input', (ev) => {
              scene.customSetting = ev.target.value;
              scene.setting = ev.target.value;
              updateSceneLivePrompt(sceneId);
            });
            parent.appendChild(inp);
            inp.focus();
          } else if (customInput) {
            customInput.style.display = 'block';
            customInput.focus();
          }
        } else {
          scene.isCustomSetting = false;
          scene.setting = e.target.value;
          const customInput = card ? card.querySelector('.scene-custom-setting-input') : null;
          if (customInput) customInput.style.display = 'none';
        }
        updateSceneLivePrompt(sceneId);
      });
    });

    document.querySelectorAll('.scene-custom-setting-input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const sceneId = inp.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          scene.customSetting = e.target.value;
          scene.setting = e.target.value;
          updateSceneLivePrompt(sceneId);
        }
      });
    });

    // - Curatorial Theme Dropdown
    document.querySelectorAll('.scene-theme-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const sceneId = sel.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          scene.theme = e.target.value;
          updateSceneLivePrompt(sceneId);
        }
      });
    });

    // - Subject Action Input & Suggest Action
    document.querySelectorAll('.scene-subject-textarea').forEach(ta => {
      ta.addEventListener('input', (e) => {
        const sceneId = ta.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          scene.subject = e.target.value;
          updateSceneLivePrompt(sceneId);
        }
      });
    });

    document.querySelectorAll('.btn-insert-subject-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (!scene || !state.campaignData) return;

        const examples = state.campaignData.subject_examples || [];
        const sampleActions = [
          `Local community members actively collaborating on ${scene.theme}, maintaining steady focused movements`,
          `Frontline practitioner demonstrating field equipment to attentive community members`,
          `Elder and younger coordinator reviewing local outcomes with authentic dignity and mutual respect`,
          `Community members exchanging tools and discussing next steps in natural conversational cadence`,
          `Field team recording authentic oral accounts with attentive visual presence`
        ];

        const pool = examples.length > 0 ? [...examples, ...sampleActions] : sampleActions;
        const randomAction = pool[Math.floor(Math.random() * pool.length)];

        scene.subject = randomAction;
        const card = document.querySelector(`.single-scene-editor-card[data-scene-id="${sceneId}"]`);
        if (card) {
          const textarea = card.querySelector('.scene-subject-textarea');
          if (textarea) textarea.value = randomAction;
        }
        updateSceneLivePrompt(sceneId);
        showToast('Inserted contextual human action', 'info');
      });
    });

    // - Scene Chips (motionStyle, lensStyle, lighting, pacing)
    document.querySelectorAll('[data-scene-chip-field]').forEach(chip => {
      chip.addEventListener('click', () => {
        const field = chip.getAttribute('data-scene-chip-field');
        const sceneId = chip.getAttribute('data-scene-id');
        const chipValue = chip.getAttribute('data-chip-value');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (!scene) return;

        scene[field] = chipValue;

        const group = chip.closest('.chips-group');
        if (group) {
          group.querySelectorAll('.chip').forEach(c => {
            const isCurrent = c.getAttribute('data-chip-value') === chipValue;
            c.classList.toggle('chip-selected', isCurrent);
            let cleanLabel = c.textContent.replace(/^[●✓]\s*/, '').trim();
            if (field === 'lensStyle') {
              c.textContent = isCurrent ? `✓ ${cleanLabel}` : cleanLabel;
            } else if (field === 'lighting' || field === 'motionStyle') {
              c.textContent = isCurrent ? `● ${cleanLabel}` : cleanLabel;
            } else {
              c.textContent = cleanLabel;
            }
          });
        }

        updateSceneLivePrompt(sceneId);
      });
    });

    // - Transition Select
    document.querySelectorAll('.scene-transition-select').forEach(sel => {
      sel.addEventListener('change', (e) => {
        const sceneId = sel.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          scene.transition = e.target.value;
        }
      });
    });

    // - Voiceover & Sound Design
    document.querySelectorAll('.scene-voiceover-input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const sceneId = inp.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          scene.voiceover = e.target.value;
        }
      });
    });

    document.querySelectorAll('.scene-audio-input').forEach(inp => {
      inp.addEventListener('input', (e) => {
        const sceneId = inp.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          scene.audioCue = e.target.value;
          updateSceneLivePrompt(sceneId);
        }
      });
    });

    // - Visual Prompt Direct Editable Textarea
    document.querySelectorAll('.scene-prompt-textarea').forEach(ta => {
      ta.addEventListener('input', (e) => {
        const sceneId = ta.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          scene.visualPrompt = e.target.value;
        }
      });
    });

    // - Re-compose Single Scene Prompt (with confirmation)
    document.querySelectorAll('.btn-regen-single-scene').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
        if (scene) {
          const confirmed = window.confirm(`Re-compose prompt for Scene #${scene.sceneNumber}? Any manual edits in this prompt box will be replaced.`);
          if (!confirmed) return;
          updateSceneLivePrompt(sceneId);
          showToast(`Re-composed Scene #${scene.sceneNumber} prompt`, 'success');
        }
      });
    });

    // - Copy Single Scene Prompt
    document.querySelectorAll('.btn-copy-scene-prompt').forEach(btn => {
      btn.addEventListener('click', () => {
        const sceneId = btn.getAttribute('data-scene-id');
        const scene = state.storyboardState.scenes.find(s => s.id === sceneId);
        if (scene && scene.visualPrompt) {
          copyToClipboard(scene.visualPrompt, `Scene #${scene.sceneNumber} prompt copied!`, btn);
        }
      });
    });

    // - Save Single Scene to Deck
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
        updateDeckHeaderBadge(state.savedPrompts.length);
        flashButtonSuccess(btn, 'Saved!');
        showToast(`Scene #${scene.sceneNumber} saved to Deck!`, 'success');
      });
    });

    // 12. Copy Full Storyboard Text
    const btnCopyFullStoryboard = document.getElementById('btn-copy-full-storyboard');
    if (btnCopyFullStoryboard && state.campaignData) {
      btnCopyFullStoryboard.addEventListener('click', () => {
        const fullText = exportStoryboardAsText(state.storyboardState, state.campaignData);
        copyToClipboard(fullText, 'Full pitch storyboard copied to clipboard!', btnCopyFullStoryboard);
      });
    }

    // 13. Save Entire Storyboard to Deck Drawer
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
        updateDeckHeaderBadge(state.savedPrompts.length);
        flashButtonSuccess(btnSaveStoryboardToDeck, 'Saved to Deck!');
        showToast(`Full Video Storyboard saved to Deck (${state.savedPrompts.length} total)`, 'success');
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
      showToast('Item removed from Deck', 'info');
    });
  });

  const btnCopyAllSaved = document.getElementById('btn-copy-all-saved');
  if (btnCopyAllSaved) {
    btnCopyAllSaved.addEventListener('click', () => {
      const md = exportDeckPromptsMarkdown(state.savedPrompts);
      copyToClipboard(md, 'All Deck prompts copied as Markdown!', btnCopyAllSaved);
    });
  }

  const btnExportMarkdown = document.getElementById('btn-export-markdown');
  if (btnExportMarkdown) {
    btnExportMarkdown.addEventListener('click', () => {
      const md = exportDeckPromptsMarkdown(state.savedPrompts);
      const filename = `Documentary_Deck_Prompts_${new Date().toISOString().slice(0,10)}.md`;
      downloadFile(md, filename, 'text/markdown');
      showToast('Downloaded Deck .md sheet', 'success');
    });
  }

  const btnClearDeck = document.getElementById('btn-clear-saved-deck');
  if (btnClearDeck) {
    btnClearDeck.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (window.confirm('Are you sure you want to clear all items from your Deck? This cannot be undone.')) {
        state.savedPrompts = [];
        persistSavedPrompts([]);
        renderApp();
        showToast('Deck cleared', 'info');
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

  const btnRebalance = document.getElementById('btn-rebalance-durations');
  if (btnRebalance) {
    btnRebalance.classList.toggle('is-over-target', delta > 0);
    btnRebalance.title = `Fit to ${target}s: evenly redistributes scene lengths (${delta > 0 ? '+' + delta + 's over' : delta + 's under'})`;
    btnRebalance.style.display = delta !== 0 ? 'inline-flex' : 'none';
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
 * Real-time reactive update of a single video scene prompt and UI display
 */
function updateSceneLivePrompt(sceneId) {
  const scene = (state.storyboardState.scenes || []).find(s => s.id === sceneId);
  if (!scene || !state.campaignData) return;

  // Ensure scene has current global defaults if not explicitly set
  if (!scene.targetModel) scene.targetModel = state.storyboardState.targetModel || 'qwen';
  if (!scene.aspectRatio) scene.aspectRatio = state.storyboardState.aspectRatio || '16:9';

  const newPrompt = regenerateSingleScenePrompt(scene, state.campaignData);
  scene.visualPrompt = newPrompt;

  // 1. Update single-scene editor card or storyboard-scene-card if visible
  const card = document.querySelector(`.single-scene-editor-card[data-scene-id="${sceneId}"], .storyboard-scene-card[data-scene-id="${sceneId}"]`);
  if (card) {
    const promptArea = card.querySelector('.scene-prompt-textarea');
    if (promptArea && document.activeElement !== promptArea) {
      promptArea.value = newPrompt;
    }

    const strandTag = card.querySelector('.strand-tag, .theme-tag-pill');
    if (strandTag && scene.theme) {
      strandTag.textContent = scene.theme;
    }

    const modelTag = card.querySelector('.model-tag, .qwen-pill');
    if (modelTag) {
      modelTag.textContent = (scene.targetModel || state.storyboardState.targetModel || 'Qwen').toUpperCase();
    }

    const ratioTag = card.querySelector('.ratio-tag');
    if (ratioTag) {
      ratioTag.textContent = scene.aspectRatio || '16:9';
    }

    const footerMeta = card.querySelector('.footer-meta, .scene-meta-indicator');
    if (footerMeta) {
      footerMeta.textContent = `Clip #${scene.sceneNumber} • ${scene.duration}s • ${cleanMotionLabel(scene.motionStyle)} • ${scene.aspectRatio || '16:9'}`;
    }
  }

  // 2. Update sequence timeline strip tile
  const tile = document.querySelector(`.timeline-scene-tile[data-scene-id="${sceneId}"]`);
  if (tile) {
    const motionTag = tile.querySelector('.tile-motion-tag');
    if (motionTag) motionTag.textContent = cleanMotionLabel(scene.motionStyle);

    const durationTag = tile.querySelector('.tile-duration');
    if (durationTag) durationTag.textContent = `${scene.duration || 10}s`;

    const roleText = tile.querySelector('.tile-role-text');
    if (roleText && scene.role) roleText.textContent = scene.role;
  }
}

/**
 * Real-time reactive update of live prompt text without whole-page DOM tear down
 */
function updateLivePromptPreview() {
  const textarea = document.getElementById('live-prompt-textarea');
  if (textarea) {
    textarea.value = getLivePromptText();
  }
  const ratioBadge = document.querySelector('.studio-preview-sticky .ratio-badge');
  if (ratioBadge) {
    ratioBadge.textContent = state.builderState.aspectRatio || '16:9';
  }
  const strandBadge = document.querySelector('.studio-preview-sticky .strand-badge');
  if (strandBadge && state.campaignData?.themes?.[state.builderState.selectedThemeIndex]) {
    strandBadge.textContent = state.campaignData.themes[state.builderState.selectedThemeIndex].label;
  }
}

/**
 * Handles uploaded file reading, parsing, and LLM extraction
 */
async function handleFileProcessing(file, targetMode = null) {
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
      const mode = targetMode || state.activeMode;
      initBuilderFromCampaign(campaignData, mode);
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
        const mode = targetMode || state.activeMode;
        initBuilderFromCampaign(campaignData, mode);
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
    initBuilderFromCampaign(campaignData, state.activeMode);
    renderApp();
    showToast(`Extracted: ${campaignData.campaign_name}`, 'success');
  } catch (err) {
    state.isParsing = false;
    state.parseError = err.message;
    renderApp();
  }
}

/**
 * Opens a modal with prompt text and 'Select all' if clipboard write fails
 */
function openClipboardFallbackModal(text) {
  let modalEl = document.getElementById('clipboard-fallback-modal');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'clipboard-fallback-modal';
    modalEl.className = 'modal-backdrop is-open';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-label', 'Copy Prompt Fallback');
    modalEl.setAttribute('aria-modal', 'true');
    document.body.appendChild(modalEl);
  } else {
    modalEl.classList.add('is-open');
  }

  modalEl.innerHTML = `
    <div class="modal-dialog copy-fallback-dialog" role="document">
      <div class="modal-header">
        <div class="modal-title-group">
          <h3 class="modal-title">Copy Prompt</h3>
          <p class="modal-subtitle">Clipboard access was blocked. Click Select all or copy manually.</p>
        </div>
        <button type="button" class="btn-close-modal" id="btn-close-clipboard-fallback" aria-label="Close copy modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="modal-body" style="padding: 1.25rem 0 0.5rem 0;">
        <textarea id="clipboard-fallback-textarea" class="form-textarea" rows="6" readonly style="font-family: var(--font-mono); font-size: 0.825rem; line-height: 1.5; resize: vertical; width: 100%;"></textarea>
      </div>
      <div class="modal-actions-bar" style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1rem;">
        <button type="button" class="btn btn-ghost" id="btn-dismiss-clipboard-fallback">Close</button>
        <button type="button" class="btn btn-primary" id="btn-select-all-clipboard">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Select all</span>
        </button>
      </div>
    </div>
  `;

  const textarea = modalEl.querySelector('#clipboard-fallback-textarea');
  if (textarea) {
    textarea.value = text;
  }

  const closeModal = () => {
    modalEl.classList.remove('is-open');
    modalEl.remove();
  };

  const btnClose = modalEl.querySelector('#btn-close-clipboard-fallback');
  const btnDismiss = modalEl.querySelector('#btn-dismiss-clipboard-fallback');
  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnDismiss) btnDismiss.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  const btnSelectAll = modalEl.querySelector('#btn-select-all-clipboard');
  if (btnSelectAll && textarea) {
    btnSelectAll.addEventListener('click', () => {
      textarea.focus();
      textarea.select();
      try {
        const copied = document.execCommand('copy');
        if (copied) {
          showToast('Text copied to clipboard!', 'success');
          btnSelectAll.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>Copied!</span>`;
          setTimeout(() => closeModal(), 1000);
        } else {
          showToast('Text selected! Press Ctrl+C or ⌘+C to copy', 'info');
        }
      } catch {
        showToast('Text selected! Press Ctrl+C or ⌘+C to copy', 'info');
      }
    });
  }

  setTimeout(() => {
    if (textarea) {
      textarea.focus();
      textarea.select();
    }
  }, 100);
}

/**
 * Flashes a brief check/success state on an action button
 */
function flashButtonSuccess(button, successText = 'Saved!') {
  if (!button) return;
  const origHtml = button.innerHTML;
  button.classList.add('btn-action-success');
  button.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> <span>${successText}</span>`;
  setTimeout(() => {
    button.classList.remove('btn-action-success');
    button.innerHTML = origHtml;
  }, 1800);
}

/**
 * Updates the Deck badge and drawer button in the header without full re-render
 */
function updateDeckHeaderBadge(count) {
  const badge = document.getElementById('header-deck-count');
  if (badge) badge.textContent = count;
  const drawerBtn = document.getElementById('btn-toggle-deck-drawer');
  if (drawerBtn) {
    drawerBtn.classList.toggle('has-items', count > 0);
    drawerBtn.setAttribute('title', `Your Deck (${count} saved)`);
  }
  const sessionCountTag = document.querySelector('.session-count-tag');
  if (sessionCountTag) {
    sessionCountTag.textContent = `${count} prompt${count === 1 ? '' : 's'} saved`;
  }
}

/**
 * Clipboard Copy Helper
 */
function copyToClipboard(text, successMsg, targetBtn = null) {
  const triggerSuccess = () => {
    showToast(successMsg, 'success');
    if (targetBtn) {
      flashButtonSuccess(targetBtn, 'Copied!');
    }
  };

  const tryFallbackExec = () => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const copied = document.execCommand('copy');
      document.body.removeChild(ta);
      if (copied) {
        triggerSuccess();
      } else {
        openClipboardFallbackModal(text);
      }
    } catch {
      openClipboardFallbackModal(text);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(triggerSuccess)
      .catch((err) => {
        console.warn('navigator.clipboard failed, attempting fallback execCommand:', err);
        tryFallbackExec();
      });
  } else {
    tryFallbackExec();
  }
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

function initRouteFromHash() {
  const hash = (window.location.hash || '').toLowerCase();
  if (hash === '#video-storyboard' || hash === '#video' || hash === '#storyboard') {
    state.activeMode = 'video-storyboard';
  } else if (hash === '#image-prompts' || hash === '#images' || hash === '#create') {
    state.activeMode = 'image-prompts';
  }
}

window.addEventListener('hashchange', () => {
  const oldMode = state.activeMode;
  initRouteFromHash();
  if (oldMode !== state.activeMode) {
    if (state.activeMode === 'video-storyboard' && state.campaignData && (!state.storyboardState.scenes || state.storyboardState.scenes.length === 0)) {
      const gen = generateVideoStoryboard(state.campaignData, state.storyboardState);
      state.storyboardState.scenes = gen.scenes;
      state.storyboardState.isGenerated = true;
      state.storyboardState.selectedSceneId = gen.scenes[0]?.id || null;
    }
    renderApp();
  }
});

// Boot application
document.addEventListener('DOMContentLoaded', () => {
  initRouteFromHash();
  renderApp();
});
