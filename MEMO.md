# 메모장

## 자주 쓰는 터미널 명령어

```bash
# 개발 서버 실행
cd chicken-mvp && npm run dev

# 패키지 설치
npm install

# 빌드
npm run build
```

---

## 메모

<디버깅 프로토콜>

1. 로컬(커서)
(1)로컬 실행 안 됨 → npm install 먼저 실행(프로젝트마다)
(2)npm run dev = 로컬 테스트 서버 실행, 
   npm run build = 배포용 파일 생성(dist)
(3)로컬 변경안되면 새터미널에서 npmrun build/ npm run pages:devgit add .; git commit -m "글자크기등 "; git push
(4) 최신 변경사항(api키등 변경사항) 각 사이트의 docs를 커서에게 참고자료로 주기

2. 깃허브 
(1) 다른 곳에서 작업할 때 
직접 폴더를 만들지 말기>>>> 터미널서 Git Clone


3. 배포
(0) git ignore 체크 
(1)Cloudflare  Env(환경변수) or secret 변경 = Retry Deploy 필요
(2)Cloudflare  Env(환경변수) or secret 변경시 name 커서 요구대로 입력. 
(3) React 배포 실패 → Build command + git checkout . dist 설정(프로젝트마다)
  
4.외부환경
(1) npm run dev 실행 안 됨 → Node.js 설치 확인(외부프로그램설치)

5.명령어

git add .; git commit -m " 간단오류수정"; git push
git checkout .     git pull
npm install, npm run dev
Simple Browser: Show
