# ─────────────────────────────────────────────────────────
# Stage 1: Build
# TypeScript를 JavaScript로 컴파일
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 2: Runtime
# 보안 강화: non-root 사용자로 실행
# (root로 실행하면 컨테이너 탈출 시 호스트에도 root 권한이 생김)
# ─────────────────────────────────────────────────────────
FROM node:20-alpine

# non-root 사용자 및 그룹 생성
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# 프로덕션 의존성만 설치 (devDependencies 제외)
COPY package*.json ./
RUN npm ci --omit=dev

# 빌드된 결과물만 복사
COPY --from=builder /app/dist ./dist

# non-root 사용자로 전환
USER appuser

EXPOSE 3001

CMD ["node", "dist/server.js"]
