---
description: "Git 커밋 워크플로우. 브랜치명 기반 커밋 메시지 형식을 따르며, 스테이징 → 미리보기 → 커밋 순서로 진행합니다."
---

# Git Commit Workflow

// turbo-all

## 규칙

- 커밋 메시지 형식: `[브랜치명] 변경 내용 요약`
- **금지**: `fix:`, `feat:`, `chore:` 등 conventional commits 접두어 사용 금지
- **OS 감지**: 실행 환경(Linux/macOS vs Windows/PowerShell)에 따라 적절한 명령어를 사용할 것

## OS별 명령어 차이

| 항목 | Linux / macOS (bash/zsh) | Windows (PowerShell) |
| :--- | :--- | :--- |
| 명령 연결 | `&&` | `;` |
| 줄바꿈 (커밋 본문) | `\n` 또는 여러 `-m` 플래그 | `` `n `` |
| 경로 구분자 | `/` | `\` 또는 `/` |

## Step 1: 현재 브랜치 및 변경 파일 확인

**Linux / macOS:**
```bash
git branch --show-current && git status && git diff --name-only
```

**PowerShell:**
```powershell
git branch --show-current; git status; git diff --name-only
```

## Step 2: 변경 파일 스테이징

**특정 파일만 스테이징** (절대로 `git add .` 또는 `git add -A` 사용 금지):

```bash
git add <파일경로1> <파일경로2>
```

> ⚠️ **PowerShell 환경에서 괄호 `()` 포함 경로는 반드시 따옴표로 감쌀 것:**
> ```powershell
> # ❌ 틀림
> git add src/app/(auth)/login/page.tsx
>
> # ✅ 올바름
> git add "src/app/(auth)/login/page.tsx"
> ```

## Step 3: 커밋 메시지 미리보기 확인

커밋 전 사용자에게 반드시 확인:

```
📝 커밋 메시지 미리보기:

[feature/user-profile] 사용자 프로필 이미지 업로드 기능 추가

- components/ProfileUploader.tsx: 이미지 드래그앤드롭 업로드 컴포넌트 구현
- lib/storage.ts: S3 업로드 유틸리티 함수 추가

스테이징된 파일:
- src/components/ProfileUploader.tsx
- src/lib/storage.ts

진행할까요? (Y/N)
```

## Step 4: 커밋 실행

제목(subject) + 본문(body)을 `-m` 플래그 두 번으로 작성합니다.

**Linux / macOS:**
```bash
git add src/components/ProfileUploader.tsx src/lib/storage.ts && \
git commit -m "[feature/user-profile] 사용자 프로필 이미지 업로드 기능 추가" \
-m "- components/ProfileUploader.tsx: 이미지 드래그앤드롭 업로드 컴포넌트 구현
- lib/storage.ts: S3 업로드 유틸리티 함수 추가"
```

**PowerShell:**
```powershell
git add "src/components/ProfileUploader.tsx" "src/lib/storage.ts"; git commit -m "[feature/user-profile] 사용자 프로필 이미지 업로드 기능 추가" -m "- components/ProfileUploader.tsx: 이미지 드래그앤드롭 업로드 컴포넌트 구현`n- lib/storage.ts: S3 업로드 유틸리티 함수 추가"
```

## 주의사항

- `.env`, `.env.local` 등 환경변수 파일은 절대 커밋 금지
- Husky pre-commit hook 실패 시 lint 오류 수정 후 재시도
- `git add .` 사용 금지 — 반드시 파일을 명시적으로 지정
