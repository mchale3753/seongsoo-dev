'use client';

import { useEffect, useRef } from 'react';

export default function ProjectModal({ details }) {
  const modalRef   = useRef(null);
  const bodyRef    = useRef(null);
  const lbRef      = useRef(null);
  const lbImgRef   = useRef(null);
  const lbPrevRef  = useRef(null);
  const lbNextRef  = useRef(null);
  const galState   = useRef({ gal: null, idx: 0 });

  useEffect(() => {
    const modal  = modalRef.current;
    const body   = bodyRef.current;
    const lb     = lbRef.current;
    const lbImg  = lbImgRef.current;
    const lbPrev = lbPrevRef.current;
    const lbNext = lbNextRef.current;
    if (!modal || !body) return;
    const cleanups = [];

    // ── lightbox ──
    function openLB(gal, idx) {
      if (!lb || !lbImg) return;
      const arr = (window.GALLERIES || {})[gal] || [];
      galState.current = { gal, idx };
      lbImg.src = arr[idx] || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLB() {
      if (!lb || !lbImg) return;
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      lbImg.src = '';
    }
    function stepLB(d) {
      const { gal, idx } = galState.current;
      const arr = (window.GALLERIES || {})[gal] || [];
      if (!arr.length) return;
      const next = (idx + d + arr.length) % arr.length;
      galState.current.idx = next;
      if (lbImg) lbImg.src = arr[next];
    }

    const onLbClick  = (e) => { if (e.target === lb || e.target.classList.contains('proj-lb-close')) closeLB(); };
    const onLbPrev   = (e) => { e.stopPropagation(); stepLB(-1); };
    const onLbNext   = (e) => { e.stopPropagation(); stepLB(1); };
    if (lb)     { lb.addEventListener('click', onLbClick); cleanups.push(() => lb.removeEventListener('click', onLbClick)); }
    if (lbPrev) { lbPrev.addEventListener('click', onLbPrev); cleanups.push(() => lbPrev.removeEventListener('click', onLbPrev)); }
    if (lbNext) { lbNext.addEventListener('click', onLbNext); cleanups.push(() => lbNext.removeEventListener('click', onLbNext)); }

    // ── modal ──
    function attachShots() {
      body.querySelectorAll('a.shot').forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openLB(a.dataset.gal, parseInt(a.dataset.i, 10) || 0);
        });
      });
    }

    function attachNavLinks() {
      body.querySelectorAll('.proj-nav a').forEach((a) => {
        a.addEventListener('click', (e) => {
          const href  = a.getAttribute('href') || '';
          const match = href.match(/\/projects\/([^/]+)\//);
          if (!match || !details[match[1]]) return;
          e.preventDefault();
          e.stopPropagation();
          openModal(match[1]);
        });
      });
    }

    function openModal(slug) {
      const proj = details[slug];
      if (!proj) return;
      body.innerHTML = proj.main;
      attachShots();
      attachNavLinks();
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // scroll modal body to top after paint
      const mbox = modal.querySelector('.proj-modal-box');
      if (mbox) { mbox.scrollTop = 0; requestAnimationFrame(() => { mbox.scrollTop = 0; }); }
    }

    function closeModal() {
      closeLB();
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      body.innerHTML = '';
    }

    // intercept .plist a clicks via delegation
    const onDocClick = (e) => {
      const link = e.target.closest('.plist a');
      if (!link) return;
      const href  = link.getAttribute('href') || '';
      const match = href.match(/\/projects\/([^/]+)\//);
      if (!match || !details[match[1]]) return;
      e.preventDefault();
      openModal(match[1]);
    };
    document.addEventListener('click', onDocClick);
    cleanups.push(() => document.removeEventListener('click', onDocClick));

    // backdrop click
    const onBackdrop = (e) => { if (e.target === modal) closeModal(); };
    modal.addEventListener('click', onBackdrop);
    cleanups.push(() => modal.removeEventListener('click', onBackdrop));

    // keyboard
    const onKey = (e) => {
      if (lb && lb.classList.contains('open')) {
        if (e.key === 'Escape')      { closeLB(); return; }
        if (e.key === 'ArrowLeft')   { stepLB(-1); return; }
        if (e.key === 'ArrowRight')  { stepLB(1); return; }
      }
      if (modal.classList.contains('open') && e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', onKey);
    cleanups.push(() => document.removeEventListener('keydown', onKey));

    return () => cleanups.forEach((fn) => fn());
  }, [details]);

  function handleClose() {
    const modal = modalRef.current;
    const body  = bodyRef.current;
    const lb    = lbRef.current;
    const lbImg = lbImgRef.current;
    if (lb)    { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
    if (lbImg) { lbImg.src = ''; }
    if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
    if (body)  { body.innerHTML = ''; }
    document.body.style.overflow = '';
  }

  return (
    <>
      {/* ── project detail modal ── */}
      <div
        className="proj-modal"
        id="proj-modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-hidden="true"
        aria-label="Project detail"
      >
        <div className="proj-modal-box">
          <div className="proj-modal-topbar">
            <button
              className="proj-modal-close"
              type="button"
              aria-label="Close"
              onClick={handleClose}
            >
              ×
            </button>
          </div>
          <div className="proj-modal-body" ref={bodyRef} />
        </div>
      </div>

      {/* ── inline lightbox for gallery shots inside modal ── */}
      <div
        className="lightbox proj-lightbox"
        ref={lbRef}
        role="dialog"
        aria-modal="true"
        aria-hidden="true"
      >
        <button className="lb-close proj-lb-close" type="button" aria-label="Close image">×</button>
        <button className="lb-nav lb-prev" ref={lbPrevRef} type="button" aria-label="Previous">‹</button>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={lbImgRef} alt="" />
        <button className="lb-nav lb-next" ref={lbNextRef} type="button" aria-label="Next">›</button>
      </div>
    </>
  );
}
