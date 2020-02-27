# HappY Readers (Good Readers) Back

### Back 사용기술:

- express (nodejs 프레임워크)
- mongoose (mongoDB)
- passport.js (로그인 인증)
- multer-S3 (AWS-S3스토리지에 이용 파일 저장)

### 2020.02.22

1. express 기본 작업 진행, route, contoller, model 구성 진행

- controller (userController, bookController)
- model (userModel, bookModel,reviewModel)
- route (2가지 라우트로 구성 /, /book )

2. db.js에서 mongodb 설정, passport-local strategy 설정( email을 userField로 사용)
3. login ,signup, logout api 제공, 현재 passport local strategy를 이용, db에 session을 저장해 로그인을 유지하는것이 아닌, jwtToken 인증 방식으로 로그인 상태 유지 소셜로그인은 (github,facebook 등은 차후 작업 예정)

### 2020.02.23

1. 책 평점, 리뷰 작성 api 제공. (userModel에서 book을 참조하는 votes, review를 참조하는 reviews를 이용해 프로필 페이지에서의 유저의 모든 활동에 대해서 처리를 진행할 것)
   사용하는 책 리뷰에 사용되는 api url은 /book/:id/review, 책 평점에 사용되는 api urldms /book/:id (Restful에 대해서 좀 읽어보고, url 명명에 대해서 더 알아봐야겠다)

2. profile 업데이트 코딩 작업 시작, 먼저 기능 테스트로 middlewares.js 파일안에 multer를 작성 후 적용 시킨뒤 로컬에 업로드 진헹.

### 2020.02.24

1. 책 서재 리스트에 추가 api 작업 진행(현재 일단 서재에 리스트는 읽기,읽음,읽는중 이 3가지로 나눔) 완료
2. multer-s3, aws-sdk를 이용해 유저 이미지 파일 AWS S3 스토리지에 업로드

### 2020.02.25

1. api관련 버그 수정(리뷰, 평점 관련되서 발생 한 오류 수정)
2. 책 업로드 api 작업 진행(multer를 이용해 책 커버를 스토리지에 업로드)
3. 리뷰 좋아요 숫자 증가/감소 api 작성 (userModel에 있는 유저의 좋아요 리스트에 책이 포함되있을 경우,like리스트에서 책의 id를 제거, bookModel 책의 좋아요 값 감소, 좋아요 증가의 경우 감소의 반대로 적용)
