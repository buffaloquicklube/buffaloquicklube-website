/* One seasonal greeting per tab session; all instants use America/Chicago (CST). */
(function () {
  'use strict';
  var start = Date.parse('2026-11-25T00:00:00-06:00');
  var end = Date.parse('2026-11-28T00:00:00-06:00');
  var now = Date.now();
  var key = 'bql-thanksgiving-2026-seen';
  var motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (now < start || now >= end) return;
  // If storage is unavailable, skip rather than repeat on every page.
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch (_) { return; }
  if (motion.matches) return;
  var overlay = document.createElement('div');
  overlay.className = 'bql-thanksgiving';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `<div class="bql-parade">
    <div class="bql-holiday-banner">Happy<br>Thanksgiving!</div>
    <svg class="bql-turkey" viewBox="0 0 180 160" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <g class="bql-tail" stroke="#fff" stroke-width="2.5">
        <ellipse cx="50" cy="73" rx="17" ry="48" fill="#7137a8" transform="rotate(-52 50 73)"/>
        <ellipse cx="57" cy="61" rx="17" ry="48" fill="#21152e" transform="rotate(-28 57 61)"/>
        <ellipse cx="74" cy="56" rx="17" ry="48" fill="#9658c8"/>
        <ellipse cx="91" cy="62" rx="17" ry="45" fill="#21152e" transform="rotate(28 91 62)"/>
        <ellipse cx="105" cy="74" rx="15" ry="40" fill="#7137a8" transform="rotate(48 105 74)"/>
      </g>
      <g fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round">
        <path class="bql-leg bql-leg-back" d="M83 119v23l12 6"/>
        <path class="bql-leg bql-leg-front" d="M103 119v23l13 6"/>
      </g>
      <g class="bql-body" stroke="#fff" stroke-width="2.5">
        <ellipse cx="91" cy="99" rx="38" ry="31" fill="#21152e"/>
        <path d="M69 92q12-12 30 7q-3 21-25 12" fill="#7137a8"/>
        <path d="M112 99q-1-21 9-37l17 4q-7 22-2 37" fill="#21152e"/>
        <circle cx="134" cy="48" r="22" fill="#7137a8"/>
        <path d="m154 47 19 9-20 6" fill="#fff"/>
        <path d="M148 63q13 24 1 26q-9-3-5-21" fill="#9658c8"/>
        <circle cx="141" cy="43" r="5" fill="#fff" stroke="none"/>
        <circle cx="143" cy="43" r="2.5" fill="#17111e" stroke="none"/>
        <path d="M114 31h39l-5-7h-30z" fill="#17111e"/>
        <path d="m120 24 3-17h22l3 17z" fill="#17111e"/>
      </g>
    </svg></div>`;
  document.body.appendChild(overlay);
  var timer;
  function remove() {
    overlay.remove();
    clearTimeout(timer);
    motion.removeEventListener('change', onMotion);
    window.removeEventListener('pagehide', remove);
  }
  function onMotion(event) { if (event.matches) remove(); }
  overlay.addEventListener('animationend', function (event) {
    if (event.animationName === 'bql-cross') remove();
  });
  motion.addEventListener('change', onMotion);
  window.addEventListener('pagehide', remove);
  timer = setTimeout(remove, Math.min(9500, end - Date.now()));
}());
