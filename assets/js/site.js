/* Seongsoo Shin — shared site script (담백 build) */
(function(){
  var y = document.getElementById('y');
  if (y) y.textContent = new Date().getFullYear();

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
    'ranking-gg':   ['../assets/projects/ranking-gg/ss-1.png','../assets/projects/ranking-gg/ss-2.png','../assets/projects/ranking-gg/ss-3.png','../assets/projects/ranking-gg/ss-4.png','../assets/projects/ranking-gg/ss-5.png','../assets/projects/ranking-gg/ss-6.png'],
    's-team':       ['../assets/projects/s-team/ss-1.png','../assets/projects/s-team/ss-2.png','../assets/projects/s-team/ss-3.png','../assets/projects/s-team/ss-4.png','../assets/projects/s-team/ss-5.png','../assets/projects/s-team/ss-6.png'],
    'neurodio':     ['../assets/projects/neurodio/ss-1.png','../assets/projects/neurodio/ss-2.png','../assets/projects/neurodio/ss-3.png','../assets/projects/neurodio/ss-4.png','../assets/projects/neurodio/ss-5.png','../assets/projects/neurodio/ss-6.png'],
    'd-hub':        ['../assets/projects/d-hub/ss-1.png','../assets/projects/d-hub/ss-2.png','../assets/projects/d-hub/ss-3.png','../assets/projects/d-hub/ss-4.png','../assets/projects/d-hub/ss-5.png','../assets/projects/d-hub/ss-6.png'],
    'unibook':      ['../assets/projects/unibook/ss-1.png','../assets/projects/unibook/ss-2.png','../assets/projects/unibook/ss-3.png','../assets/projects/unibook/ss-4.png','../assets/projects/unibook/ss-5.jpeg','../assets/projects/unibook/ss-6.jpeg'],
    'bullida':      ['../assets/projects/bullida/ss-1.png','../assets/projects/bullida/ss-2.png'],
    'bexco':        ['../assets/projects/bexco/ss-1.png','../assets/projects/bexco/ss-2.png','../assets/projects/bexco/ss-3.png','../assets/projects/bexco/ss-4.png'],
    'cashbin':      ['../assets/projects/cashbin/ss-1.png','../assets/projects/cashbin/ss-2.png','../assets/projects/cashbin/ss-3.png'],
    'gem-platform': ['../assets/projects/gem-platform/ss-1.png','../assets/projects/gem-platform/ss-2.png','../assets/projects/gem-platform/ss-3.png','../assets/projects/gem-platform/ss-4.png'],
    'nmodelin':     ['../assets/projects/nmodelin/onelook-official-1.png','../assets/projects/nmodelin/onelook-official-3.png','../assets/projects/nmodelin/onelook-official-2.png','../assets/projects/nmodelin/onelook-ss-1.jpg','../assets/projects/nmodelin/onelook-ss-2.jpg','../assets/projects/nmodelin/onelook-ss-3.jpg','../assets/teams/nmodelin/derived/20241130_131411-team.jpg','../assets/teams/nmodelin/derived/20241130_131520-team.jpg','../assets/teams/nmodelin/derived/img-2182-team.jpg','../assets/teams/nmodelin/derived/img-2141-team.jpg'],
    'dabatruck':    ['../assets/projects/dabatruck/ss-2.png','../assets/projects/dabatruck/ss-3.png','../assets/projects/dabatruck/ss-4.png','../assets/projects/dabatruck/ss-5.png','../assets/projects/dabatruck/ss-1.jpg','../assets/projects/dabatruck/ss-6.jpg'],
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
