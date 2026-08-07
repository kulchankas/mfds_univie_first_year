/* ============================================================
   MFDS — the 6-week plan, as data.

   Single source of truth. Both the dashboard (index.html) and the
   plan page (study-plan.html) render from this object, so the two
   can no longer drift apart. Edit the plan here and nowhere else.

   Paths are relative to the site root; both consumers live there.
   ============================================================ */
window.MFDS_PLAN = {

  days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  dayFull: { Mon:'Monday', Tue:'Tuesday', Wed:'Wednesday', Thu:'Thursday',
             Fri:'Friday', Sat:'Saturday', Sun:'Sunday' },

  /* which subject leads each day, Mon..Sun (null = rest / catch-up) */
  rhythm: ['algo', 'ana', 'la', 'algo', 'ana', 'la', null],

  subjects: {
    algo: { name:'Algorithms', full:'Algorithms & Data Structures',
            bg:'var(--algo-bg)', accent:'var(--algo)', dark:'var(--algo-dark)',
            href:'algorithms/index.html' },
    ana:  { name:'Analysis', full:'Analysis',
            bg:'var(--ana-bg)', accent:'var(--ana)', dark:'var(--ana-dark)',
            href:'analysis/index.html' },
    la:   { name:'Linear Algebra', full:'Linear Algebra',
            bg:'var(--lads-bg)', accent:'var(--lads)', dark:'var(--lads-dark)',
            href:'linear-algebra-ds/index.html' }
  },

  off: { name:'Off / catch-up', full:'Off / catch-up',
         bg:'var(--off-bg)', accent:'var(--off)', dark:'var(--off-dark)',
         href:'study-plan.html',
         detail:'Rest, or use the daily flashcard block.' },

  /* the daily non-negotiable, appended to every day */
  daily: { name:'Flashcards — all decks', detail:'20–30 min, whatever is due',
           bg:'var(--lads-bg)', accent:'var(--lads)', dark:'var(--lads-dark)',
           href:'algorithms/flashcards.html', slug:'cards' },

  weeks: {
    1: { theme:'Foundations, pass I',
         sub:'re-open every subject; find your gaps early',
         tracks: {
           algo:'Read the <a href="algorithms/data-structures.html">data-structure notes</a> end to end (heaps → BST/RBT → hashing). Do <a href="algorithms/recurrence-drills.html">drill groups A–B</a>. Skim the <a href="algorithms/mock-exam-1.html">real exam paper</a> <em>without</em> solutions — just to calibrate what\'s coming.',
           ana:'Re-read <a href="analysis/study-guide/">study guide</a> Blocks 1–2 (metric spaces, completeness/compactness, continuity). Start <a href="analysis/daily-practice.html">daily-practice</a> sheets 1–3.',
           la:'Chapters 1–2 of the <a href="linear-algebra-ds/index.html">self-study plan</a> (vector spaces, inner products): watch the 3B1B clips, redo the flagged Ch 1 exercises.'
         },
         short: { algo:'Data-structure notes end to end; drill groups A–B',
                  ana:'Study guide blocks 1–2; daily-practice sheets 1–3',
                  la:'Chapters 1–2 — vector spaces, inner products' },
         milestone:'All three decks started; a written list of your 5 weakest topics per subject.' },

    2: { theme:'Foundations, pass II',
         sub:'finish the content sweep',
         tracks: {
           algo:'Read the <a href="algorithms/exam-proofs.html">proofs page</a> ①–③ (loop invariants, Master machinery, Akra–Bazzi) actively. Finish <a href="algorithms/recurrence-drills.html">drill groups C–D</a>; redo any miss the next day.',
           ana:'Blocks 3–6 of the study guide (incl. convexity). Daily-practice sheets 4–7. Check the exam-focus table and mark every ✅ topic you can\'t yet prove.',
           la:'Chapters 3–4 (bilinear forms, determinants). Work Gram–Schmidt and orthogonal projection until they are automatic — they carry the whole least-squares story.'
         },
         short: { algo:'Exam-proofs ①–③ actively; drill groups C–D',
                  ana:'Blocks 3–6 incl. convexity; daily-practice sheets 4–7',
                  la:'Chapters 3–4 — bilinear forms, determinants' },
         milestone:'Every recurrence drill solved once; Analysis ✅-list complete.' },

    3: { theme:'Proofs from memory, I',
         sub:'closed book: write, compare, repeat',
         tracks: {
           algo:'From memory, on paper: <b>Huffman optimality</b> (the 8-pointer — <a href="algorithms/exam-proofs.html#huffman">⑩</a>), bubblesort <em>and</em> insertion-sort invariant proofs (<a href="algorithms/exam-proofs.html#loopinv">①</a>). Compare against the model solutions; repeat failures two days later.',
           ana:'The ✅ exam-priority proofs from memory, one block per session (Banach FPT and friends). Daily-practice sheets 8–10.',
           la:'Chapter 5 (eigenvalues): diagonalization workflow + Cayley–Hamilton. Reproduce the Riesz representation theorem and the adjoint identities from memory.'
         },
         short: { algo:'Huffman & loop-invariant proofs from memory',
                  ana:'Exam-priority proofs, one block per session',
                  la:'Chapter 5 — eigenvalues, diagonalization workflow' },
         milestone:'Huffman reproduced twice without peeking; eigen-workflow (char. poly → eigenspaces → diagonalizable?) automatic.' },

    4: { theme:'Proofs from memory, II',
         sub:'the rotation candidates',
         tracks: {
           algo:'From memory: <b>quicksort</b> <a href="algorithms/exam-proofs.html#quicksort">⑤</a>, the <b>lower bound</b> <a href="algorithms/exam-proofs.html#lowerbound">⑥</a>, <b>selection</b> <a href="algorithms/exam-proofs.html#select">⑦</a>, <b>hashing</b> <a href="algorithms/exam-proofs.html#hashing">⑧</a>. Rehearse MIN-HEAPIFY / DECREASE-KEY / RB-INSERT-FIXUP pseudocode cold.',
           ana:'⚠️ proofs (the "maybe" tier) + redo the highest-priority problem-set questions. Daily-practice sheets 11–13.',
           la:'Chapter 6 — the spectral theorem and SVD. Compute one full SVD by hand on a $2\\times2$, verify with <code>numpy.linalg.svd</code>.'
         },
         short: { algo:'Quicksort, lower-bound, selection & hashing proofs',
                  ana:'Maybe-tier proofs + highest-priority problem sets',
                  la:'Chapter 6 — spectral theorems, SVD by hand' },
         milestone:'All four AlgoDat big proofs written once from memory; SVD by hand once without notes.' },

    5: { theme:'Mock week',
         sub:'timed, closed book, graded honestly',
         tracks: {
           algo:'Sit the <a href="algorithms/mock-exam-1.html">real first-date paper</a> under exam conditions; grade with the grader notes; log every dropped point. Two days later: the predicted second-date paper, same protocol.',
           ana:'Self-test: pick one ✅ problem from each problem sheet (2, 3, 5, 8, 11, 14) and solve under time; redo the study-guide recipes for anything that failed.',
           la:'Simulated exam from the course exercises: one exercise per chapter, 90 minutes, closed book. (Intro-LA takers: <a href="linear-algebra/mock_exams.html">mock exams 1–3</a> this week.)'
         },
         short: { algo:'Real first-date exam paper, timed & graded',
                  ana:'Self-test: one priority problem per sheet, under time',
                  la:'Simulated exam — one exercise per chapter, 90 min' },
         milestone:'A one-page "dropped points" list per subject — this is your week-6 curriculum.' },

    6: { theme:'Close the gaps, then taper',
         sub:'only what the mocks exposed',
         tracks: {
           algo:'Re-do exactly the failed sub-questions from week 5, from scratch. Re-write the two weakest proofs from memory one final time. Skim the <a href="algorithms/data-structures.html">notes</a> tables (runtimes, RB properties, Master cases) the day before.',
           ana:'Dropped-points list only; then one final pass over the exam-focus table. No new material after mid-week.',
           la:'Dropped-points list; final pass over definitions (norms, inner products, diagonalizability criteria, the SVD statement). (Intro-LA: mocks 4–5 early in the week.)'
         },
         short: { algo:'Redo failed sub-questions from week 5, from scratch',
                  ana:'Dropped-points list only; final exam-focus pass',
                  la:'Dropped-points list; final definitions pass' },
         milestone:'Last 2 days = flashcards + skim only. Sleep. An exam is a performance, not a cram.' }
  },

  homework: {
    1:[ {t:'Data-structure notes', s:'Heaps → RBT → hashing, end to end', k:'algo', href:'algorithms/data-structures.html'},
        {t:'Daily practice 1–3',   s:'Analysis warm-up sheets',            k:'ana',  href:'analysis/daily-practice.html'},
        {t:'LA chapters 1–2',      s:'Vector spaces & inner products',     k:'la',   href:'linear-algebra-ds/index.html'} ],
    2:[ {t:'Exam-proofs ①–③',      s:'Loop invariants, Master, Akra–Bazzi',k:'algo', href:'algorithms/exam-proofs.html'},
        {t:'Daily practice 4–7',   s:'Cumulative review + fresh tasks',    k:'ana',  href:'analysis/daily-practice.html'},
        {t:'LA chapters 3–4',      s:'Bilinear forms & determinants',      k:'la',   href:'linear-algebra-ds/index.html'} ],
    3:[ {t:'Huffman from memory',  s:'The 8-point proof, closed book',     k:'algo', href:'algorithms/exam-proofs.html#huffman'},
        {t:'Priority proofs',      s:'One study-guide block per session',  k:'ana',  href:'analysis/study-guide/index.html'},
        {t:'Riesz & adjoints',     s:'Reproduce from memory',              k:'la',   href:'linear-algebra-ds/theorems.html#riesz'} ],
    4:[ {t:'Rotation-risk proofs', s:'Quicksort, lower bound, selection, hashing', k:'algo', href:'algorithms/exam-proofs.html'},
        {t:'Problem-set priorities',s:'✅-tagged questions under time',    k:'ana',  href:'analysis/index.html'},
        {t:'SVD mini-lab',         s:'One 2×2 by hand, verify with numpy', k:'la',   href:'linear-algebra-ds/theorems.html#svd'} ],
    5:[ {t:'Mock exam (real paper)',s:'Timed, closed book, graded honestly',k:'algo', href:'algorithms/mock-exam-1.html'},
        {t:'Sheet self-test',      s:'One priority problem per sheet',     k:'ana',  href:'analysis/index.html'},
        {t:'Simulated LA exam',    s:'One exercise per chapter, 90 min',   k:'la',   href:'linear-algebra-ds/index.html'} ],
    6:[ {t:'Redo dropped points',  s:'Only what the mocks exposed',        k:'algo', href:'algorithms/mock-exam-1.html'},
        {t:'Final exam-focus pass',s:'Then flashcards only',               k:'ana',  href:'analysis/study-guide/index.html'},
        {t:'Definitions pass',     s:'Norms, diagonalizability, SVD statement', k:'la', href:'linear-algebra-ds/index.html'} ]
  },

  /* every localStorage key the site writes — used by the hub's backup */
  storageKeys: [
    'hub-state-v1',
    'fc_algodat_v1',
    'fc_analysis_day1_v1',
    'fc_lads_v1',
    'asg-progress-v1',
    'lads-progress-v1',
    'algo-progress-v1',
    'analysis-daily-v1'
  ],

  /* helper: which subject leads a given weekday index (Mon=0) */
  taskFor: function (dayIdx, week) {
    var key = this.rhythm[dayIdx];
    if (!key) return Object.assign({ slug:'off' }, this.off);
    var meta = this.subjects[key];
    return {
      slug: key, name: meta.name, detail: this.weeks[week].short[key],
      bg: meta.bg, accent: meta.accent, dark: meta.dark, href: meta.href
    };
  }
};
