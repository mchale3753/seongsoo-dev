# 포트폴리오 사이트 (신성수 / Seongsoo Shin)

생성 시각: 2026-05-20 (자동 cron 작업)
경로: `/mnt/c/Users/intercluster/portfolio-site/index.html` (단일 파일, 외부 종속성 없음 — Google Fonts 만 CDN)

## 무엇이 만들어졌나

`index.html` 1개 파일 안에 다음 구성:

1. **Header / 스티키 내비** — Inter + JetBrains Mono, 다크 모노 미니멀
2. **Hero** — 영문 헤드라인 ("Solo-built platforms across eight industries"), lede, CTA(SEEK · LinkedIn · 작업 보기 · 연락), 우측 at-a-glance 카드
3. **Signal strip** — 4분할 (8개 산업 · 10+년 · 12 프로젝트 · 4개 언어)
4. **Thesis** — 본인이 정의한 0→1·도메인 횡단 메시지를 영문 미려체로 풀어낸 섹션
5. **Selected work** — 9개 featured 프로젝트 (Nmodelin Hero, Ranking GG, Bullida, S-TEAM, D-HUB, Unibook, Neurodio, BEXCO MICE CRM, Cashbin) 각각 역할·하이라이트·스택 chip
6. **Career timeline** — 군복무 → Nmodelin CTO → Amplified Codes → Bullida → Beeplus → Bium (Cashbin → Ranking GG 사내 전환 명시) → 안산 에이전시 → SA-MP origin
7. **Capabilities** — Front-end / Back-end / Data·infra / Mobile·native / Payments / Growth infra / Earlier breadth / Operating 8개 컬럼
8. **About** — 짧고 단단한 자기 서술 + serif 인용 + 우측 quick-signals 카드 (이주 시기, 비자, 언어 등)
9. **Contact** — 이메일(업무/개인), LinkedIn, SEEK, Wishket, Freemoa, GitHub, 전화

## 디자인 의도

- **다크 모노 미니멀** — Linear / Vercel / Raycast 계열. 본인 기존 portfolio.html 토큰 (`--bg:#0a0a0a`, accent `#7C5CFF`) 계승
- **타이포** — Inter (sans) · JetBrains Mono (mono · 라벨/메타) · Instrument Serif (헤드라인 강조·인용)
- **반응형** · **키보드 포커스** · **prefers-reduced-motion** 존중 · 부드러운 IntersectionObserver 페이드인
- **인쇄용 résumé** — `@media print` 로 라이트 모드 1-2 페이지 이력서 출력 가능 (`Print as résumé` 푸터 링크)
- AI 디자인 슬롭(랜덤 그라디언트·가짜 metrics·스톡 사진·rainbow chips) 회피

## 사용한 vault 소스

위치: `/mnt/c/Users/intercluster/Documents/MyWiki`

- `areas/self/종합.md` — 정체성·연락처·취향
- `areas/career/career.md` — 경력 timeline
- `areas/career/positions/해외취업.md` — 호주 lane, 어휘 뱅크, 비자, 연봉 목표
- `areas/career/positions/nmodelin.md` — CTO 상세
- `resources/portfolio/portfolio.md` — 12 프로젝트 검증된 사실
- `resources/portfolio/portfolio-site-plan.md` — 본인이 직접 만든 hero/featured/supporting 큐레이션 플랜
- `resources/resume/2024-09-06.md` — 영문 이력서 어휘
- `areas/self/심리분석.md`, `areas/self/심리검사.md` — 톤 의사결정(과시 회피·차분·dense)
- `portfolio.html` (기존) — 디자인 토큰 추출용

## 검증 상태

- 파일 작성: ✅ `48,385 bytes` (`/mnt/c/Users/intercluster/portfolio-site/index.html`)
- HTML 문법: lint 미실행 (HTML linter 부재)
- 브라우저 비주얼 확인: ❌ (cron 환경, 사용자 부재로 미실시)
- 사용자가 직접 브라우저에서 열어 확인 권장: `start /mnt/c/Users/intercluster/portfolio-site/index.html` (Windows: 더블클릭)

## 사용자 확인 필요 (사이트 내 내용)

다음 항목들은 vault에 명시되어 있어 사용했으나 본인 검토 후 수정·삭제 권장:

| 항목 | 사이트 표기 | 확인 포인트 |
|---|---|---|
| 영문명 | Seongsoo Shin | vault directive (2026-05-16 "일단 고정"). Sean Shin 잔존 표기와 정합 OK. |
| 이메일 (업무) | inbox@seongsoo.dev | 공개 연락처와 정합 |
| 전화 | +82 10-4056-0416 | 공개 노출 여부 본인 결정 |
| Nmodelin 수치 | "Series-A 자금", "cross-border 매출" | NDA·합의 범위 vault 표시는 ambiguous — 노출 보수적으로 표현, 구체 매출액·MRR은 의도적으로 미기재 |
| Ranking GG 동접 | "~100 concurrent" | vault 명시 |
| 영어 수준 | "Working professional · written-fluent" | IELTS 등 점수 vault 미수록, 본인 검토 후 수정 |
| GitHub | `@mchale3753` 링크 | 공개 repo 0건 — launch 전 첫 commit 권장 |
| 군복무 표기 | 부대명 부분 노출 | OPSEC 차원에서 본인이 수위 결정 |
| Cashbin/Ranking GG 연도 | 2017 / 2018-2019 | "Ranking GG 이직" 오기 회피 명시함 |

## 사실 정확성 가드

- "Ranking GG 이직" 표현 X — "internal product transition" 으로 표기
- Freemoa의 동명이인 "㈜비움 922만원" 계약 미반영
- 부재 자산(과거 영문 포트폴리오 사이트 등) 현재형 주장 X
- 가짜 metrics / 가짜 testimonial / 보증되지 않은 수상 이력 추가 X

## 다음 단계 권장

1. **로컬 열어보기**: 윈도우 탐색기에서 `C:\Users\intercluster\portfolio-site\index.html` 더블클릭
2. **사실 검토**: 위 표의 "확인 포인트" 9개 항목
3. **GitHub 첫 commit**: `mchale3753/portfolio` 신규 repo → 이 단일 HTML 파일 push → GitHub Pages 활성화 시 `mchale3753.github.io/portfolio` 즉시 공개
4. **배포 옵션**:
   - GitHub Pages (무료, 가장 간단)
   - Vercel/Cloudflare Pages — 도메인 `seongsoo.dev` 연결
   - 본인이 plan 에 잡아둔 Next.js + TS 재작성은 별도 lane (이 HTML 은 즉시 가용 임시 site)
5. **iteration**:
   - Wishket/Freemoa 마스터 표(31건)에서 추가로 굵직한 프로젝트 1-2건 featured 승격 검토
   - Nmodelin 케이스 스터디 (`case-study-drafts.md`) 별도 페이지화
   - 영어 면접용 어휘 뱅크(`해외취업.md` A-I) 의 헤드라인 5종을 A/B 테스트
