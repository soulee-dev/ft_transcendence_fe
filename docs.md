# 주의점
Backend를 꼭 먼저 실행하세요! 백엔드가 먼저 실행되어 3000번 포트를 할당 받고,
프론트엔드가 그 다음 실행되어 3001번 포트를 받야아 합니다.

## .env파일 설정 방법
백엔드의 .env 파일은 kyhan한테 직접 받습니다
프론트의 .env는 직접 들어가서 아이피를 localhost로 변경해줍니다.
혹시 다른 사람과 공유하고 싶다면 `ifconfig`를 입력하고 `10.`으로 시작하는 아이피를 넣어줍니다

# Backend 설정 방법
1. 아래와 같은 명령어를 실행한다

```
make
```

[https://localhost:3000](https://localhost:3000)에 접속해서 Hello World가 나오면, 정상적으로 설정된 것이다

# Frontend 설정 방법
1. NodeJS를 설치한다 (설치가 안되어있다면)
  1. 공식 홈페이지에서 NodeJS LTS버전을 설치한다

2. 아래와 같은 명령어를 실행한다

```
npm i
npm run dev
```

[https://localhost:3001](https://localhost:3001)에 접속해서 로그인 페이지가 나오면, 정상적으로 설정된 것이다

