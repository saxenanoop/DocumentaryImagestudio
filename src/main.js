/**
 * Main Application Logic & Client Router
 */
import './style.css';
import { renderHeader } from './components/Header.js';
import { renderFooter } from './components/Footer.js';
import { showToast } from './components/Toast.js';
import { DOCUMENTARY_PRESETS } from './presets.js';
import { generateShotPlan, generatePromptSheetMarkdown } from './promptEngine.js';
import { saveDraft, getDraft, saveProjectToHistory, getProjectHistory, deleteProjectFromHistory } from './storage.js';

import { renderHomeView } from './views/HomeView.js';
import { renderCreateView } from './views/CreateView.js';
import { renderResultsView } from './views/ResultsView.js';
import { renderEthicsView } from './views/EthicsView.js';
import { renderHistoryView } from './views/HistoryView.js';

// Application State
const state = {
  route: 'home',
  wizardStep: 1,
  selectedPresetId: null,
  activeProject: null // { brief, shots }
};

/**
 * Main Render Controller
 */
function renderApp() {
  const appElement = document.getElementById('app');
  if (!appElement) return;

  // Determine current view HTML
  let viewHtml = '';
  if (state.route === 'home') {
    viewHtml = renderHomeView();
  } else if (state.route === 'create') {
    viewHtml = renderCreateView(state.selectedPresetId, state.wizardStep);
  } else if (state.route === 'results') {
    if (!state.activeProject) {
      state.route = 'create';
      state.wizardStep = 1;
      viewHtml = renderCreateView(state.selectedPresetId, state.wizardStep);
    } else {
      viewHtml = renderResultsView(state.activeProject);
    }
  } else if (state.route === 'ethics') {
    viewHtml = renderEthicsView();
  } else if (state.route === 'history') {
    viewHtml = renderHistoryView();
  } else {
    viewHtml = renderHomeView();
  }

  // Compose Page Layout
  appElement.innerHTML = `
    ${renderHeader(state.route)}
    <main class="main-content">
      ${viewHtml}
    </main>
    ${renderFooter()}
  `;

  // Attach Event Listeners for current view
  attachEventListeners();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Event Listeners & Router Dispatcher
 */
function attachEventListeners() {
  // Navigation Links
  document.querySelectorAll('[data-route]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetRoute = link.getAttribute('data-route');
      if (targetRoute === 'create') {
        state.wizardStep = 1;
      }
      navigateTo(targetRoute);
    });
  });

  // Preset Card Clicks on Home Page
  document.querySelectorAll('.preset-card').forEach(card => {
    card.addEventListener('click', () => {
      const presetId = card.getAttribute('data-preset-id');
      state.selectedPresetId = presetId;
      state.wizardStep = 1;
      navigateTo('create');
    });
  });

  // Preset Autofill Chips on Create Form (Step 2)
  document.querySelectorAll('[data-preset-autofill]').forEach(chip => {
    chip.addEventListener('click', () => {
      const presetId = chip.getAttribute('data-preset-autofill');
      state.selectedPresetId = presetId;
      const preset = DOCUMENTARY_PRESETS.find(p => p.id === presetId);
      if (preset) {
        const form = document.getElementById('create-project-form');
        if (form) {
          autofillFormInputs(form, preset.defaults);
          saveDraft(getFullFormData(form));
        }
      }
      showToast(`Autofilled form with ${presetId.toUpperCase()} preset`, 'success');
    });
  });

  // Aspect Ratio Segmented Control
  document.querySelectorAll('.segmented-option').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.segmented-option').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const ratio = btn.getAttribute('data-ratio');
      const hiddenInput = document.getElementById('aspectRatio');
      if (hiddenInput) hiddenInput.value = ratio;
      const form = document.getElementById('create-project-form');
      if (form) saveDraft(getFullFormData(form));
    });
  });

  // 2-Step Wizard Navigation Buttons
  const btnNext = document.getElementById('btn-next-step');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const form = document.getElementById('create-project-form');
      if (form) {
        const currentData = getFullFormData(form);
        saveDraft(currentData);
        
        if (!currentData.topic || !currentData.subject) {
          showToast('Please enter documentary topic and subject agency', 'info');
          return;
        }
        
        // Switch to Step 2 without destroying DOM inputs
        state.wizardStep = 2;
        const s1 = document.getElementById('step-1-container');
        const s2 = document.getElementById('step-2-container');
        if (s1 && s2) {
          s1.classList.add('step-hidden');
          s2.classList.remove('step-hidden');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          renderApp();
        }
      }
    });
  }

  const btnBack = document.getElementById('btn-back-step');
  if (btnBack) {
    btnBack.addEventListener('click', () => {
      const form = document.getElementById('create-project-form');
      if (form) {
        saveDraft(getFullFormData(form));
      }
      state.wizardStep = 1;
      const s1 = document.getElementById('step-1-container');
      const s2 = document.getElementById('step-2-container');
      if (s1 && s2) {
        s2.classList.add('step-hidden');
        s1.classList.remove('step-hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        renderApp();
      }
    });
  }

  // Form Input Change Auto-Save Draft
  const form = document.getElementById('create-project-form');
  if (form) {
    form.addEventListener('input', () => {
      const fullDraft = getFullFormData(form);
      saveDraft(fullDraft);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const brief = getFullFormData(form);
      
      showToast('Building documentary shot plan...', 'info');

      // Generate 3-Shot Plan via Prompt Engine
      setTimeout(() => {
        const shots = generateShotPlan(brief);
        state.activeProject = { brief, shots };
        saveProjectToHistory(state.activeProject);
        state.wizardStep = 1;
        navigateTo('results');
        showToast('Documentary shot plan generated successfully!', 'success');
      }, 300);
    });
  }

  // Copy Prompt Button Handler
  document.querySelectorAll('.btn-copy-prompt').forEach(btn => {
    btn.addEventListener('click', () => {
      const shotId = btn.getAttribute('data-prompt-id');
      const textarea = document.getElementById(`prompt-text-${shotId}`);
      if (textarea) {
        copyToClipboard(textarea.value, 'Prompt copied to clipboard!');
      }
    });
  });

  // Copy Disclosure Caption Handler
  document.querySelectorAll('.btn-copy-caption').forEach(btn => {
    btn.addEventListener('click', () => {
      const caption = btn.getAttribute('data-caption-text');
      if (caption) {
        copyToClipboard(caption, 'Ethical disclosure caption copied!');
      }
    });
  });

  // Global Action: Copy All Prompts
  const btnCopyAll = document.getElementById('btn-copy-all-prompts');
  if (btnCopyAll && state.activeProject) {
    btnCopyAll.addEventListener('click', () => {
      const markdown = generatePromptSheetMarkdown(state.activeProject.brief, state.activeProject.shots);
      copyToClipboard(markdown, 'All 3 documentary prompts copied as Markdown!');
    });
  }

  // Global Action: Download Prompt Sheet (.md)
  const btnDownloadSheet = document.getElementById('btn-download-sheet');
  if (btnDownloadSheet && state.activeProject) {
    btnDownloadSheet.addEventListener('click', () => {
      const markdown = generatePromptSheetMarkdown(state.activeProject.brief, state.activeProject.shots);
      const filename = `Documentary_Shot_Plan_${(state.activeProject.brief.projectName || 'Project').replace(/\s+/g, '_')}.md`;
      downloadFile(markdown, filename, 'text/markdown');
      showToast('Downloaded prompt sheet .md file', 'success');
    });
  }

  // History Page Handlers
  document.querySelectorAll('.btn-open-project').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project-id');
      const history = getProjectHistory();
      const project = history.find(p => p.id === projId);
      if (project) {
        state.activeProject = project;
        navigateTo('results');
      }
    });
  });

  document.querySelectorAll('.btn-delete-project').forEach(btn => {
    btn.addEventListener('click', () => {
      const projId = btn.getAttribute('data-project-id');
      deleteProjectFromHistory(projId);
      renderApp();
      showToast('Project removed from history', 'info');
    });
  });
}

