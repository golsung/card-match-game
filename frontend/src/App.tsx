import { useEffect } from 'react'
import { ThemeProvider } from 'styled-components'
import styled from 'styled-components'
import { GlobalStyle } from './styles/GlobalStyle'
import theme from './styles/theme'
import { Header } from './components/Header'
import { GameBoard } from './components/GameBoard'
import { GameProvider } from './contexts/GameContext'
import { useGameContext } from './contexts/GameContext'
import { useGameInitializer } from './hooks/useGameInitializer'

/**
 * App Container
 * 전체 화면을 채우며 게임 컨테이너를 중앙에 배치
 */
const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
`

/**
 * Game Container
 * 600x600px 크기의 게임 영역
 */
const GameContainer = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.colors.cardFront};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;

  /* 반응형 디자인: 작은 화면에서는 화면 크기에 맞춤 */
  @media (max-width: 640px) {
    width: 100%;
    height: auto;
    min-height: 500px;
  }
`

/**
 * Loading Container
 * 로딩 중일 때 표시되는 컨테이너
 */
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
`

/**
 * Error Container
 * 에러 발생 시 표시되는 컨테이너
 */
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.md};
  text-align: center;
`

/**
 * Game Component
 * 실제 게임 UI를 렌더링하는 컴포넌트
 * GameProvider 내부에서 사용되어야 합니다.
 */
function Game() {
  // 게임 초기화 (컴포넌트 마운트 시 API 호출)
  useGameInitializer()

  // Context에서 게임 상태 가져오기 및 디스패치
  const { state, dispatch } = useGameContext()

  /**
   * 카드 클릭 핸들러
   * 카드를 뒤집는 로직을 처리합니다.
   *
   * Guard Clause 패턴을 사용하여 엣지 케이스를 처리:
   * 1. 이미 Solved 카드는 클릭 무시
   * 2. 이미 Flipped 카드는 클릭 무시
   * 3. flippedCards가 2개일 때는 클릭 무시
   * 4. 매칭 판별 중일 때는 클릭 무시
   *
   * @param cardId - 클릭한 카드의 ID
   */
  const handleCardClick = (cardId: string) => {
    // 클릭한 카드 찾기
    const clickedCard = state.cards.find((card) => card.id === cardId)

    // 카드를 찾지 못한 경우 (비정상 상황)
    if (!clickedCard) {
      console.warn('[Card Click] Card not found:', cardId)
      return
    }

    // Guard Clause 1: 이미 짝이 맞춰진 카드는 클릭 무시
    if (clickedCard.isSolved) {
      console.log('[Card Click] Ignored: Card already solved')
      return
    }

    // Guard Clause 2: 이미 뒤집힌 카드는 클릭 무시
    if (clickedCard.isFlipped) {
      console.log('[Card Click] Ignored: Card already flipped')
      return
    }

    // Guard Clause 3: 이미 2장이 뒤집혀 있으면 클릭 무시
    if (state.flippedCards.length >= 2) {
      console.log('[Card Click] Ignored: Two cards already flipped')
      return
    }

    // Guard Clause 4: 매칭 판별 중일 때는 클릭 무시
    if (state.isMatching) {
      console.log('[Card Click] Ignored: Matching in progress')
      return
    }

      // 모든 Guard Clause를 통과하면 카드 뒤집기
    console.log('[Card Click] Flipping card:', cardId)
    dispatch({ type: 'FLIP_CARD', payload: { cardId } })
  }

  /**
   * 매칭 판별 로직
   * flippedCards의 길이가 2가 되면 자동으로 실행됩니다.
   *
   * - 두 카드의 type이 같으면 MATCH_SUCCESS 디스패치
   * - 두 카드의 type이 다르면 1초 후 MATCH_FAIL 디스패치
   * - 매칭 판별 중에는 isMatching 플래그를 true로 설정
   */
  useEffect(() => {
    // flippedCards가 정확히 2개일 때만 실행
    if (state.flippedCards.length !== 2) {
      return
    }

    // 매칭 판별 시작
    dispatch({ type: 'SET_MATCHING', payload: true })

    const [firstCard, secondCard] = state.flippedCards

    // 두 카드의 type 비교
    if (firstCard.type === secondCard.type) {
      // 매칭 성공: 즉시 MATCH_SUCCESS 디스패치
      console.log('[Matching] Success:', firstCard.type)
      dispatch({
        type: 'MATCH_SUCCESS',
        payload: { cardIds: [firstCard.id, secondCard.id] },
      })
      // 매칭 판별 종료
      dispatch({ type: 'SET_MATCHING', payload: false })
    } else {
      // 매칭 실패: 1초 후 MATCH_FAIL 디스패치
      console.log('[Matching] Fail:', firstCard.type, 'vs', secondCard.type)
      const timeoutId = setTimeout(() => {
        dispatch({
          type: 'MATCH_FAIL',
          payload: { cardIds: [firstCard.id, secondCard.id] },
        })
        // 매칭 판별 종료
        dispatch({ type: 'SET_MATCHING', payload: false })
      }, 1000)

      // cleanup 함수: 컴포넌트 언마운트 시 타이머 정리
      return () => clearTimeout(timeoutId)
    }
  }, [state.flippedCards, dispatch])

  // 로딩 중일 때
  if (state.isLoading) {
    return (
      <GameContainer>
        <LoadingContainer>Loading...</LoadingContainer>
      </GameContainer>
    )
  }

  // 에러 발생 시
  if (state.error) {
    return (
      <GameContainer>
        <ErrorContainer>
          <div>⚠️ 게임을 시작할 수 없습니다</div>
          <div>{state.error}</div>
        </ErrorContainer>
      </GameContainer>
    )
  }

  // 게임 플레이 화면
  return (
    <GameContainer>
      <Header life={state.life} />
      <GameBoard
        cards={state.cards}
        onCardClick={handleCardClick}
        isMatching={state.isMatching}
      />
    </GameContainer>
  )
}

/**
 * App Component
 * 전체 앱의 루트 컴포넌트
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <GameProvider>
        <AppContainer>
          <Game />
        </AppContainer>
      </GameProvider>
    </ThemeProvider>
  )
}

export default App
