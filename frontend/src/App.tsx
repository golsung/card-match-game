import { useState } from 'react'
import { ThemeProvider } from 'styled-components'
import styled from 'styled-components'
import { GlobalStyle } from './styles/GlobalStyle'
import theme from './styles/theme'
import { Header } from './components/Header'
import { GameBoard } from './components/GameBoard'
import type { Card } from './types/Card'

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
 * 더미 카드 데이터 생성
 * 16개의 카드 (8종류 x 2장)
 */
const createDummyCards = (): Card[] => {
  const fruitTypes = ['apple', 'banana', 'cherry', 'grape', 'lemon', 'orange', 'strawberry', 'watermelon']
  const cards: Card[] = []

  fruitTypes.forEach((fruit, index) => {
    // 각 과일당 2장씩
    for (let i = 0; i < 2; i++) {
      cards.push({
        id: `${fruit}-${i}-${Date.now()}-${index}`,
        type: fruit,
        imgUrl: `/images/${fruit}.png`,
        isFlipped: false,
        isSolved: false,
      })
    }
  })

  return cards
}

function App() {
  // 게임 상태: 남은 생명 (초기값: 3)
  const [life] = useState(3)

  // 더미 카드 데이터 (Issue #34 이후 실제 API 호출로 교체됨)
  const [cards] = useState<Card[]>(createDummyCards())

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <GameContainer>
          <Header life={life} />
          <GameBoard cards={cards} />
        </GameContainer>
      </AppContainer>
    </ThemeProvider>
  )
}

export default App
