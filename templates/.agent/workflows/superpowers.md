---
description: "Superpowers 전체 개발 사이클을 오케스트레이션합니다. 브레인스토밍 → 계획 → 구현 → 검증 → 마무리까지 5단계를 순서대로 진행하며, 각 단계 전환 시 최적의 AI 모델 전환을 안내합니다."
---

# Superpowers 멀티모델 오케스트레이터

이 워크플로우는 Superpowers의 전체 개발 사이클을 관리하는 마스터 오케스트레이터입니다.
각 단계가 끝나면 **반드시** 다음 단계의 추천 모델을 안내하고, 사용자의 확인 후 다음 단계로 진입합니다.

## 모델 추천 매핑

| Phase | 단계 | 추천 모델 | 이유 |
| :---: | :--- | :--- | :--- |
| 1 | 브레인스토밍 | **Claude Opus** | 창의적 사고, 요구사항 탐색에 강점 |
| 2 | 계획 수립 | **Claude Opus** | 상세 분석, 아키텍처 설계에 강점 |
| 3 | 구현 (코딩) | **Gemini** | 빠른 코드 생성, 도구 실행에 강점 |
| 4 | 검증 | **Gemini** | 도구 실행, 빌드/테스트 검증에 강점 |
| 5 | 코드 리뷰 / 마무리 | **Claude Opus** | 분석적 리뷰, 품질 판단에 강점 |

> 위 추천은 기본값입니다. 사용자가 원하면 언제든 다른 모델을 선택할 수 있습니다.

## 실행 흐름

```
Phase 1: 브레인스토밍  ──→  🔄 모델 전환 안내
          ↓
Phase 2: 계획 수립     ──→  🔄 모델 전환 안내
          ↓
Phase 3: 구현          ──→  🔄 모델 전환 안내
          ↓
Phase 4: 검증          ──→  🔄 모델 전환 안내
          ↓
Phase 5: 마무리
```

---

## Phase 1: 브레인스토밍

**추천 모델:** Claude Opus

1. `.agent/skills/brainstorming/SKILL.md` 스킬을 로드하고 정확히 따릅니다.
2. 프로젝트 컨텍스트 탐색 → 질문 → 접근법 제안 → 설계 승인 → 설계 문서 저장.
3. 설계가 승인되면 **Transition Gate**를 실행합니다.

### Transition Gate → Phase 2

브레인스토밍이 완료되면 다음 메시지를 출력하고 **반드시** 사용자 응답을 기다립니다:

```
✅ Phase 1 (브레인스토밍) 완료

📋 다음 단계: Phase 2 — 계획 수립
🤖 추천 모델: Claude Opus (상세 분석, 아키텍처 설계에 강점)

👉 모델을 확인/변경한 후, "계속" 또는 "진행"이라고 입력해주세요.
```

---

## Phase 2: 계획 수립

**추천 모델:** Claude Opus

1. `.agent/skills/writing-plans/SKILL.md` 스킬을 로드하고 정확히 따릅니다.
2. bite-sized 작업 단위로 구현 계획을 작성합니다.
3. 계획이 `docs/plans/` 에 저장되면 **Transition Gate**를 실행합니다.

### Transition Gate → Phase 3

계획 수립이 완료되면 다음 메시지를 출력하고 **반드시** 사용자 응답을 기다립니다:

```
✅ Phase 2 (계획 수립) 완료
📄 계획 파일: docs/plans/<filename>.md

📋 다음 단계: Phase 3 — 구현
🤖 추천 모델: Gemini (빠른 코드 생성, 도구 실행에 강점)

⚠️ 모델 전환을 권장합니다: Claude Opus → Gemini
👉 모델을 확인/변경한 후, "계속" 또는 "진행"이라고 입력해주세요.
```

---

## Phase 3: 구현

**추천 모델:** Gemini

1. `.agent/skills/executing-plans/SKILL.md` 스킬을 로드합니다.
2. `.agent/skills/single-flow-task-execution/SKILL.md` 실행 모델을 따릅니다.
3. 배치 단위(기본 3개)로 작업을 실행하며, 각 배치 완료 시 사용자 피드백을 기다립니다.
4. 모든 작업이 끝나면 **Transition Gate**를 실행합니다.

### 조건부 스킬 (Phase 3 내에서 상황에 따라 호출)

