import './site.css';

const META_BASE = {
  metadataBase: new URL('https://seongsoo.dev'),
};

export const viewport = {
  themeColor: '#0a0a0a',
};

export const metadata = {
  ...META_BASE,
  title: 'Seongsoo Shin — Full-stack Engineer',
  description:
    'Seongsoo Shin (신성수). Full-stack engineer based in South Korea. Available from March 2027.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/social/icon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/assets/social/apple-touch-icon.png',
  },
};

// Pre-paint language attribute + first-load class exactly like the original inline script.
const langBootstrap = `(function(){try{var l=localStorage.getItem('lang');if(!l){l=((navigator.language||'').toLowerCase().startsWith('ko'))?'ko':'en';}document.documentElement.setAttribute('data-lang',l);document.documentElement.setAttribute('lang',l==='ko'?'ko':'en');}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.css"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: langBootstrap }} />
      </head>
      <body id="top"><div id="scroll-progress" aria-hidden="true"><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span><span class="seg"></span></div>{children}</body>
    </html>
  );
}
