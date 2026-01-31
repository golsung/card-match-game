import styled from 'styled-components'

/**
 * ResultModal Props Interface
 */
interface ResultModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean
  /** 게임 결과 (GAME_OVER | VICTORY) */
  result: 'GAME_OVER' | 'VICTORY'
  /** 게임 재시작 핸들러 */
  onRestart: () => void
}

/**
 * Modal Overlay
 * 화면 전체를 덮는 반투명 배경
 */
const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.overlay}; /* rgba(0,0,0,0.7) */
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  z-index: ${({ theme }) => theme.zIndex.modal}; /* 100 */
  animation: fadeIn ${({ theme }) => theme.transitions.normal};

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`

/**
 * Modal Content
 * 모달의 실제 내용을 담는 컨테이너
 */
const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.cardFront}; /* 흰색 */
  border-radius: ${({ theme }) => theme.borderRadius.xl}; /* 16px */
  padding: ${({ theme }) => theme.spacing.xxl}; /* 48px */
  box-shadow: ${({ theme }) => theme.shadows.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg}; /* 24px */
  min-width: 400px;
  animation: slideUp ${({ theme }) => theme.transitions.normal};

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  /* 반응형: 모바일 */
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-width: 90%;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`

/**
 * Modal Emoji
 * 결과에 따른 큰 emoji 표시
 */
const ModalEmoji = styled.div`
  font-size: 72px;
  line-height: 1;
  user-select: none;
`

/**
 * Modal Title
 * 모달 제목
 */
const ModalTitle = styled.h2<{ $result: 'GAME_OVER' | 'VICTORY' }>`
  font-size: ${({ theme }) => theme.fontSizes.xxxl}; /* 32px */
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme, $result }) =>
    $result === 'VICTORY' ? theme.colors.success : theme.colors.danger};
  margin: 0;
  text-align: center;
`

/**
 * Modal Message
 * 결과 메시지
 */
const ModalMessage = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg}; /* 18px */
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  text-align: center;
  line-height: 1.6;
`

/**
 * Restart Button
 * 게임 재시작 버튼
 */
const RestartButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textLight};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-top: ${({ theme }) => theme.spacing.md};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }

  &:active {
    transform: translateY(0);
  }
`

/**
 * ResultModal Component
 * 게임 결과(승리/패배)를 표시하는 모달 컴포넌트
 *
 * @param {boolean} isOpen - 모달 표시 여부
 * @param {'GAME_OVER' | 'VICTORY'} result - 게임 결과
 * @param {Function} onRestart - 게임 재시작 핸들러
 * @returns {JSX.Element} ResultModal 컴포넌트
 *
 * @example
 * <ResultModal
 *   isOpen={state.status === 'VICTORY' || state.status === 'GAME_OVER'}
 *   result={state.status}
 *   onRestart={handleRestart}
 * />
 */
export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  result,
  onRestart,
}) => {
  // result에 따른 emoji 선택
  const emoji = result === 'VICTORY' ? '🎉' : '😢'

  // result에 따른 제목 선택
  const title = result === 'VICTORY' ? '승리!' : '게임 오버'

  // result에 따른 메시지 선택
  const message =
    result === 'VICTORY'
      ? '축하합니다! 모든 짝을 찾았습니다!'
      : '아쉽네요. 다시 도전해보세요!'

  return (
    <ModalOverlay $isOpen={isOpen}>
      <ModalContent>
        <ModalEmoji>{emoji}</ModalEmoji>
        <ModalTitle $result={result}>{title}</ModalTitle>
        <ModalMessage>{message}</ModalMessage>
        <RestartButton onClick={onRestart}>게임 재시작</RestartButton>
      </ModalContent>
    </ModalOverlay>
  )
}

export default ResultModal
