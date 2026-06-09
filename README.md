# 구독도시 — 랜딩 페이지

취향에 맞는 도시를 찾아주는 구독도시 앱의 사전등록 랜딩 페이지입니다.
별도 빌드 도구 없이 브라우저에서 바로 도는 **순수 HTML/CSS/JS** 정적 사이트예요.

## 폴더 구성

```
index.html              ← 페이지 (Vercel 진입점)
match-engine.js         ← 매칭 테스트 로직 + 결과 화면
fonts/                  ← 을유1945 웹폰트 (Regular, SemiBold)
images/                 ← 사진 (alley.jpg, sea.jpg)
```

이 4가지(폴더 포함)를 **모두 함께** 올려야 정상 작동합니다.
`index.html`이 같은 위치의 `match-engine.js`·`fonts/`·`images/`를 상대경로로 불러오기 때문이에요.

## GitHub + Vercel 배포 방법

1. 이 폴더의 **모든 파일·폴더**를 GitHub 저장소(repository)에 올립니다.
   (`index.html`이 저장소 최상위에 있어야 합니다.)
2. [vercel.com](https://vercel.com) → **Add New → Project** → 해당 GitHub 저장소 선택.
3. 설정은 **그대로 두고**(Framework Preset: *Other*, 빌드 명령 없음) **Deploy** 클릭.
4. 끝. 이후 GitHub에 커밋·푸시할 때마다 Vercel이 자동으로 다시 배포합니다.

> 이미 다른 사이트를 Vercel로 운영 중이라면, 이 폴더를 그 저장소의 하위 폴더(예: `gudokdosi/`)에 넣어 `사이트주소/gudokdosi/` 로 열 수도 있습니다.

## 배포 전 마지막 확인 (중요)

- **사전등록 폼 링크** — `match-engine.js` 맨 아래 `CONFIG.formUrl` 이 실제 구글폼 주소인지 확인하세요. (현재 예시 주소가 들어 있을 수 있어요.)
  ```js
  const CONFIG = {
    formUrl: "https://forms.gle/여기에_실제_폼_주소",
    instaUrl: "#",
    contactEmail: "conipoky1347@gmail.com"
  };
  ```
- **인스타·문의 이메일** — 같은 `CONFIG`에서 수정 가능합니다.

## 폰트 라이선스 메모

- **을유1945(Eulyoo1945)** — 웹 임베딩 허용 폰트. 단 브랜드명·로고·슬로건(BI/CI)에는 사용 금지라, 본문·제목 등 일반 텍스트에만 적용했습니다. "구독도시" 브랜드명과 메인 히어로 슬로건은 Pretendard로 유지하고 있습니다.
- **Pretendard** — 본문·UI용. 외부 CDN으로 불러오며 별도 파일이 필요 없습니다.
