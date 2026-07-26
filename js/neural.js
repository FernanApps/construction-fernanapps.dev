(function neuralGrid() {
  'use strict';

  var canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var ACCENT = [198, 253, 14];
  var BASE = [90, 90, 85];
  var GRID = 110;
  var RADIUS = 300;
  var PUSH = 40;

  var w, h, cols, rows, nodes = [];
  var mouse = { x: -1000, y: -1000, active: false };
  var t = 0;

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildGrid();
  }

  function buildGrid() {
    nodes = [];
    cols = Math.ceil(w / GRID) + 2;
    rows = Math.ceil(h / GRID) + 2;
    var ox = (w - (cols - 1) * GRID) / 2;
    var oy = (h - (rows - 1) * GRID) / 2;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        nodes.push({
          ox: ox + c * GRID,
          oy: oy + r * GRID,
          x: ox + c * GRID,
          y: oy + r * GRID,
          energy: 0
        });
      }
    }
  }

  function getGhosts() {
    var ghosts = [
      {
        x: w * 0.5 + Math.sin(t * 0.4) * w * 0.35 + Math.cos(t * 0.25) * w * 0.12,
        y: h * 0.5 + Math.cos(t * 0.35) * h * 0.3 + Math.sin(t * 0.2) * h * 0.1
      },
      {
        x: w * 0.5 + Math.cos(t * 0.3 + 2) * w * 0.28 + Math.sin(t * 0.45) * w * 0.1,
        y: h * 0.5 + Math.sin(t * 0.38 + 1) * h * 0.32
      },
      {
        x: w * 0.5 + Math.sin(t * 0.28 + 4) * w * 0.32,
        y: h * 0.5 + Math.cos(t * 0.22 + 3) * h * 0.28
      }
    ];
    if (mouse.active) ghosts.push({ x: mouse.x, y: mouse.y });
    return ghosts;
  }

  function lerp(a, b, f) { return a + (b - a) * f; }

  function drawLine(a, b) {
    var e = (a.energy + b.energy) / 2;
    var cr = Math.round(lerp(BASE[0], ACCENT[0], e));
    var cg = Math.round(lerp(BASE[1], ACCENT[1], e));
    var cb = Math.round(lerp(BASE[2], ACCENT[2], e));
    ctx.strokeStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (0.04 + e * 0.16) + ')';
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  function step() {
    var ghosts = getGhosts();

    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var wx = Math.sin(n.ox * 0.01 + t * 0.8) * 5 + Math.cos(n.oy * 0.012 + t * 0.6) * 4;
      var wy = Math.cos(n.ox * 0.011 - t * 0.7) * 4 + Math.sin(n.oy * 0.01 + t * 0.9) * 3;
      var tx = n.ox + wx;
      var ty = n.oy + wy;
      var e = 0;

      for (var g = 0; g < ghosts.length; g++) {
        var dx = tx - ghosts[g].x;
        var dy = ty - ghosts[g].y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < RADIUS) {
          var force = (1 - d / RADIUS) * PUSH;
          var ang = Math.atan2(dy, dx);
          tx += Math.cos(ang) * force;
          ty += Math.sin(ang) * force;
          e = Math.max(e, 1 - d / RADIUS);
        }
      }

      n.x = lerp(n.x, tx, 0.15);
      n.y = lerp(n.y, ty, 0.15);
      n.energy = lerp(n.energy, e, 0.12);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    ctx.lineWidth = 1;
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var c = i % cols;
      var r = Math.floor(i / cols);
      if (c < cols - 1) drawLine(n, nodes[i + 1]);
      if (r < rows - 1) drawLine(n, nodes[i + cols]);
    }

    for (var j = 0; j < nodes.length; j++) {
      var m = nodes[j];
      var e = m.energy;
      var cr = Math.round(lerp(BASE[0], ACCENT[0], e));
      var cg = Math.round(lerp(BASE[1], ACCENT[1], e));
      var cb = Math.round(lerp(BASE[2], ACCENT[2], e));
      ctx.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + (0.15 + e * 0.3) + ')';
      ctx.beginPath();
      ctx.arc(m.x, m.y, 1.5 + e * 3, 0, Math.PI * 2);
      ctx.fill();

      if (e > 0.3) {
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(' + ACCENT[0] + ',' + ACCENT[1] + ',' + ACCENT[2] + ',' + (e * 0.5) + ')';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }
  }

  function frame() {
    t += 0.016;
    step();
    draw();
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener('mouseout', function () { mouse.active = false; });

  resize();
  frame();
})();
