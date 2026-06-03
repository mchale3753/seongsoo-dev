import Link from 'next/link';

// Shared footer. `links` is the right-hand nav cluster (varies per page).
export default function Footer({ links }) {
  return (
    <footer className="foot">
      <div className="wrap">
        <div>
          © <span id="y"></span> Seongsoo Shin
        </div>
        <div>{links}</div>
      </div>
    </footer>
  );
}

// Convenience link clusters mirroring each original page's footer.
export const FooterLinks = {
  index: (
    <>
      <a href="mailto:inbox@seongsoo.dev">inbox@seongsoo.dev</a>
      &nbsp;·&nbsp;
      <a href="#top" data-i18n-en="">Top ↑</a>
      <a href="#top" data-i18n-ko="">맨 위 ↑</a>
    </>
  ),
  career: (
    <>
      <Link href="/" data-i18n-en="">← Index</Link>
      <Link href="/" data-i18n-ko="">← 인덱스</Link>
      &nbsp;·&nbsp;
      <Link href="/projects/" data-i18n-en="">Projects →</Link>
      <Link href="/projects/" data-i18n-ko="">프로젝트 →</Link>
    </>
  ),
  projects: (
    <>
      <Link href="/" data-i18n-en="">← Index</Link>
      <Link href="/" data-i18n-ko="">← 인덱스</Link>
      &nbsp;·&nbsp;
      <Link href="/contact/" data-i18n-en="">Contact →</Link>
      <Link href="/contact/" data-i18n-ko="">연락 →</Link>
    </>
  ),
  contact: (
    <>
      <Link href="/projects/" data-i18n-en="">← Projects</Link>
      <Link href="/projects/" data-i18n-ko="">← 프로젝트</Link>
      &nbsp;·&nbsp;
      <Link href="/" data-i18n-en="">Index ↑</Link>
      <Link href="/" data-i18n-ko="">인덱스 ↑</Link>
    </>
  ),
  project: (
    <>
      <Link href="/projects/" data-i18n-en="">← All projects</Link>
      <Link href="/projects/" data-i18n-ko="">← 전체 프로젝트</Link>
      &nbsp;·&nbsp;
      <Link href="/contact/" data-i18n-en="">Contact →</Link>
      <Link href="/contact/" data-i18n-ko="">연락 →</Link>
    </>
  ),
};
