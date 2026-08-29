/**
 * Toast Notification Component
 */
let toastTimeout = null;

export function showToast(message, type = 'info', duration = 3000) {
  let toastEl = document.getElementById('global-toast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'global-toast';
    toastEl.className = 'global-toast';
    document.body.appendChild(toastEl);
  }

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  const iconSvg = type === 'success' 
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
    : type === 'error'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;

  toastEl.className = `global-toast toast-${type} toast-visible`;
  toastEl.innerHTML = `
    <span class="toast-icon">${iconSvg}</span>
    <span class="toast-text">${message}</span>
  `;

  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('toast-visible');
  }, duration);
}
