🛫 Road In 로드인

여행지 소개글을 모아두는 홈페이지

여행지에 들어가보다, 발 디디다
여행지로 가는 길을 R과 연결시켜 도로로
장소를 표현하는 핀을 i 위 + 길 끝 = 목적지

🅰️ Ateam

Frontend

Frontend

Backend

Backend

Backend











강민경

김성윤

황가연

황정우

황지은

📌 프로젝트 소개

RoadIn은 여행지 정보를 제공하고, 검색 및 좋아요 기능을 지원하는 웹사이트입니다. 실시간 날씨 정보, 태그 기반 필터링, 인기 여행지 추천 등의 기능을 제공합니다.

🛠 기술 스택

Frontend: React, TypeScript, CSS

Backend: Node.js (Express), Axios

Database: MariaDB, MySQL Workbench

API Testing: Postman

Deployment: AWS, Vercel

Version Control: GitHub

🔹 주요 기능

1️⃣ 여행지 검색 및 상세 페이지

여행지 검색 후 상세 정보 제공

외부 API (Geonames, 날씨 API) 연동

실시간 날씨 정보 표시

📌 Geonames API 예제

2️⃣ 태그 필터링 시스템

태그별 여행지 검색 가능

다중 태그 선택 지원

3️⃣ 좋아요 기능

여행지 좋아요 추가/삭제 가능

좋아요한 여행지만 모아보기 지원

🚀 설치 및 실행 방법

✅ http://localhost:3000에서 실행 가능! 🎉

🛠 API 개발 & 테스트 (Postman 활용)

여행지 정보 조회 (GET /search/place/:place_name)

좋아요 추가 (POST /placelikes/:place_id)

태그 기반 여행지 검색 (GET /places/tag/:tag_name)

Geonames API를 활용한 날씨 정보 조회 (GET /places_weather/:place_name)

📌 DB 설계 & Workbench 활용

MariaDB + MySQL Workbench를 사용하여 데이터베이스 설계

여행지(places), 태그(tags), 사용자(users), 좋아요(places_likes) 테이블 구축
