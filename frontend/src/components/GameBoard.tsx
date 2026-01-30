import styled from 'styled-components'
import type { Card } from '../types/Card'

/**
 * GameBoard Props Interface
 */
interface GameBoardProps {
  /** 16개의 카드 배열 */
  cards: Card[]
}

/**
 * Game Board Container
 * 4x4 CSS Grid 레이아웃으로 카드들을 배치
 */
const BoardContainer = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4열 고정 */
  gap: ${({ theme }) => theme.spacing.sm}; /* 10px */
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
`

/**
 * Card Placeholder
 * 임시 카드 표시 (Issue #34에서 실제 Card 컴포넌트로 교체됨)
 */
const CardPlaceholder = styled.div`
  aspect-ratio: 1; /* 정사각형 유지 */
  background-color: ${({ theme }) => theme.colors.cardBack};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: transform ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  word-break: break-all;
  padding: ${({ theme }) => theme.spacing.xs};
  text-align: center;

  &:hover {
    transform: scale(1.05);
  }
`

/**
 * GameBoard Component
 * 16개의 카드를 4x4 Grid로 표시하는 게임 보드
 *
 * @param {Card[]} cards - 16개의 카드 배열
 * @returns {JSX.Element} GameBoard 컴포넌트
 *
 * @example
 * <GameBoard cards={cards} />
 */
export const GameBoard: React.FC<GameBoardProps> = ({ cards }) => {
  return (
    <BoardContainer>
      {cards.map((card) => (
        <CardPlaceholder key={card.id}>
          {/* 임시로 카드 ID 표시 (처음 8자만) */}
          {card.id.substring(0, 8)}
        </CardPlaceholder>
      ))}
    </BoardContainer>
  )
}

export default GameBoard
