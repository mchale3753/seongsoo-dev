'use client';

import { useEffect } from 'react';
import GALLERIES from '@/data/galleries';

// Faithful port of portfolio-site/assets/js/site.js, adapted to run inside React.
// Behaviors: footer year, mobile nav drawer, language toggle, gallery lightbox,
// scroll reveal, and the first-load screen. Re-runs per pathname via the `key`
// on the mounting page so listeners attach to freshly rendered content.
export default function SiteRuntime() {
  useEffect(() => {
    const y = document.getElementById('y');
    if (y) y.textContent = String(new Date().getFullYear());

    // expose galleries for the lightbox (same contract as the original)
    window.GALLERIES = GALLERIES;

    const cleanups = [];

    // ───── mobile nav drawer ─────
    const navToggle = document.querySelector('.nav-toggle');
    const navEl = document.querySelector('header.top nav.nav');
    const navMql = window.matchMedia('(max-width:780px)');
    function setNav(open) {
      if (!navEl || !navToggle) return;
      navEl.classList.toggle('open', open);
      if (navMql.matches) navEl.setAttribute('aria-hidden', open ? 'false' : 'true');
      else navEl.removeAttribute('aria-hidden');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    }
    if (navToggle && navEl) {
      setNav(false);
      const onToggle = () => setNav(!navEl.classList.contains('open'));
      navToggle.addEventListener('click', onToggle);
      cleanups.push(() => navToggle.removeEventListener('click', onToggle));

      const linkHandlers = [];
      navEl.querySelectorAll('a').forEach((a) => {
        const h = () => setNav(false);
        a.addEventListener('click', h);
        linkHandlers.push([a, h]);
      });
      cleanups.push(() => linkHandlers.forEach(([a, h]) => a.removeEventListener('click', h)));

      const onEsc = (e) => {
        if (e.key === 'Escape' && navEl.classList.contains('open')) setNav(false);
      };
      document.addEventListener('keydown', onEsc);
      cleanups.push(() => document.removeEventListener('keydown', onEsc));

      const onDocClick = (e) => {
        if (!navEl.classList.contains('open')) return;
        if (navEl.contains(e.target) || navToggle.contains(e.target)) return;
        setNav(false);
      };
      document.addEventListener('click', onDocClick);
      cleanups.push(() => document.removeEventListener('click', onDocClick));

      const onChange = () =>
        setNav(navEl.classList.contains('open') && navMql.matches);
      if (navMql.addEventListener) navMql.addEventListener('change', onChange);
      else if (navMql.addListener) navMql.addListener(onChange);
      cleanups.push(() => {
        if (navMql.removeEventListener) navMql.removeEventListener('change', onChange);
        else if (navMql.removeListener) navMql.removeListener(onChange);
      });
    }

    // ───── language toggle ─────
    const langBtns = document.querySelectorAll('.lang-toggle button[data-set-lang]');
    function setLang(l) {
      document.documentElement.setAttribute('data-lang', l);
      document.documentElement.setAttribute('lang', l === 'ko' ? 'ko' : 'en');
      langBtns.forEach((b) => b.classList.toggle('active', b.dataset.setLang === l));
      try {
        localStorage.setItem('lang', l);
      } catch (e) {}
    }
    const langHandlers = [];
    langBtns.forEach((b) => {
      const h = () => setLang(b.dataset.setLang);
      b.addEventListener('click', h);
      langHandlers.push([b, h]);
    });
    cleanups.push(() => langHandlers.forEach(([b, h]) => b.removeEventListener('click', h)));
    try {
      const saved = localStorage.getItem('lang');
      if (saved === 'ko' || saved === 'en') setLang(saved);
      else if ((navigator.language || '').toLowerCase().startsWith('ko')) setLang('ko');
    } catch (e) {}

    // ───── lightbox ─────
    const lb = document.getElementById('lightbox');
    if (lb) {
      const lbImg = document.getElementById('lb-img');
      const lbMeta = document.getElementById('lb-meta');
      let currentGal = null;
      let currentIdx = 0;

      const galLabel = (gal) => {
        if (!gal) return '';
        const base = gal.replace(/-(en|ko)$/, '').replace(/-/g, ' ');
        return base.replace(/\b\w/g, (m) => m.toUpperCase());
      };
      function openLB(gal, idx) {
        currentGal = gal;
        currentIdx = idx;
        const arr = window.GALLERIES[gal] || [];
        lbImg.src = arr[idx] || '';
        lbMeta.textContent = galLabel(gal) + ' · ' + (idx + 1) + ' / ' + arr.length;
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
      function closeLB() {
        lb.classList.remove('open');
        lb.setAttribute('aria-hidden', 'true');
        lbImg.src = '';
        document.body.style.overflow = '';
      }
      function step(d) {
        const arr = window.GALLERIES[currentGal] || [];
        if (!arr.length) return;
        currentIdx = (currentIdx + d + arr.length) % arr.length;
        lbImg.src = arr[currentIdx];
        lbMeta.textContent =
          galLabel(currentGal) + ' · ' + (currentIdx + 1) + ' / ' + arr.length;
      }
      const shotHandlers = [];
      document.querySelectorAll('a.shot').forEach((a) => {
        const h = (e) => {
          e.preventDefault();
          openLB(a.dataset.gal, parseInt(a.dataset.i, 10) || 0);
        };
        a.addEventListener('click', h);
        shotHandlers.push([a, h]);
      });
      cleanups.push(() => shotHandlers.forEach(([a, h]) => a.removeEventListener('click', h)));

      const onLbClick = (e) => {
        if (e.target === lb || e.target === lbImg || e.target.classList.contains('lb-close'))
          closeLB();
      };
      lb.addEventListener('click', onLbClick);
      cleanups.push(() => lb.removeEventListener('click', onLbClick));

      const lbp = document.querySelector('.lb-prev');
      const lbn = document.querySelector('.lb-next');
      const onPrev = (e) => {
        e.stopPropagation();
        step(-1);
      };
      const onNext = (e) => {
        e.stopPropagation();
        step(1);
      };
      if (lbp) lbp.addEventListener('click', onPrev);
      if (lbn) lbn.addEventListener('click', onNext);
      cleanups.push(() => {
        if (lbp) lbp.removeEventListener('click', onPrev);
        if (lbn) lbn.removeEventListener('click', onNext);
      });

      const onKey = (e) => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      };
      document.addEventListener('keydown', onKey);
      cleanups.push(() => document.removeEventListener('keydown', onKey));
    }

    // ───── scroll progress bar ─────
    const segs = Array.from(document.querySelectorAll('#scroll-progress .seg'));
    const sectionIds = ['intro', 'profile', 'work', 'stack', 'timeline', 'contact'];
    function getSections() {
      return sectionIds.map(id =>
        id === 'intro'
          ? document.querySelector('section.intro')
          : document.getElementById(id)
      ).filter(Boolean);
    }
    function updateProgress() {
      const sections = getSections();
      if (!sections.length || !segs.length) return;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const viewH = window.innerHeight;
      sections.forEach((sec, i) => {
        const seg = segs[i];
        if (!seg) return;
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (scrollTop + viewH >= bottom) {
          seg.classList.add('done');
          seg.classList.remove('active');
        } else if (scrollTop + viewH > top) {
          const p = Math.min(1, (scrollTop + viewH - top) / sec.offsetHeight);
          seg.style.setProperty('--p', p);
          seg.classList.add('active');
          seg.classList.remove('done');
        } else {
          seg.classList.remove('done', 'active');
          seg.style.setProperty('--p', 0);
        }
      });
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
    cleanups.push(() => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    });

    // ───── reveal ─────
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.style.opacity = '1';
              e.target.style.transform = 'none';
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.04 }
      );
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduce) {
        document
          .querySelectorAll('section, .tl-row, .cap, .gallery .shot, .plist a')
          .forEach((el) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px)';
            el.style.transition = 'opacity .5s ease, transform .5s ease';
            io.observe(el);
          });
      }
      cleanups.push(() => io.disconnect());
    }

    // ───── first-load screen ─────
    const loadStartedAt =
      window.performance && performance.now ? performance.now() : Date.now();
    function markLoaded() {
      const now =
        window.performance && performance.now ? performance.now() : Date.now();
      const elapsed = now - loadStartedAt;
      const delay = Math.max(0, 520 - elapsed);
      window.setTimeout(() => {
        document.documentElement.classList.add('site-loaded');
        document.body.classList.add('page-enter');
      }, delay);
    }
    if (document.readyState === 'complete') markLoaded();
    else window.addEventListener('load', markLoaded, { once: true });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
