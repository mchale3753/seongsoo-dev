/* Seongsoo Shin — shared site script (담백 build) */
(function(){
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

  // ───── mobile nav drawer ─────
  var navToggle = document.querySelector('.nav-toggle');
  var navEl = document.querySelector('header.top nav.nav');
  var navMql = window.matchMedia('(max-width:780px)');
  function setNav(open){
    if (!navEl || !navToggle) return;
    navEl.classList.toggle('open', open);
    if (navMql.matches) navEl.setAttribute('aria-hidden', open ? 'false' : 'true');
    else navEl.removeAttribute('aria-hidden');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.classList.toggle('nav-open', open);
  }
  if (navToggle && navEl){
    setNav(false);
    navToggle.addEventListener('click', function(){
      var isOpen = navEl.classList.contains('open');
      setNav(!isOpen);
    });
    // close on link click (drawer)
    navEl.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setNav(false); });
    });
    // close on Esc
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && navEl.classList.contains('open')) setNav(false);
    });
    // close when clicking the dim backdrop (outside drawer)
    document.addEventListener('click', function(e){
      if (!navEl.classList.contains('open')) return;
      if (navEl.contains(e.target) || navToggle.contains(e.target)) return;
      setNav(false);
    });
    // close when resizing back to desktop
    var onChange = function(){ setNav(navEl.classList.contains('open') && navMql.matches); };
    if (navMql.addEventListener) navMql.addEventListener('change', onChange);
    else if (navMql.addListener) navMql.addListener(onChange);
  }

  // language toggle
  var langBtns = document.querySelectorAll('.lang-toggle button[data-set-lang]');
  function setLang(l){
    document.documentElement.setAttribute('data-lang', l);
    document.documentElement.setAttribute('lang', l === 'ko' ? 'ko' : 'en');
    langBtns.forEach(function(b){ b.classList.toggle('active', b.dataset.setLang === l); });
    try { localStorage.setItem('lang', l); } catch(e){}
  }
  langBtns.forEach(function(b){ b.addEventListener('click', function(){ setLang(b.dataset.setLang); }); });
  try {
    var saved = localStorage.getItem('lang');
    if (saved === 'ko' || saved === 'en') setLang(saved);
    else if ((navigator.language || '').toLowerCase().startsWith('ko')) setLang('ko');
  } catch(e){}

  // Gallery manifest — used by project detail pages and lightbox
  window.GALLERIES = {
    'ranking-gg-en': ['../assets/projects/ranking-gg/en/ss-1.png','../assets/projects/ranking-gg/en/ss-2.png','../assets/projects/ranking-gg/en/ss-3.png','../assets/projects/ranking-gg/en/ss-4.png','../assets/projects/ranking-gg/en/ss-5.png','../assets/projects/ranking-gg/en/ss-6.png'],
    'ranking-gg-ko': ['../assets/projects/ranking-gg/ko/ss-1.png','../assets/projects/ranking-gg/ko/ss-2.png','../assets/projects/ranking-gg/ko/ss-3.png','../assets/projects/ranking-gg/ko/ss-4.png','../assets/projects/ranking-gg/ko/ss-5.png','../assets/projects/ranking-gg/ko/ss-6.png'],
    's-team-en': ['../assets/projects/s-team/en/ss-1.png','../assets/projects/s-team/en/ss-2.png','../assets/projects/s-team/en/ss-3.png','../assets/projects/s-team/en/ss-4.png','../assets/projects/s-team/en/ss-5.png','../assets/projects/s-team/en/ss-6.png'],
    's-team-ko': ['../assets/projects/s-team/ko/ss-1.png','../assets/projects/s-team/ko/ss-2.png','../assets/projects/s-team/ko/ss-3.png','../assets/projects/s-team/ko/ss-4.png','../assets/projects/s-team/ko/ss-5.png','../assets/projects/s-team/ko/ss-6.png'],
    'neurodio':     ['../assets/projects/neurodio/ss-1.png','../assets/projects/neurodio/ss-2.png','../assets/projects/neurodio/ss-3.png','../assets/projects/neurodio/ss-4.png','../assets/projects/neurodio/ss-5.png','../assets/projects/neurodio/ss-6.png'],
    'neurodio-en': ['../assets/projects/neurodio/en/ss-1.png','../assets/projects/neurodio/en/ss-2.png','../assets/projects/neurodio/en/ss-3.png','../assets/projects/neurodio/en/ss-4.png','../assets/projects/neurodio/en/ss-5.png','../assets/projects/neurodio/en/ss-6.png'],
    'neurodio-ko': ['../assets/projects/neurodio/ko/ss-1.png','../assets/projects/neurodio/ko/ss-2.png','../assets/projects/neurodio/ko/ss-3.png','../assets/projects/neurodio/ko/ss-4.png','../assets/projects/neurodio/ko/ss-5.png','../assets/projects/neurodio/ko/ss-6.png'],
    'd-hub-en': ['../assets/projects/d-hub/en/ss-1.png','../assets/projects/d-hub/en/ss-2.png','../assets/projects/d-hub/en/ss-3.png','../assets/projects/d-hub/en/ss-4.png','../assets/projects/d-hub/en/ss-5.png','../assets/projects/d-hub/en/ss-6.png'],
    'd-hub-ko': ['../assets/projects/d-hub/ko/ss-1.png','../assets/projects/d-hub/ko/ss-2.png','../assets/projects/d-hub/ko/ss-3.png','../assets/projects/d-hub/ko/ss-4.png','../assets/projects/d-hub/ko/ss-5.png','../assets/projects/d-hub/ko/ss-6.png'],
    'unibook-en': ['../assets/projects/unibook/en/ss-1.png','../assets/projects/unibook/en/ss-2.png','../assets/projects/unibook/en/ss-3.png','../assets/projects/unibook/en/ss-4.png','../assets/projects/unibook/en/ss-5.jpeg','../assets/projects/unibook/en/ss-6.jpeg'],
    'unibook-ko': ['../assets/projects/unibook/ko/ss-1.png','../assets/projects/unibook/ko/ss-2.png','../assets/projects/unibook/ko/ss-3.png','../assets/projects/unibook/ko/ss-4.png','../assets/projects/unibook/ko/ss-5.jpeg','../assets/projects/unibook/ko/ss-6.jpeg'],
    'bullida-en': ['../assets/projects/bullida/en/ss-1.png','../assets/projects/bullida/en/ss-2.png'],
    'bullida-ko': ['../assets/projects/bullida/ko/ss-1.png','../assets/projects/bullida/ko/ss-2.png'],
    'bexco-en': ['../assets/projects/bexco/en/ss-1.png','../assets/projects/bexco/en/ss-2.png','../assets/projects/bexco/en/ss-3.png','../assets/projects/bexco/en/ss-4.png'],
    'bexco-ko': ['../assets/projects/bexco/ko/ss-1.png','../assets/projects/bexco/ko/ss-2.png','../assets/projects/bexco/ko/ss-3.png','../assets/projects/bexco/ko/ss-4.png'],
    'cashbin-en': ['../assets/projects/cashbin/en/ss-1.png','../assets/projects/cashbin/en/ss-2.png','../assets/projects/cashbin/en/ss-3.png'],
    'cashbin-ko': ['../assets/projects/cashbin/ko/ss-1.png','../assets/projects/cashbin/ko/ss-2.png','../assets/projects/cashbin/ko/ss-3.png'],
    'gem-platform-en': ['../assets/projects/gem-platform/en/ss-1.png','../assets/projects/gem-platform/en/ss-2.png','../assets/projects/gem-platform/en/ss-3.png','../assets/projects/gem-platform/en/ss-4.png'],
    'gem-platform-ko': ['../assets/projects/gem-platform/ko/ss-1.png','../assets/projects/gem-platform/ko/ss-2.png','../assets/projects/gem-platform/ko/ss-3.png','../assets/projects/gem-platform/ko/ss-4.png'],
    'dabatruck-en': ['../assets/projects/dabatruck/en/ss-2.png','../assets/projects/dabatruck/en/ss-3.png','../assets/projects/dabatruck/en/ss-4.png','../assets/projects/dabatruck/en/ss-5.png','../assets/projects/dabatruck/en/ss-1.jpg','../assets/projects/dabatruck/en/ss-6.jpg'],
    'dabatruck-ko': ['../assets/projects/dabatruck/ko/ss-2.png','../assets/projects/dabatruck/ko/ss-3.png','../assets/projects/dabatruck/ko/ss-4.png','../assets/projects/dabatruck/ko/ss-5.png','../assets/projects/dabatruck/ko/ss-1.jpg','../assets/projects/dabatruck/ko/ss-6.jpg'],
    'dabatruck': ['../assets/projects/dabatruck/ko/ss-1.jpg','../assets/projects/dabatruck/ko/ss-2.png','../assets/projects/dabatruck/ko/ss-3.png','../assets/projects/dabatruck/ko/ss-4.png','../assets/projects/dabatruck/ko/ss-5.png','../assets/projects/dabatruck/ko/ss-6.jpg'],
    'nmodelin':     ['../assets/projects/nmodelin/onelook-official-1.png','../assets/projects/nmodelin/onelook-official-3.png','../assets/projects/nmodelin/onelook-official-2.png','../assets/projects/nmodelin/onelook-ss-1.jpg','../assets/projects/nmodelin/onelook-ss-2.jpg','../assets/projects/nmodelin/onelook-ss-3.jpg','../assets/teams/nmodelin/derived/20241130_131411-team.jpg','../assets/teams/nmodelin/derived/20241130_131520-team.jpg','../assets/teams/nmodelin/derived/img-2182-team.jpg','../assets/teams/nmodelin/derived/img-2141-team.jpg'],
    'nmodelin-onelook-en': ['../assets/projects/nmodelin/en/onelook-ss-1.jpg','../assets/projects/nmodelin/en/onelook-ss-2.jpg','../assets/projects/nmodelin/en/onelook-ss-3.jpg'],
    'nmodelin-onelook-ko': ['../assets/projects/nmodelin/ko/onelook-ss-1.jpg','../assets/projects/nmodelin/ko/onelook-ss-2.jpg','../assets/projects/nmodelin/ko/onelook-ss-3.jpg'],
  };

  // lightbox (used by detail pages)
  var lb = document.getElementById('lightbox');
  if (lb){
    var lbImg = document.getElementById('lb-img');
    var lbMeta = document.getElementById('lb-meta');
    var currentGal = null, currentIdx = 0;

    function openLB(gal, idx){
      currentGal = gal; currentIdx = idx;
      var arr = window.GALLERIES[gal] || [];
      lbImg.src = arr[idx] || '';
      lbMeta.textContent = gal.toUpperCase() + ' · ' + (idx+1) + ' / ' + arr.length;
      lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
      document.body.style.overflow = 'hidden';
    }
    function closeLB(){
      lb.classList.remove('open'); lb.setAttribute('aria-hidden','true');
      lbImg.src=''; document.body.style.overflow='';
    }
    function step(d){
      var arr = window.GALLERIES[currentGal] || [];
      if (!arr.length) return;
      currentIdx = (currentIdx + d + arr.length) % arr.length;
      lbImg.src = arr[currentIdx];
      lbMeta.textContent = currentGal.toUpperCase() + ' · ' + (currentIdx+1) + ' / ' + arr.length;
    }
    document.querySelectorAll('a.shot').forEach(function(a){
      a.addEventListener('click', function(e){ e.preventDefault(); openLB(a.dataset.gal, parseInt(a.dataset.i,10) || 0); });
    });
    lb.addEventListener('click', function(e){ if (e.target === lb || e.target.classList.contains('lb-close')) closeLB(); });
    var lbp = document.querySelector('.lb-prev'); if (lbp) lbp.addEventListener('click', function(e){ e.stopPropagation(); step(-1); });
    var lbn = document.querySelector('.lb-next'); if (lbn) lbn.addEventListener('click', function(e){ e.stopPropagation(); step(1); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLB();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  // reveal
  if ('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting){
          e.target.style.opacity='1'; e.target.style.transform='none';
          io.unobserve(e.target);
        }
      });
    }, { rootMargin:'0px 0px -6% 0px', threshold:.04 });
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce){
      document.querySelectorAll('section, .tl-row, .cap, .gallery .shot, .plist a').forEach(function(el){
        el.style.opacity='0'; el.style.transform='translateY(8px)';
        el.style.transition='opacity .5s ease, transform .5s ease';
        io.observe(el);
      });
    }
  }

  // first-load screen: keep it briefly, then reveal after assets are ready.
  var loadStartedAt = (window.performance && performance.now) ? performance.now() : Date.now();
  function markLoaded(){
    var now = (window.performance && performance.now) ? performance.now() : Date.now();
    var elapsed = now - loadStartedAt;
    var delay = Math.max(0, 520 - elapsed);
    window.setTimeout(function(){
      document.documentElement.classList.add('site-loaded');
      document.body.classList.add('page-enter');
    }, delay);
  }
  if (document.readyState === 'complete') markLoaded();
  else window.addEventListener('load', markLoaded, { once:true });
})();
