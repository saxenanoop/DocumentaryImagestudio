/**
 * Local Storage Draft & Project Manager
 * Stores project briefs and shot history locally in browser storage.
 */

const DRAFT_KEY = "doc_studio_current_draft";
const HISTORY_KEY = "doc_studio_project_history";

/**
 * Saves current draft form inputs
 */
export function saveDraft(formData) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  } catch (err) {
    console.warn("Could not save draft to local storage", err);
  }
}

/**
 * Gets saved draft form inputs
 */
export function getDraft() {
  try {
    const data = localStorage.getItem(DRAFT_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
}

/**
 * Clears saved draft
 */
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (err) {
    // ignore
  }
}

/**
 * Saves a completed project into local history
 */
export function saveProjectToHistory(projectData) {
  try {
    const history = getProjectHistory();
    const updated = [
      {
        id: "proj_" + Date.now(),
        createdAt: new Date().toISOString(),
        ...projectData
      },
      ...history.slice(0, 19) // keep last 20 projects
    ];
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn("Could not save project to history", err);
  }
}

/**
 * Retrieves all saved projects from history
 */
export function getProjectHistory() {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    return [];
  }
}

/**
 * Removes a specific project from history by ID
 */
export function deleteProjectFromHistory(id) {
  try {
    const history = getProjectHistory();
    const filtered = history.filter(p => p.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    return [];
  }
}
