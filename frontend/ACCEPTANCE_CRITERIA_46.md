# Acceptance Criteria - Issue #46

## 📋 Issue
**[Phase 7] 게임 재시작 로직 구현**

## ✅ Acceptance Criteria Checklist

### 1. handleRestart 함수가 작성되었는가?
- ✅ **충족**
- **검증 방법**:
  - `App.tsx:189-228` - `handleRestart` async 함수 구현
  ```typescript
  const handleRestart = async () => {
    // 1. RESET_GAME 액션
    // 2. SET_LOADING
    // 3. startGame() API 호출
    // 4. INIT_GAME 액션
  }
  ```

### 2. "게임 재시작" 버튼 클릭 시 API가 호출되는가?
- ✅ **충족**
- **검증 방법**:
  - `handleRestart` 내부에서 `await startGame()` 호출
  - ResultModal의 RestartButton onClick에 handleRestart 연결
  ```typescript
  const { gameId, cards } = await startGame()
  ```

### 3. 상태가 초기화되는가 (life=3, status='PLAYING')?
- ✅ **충족**
- **검증 방법**:
  - `RESET_GAME` 액션: initialState로 완전 초기화
  - `INIT_GAME` 액션: life=3, status='PLAYING' 설정
  ```typescript
  dispatch({ type: 'RESET_GAME' })
  // → initialState (life: 3, status: 'IDLE')

  dispatch({ type: 'INIT_GAME', payload: { gameId, cards } })
  // → life: 3, status: 'PLAYING'
  ```

### 4. 카드가 새롭게 셔플되어 배치되는가?
- ✅ **충족**
- **검증 방법**:
  - `/api/game/start` API 호출로 새로운 카드 배열 받기
  - 서버에서 매번 랜덤하게 셔플된 16개 카드 반환
  - 이전 게임과 다른 배치로 게임 시작

### 5. 모달이 닫히는가?
- ✅ **충족**
- **검증 방법**:
  - `RESET_GAME` → status = 'IDLE'
  - `INIT_GAME` → status = 'PLAYING'
  - ResultModal의 isOpen 조건:
    ```typescript
    isOpen={state.status === 'VICTORY' || state.status === 'GAME_OVER'}
    ```
  - status가 'PLAYING'이 되면 모달 자동으로 닫힘

## 📝 구현 세부사항

### 변경 파일 1: App.tsx

#### 1. Import 추가 (8, 12줄)
```typescript
import { ResultModal } from './components/ResultModal'
import { startGame } from './api/gameApi'
```

#### 2. handleRestart 함수 (189-228줄)
```typescript
const handleRestart = async () => {
  console.log('[Game Restart] Restarting game...')

  try {
    // 1. 상태 초기화 (모달이 닫히고 상태가 IDLE로 변경됨)
    dispatch({ type: 'RESET_GAME' })

    // 2. 로딩 시작
    dispatch({ type: 'SET_LOADING', payload: true })

    // 3. API 호출로 새로운 게임 데이터 받기
    const { gameId, cards } = await startGame()

    // 4. 새 게임 초기화
    dispatch({
      type: 'INIT_GAME',
      payload: { gameId, cards },
    })

    console.log(`[Game Restart] New game started: ${gameId}`)
  } catch (error) {
    // 에러 처리
    const errorMessage =
      error instanceof Error ? error.message : '게임 재시작에 실패했습니다'

    dispatch({
      type: 'SET_ERROR',
      payload: errorMessage,
    })

    alert(`게임 재시작 실패\n\n${errorMessage}`)
    console.error('[Game Restart Error]', error)
  }
}
```

**단계별 설명**
1. **RESET_GAME**: 상태를 initialState로 초기화
   - gameId: null
   - cards: []
   - flippedCards: []
   - life: 3
   - status: 'IDLE'
   - isLoading: false
   - error: null
   - isMatching: false

2. **SET_LOADING**: 로딩 상태 활성화
   - isLoading: true
   - Loading... 메시지 표시

