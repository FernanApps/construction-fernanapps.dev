(function progress() {
  'use strict';

  var bar = document.getElementById('progress-bar');
  var fill = document.getElementById('progress-fill');
  var pct = document.getElementById('progress-pct');
  var joke = document.getElementById('progress-joke');
  if (!bar || !fill || !pct) return;

  var TARGET = 99;

  function setValue(v) {
    var val = Math.round(v);
    fill.style.width = val + '%';
    pct.textContent = val + '%';
    bar.setAttribute('aria-valuenow', String(val));
  }

  var start = null;
  var DURATION = 3200;

  function easeOutCubic(x) { return 1 - Math.pow(1 - x, 3); }

  function tick(ts) {
    if (start === null) start = ts;
    var p = Math.min((ts - start) / DURATION, 1);
    setValue(easeOutCubic(p) * TARGET);
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      joke.classList.add('visible');
    }
  }

  setTimeout(function () {
    requestAnimationFrame(tick);
  }, 1100);
})();
