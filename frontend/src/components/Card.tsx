import styled from 'styled-components'
import type { Card as CardType } from '../types/Card'

/**
 * Card Props Interface
 */
interface CardProps {
  /** 카드 데이터 */
  cardData: CardType
  /** 클릭 이벤트 핸들러 */
  onClick: () => void
}

/**
 * Card Container
 * 140x140px 크기의 카드
 */
const CardContainer = styled.div`
  width: 140px;
  height: 140px;
  border-radius: ${({ theme }) => theme.borderRadius.md}; /* 8px */
  cursor: pointer;
  position: relative;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: scale(1.05);
  }
`

/**
 * Card Face (앞면/뒷면 공통 스타일)
 */
const CardFace = styled.div`
  width: 100%;
  height: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md}; /* 8px */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  backface-visibility: hidden;
`

/**
 * Card Back (뒷면)
 */
const CardBack = styled(CardFace)`
  background-color: ${({ theme }) => theme.colors.cardBack}; /* #2c3e50 */
  box-shadow: ${({ theme }) => theme.shadows.md};
`

/**
 * Card Front (앞면)
 */
const CardFront = styled(CardFace)`
  background-color: ${({ theme }) => theme.colors.cardFront}; /* 흰색 */
  box-shadow: ${({ theme }) => theme.shadows.md};
`

/**
 * Card Image (과일 이미지)
 * Phase 6에서 실제 이미지와 함께 사용 예정
 */
// const CardImage = styled.img`
//   width: 80%;
//   height: 80%;
//   object-fit: contain;
// `

/**
 * Card Type Text (임시: 이미지 없을 때)
 */
const CardTypeText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary};
  text-transform: capitalize;
`

/**
 * Card Component
 * 게임 카드를 표시하는 컴포넌트
 *
 * @param {CardType} cardData - 카드 데이터 (id, type, imgUrl, isFlipped, isSolved)
 * @param {Function} onClick - 클릭 이벤트 핸들러
 * @returns {JSX.Element} Card 컴포넌트
 *
 * @example
 * <Card
 *   cardData={card}
 *   onClick={() => handleCardClick(card.id)}
 * />
 */
export const Card: React.FC<CardProps> = ({ cardData, onClick }) => {
  const { type, isFlipped, isSolved } = cardData

  // 카드가 뒤집혔거나 짝이 맞춰진 경우 앞면 표시
  const showFront = isFlipped || isSolved

  return (
    <CardContainer onClick={onClick}>
      {showFront ? (
        <CardFront>
          {/* 임시: 이미지 대신 타입 텍스트 표시 (Phase 6에서 이미지 추가) */}
          <CardTypeText>{type}</CardTypeText>
        </CardFront>
      ) : (
        <CardBack />
      )}
    </CardContainer>
  )
}

export default Card
