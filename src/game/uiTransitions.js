/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const closeTimers = new WeakMap();
const CLOSE_TIMEOUT_MS = 280;

function clearPendingClose(el) {
  if (!el) return;
  const prev = closeTimers.get(el);
  if (prev) {
    clearTimeout(prev.timer);
    if (prev.onEnd) el.removeEventListener('transitionend', prev.onEnd);
    closeTimers.delete(el);
  }
  if (el.dataset) {
    delete el.dataset.uiClosing;
  }
}

/**
 * Smoothly animates a newly appended or reused modal backdrop + inner card into view.
 */
export function openAnimatedModal(el, opts = {}) {
  if (!el) return;
  const { immediate = false, panelClass = 'ui-modal-backdrop' } = opts;
  clearPendingClose(el);
  el.classList.add(panelClass);
  el.classList.remove('ui-panel-closing', 'ui-panel-enter');

  if (immediate) {
    el.classList.add('ui-panel-open');
    return;
  }

  el.classList.remove('ui-panel-open');
  void el.offsetWidth;
  requestAnimationFrame(() => {
    if (!el.isConnected || el.dataset?.uiClosing === '1') return;
    el.classList.add('ui-panel-open');
  });
}

/**
 * Smoothly animates a modal backdrop + inner card out of view, then removes or hides it.
 */
export function closeAnimatedModal(el, opts = {}) {
  if (!el) return;
  const { remove = true, panelClass = 'ui-modal-backdrop', onDone } = opts;
  if (el.dataset?.uiClosing === '1') return;

  clearPendingClose(el);
  if (el.dataset) el.dataset.uiClosing = '1';
  el.classList.add(panelClass);
  el.classList.remove('ui-panel-open', 'ui-panel-enter');
  void el.offsetWidth;
  el.classList.add('ui-panel-closing');

  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    clearPendingClose(el);
    el.classList.remove('ui-panel-closing');
    if (remove) {
      if (el.parentNode) el.remove();
    } else {
      el.style.display = 'none';
    }
    if (typeof onDone === 'function') onDone();
  };

  const onEnd = (e) => {
    if (e.target === el) finish();
  };
  el.addEventListener('transitionend', onEnd);
  const timer = setTimeout(finish, CLOSE_TIMEOUT_MS);
  closeTimers.set(el, { timer, onEnd });
}

/**
 * Immediately removes a modal (useful before replacing an outdated/closing modal instance).
 */
export function disposeAnimatedModal(el) {
  if (!el) return;
  clearPendingClose(el);
  if (el.parentNode) el.remove();
}

/**
 * Smoothly shows a persistent DOM panel (like settings, lobby overlay, dead UI, escape UI, chat drawer).
 */
export function showAnimatedPanel(el, displayValue = 'flex', panelClass = 'ui-modal-backdrop') {
  if (!el) return;
  const isAlreadyOpen =
    el.style.display === displayValue &&
    el.classList.contains('ui-panel-open') &&
    el.dataset?.uiClosing !== '1';
  if (isAlreadyOpen) return;

  clearPendingClose(el);
  el.classList.add(panelClass);
  el.classList.remove('ui-panel-closing', 'ui-panel-open');
  el.classList.add('ui-panel-enter');
  el.style.display = displayValue;

  void el.offsetWidth;
  requestAnimationFrame(() => {
    if (el.dataset?.uiClosing === '1') return;
    el.classList.remove('ui-panel-enter');
    el.classList.add('ui-panel-open');
  });
}

/**
 * Smoothly hides a persistent DOM panel using CSS transitions before setting display: none.
 */
export function hideAnimatedPanel(el, panelClass = 'ui-modal-backdrop', onDone) {
  if (!el) return;
  if (el.style.display === 'none' && el.dataset?.uiClosing !== '1') {
    el.classList.remove('ui-panel-open', 'ui-panel-closing', 'ui-panel-enter');
    return;
  }
  closeAnimatedModal(el, { remove: false, panelClass, onDone });
}
