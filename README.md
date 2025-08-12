#  2팀 - MoonShot 프로젝트

📄 [2팀 프로젝트 계획서 보기](https://www.notion.so/2065c17d948680e984f1e73ea7c43d70)

---

## 👨‍👩‍👧‍👦 팀원 구성

| 이름     | GitHub 링크 |
|----------|-------------|
| 고민재   | [@nbkominjae](https://github.com/nbkominjae) |
| 김진솔   | [@JINSOLdev](https://github.com/JINSOLdev) |
| 하상준   | [@hippo8427](https://github.com/hippo8427) |
| 강시연   | [@singnyeo](https://github.com/singnyeo) |
| 차수연   | [@chya-chya](https://github.com/chya-chya) |

---

## 📌 프로젝트 소개

- **프로젝트 이름:** MoonShot  
- **프로젝트 주제:** 프로젝트 일정 관리 서비스 백엔드 시스템 구축  
- **진행 기간:** 2025.07.22 ~ 2025.08.13  

---

## 🛠️ 기술 스택

- **Backend:** Express.js, Prisma ORM  
- **Database:** PostgreSQL  
- **API 문서화:** Swagger  
- **협업 도구:** Git & GitHub, Discord  

---

## 🧩 팀원별 구현 기능

> 각자 개발한 기능에 대한 스크린샷, GIF, 설명 등을 첨부해주세요.

### 💻 고민재
- (구현 기능 요약)
- ![기능 이미지](./img/minjae.gif)

### 💻 김진솔
- (구현 기능 요약)
- ![기능 이미지](./img/jinsol.gif)

### 💻 하상준
- (구현 기능 요약)
- ![기능 이미지](./img/sangjun.gif)

### 💻 강시연
- (구현 기능 요약)
- ![기능 이미지](./img/siyeon.gif)

### 💻 차수연
- (구현 기능 요약)
- ![기능 이미지](./img/sooyeon.gif)

---

## 📁 프로젝트 파일 구조
📦 프로젝트 루트
```
📦src
 ┣ 📂config
 ┃ ┣ 📜db.ts
 ┃ ┣ 📜firebase-admin.ts
 ┃ ┗ 📜swagger.ts
 ┣ 📂controllers
 ┃ ┣ 📜auth-controllers.ts
 ┃ ┣ 📜comment-controller.ts
 ┃ ┣ 📜file-upload-controller.ts
 ┃ ┣ 📜member-controller.ts
 ┃ ┣ 📜project-controller.ts
 ┃ ┣ 📜subtask-controller.ts
 ┃ ┣ 📜task-controller.ts
 ┃ ┗ 📜user-controller.ts
 ┣ 📂middlewares
 ┃ ┣ 📜authorization.ts
 ┃ ┣ 📜error-handler.ts
 ┃ ┣ 📜multer.ts
 ┃ ┗ 📜validation.ts
 ┣ 📂repositories
 ┃ ┣ 📜auth-repositorie.ts
 ┃ ┣ 📜comment-repository.ts
 ┃ ┣ 📜member-repository.ts
 ┃ ┣ 📜project-repository.ts
 ┃ ┣ 📜subtask-repository.ts
 ┃ ┣ 📜task-repository.ts
 ┃ ┗ 📜user-repository.ts
 ┣ 📂routes
 ┃ ┣ 📜auth-route.ts
 ┃ ┣ 📜comment-route.ts
 ┃ ┣ 📜file-upload-route.ts
 ┃ ┣ 📜index-route.ts
 ┃ ┣ 📜member-route.ts
 ┃ ┣ 📜project-route.ts
 ┃ ┣ 📜subtask-route.ts
 ┃ ┣ 📜task-route.ts
 ┃ ┗ 📜user-route.ts
 ┣ 📂services
 ┃ ┣ 📜auth-service.ts
 ┃ ┣ 📜comment-service.ts
 ┃ ┣ 📜member-service.ts
 ┃ ┣ 📜project-service.ts
 ┃ ┣ 📜subtask-service.ts
 ┃ ┣ 📜task-service.ts
 ┃ ┗ 📜user-service.ts
 ┣ 📂swagger
 ┃ ┗ 📂paths
 ┃ ┃ ┣ 📜auth-path.json
 ┃ ┃ ┣ 📜member-path.json
 ┃ ┃ ┣ 📜project-path.json
 ┃ ┃ ┣ 📜subtask-path.json
 ┃ ┃ ┣ 📜task-path.json
 ┃ ┃ ┗ 📜user-path.json
 ┣ 📂types
 ┃ ┣ 📜express.d.ts
 ┃ ┣ 📜subtask-type.ts
 ┃ ┗ 📜task-type.ts
 ┣ 📂utils
 ┃ ┣ 📂dtos
 ┃ ┃ ┣ 📜comment-dto.ts
 ┃ ┃ ┣ 📜member-dto.ts
 ┃ ┃ ┣ 📜project-dto.ts
 ┃ ┃ ┗ 📜task-dto.ts
 ┃ ┣ 📂passport
 ┃ ┃ ┣ 📜googleStrategy.ts
 ┃ ┃ ┣ 📜index.ts
 ┃ ┃ ┗ 📜jwtStrategy.ts
 ┃ ┣ 📜email.ts
 ┃ ┗ 📜token.ts
 ┣ 📜app.ts
 ┗ 📜server.ts
```

---

## 🌐 구현 홈페이지

👉 [https://nb-02-moon-shot-fe.vercel.app/login](https://nb-02-moon-shot-fe.vercel.app/login)

---

## 📊 ERD (Entity Relationship Diagram)

<img width="1334" height="655" alt="image" src="https://github.com/user-attachments/assets/5ab19065-4be4-48c7-a097-a5b924a1b961" />

---

## 🧠 프로젝트 회고 및 발표자료

📎 [발표자료 다운로드](#)  
📎 [회고 링크 / Notion / PPT 등](#)

---







