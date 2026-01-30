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

  // Context에서 게임 상태 가져오기
  const { state } = useGameContext()

  /**
   * 카드 클릭 핸들러 (임시)
   * Issue #38에서 실제 로직 구현 예정
   */
  const handleCardClick = (cardId: string) => {
    console.log('Card clicked:', cardId)
    // TODO: Issue #38에서 FLIP_CARD 액션 디스패치 구현
  }

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
      <GameBoard cards={state.cards} onCardClick={handleCardClick} />
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