/**
 * Extracts 100% of form input data directly from the DOM
 */
function getFullFormData(form) {
  if (!form) return getDraft() || {};
  return {
    projectName: form.querySelector('#projectName')?.value || '',
    topic: form.querySelector('#topic')?.value || '',
    subject: form.querySelector('#subject')?.value || '',
    location: form.querySelector('#location')?.value || '',
    timeOfDay: form.querySelector('#timeOfDay')?.value || '',
    lighting: form.querySelector('#lighting')?.value || '',
    mood: form.querySelector('#mood')?.value || '',
    visualStyle: form.querySelector('#visualStyle')?.value || '',
    filmLook: form.querySelector('#filmLook')?.value || '',
    aspectRatio: form.querySelector('#aspectRatio')?.value || '16:9'
  };
}

/**
 * Autofills all form inputs in the DOM
 */
function autofillFormInputs(form, defaults) {
  if (!form || !defaults) return;
  Object.keys(defaults).forEach(key => {
    const el = form.querySelector(`#${key}`);
    if (el) {
      el.value = defaults[key];
    }
  });
}

/**
 * Router Navigation Helper
 */
function navigateTo(route) {
  state.route = route;
  window.location.hash = route;
  renderApp();
}

/**
 * Clipboard Copy Helper
 */
function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg, 'success');
    }).catch(() => {
      fallbackCopyTextToClipboard(text, successMsg);
    });
  } else {
    fallbackCopyTextToClipboard(text, successMsg);
  }
}

function fallbackCopyTextToClipboard(text, successMsg) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMsg, 'success');
  } catch (err) {
    showToast('Failed to copy', 'error');
  }
  document.body.removeChild(textArea);
}

/**
 * File Download Helper
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

// Initial Hash Route Listener & Boot
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && ['home', 'create', 'results', 'ethics', 'history'].includes(hash)) {
    state.route = hash;
    renderApp();
  }
});

// Boot Application
document.addEventListener('DOMContentLoaded', () => {
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && ['home', 'create', 'results', 'ethics', 'history'].includes(initialHash)) {
    state.route = initialHash;
  }
  renderApp();
});
