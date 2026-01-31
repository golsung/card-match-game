import styled from 'styled-components'
import type { Card as CardType } from '../types/Card'
import { Card } from './Card'

/**
 * GameBoard Props Interface
 */
interface GameBoardProps {
  /** 16개의 카드 배열 */
  cards: CardType[]
  /** 카드 클릭 핸들러 */
  onCardClick: (cardId: string) => void
  /** 매칭 판별 중 여부 (광클 방지용) */
  isMatching: boolean
}

/**
 * Game Board Container
 * 4x4 CSS Grid 레이아웃으로 카드들을 배치
 * isMatching이 true일 때 pointer-events: none으로 광클 방지
 */
const BoardContainer = styled.div<{ $isMatching: boolean }>`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4열 고정 */
  gap: ${({ theme }) => theme.spacing.sm}; /* 10px */
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  pointer-events: ${({ $isMatching }) =>
    $isMatching ? 'none' : 'auto'}; /* 매칭 판별 중에는 클릭 차단 */
`

/**
 * Card Wrapper
 * Card 컴포넌트를 Grid에 맞추기 위한 래퍼
 */
const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

/**
 * GameBoard Component
 * 16개의 카드를 4x4 Grid로 표시하는 게임 보드
 *
 * @param {CardType[]} cards - 16개의 카드 배열
 * @param {Function} onCardClick - 카드 클릭 핸들러
 * @param {boolean} isMatching - 매칭 판별 중 여부 (광클 방지용)
 * @returns {JSX.Element} GameBoard 컴포넌트
 *
 * @example
 * <GameBoard cards={cards} onCardClick={handleCardClick} isMatching={false} />
 */
export const GameBoard: React.FC<GameBoardProps> = ({
  cards,
  onCardClick,
  isMatching,
}) => {
  return (
    <BoardContainer $isMatching={isMatching}>
      {cards.map((card) => (
        <CardWrapper key={card.id}>
          <Card cardData={card} onClick={() => onCardClick(card.id)} />
        </CardWrapper>
      ))}
    </BoardContainer>
  )
}

export default GameBoard
