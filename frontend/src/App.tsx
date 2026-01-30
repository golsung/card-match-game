import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import styled from 'styled-components'
import { GlobalStyle } from './styles/GlobalStyle'
import theme from './styles/theme'
import { Header } from './components/Header'

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
  // 게임 상태: 남은 생명 (초기값: 3)
  const [life, setLife] = useState(3)

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <GameContainer>
          <Header life={life} />
          <PlaceholderContent>
            <Title>카드 짝 맞추기 게임</Title>
            <Description>
              Header 컴포넌트가 추가되었습니다!
            </Description>
            <Description>
              다음 이슈에서 GameBoard, Card 컴포넌트가 추가됩니다.
            </Description>
            {/* 테스트용: life 변경 버튼 */}
            <button
              onClick={() => setLife((prev) => Math.max(0, prev - 1))}
              style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
            >
              Life 감소 (현재: {life})
            </button>
          </PlaceholderContent>
        </GameContainer>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
