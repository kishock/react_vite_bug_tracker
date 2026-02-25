# Bug Tracker Dashboard

https://react-vite-bug-tracker.pages.dev/

React + Vite 기반의 버그 트래킹 대시보드입니다.  
로그인/회원가입, 역할(Role) 관리, 버그 칸반 보드, 담당자 할당(Assign), 수정 이력(History), 코멘트(댓글), 테마/언어 설정까지 포함한 단일 페이지 앱(SPA)입니다.

## 1. 핵심 기능

### 1) 인증/사용자

- 회원가입 / 로그인
- 로그인한 사용자만 대시보드 접근 가능
- 사용자 역할(Role) 구분
  - `Developer`
  - `QA`
  - `Customer`
- 로그아웃 기능

### 2) 버그 관리

- 버그 등록(Create)
- 버그 목록 조회(Read)
- 버그 수정(Update)
- 버그 삭제(Delete)
  - 삭제 전 복구 불가 경고(confirm) 표시
- 상태(Status)
  - `Open`
  - `In Progress`
  - `Done`
- 심각도(Severity)
  - `Low`
  - `Medium`
  - `High`
  - `Critical`

### 3) 보드/탐색

- 칸반 보드(상태별 3컬럼)
- 상태/심각도 필터
- 제목/설명 검색
- 필터 바 우측에 `Showing X ...` 표시

### 4) 협업 기능

- 버그 담당 개발자 Assign
  - Developer 역할 사용자만 할당 가능
- 수정 이력(History) 저장
  - 수정자 아이디
  - 수정 시각
  - 변경 필드(from -> to)
- 코멘트(메시지) 기능
  - 등록
  - 본인 코멘트 수정/삭제
  - 작성자/시간 표시

### 5) 사용성

- 등록/수정 폼 하단 고정 액션 + 맨 아래 `목록으로` 이동 버튼
- 수정 이력 / 코멘트 섹션 펼침/숨김 토글(화살표)
- 다크/화이트 테마
- 한글/영어 언어 전환
- 새로고침 후 데이터 유지(`localStorage`)

## 2. 프로젝트 구조

```text
src/
  components/
    AuthForm.jsx      # 로그인/회원가입 UI
    BugForm.jsx       # 버그 등록/수정 UI + 이력/코멘트
    BugList.jsx       # 칸반 보드(3컬럼)
    BugItem.jsx       # 단일 버그 카드
    Filters.jsx       # 필터/검색 + Showing 카운트
  App.jsx             # 상태 관리, 비즈니스 로직, 화면 전환
  App.css             # 화면 스타일
  index.css           # 글로벌 스타일
  main.jsx            # 앱 진입점
```

## 3. 화면 구성

### 1) 로그인/회원가입 화면

- 로그인 모드 / 회원가입 모드 전환
- 회원가입 시 역할(Role) 선택

### 2) 메인 대시보드

- 좌측 사이드바
  - 로고
  - `List`
  - `Setting`
  - 현재 사용자 아이디/역할
  - `Logout`
- 우측 콘텐츠
  - 상단 제목 + `Create Bug`
  - 필터/검색 바 + Showing 카운트
  - 상태별 칸반 보드

### 3) 버그 등록/수정 화면

- 제목, 설명, 심각도, 상태, 담당 개발자 설정
- 수정 이력, 코멘트 확인/작성
- 코멘트 본인 수정/삭제
- 상단/하단 `목록으로` 이동

## 4. 데이터 저장(localStorage)

앱은 서버 없이 브라우저 `localStorage`를 사용합니다.

- `bug-tracker-items`
  - 버그 목록(이력/코멘트 포함)
- `bug-tracker-theme`
  - `light` 또는 `dark`
- `bug-tracker-language`
  - `ko` 또는 `en`
- `bug-tracker-users`
  - 회원 계정 목록(아이디/비밀번호/역할)
- `bug-tracker-current-user`
  - 현재 로그인 아이디

## 5. 실행 방법

### 사전 준비

- Node.js 18+ 권장
- npm 사용

### 설치

```bash
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

- 기본적으로 Vite 개발 서버가 실행됩니다.
- 터미널에 표시되는 주소(예: `http://localhost:5173`)로 접속합니다.

### 프로덕션 빌드

```bash
npm run build
```

- 결과물은 `dist/` 폴더에 생성됩니다.

### 빌드 결과 미리보기

```bash
npm run preview
```

### 린트

```bash
npm run lint
```

## 6. 사용 흐름 예시

1. 회원가입에서 아이디/비밀번호/역할 선택 후 계정 생성
2. 로그인 후 `Create Bug`로 버그 등록
3. 필요 시 담당 개발자(Assign) 지정
4. 보드에서 카드 클릭 -> 수정 화면 이동
5. 수정 이력 확인, 코멘트로 협업 메시지 남기기
6. 필요 시 코멘트 본인 수정/삭제
7. 완료된 버그는 `Done` 상태로 변경

## 7. 참고 사항

- 현재 인증은 데모 목적의 `localStorage` 기반입니다(실서비스 보안 인증 아님).
- 계정 비밀번호는 암호화 없이 브라우저 저장소에 저장됩니다.
- 다중 사용자/실시간 동기화/백엔드 API는 포함되어 있지 않습니다.