3. **startGame() API 호출**: 새로운 게임 데이터 받기
   - 서버에서 새로운 gameId 생성
   - 16개의 카드를 랜덤 셔플하여 반환

4. **INIT_GAME**: 새 게임으로 초기화
   - gameId, cards 설정
   - life: 3
   - status: 'PLAYING'
   - isLoading: false

#### 3. ResultModal 렌더링 (252-260줄)
```typescript
// 게임 플레이 화면
return (
  <>
    <GameContainer>
      <Header life={state.life} />
      <GameBoard cards={state.cards} onCardClick={handleCardClick} />
    </GameContainer>
    {/* 결과 모달 (VICTORY 또는 GAME_OVER 시 표시) */}
    <ResultModal
      isOpen={state.status === 'VICTORY' || state.status === 'GAME_OVER'}
      result={state.status as 'VICTORY' | 'GAME_OVER'}
      onRestart={handleRestart}
    />
  </>
)
```

**Fragment (빈 태그) 사용 이유**
```typescript
// ❌ 에러: return에는 하나의 루트 요소만 가능
return (
  <GameContainer>...</GameContainer>
  <ResultModal ... />
)

// ✅ Fragment로 감싸기
return (
  <>
    <GameContainer>...</GameContainer>
    <ResultModal ... />
  </>
)
```

### 신규 파일 2: components/ResultModal.tsx
- Issue #45에서 생성된 컴포넌트
- 이 브랜치에서도 포함하여 독립적으로 작동하도록 함
- PR merge 후 중복 제거됨

## 🎓 소프트웨어 공학적 설계 원칙

### 1. 게임 재시작 흐름

```
[사용자] "게임 재시작" 버튼 클릭
    ↓
[handleRestart] RESET_GAME 디스패치
    ↓
[Reducer] initialState로 초기화
    ↓ status = 'IDLE' → 모달 닫힘
[handleRestart] SET_LOADING(true) 디스패치
    ↓
[UI] "Loading..." 표시
    ↓
[handleRestart] startGame() API 호출
    ↓
[API] 새로운 gameId, 셔플된 cards 반환
    ↓
[handleRestart] INIT_GAME 디스패치
    ↓
[Reducer] life=3, status='PLAYING', cards 설정
    ↓
[UI] 새 게임 시작
```

### 2. 상태 초기화 전략

#### RESET_GAME vs 수동 초기화
```typescript
// ❌ 수동 초기화 (비추천)
dispatch({ type: 'SET_LIFE', payload: 3 })
dispatch({ type: 'SET_STATUS', payload: 'IDLE' })
dispatch({ type: 'SET_CARDS', payload: [] })
// ... 많은 액션 필요

// ✅ RESET_GAME (권장)
dispatch({ type: 'RESET_GAME' })
// 하나의 액션으로 모든 상태 초기화
```

**장점**
- 한 번의 액션으로 완전 초기화
- 상태 누락 위험 없음
- 코드 간결성

### 3. 에러 처리

#### try-catch로 안전한 API 호출
```typescript
try {
  const { gameId, cards } = await startGame()
  // 성공 시 게임 초기화
} catch (error) {
  // 실패 시 에러 처리
  dispatch({ type: 'SET_ERROR', payload: errorMessage })
  alert(`게임 재시작 실패\n\n${errorMessage}`)
}
```

**에러 시나리오**
- 네트워크 오류
- 서버 다운
- 타임아웃

**처리 방법**
1. SET_ERROR로 에러 상태 저장
2. alert로 사용자에게 즉시 알림
3. console.error로 디버깅 정보 로깅

### 4. 사용자 경험 (UX)

#### Retention (재미) 향상
- **즉시 재시작**: 버튼 하나로 새 게임 시작
- **깜빡임 없음**: 로딩 중 "Loading..." 표시
- **새로운 배치**: 매번 다른 카드 배치로 신선함 유지

