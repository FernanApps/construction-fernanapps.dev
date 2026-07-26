(function terminal() {
  'use strict';

  var body = document.getElementById('terminal-body');
  if (!body) return;

  var SCRIPT = [
    { type: 'cmd', text: 'git init portfolio' },
    { type: 'out', text: '› repository initialized' },
    { type: 'cmd', text: 'npm run build' },
    { type: 'out', text: '› compiling components... done', ok: 'done' },
    { type: 'out', text: '› optimizing assets... done', ok: 'done' },
    { type: 'cmd', text: './deploy --production' },
    { type: 'out', text: '› deploying fernanapps.dev...' },
    { type: 'out', text: '› coming soon' }
  ];

  function makeLine(entry, full) {
    var line = document.createElement('span');
    line.className = 'term-line';

    if (entry.type === 'cmd') {
      var prompt = document.createElement('span');
      prompt.className = 'term-prompt';
      prompt.textContent = '$ ';
      var cmd = document.createElement('span');
      cmd.className = 'term-cmd';
      cmd.textContent = full ? entry.text : '';
      line.appendChild(prompt);
      line.appendChild(cmd);
      line._target = cmd;
    } else {
      var out = document.createElement('span');
      out.className = 'term-out';
      if (entry.ok) {
        var idx = entry.text.lastIndexOf(entry.ok);
        out.appendChild(document.createTextNode(entry.text.slice(0, idx)));
        var okSpan = document.createElement('span');
        okSpan.className = 'ok';
        okSpan.textContent = entry.ok;
        out.appendChild(okSpan);
      } else {
        out.textContent = entry.text;
      }
      line.appendChild(out);
    }
    return line;
  }

  var cursor = document.createElement('span');
  cursor.className = 'term-cursor';

  var idx = 0;

  function nextEntry() {
    if (idx >= SCRIPT.length) {
      var endLine = document.createElement('span');
      endLine.className = 'term-line';
      var ep = document.createElement('span');
      ep.className = 'term-prompt';
      ep.textContent = '$ ';
      endLine.appendChild(ep);
      endLine.appendChild(cursor);
      body.appendChild(endLine);
      return;
    }

    var entry = SCRIPT[idx++];
    var line = makeLine(entry, entry.type !== 'cmd');

    if (entry.type === 'cmd') {
      body.appendChild(line);
      line._target.appendChild(cursor);
      var chars = entry.text.split('');
      var ci = 0;

      (function typeChar() {
        if (ci < chars.length) {
          cursor.before(document.createTextNode(chars[ci++]));
          setTimeout(typeChar, 34 + Math.random() * 46);
        } else {
          cursor.remove();
          setTimeout(nextEntry, 320);
        }
      })();
    } else {
      setTimeout(function () {
        body.appendChild(line);
        setTimeout(nextEntry, 260);
      }, 180);
    }
  }

  setTimeout(nextEntry, 900);
})();
