import axios from 'axios'
import type { Card } from '../types/Card'

/**
 * API Response for /api/game/start
 * 백엔드에서 반환하는 게임 시작 응답 타입
 */
interface GameStartResponse {
  gameId: string
  cards: Array<{
    id: string
    type: string
    imgUrl: string
  }>
}

/**
 * Start a new game
 * /api/game/start 엔드포인트를 호출하여 새 게임을 시작합니다.
 *
 * @returns Promise<{ gameId: string; cards: Card[] }>
 * @throws Error if API call fails
 *
 * @example
 * const { gameId, cards } = await startGame()
 */
export async function startGame(): Promise<{ gameId: string; cards: Card[] }> {
  try {
    const response = await axios.get<GameStartResponse>('/api/game/start')

    // 백엔드 응답을 프론트엔드 Card 타입으로 변환
    // isFlipped와 isSolved 필드를 추가 (초기값: false)
    const cards: Card[] = response.data.cards.map((card) => ({
      ...card,
      isFlipped: false,
      isSolved: false,
    }))

    return {
      gameId: response.data.gameId,
      cards,
    }
  } catch (error) {
    console.error('[API Error] Failed to start game:', error)

    // 에러 메시지를 더 명확하게 전달
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 서버가 응답을 반환했지만 에러 상태 코드
        throw new Error(`서버 오류: ${error.response.status}`)
      } else if (error.request) {
        // 요청은 보냈지만 응답을 받지 못함
        throw new Error('서버 연결에 실패했습니다')
      }
    }

    // 기타 에러
    throw new Error('게임 시작에 실패했습니다')
  }
}
