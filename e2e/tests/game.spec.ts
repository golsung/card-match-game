import { test, expect } from '@playwright/test'

/**
 * 카드 매칭 게임 E2E 테스트
 *
 * 교육적 관점 (Testing Strategy):
 * E2E 테스트는 "사용자 시나리오 중심"으로 작성합니다.
 * 단위 테스트(Vitest)가 로직을 검증한다면, E2E 테스트는 전체 시스템이
 * 실제 브라우저에서 올바르게 동작하는지 확인합니다.
 *
 * 선택자 전략: data-testid 속성 사용
 * CSS 클래스나 텍스트 대신 data-testid를 사용하면,
 * UI 스타일이나 국제화(i18n)가 변경돼도 테스트가 깨지지 않습니다.
 */

test.describe('카드 매칭 게임', () => {
  /**
   * 시나리오 1: 게임 로딩
   * 페이지 접속 시 16개 카드가 렌더링되는지 확인
   */
  test('게임 로딩 - 카드 16장이 렌더링된다', async ({ page }) => {
    await page.goto('/')

    // 게임 보드가 나타날 때까지 대기
    await expect(page.getByTestId('game-board')).toBeVisible()

    // 생명(기회) 표시 확인
    await expect(page.getByTestId('life-display')).toHaveText('남은 기회: 3/3')

    // 카드 16장 확인 (data-testid="card-{id}" 형태)
    const cards = page.locator('[data-testid^="card-"]')
    await expect(cards).toHaveCount(16)

    // 모든 카드가 뒤집히지 않은 상태여야 함
    const flippedCards = page.locator('[data-is-flipped="true"]')
    await expect(flippedCards).toHaveCount(0)
  })

  /**
   * 시나리오 2: 카드 뒤집기
   * 카드 클릭 시 data-is-flipped 속성이 true로 변경되는지 확인
   */
  test('카드 뒤집기 - 클릭하면 뒤집힌 상태가 된다', async ({ page }) => {
    await page.goto('/')

    // 게임 보드 대기
    await expect(page.getByTestId('game-board')).toBeVisible()

    // 첫 번째 카드 클릭
    const firstCard = page.locator('[data-testid^="card-"]').first()
    await firstCard.click()

    // 클릭 후 해당 카드가 뒤집힌 상태인지 확인
    await expect(firstCard).toHaveAttribute('data-is-flipped', 'true')
  })

  /**
   * 시나리오 3: 매칭 실패
   * 서로 다른 타입의 카드 2장을 클릭하면:
   * - 잠시 후 두 카드가 다시 뒤집힌다
   * - 생명이 1 감소한다 (3 → 2)
   *
   * 구현 세부사항:
   * 서로 다른 타입의 카드를 찾기 위해 data-card-type 속성을 활용합니다.
   * 매칭 판별 대기 시간은 1초 + 여유 시간 = 최대 2.5초로 설정합니다.
   */
  test('매칭 실패 - 다른 타입 카드 클릭 시 생명이 감소한다', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('game-board')).toBeVisible()

    // 모든 카드 가져오기
    const allCards = page.locator('[data-testid^="card-"]')
    await expect(allCards).toHaveCount(16)

    // 첫 번째 카드 클릭
    const firstCard = allCards.nth(0)
    await firstCard.click()
    await expect(firstCard).toHaveAttribute('data-is-flipped', 'true')

    // 첫 번째 카드 타입 가져오기
    const firstType = await firstCard.getAttribute('data-card-type')

    // 첫 번째와 다른 타입의 카드 찾기
    const differentCard = page.locator(`[data-testid^="card-"]:not([data-card-type="${firstType}"])`).first()
    await differentCard.click()

    // 매칭 실패 후 1초 + 여유 시간 대기
    // (게임 로직: 1000ms 후 MATCH_FAIL 디스패치)
    await page.waitForTimeout(2000)

    // 두 카드 모두 다시 뒤집혀야 함 (뒤집힌 카드 0장)
    const stillFlipped = page.locator('[data-is-flipped="true"]')
    await expect(stillFlipped).toHaveCount(0)

    // 생명이 1 감소해야 함 (3 → 2)
    await expect(page.getByTestId('life-display')).toHaveText('남은 기회: 2/3')
  })

  /**
   * 시나리오 4: 게임 재시작
   * 게임 오버 후 재시작 버튼 클릭 시:
   * - ResultModal이 닫힌다
   * - 생명이 3/3으로 초기화된다
   * - 카드 16장이 다시 렌더링된다
   *
   * 교육적 관점:
   * 게임 오버를 빠르게 만들기 위해 3번 연속 매칭 실패를 시뮬레이션합니다.
   */
  test('게임 재시작 - 재시작 버튼 클릭 시 상태가 초기화된다', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByTestId('game-board')).toBeVisible()

    // 3번 매칭 실패로 게임 오버 유도
    for (let i = 0; i < 3; i++) {
      // data-testid를 먼저 가져와 고정된 로케이터 생성
      // (Playwright locator는 동적 재평가되므로, 클릭 후 속성이 변하면 다른 카드로 이동함)
      const firstTestId = await page
        .locator('[data-testid^="card-"][data-is-flipped="false"]')
        .first()
        .getAttribute('data-testid')
      const firstCard = page.locator(`[data-testid="${firstTestId}"]`)
      await firstCard.click()
      await expect(firstCard).toHaveAttribute('data-is-flipped', 'true')
      const firstType = await firstCard.getAttribute('data-card-type')

      // 다른 타입의 카드 클릭
      const differentCard = page
        .locator(`[data-testid^="card-"][data-is-flipped="false"]:not([data-card-type="${firstType}"])`)
        .first()
      await differentCard.click()

      // 매칭 실패 대기
      await page.waitForTimeout(1500)
    }

    // ResultModal이 표시되어야 함
    await expect(page.getByTestId('result-modal')).toBeVisible({ timeout: 5000 })
    await expect(page.getByTestId('modal-title')).toHaveText('게임 오버')

    // 재시작 버튼 클릭
    await page.getByTestId('restart-button').click()

    // 새 게임: 생명 3/3으로 초기화 확인
    await expect(page.getByTestId('life-display')).toHaveText('남은 기회: 3/3', { timeout: 10000 })

    // 카드 16장 다시 확인
    const newCards = page.locator('[data-testid^="card-"]')
    await expect(newCards).toHaveCount(16)
  })
})
