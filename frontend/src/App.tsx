import { ThemeProvider } from 'styled-components'
import styled from 'styled-components'
import { GlobalStyle } from './styles/GlobalStyle'
import theme from './styles/theme'

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
 * Placeholder Content
 * 임시 플레이스홀더 (다음 이슈에서 Header, GameBoard 등으로 교체됨)
 */
const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  gap: ${({ theme }) => theme.spacing.md};
`

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.fontSizes.xxxl};
  margin: 0;
`

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin: 0;
  text-align: center;
`

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <GameContainer>
          <PlaceholderContent>
            <Title>카드 짝 맞추기 게임</Title>
            <Description>
              600x600px 게임 컨테이너가 화면 중앙에 배치되었습니다.
            </Description>
            <Description>
              다음 이슈에서 Header, GameBoard, Card 컴포넌트가 추가됩니다.
            </Description>
          </PlaceholderContent>
        </GameContainer>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
