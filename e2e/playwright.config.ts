import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright 설정
 *
 * webServer 2개:
 *  1. backend: Express on port 3001
 *  2. frontend: Vite preview (빌드 결과물) on port 4173
 *
 * 교육적 관점 (DevOps):
 * reuseExistingServer=true 로 개발 중에는 이미 띄워진 서버를 재사용하고,
 * CI에서는 환경 변수 CI=true 라서 새 서버를 항상 기동한다.
 */
export default defineConfig({
  testDir: './tests',
  /* 타임아웃: 테스트 하나당 최대 30초 */
  timeout: 30_000,
  /* 기대값 타임아웃: UI 변화 대기 최대 5초 */
  expect: {
    timeout: 5_000,
  },
  /* CI에서는 병렬 실행 비활성화 (리소스 절약) */
  workers: process.env.CI ? 1 : undefined,
  /* 실패 시 재시도 없음 */
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    /* 모든 테스트의 기본 URL */
    baseURL: 'http://localhost:4173',
    /* 실패 시 스크린샷 저장 */
    screenshot: 'only-on-failure',
    /* 실패 시 트레이스 저장 */
    trace: 'on-first-retry',
  },

  /* Chromium 단일 브라우저만 사용 (CI 속도 최적화) */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /**
   * webServer 설정
   * Playwright가 테스트 실행 전 자동으로 서버를 기동합니다.
   *
   * - backend: ts-node-dev로 TypeScript 소스를 바로 실행
   * - frontend: 먼저 빌드 후 preview 서버 기동 (실제 nginx와 유사한 환경)
   */
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
