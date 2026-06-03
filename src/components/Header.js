import Link from 'next/link';

// Shared top navigation. `active` is one of: index | career | projects | contact
export default function Header({ active }) {
  const cls = (k) => (active === k ? 'active' : undefined);
  return (
    <header className="top">
      <div className="wrap top-row">
        <Link href="/" className="brand">
          <span className="dot"></span>
          <strong>Seongsoo Shin</strong>
        </Link>
        <nav id="primary-nav" className="nav" aria-label="Primary">
          <div className="mobile-nav-head">
            <strong>Seongsoo Shin</strong>
            <span data-i18n-en="">Full-stack Software Engineer</span>
            <span data-i18n-ko="">풀스택 개발자</span>
            <span data-i18n-en="">Available from March 2027</span>
            <span data-i18n-ko="">2027년 3월부터 합류 가능</span>
          </div>
          <Link href="/" className={cls('index')}>
            <span className="num">00</span>
            <span data-i18n-en="">Index</span>
            <span data-i18n-ko="">인덱스</span>
          </Link>
          <Link href="/projects/" className={cls('projects')}>
            <span className="num">01</span>
            <span data-i18n-en="">Projects</span>
            <span data-i18n-ko="">프로젝트</span>
          </Link>
          <Link href="/contact/" className={cls('contact')}>
            <span className="num">02</span>
            <span data-i18n-en="">Contact</span>
            <span data-i18n-ko="">연락</span>
          </Link>
          <span className="lang-toggle" role="group" aria-label="Language">
            <button type="button" data-set-lang="en" className="active" title="English">
              EN
            </button>
            <button type="button" data-set-lang="ko" title="한국어">
              KO
            </button>
          </span>
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-label="Menu"
          aria-expanded="false"
          aria-controls="primary-nav"
        >
          <span className="bars" aria-hidden="true">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  );
}
