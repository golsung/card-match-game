import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E 설정
 *
 * webServer 2개 자동 기동:
 *  1. backend: Express (port 3001)
 *  2. frontend: Vite preview (port 4173) — 빌드 후 정적 파일 서빙
 *
 * 교육적 관점 (Testing Strategy):
 * E2E 테스트는 실제 브라우저 + 실서버 조합으로 "사용자 시나리오"를 검증한다.
 * webServer.reuseExistingServer=!CI 설정으로,
 *   - 로컬: 이미 띄워진 서버 재사용 (개발 편의성)
 *   - CI: 항상 새 서버 기동 (결정론적 환경 보장)
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  workers: process.env.CI ? 1 : undefined,
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: 'http://localhost:4173',
    screenshot: 'only-on-failure',  // AC: 실패 시 스크린샷 저장
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'npm run dev',
      cwd: '../backend',
      port: 3001,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: 'npm run build && npm run preview',
      cwd: '../frontend',
      port: 4173,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
})
