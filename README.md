# 숲파트너스 투자 수익 시뮬레이터

프리미엄 투자 수익 시뮬레이터 웹 애플리케이션입니다. Next.js 14와 Tailwind CSS로 구현되었으며, Vercel에서 쉽게 배포할 수 있습니다.

## 🚀 주요 기능

- **상품 안내**: 6가지 투자 상품 및 투자자 유형별 세율 정보
- **상품별 수익 비교**: 투자 금액과 유형에 따른 수익 비교 및 인사이트
- **전략별 추가 수익**: 기준 대비 추가 수익 계산
- **현금흐름 설계**: 목표 월 수익 달성을 위한 필요 투자금 계산
- **여유 시뮬레이터**: 투자 수익을 삶의 여유로 환산 (Chart.js 시각화 포함)
- **URL 기반 결과 공유**: 시뮬레이션 결과를 고유 URL로 공유 가능

## 📋 사전 요구사항

- Node.js 18.0 이상
- npm 또는 yarn

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 2. 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 으로 접속합니다.

### 3. 프로덕션 빌드

```bash
npm run build
npm start
# 또는
yarn build
yarn start
```

## 📁 프로젝트 구조

```
webapp/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # 루트 레이아웃
│   ├── page.tsx             # 메인 페이지 (상품 안내)
│   ├── globals.css          # 전역 스타일
│   ├── comparison/          # 상품별 수익 비교 페이지
│   ├── extra/               # 전략별 추가 수익 페이지
│   ├── target/              # 현금흐름 설계 페이지
│   └── simulator/           # 여유 시뮬레이터 페이지
│
├── components/              # 재사용 가능한 컴포넌트
│   ├── Header.tsx           # 헤더 네비게이션
│   ├── Footer.tsx           # 푸터
│   ├── LoadingOverlay.tsx   # 로딩 오버레이
│   └── LeisureChart.tsx     # Chart.js 차트 컴포넌트
│
├── data/                    # 정적 데이터
│   └── investment-data.json # 투자 상품 및 수익률 데이터
│
├── lib/                     # 유틸리티 및 비즈니스 로직
│   ├── types.ts             # TypeScript 타입 정의
│   ├── formatters.ts        # 포맷팅 함수 (통화, 한글)
│   ├── calculations.ts      # 수익 계산 로직
│   └── dataService.ts       # 데이터 서비스 레이어
│
└── public/                  # 정적 파일
```

## 💾 데이터 관리

### 데이터 구조

모든 투자 상품 데이터는 `data/investment-data.json`에 정적 JSON 형태로 저장되어 있습니다.

### 데이터 업데이트 방법

1. `data/investment-data.json` 파일을 수정합니다.
2. 다음 구조를 유지하세요:
   - `products`: 상품 정보 (수익률, 설명, 특징)
   - `investorTypes`: 투자자 유형 (세율 정보)
   - `comparisonData`: 금액별/상품별/유형별 수익 데이터

3. 수정 후 개발 서버를 재시작합니다.

### 데이터 예시

```json
{
  "products": [
    {
      "code": "abc",
      "name": "ABC 투자",
      "rate": 0.08,
      "rateDisplay": "8%",
      "subtitle": "수도권 핵심 입지 기반의 안정형 전략",
      "features": [...]
    }
  ],
  "comparisonData": {
    "500000000": {
      "abc": {
        "individual": { "annual": 29000000, "monthly": 2416667 },
        ...
      }
    }
  }
}
```

## 🚀 Vercel 배포

### 배포 방법

1. GitHub에 코드를 푸시합니다.
2. [Vercel](https://vercel.com)에 가입/로그인합니다.
3. "New Project" 클릭
4. GitHub 저장소를 선택합니다.
5. 기본 설정을 그대로 사용하고 "Deploy" 클릭

### 환경 변수 (필요시)

현재는 환경 변수가 필요하지 않지만, 추후 Google Sheets API를 사용하려면:

```env
GOOGLE_SHEETS_API_KEY=your_api_key
GOOGLE_SHEETS_SPREADSHEET_ID=your_spreadsheet_id
```

## 🎨 스타일 커스터마이징

### 브랜드 색상 변경

`tailwind.config.js` 파일에서 색상을 수정할 수 있습니다:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#053c3c',  // 메인 색상
        dark: '#074d4d',
      },
      accent: {
        DEFAULT: '#d4a574',  // 강조 색상
        dark: '#c29465',
      },
    },
  },
}
```

### 글로벌 스타일

`app/globals.css`에서 전역 스타일을 수정할 수 있습니다.

## 📱 반응형 디자인

모든 페이지는 모바일, 태블릿, 데스크톱에서 최적화되어 있습니다.

- 모바일: < 768px
- 태블릿: 768px ~ 1024px
- 데스크톱: > 1024px

## 🔗 URL 기반 결과 공유

시뮬레이터 페이지는 URL 파라미터를 통해 결과를 공유할 수 있습니다:

```
/simulator?amount=500000000&product=year2&type=individual&period=1
```

## 🧪 기술 스택

- **Framework**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **차트**: Chart.js + react-chartjs-2
- **폰트**: Noto Sans KR (Google Fonts)

## 📄 라이선스

Copyright © 2025 숲파트너스. All rights reserved.

## 🤝 지원

문제가 발생하거나 질문이 있으신 경우, GitHub Issues를 통해 문의해 주세요.

## 🔄 업데이트 이력

### v1.0.0 (2025-12-10)
- 초기 릴리스
- Google Apps Script에서 Next.js로 마이그레이션
- URL 기반 결과 공유 기능 추가
- Tailwind CSS로 스타일 재구성
- 반응형 디자인 구현