| 상황 | 호출할 스킬 | 설명 |
| :--- | :--- | :--- |
| 새 기능 구현 시 | `.agent/skills/test-driven-development/SKILL.md` | 테스트 먼저 작성 → 구현 → 통과 확인의 TDD 사이클을 따릅니다 |
| 버그/테스트 실패 발생 시 | `.agent/skills/systematic-debugging/SKILL.md` | 추측 대신 근본 원인을 체계적으로 추적합니다 |
| 프론트엔드 작업 시 | `.agent/skills/frontend-agent/SKILL.md` | React/UI/UX 전문 지식으로 구현을 보강합니다 |
| 백엔드 작업 시 | `.agent/skills/backend-agent/SKILL.md` | API/DB/서버 전문 지식으로 구현을 보강합니다 |

> **스킬 우선순위:** 프로세스 스킬(TDD, 디버깅)을 먼저 적용하고, 그 안에서 도메인 에이전트(frontend/backend)를 호출합니다.

### Transition Gate → Phase 4

구현이 완료되면 다음 메시지를 출력하고 **반드시** 사용자 응답을 기다립니다:

```
✅ Phase 3 (구현) 완료
📊 완료된 작업: N/N tasks

📋 다음 단계: Phase 4 — 검증
🤖 추천 모델: Gemini (도구 실행, 빌드/테스트 검증에 강점)

👉 모델을 확인/변경한 후, "계속" 또는 "진행"이라고 입력해주세요.
```

---

## Phase 4: 검증

**추천 모델:** Gemini

1. `.agent/skills/verification-before-completion/SKILL.md` 스킬을 로드하고 따릅니다.
2. 테스트 실행, 빌드 확인, 린터 검증 등 모든 관련 검증 명령을 실행합니다.
3. 증거(exit code, 테스트 결과)를 반드시 제시합니다.
4. QA 관점 검증이 필요하면 `.agent/skills/qa-agent/SKILL.md`를 로드하여 보안, 접근성, 성능 관점에서 추가 검증합니다.
5. 검증 완료 시 **Transition Gate**를 실행합니다.

### Transition Gate → Phase 5

검증이 완료되면 다음 메시지를 출력하고 **반드시** 사용자 응답을 기다립니다:

```
✅ Phase 4 (검증) 완료
🧪 테스트: PASS (N/N)
🔨 빌드: PASS
🔍 린터: PASS

📋 다음 단계: Phase 5 — 코드 리뷰 및 브랜치 마무리
🤖 추천 모델: Claude Opus (분석적 리뷰, 품질 판단에 강점)

⚠️ 모델 전환을 권장합니다: Gemini → Claude Opus
👉 모델을 확인/변경한 후, "계속" 또는 "진행"이라고 입력해주세요.
```

---

## Phase 5: 코드 리뷰 및 마무리

**추천 모델:** Claude Opus

### Step 1: 코드 리뷰

1. `.agent/skills/requesting-code-review/SKILL.md` 스킬을 로드하여 체계적인 코드 리뷰를 실행합니다.
2. 리뷰에서 이슈가 발견되면 `.agent/skills/receiving-code-review/SKILL.md` 스킬을 로드하여 피드백을 체계적으로 반영합니다.
3. 모든 리뷰 이슈가 해결될 때까지 반복합니다.

### Step 2: 최종 검증 및 완료

1. `.agent/skills/verification-before-completion/SKILL.md` 스킬을 로드하여 최종 검증을 실행합니다.
2. 모든 테스트 통과, 빌드 성공, 린터 클린을 확인합니다.

### Step 3: 커밋

1. `.agent/workflows/commit.md` 워크플로우를 따라 변경 사항을 커밋합니다.
2. 커밋 메시지 미리보기를 사용자에게 확인받은 후 실행합니다.
3. 완료 시 최종 요약을 출력합니다.

### 완료 메시지

```
🎉 Superpowers 전체 개발 사이클 완료!

📊 요약:
  - Phase 1 (브레인스토밍): ✅
  - Phase 2 (계획 수립): ✅
  - Phase 3 (구현): ✅
  - Phase 4 (검증): ✅
  - Phase 5 (마무리): ✅
```

---

## 규칙

1. **각 Phase 전환 시 반드시 Transition Gate를 실행합니다.** 사용자 확인 없이 다음 단계로 넘어가지 마세요.
2. **모델 추천은 안내일 뿐 강제가 아닙니다.** 사용자가 그대로 진행하겠다고 하면 현재 모델로 계속합니다.
3. **각 Phase에서 해당 스킬의 모든 규칙을 준수합니다.** 이 워크플로우는 기존 스킬 위에 올라가는 오케스트레이션 레이어입니다.
4. **Phase를 건너뛸 수 없습니다.** 단, 사용자가 명시적으로 "Phase N부터 시작"이라고 요청하면 해당 Phase부터 진행합니다.
5. **`docs/plans/task.md`를 각 Phase 전환 시 업데이트합니다.**
