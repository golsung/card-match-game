# ─────────────────────────────────────────────────────────
# Stage 1: Build
# node:20-alpine으로 React 앱 빌드
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# package.json만 먼저 복사하여 레이어 캐시 활용
# (소스 변경 시 npm ci를 재실행하지 않아도 됨)
COPY package*.json ./
RUN npm ci

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 2: Serve
# nginx:alpine으로 정적 파일 서빙 (이미지 크기 최소화)
# ─────────────────────────────────────────────────────────
FROM nginx:alpine

# 빌드 결과물을 nginx의 html 디렉토리로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA 라우팅 + /api 프록시 설정
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
