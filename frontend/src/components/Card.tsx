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
 * perspective를 적용하여 3D 효과 활성화
 */
const CardContainer = styled.div`
  width: 140px;
  height: 140px;
  cursor: pointer;
  position: relative;
  perspective: 1000px; /* 3D 효과를 위한 perspective */
`

/**
 * Card Inner
 * 카드의 실제 회전을 담당하는 래퍼
 * isFlipped 또는 isSolved일 때 180도 회전
 */
const CardInner = styled.div<{ $showFront: boolean }>`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d; /* 3D 변환 유지 */
  transition: transform 0.5s; /* 0.5초 애니메이션 */
  transform: ${({ $showFront }) =>
    $showFront ? 'rotateY(180deg)' : 'rotateY(0deg)'};
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
 * 처음부터 180도 회전된 상태로 시작 (CardInner가 회전하면 정면을 향함)
 */
const CardFront = styled(CardFace)`
  background-color: ${({ theme }) => theme.colors.cardFront}; /* 흰색 */
  box-shadow: ${({ theme }) => theme.shadows.md};
  transform: rotateY(180deg); /* 앞면은 처음부터 180도 회전 */
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
      <CardInner $showFront={showFront}>
        {/* 카드 뒷면 (기본 상태) */}
        <CardBack />
        {/* 카드 앞면 (180도 회전된 상태로 대기) */}
        <CardFront>
          {/* 임시: 이미지 대신 타입 텍스트 표시 (Phase 6에서 이미지 추가) */}
          <CardTypeText>{type}</CardTypeText>
        </CardFront>
      </CardInner>
    </CardContainer>
  )
}

export default Card
