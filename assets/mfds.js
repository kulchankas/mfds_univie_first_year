/* ============================================================
   MFDS — shared topbar
   Injects a consistent nav at the top of every page. The depth to
   the site root is read from the <script data-root="..."> attribute
   so this works from any folder depth.
   ============================================================ */
(function () {
  'use strict';

  var self = document.currentScript;
  var root = (self && self.getAttribute('data-root')) || '';
  var here = (document.body.getAttribute('data-page') || '').toLowerCase();

  var SECTIONS = [
    { id: 'hub',   label: 'Dashboard',  href: 'index.html' },
    { id: 'plan',  label: '6-week plan', href: 'study-plan.html' },
    { id: 'algo',  label: 'Algorithms', href: 'algorithms/index.html' },
    { id: 'ana',   label: 'Analysis',   href: 'analysis/index.html' },
    { id: 'lads',  label: 'LA for DS',  href: 'linear-algebra-ds/index.html' },
    { id: 'la',    label: 'LA (intro)', href: 'linear-algebra/index.html' }
  ];

  var bar = document.createElement('nav');
  bar.className = 'mfds-topbar';

  var html = '<a class="mfds-brand" href="' + root + 'index.html">' +
             '<span class="mfds-dot"></span><span>MFDS</span></a>';

  SECTIONS.forEach(function (s) {
    html += '<a class="mfds-link' + (s.id === here ? ' is-here' : '') + '" href="' +
            root + s.href + '">' + s.label + '</a>';
  });

  /* "up" link back to the section index, when we're on a leaf page */
  var up = document.body.getAttribute('data-up');
  if (up) {
    var upLabel = document.body.getAttribute('data-up-label') || 'Back';
    html += '<span class="mfds-spacer"></span>' +
            '<a class="mfds-up" href="' + up + '">↑ ' + upLabel + '</a>';
  }

  bar.innerHTML = html;
  document.body.insertBefore(bar, document.body.firstChild);
})();