#### 피드백 제공
```
1. 버튼 클릭 → 모달 닫힘 (즉각 반응)
2. "Loading..." 표시 (진행 상황 알림)
3. 새 게임 시작 (완료 피드백)
```

### 5. 의존성 관리

#### startGame() 재사용
```typescript
// useGameInitializer.ts에서도 사용
await startGame()

// App.tsx (handleRestart)에서도 사용
await startGame()
```

**DRY 원칙**
- API 호출 로직을 `api/gameApi.ts`에 중앙 집중
- 여러 곳에서 재사용 가능
- 수정 시 한 곳만 변경

## 🧪 테스트 시나리오

### 시나리오 1: 승리 후 재시작
```
1. 모든 카드 매칭 완료
2. status = 'VICTORY'
3. ResultModal 표시 (🎉 승리!)
4. "게임 재시작" 버튼 클릭
5. handleRestart 실행:
   - RESET_GAME → 모달 닫힘
   - SET_LOADING → "Loading..."
   - startGame() → 새 게임 데이터
   - INIT_GAME → 새 게임 시작
6. 새로운 카드 배치로 게임 진행
```

### 시나리오 2: 게임 오버 후 재시작
```
1. life = 0
2. status = 'GAME_OVER'
3. ResultModal 표시 (😢 게임 오버)
4. "게임 재시작" 버튼 클릭
5. handleRestart 실행 (동일 프로세스)
6. life = 3으로 새 게임 시작
```

### 시나리오 3: 재시작 중 에러
```
1. "게임 재시작" 버튼 클릭
2. RESET_GAME → 모달 닫힘
3. startGame() API 호출 실패 (네트워크 오류)
4. catch 블록 실행:
   - SET_ERROR
   - alert 표시
   - console.error 로깅
5. 에러 화면 표시
```

## 🧪 테스트 결과

### TypeScript 컴파일
```
✓ 컴파일 성공 (에러 없음)
```

### Production 빌드
```
vite v7.3.1 building client environment for production...
transforming...
✓ 101 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.46 kB │ gzip:  0.29 kB
dist/assets/index-DQ3P1g1z.css    0.91 kB │ gzip:  0.49 kB
dist/assets/index-jTStLv1D.js   275.46 kB │ gzip: 91.40 kB
✓ built in 391ms
```

## 📊 코드 품질 지표

### 타입 안전성
- ✅ handleRestart는 async 함수로 명시
- ✅ error 타입 체크 (instanceof Error)
- ✅ ResultModal props 타입 검증

### 에러 처리
- ✅ try-catch로 API 오류 처리
- ✅ 사용자에게 alert 알림
- ✅ console.error로 디버깅 지원

### 재사용성
- ✅ startGame() API 함수 재사용
- ✅ RESET_GAME 액션 재사용
- ✅ ResultModal 컴포넌트 재사용

### 사용자 경험
- ✅ 로딩 중 피드백 제공
- ✅ 에러 시 명확한 메시지
- ✅ 즉시 반응하는 UI

## 🎯 완성된 게임 흐름

```
게임 시작
    ↓
카드 뒤집기 (매칭 시도)
    ↓
    ├─ 모든 카드 매칭 → VICTORY → 모달 표시
    └─ Life 0 → GAME_OVER → 모달 표시
              ↓
       "게임 재시작" 버튼 클릭
              ↓
       새 게임 시작 (새로운 카드 배치)
              ↓
       반복적으로 즐기기 (Retention ↑)
```

## 🔗 관련 컴포넌트

### 상호작용하는 컴포넌트들
```
App.tsx
  ├─ useGameInitializer (게임 초기화)
  ├─ handleCardClick (카드 클릭)
  ├─ handleRestart (게임 재시작)
  ├─ Header (Life 표시)
  ├─ GameBoard (카드 보드)
  └─ ResultModal (결과 모달)
       └─ RestartButton → handleRestart 호출
```

---

**검증 완료**: 2026-01-31
**검증자**: Claude Sonnet 4.5
