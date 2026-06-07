'use client';

import { useEffect, useRef } from 'react';

// ── body scroll lock (iOS Safari safe) ──────────────────────────────────────
// lockBodyScroll / unlockBodyScroll은 모달이 닫혀 있을 때만 호출해야 한다.
// 이미 lock된 상태에서 openModal을 재호출(프로젝트 간 이동)하면 lock을 건드리지 않음.
function lockBodyScroll() {
  if (document.body.dataset.scrollLocked) return; // 이미 잠긴 상태면 skip
  const scrollY = window.scrollY;
  document.body.dataset.scrollY = scrollY;
  document.body.dataset.scrollLocked = '1';
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = '100%';
}
function unlockBodyScroll() {
  if (!document.body.dataset.scrollLocked) return;
  const scrollY = parseInt(document.body.dataset.scrollY || '0', 10);
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  delete document.body.dataset.scrollY;
  delete document.body.dataset.scrollLocked;
  window.scrollTo(0, scrollY);
}

// ── focus trap ───────────────────────────────────────────────────────────────
const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
function trapFocus(container, e) {
  const nodes = Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (n) => !n.closest('[aria-hidden="true"]')
  );
  if (!nodes.length) return;
  const first = nodes[0];
  const last  = nodes[nodes.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
}

export default function ProjectModal({ details }) {
  const modalRef   = useRef(null);
  const bodyRef    = useRef(null);
  const lbRef      = useRef(null);
  const lbImgRef   = useRef(null);
  const lbPrevRef  = useRef(null);
  const lbNextRef  = useRef(null);
  const galState   = useRef({ gal: null, idx: 0 });
  const prevFocus  = useRef(null); // 모달 열기 전 포커스 복원용

  useEffect(() => {
    const modal  = modalRef.current;
    const body   = bodyRef.current;
    const lb     = lbRef.current;
    const lbImg  = lbImgRef.current;
    const lbPrev = lbPrevRef.current;
    const lbNext = lbNextRef.current;
    if (!modal || !body) return;
    const cleanups = [];

    // ── lightbox ──────────────────────────────────────────────────────────────
    function openLB(gal, idx) {
      if (!lb || !lbImg) return;
      const arr = (window.GALLERIES || {})[gal] || [];
      galState.current = { gal, idx };
      lbImg.src = arr[idx] || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
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

    // ── modal helpers ─────────────────────────────────────────────────────────
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
      body.querySelectorAll('.proj-nav a, .crumb a').forEach((a) => {
        a.addEventListener('click', (e) => {
          const href = a.getAttribute('href') || '';

          // 다른 프로젝트 → 모달 콘텐츠 교체
          const projMatch = href.match(/\/projects\/([^/]+)\//);
          if (projMatch && details[projMatch[1]]) {
            e.preventDefault();
            e.stopPropagation();
            openModal(projMatch[1]);
            return;
          }

          // 섹션 앵커 / 홈 → 모달 닫고 이동
          const isSection = href === '/projects/' || href === '/' || href.startsWith('/#');
          if (isSection) {
            e.preventDefault();
            e.stopPropagation();
            closeModal();
            if (href === '/projects/' || href === '/') {
              window.location.hash = href === '/projects/' ? '#projects' : '#top';
            } else {
              const hash   = href.replace(/^\//, '');
              const target = document.querySelector(hash);
              if (target) target.scrollIntoView({ behavior: 'smooth' });
              else window.location.href = href;
            }
          }
        });
      });
    }

    function openModal(slug) {
      const proj = details[slug];
      if (!proj) return;

      // 처음 열 때만 포커스 저장 + body lock
      if (!modal.classList.contains('open')) {
        prevFocus.current = document.activeElement;
        lockBodyScroll();
      }

      // 콘텐츠 교체 + 스크롤 리셋
      body.scrollTop = 0;
      body.innerHTML = proj.main;
      attachShots();
      attachNavLinks();

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');

      // 닫기 버튼으로 포커스 이동
      const closeBtn = modal.querySelector('.proj-modal-close');
      if (closeBtn) closeBtn.focus();

      body.scrollTop = 0;
      requestAnimationFrame(() => {
        body.scrollTop = 0;
        requestAnimationFrame(() => { body.scrollTop = 0; });
      });
    }

    function closeModal() {
      closeLB();
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      unlockBodyScroll();
      body.innerHTML = '';
      // 포커스 복원
      if (prevFocus.current && typeof prevFocus.current.focus === 'function') {
        prevFocus.current.focus();
        prevFocus.current = null;
      }
    }

    // 페이지 내 프로젝트 링크 전역 인터셉트
    const onDocClick = (e) => {
      if (modal.classList.contains('open')) return; // 모달 열려있으면 attachNavLinks 처리
      const link = e.target.closest('a[href]');
      if (!link) return;
      const href  = link.getAttribute('href') || '';
      const match = href.match(/\/projects\/([^/]+)\//);
      if (!match || !details[match[1]]) return;
      e.preventDefault();
      openModal(match[1]);
    };
    document.addEventListener('click', onDocClick);
    cleanups.push(() => document.removeEventListener('click', onDocClick));

    // 백드롭 클릭
    const onBackdrop = (e) => { if (e.target === modal) closeModal(); };
    modal.addEventListener('click', onBackdrop);
    cleanups.push(() => modal.removeEventListener('click', onBackdrop));

    // 키보드: Escape / 화살표 / Tab 트랩
    const onKey = (e) => {
      if (lb && lb.classList.contains('open')) {
        if (e.key === 'Escape')     { closeLB(); return; }
        if (e.key === 'ArrowLeft')  { stepLB(-1); return; }
        if (e.key === 'ArrowRight') { stepLB(1); return; }
      }
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') { closeModal(); return; }
      if (e.key === 'Tab')    { trapFocus(modal, e); }
    };
    document.addEventListener('keydown', onKey);
    cleanups.push(() => document.removeEventListener('keydown', onKey));

    return () => cleanups.forEach((fn) => fn());
  }, [details]);

  // X 버튼 — useEffect 밖이므로 unlockBodyScroll 직접 호출
  function handleClose() {
    const modal = modalRef.current;
    const body  = bodyRef.current;
    const lb    = lbRef.current;
    const lbImg = lbImgRef.current;
    if (lb)    { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); }
    if (lbImg) { lbImg.src = ''; }
    if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
    if (body)  { body.innerHTML = ''; }
    unlockBodyScroll();
    if (prevFocus.current && typeof prevFocus.current.focus === 'function') {
      prevFocus.current.focus();
      prevFocus.current = null;
    }
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
