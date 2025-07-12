# 블로그 모니터링용 GitHub Actions 설정 가이드

이 가이드는 `SeHIgh/BLOG-milkycoad` 리포지토리에 간단한 모니터링용 GitHub Actions를 설정하는 방법을 안내합니다.

## 📁 설정 방법

### 1. 워크플로우 파일 업로드

다음 파일들을 `SeHIgh/BLOG-milkycoad` 리포지토리의 `.github/workflows/` 디렉토리에 업로드하세요:

```
.github/
└── workflows/
    ├── ci.yml                 # 기본 CI (빌드, 린트)
    ├── deploy-monitor.yml     # 배포 모니터링
    └── scheduled-check.yml    # 정기 상태 체크
```

### 2. 파일 업로드 단계

1. **GitHub에서 직접 생성하기**

   - `SeHIgh/BLOG-milkycoad` 리포지토리로 이동
   - `.github/workflows/` 폴더 생성
   - 각 워크플로우 파일을 차례로 생성

2. **로컬에서 푸시하기**
   ```bash
   git clone https://github.com/SeHIgh/BLOG-milkycoad.git
   cd BLOG-milkycoad
   mkdir -p .github/workflows
   # 워크플로우 파일들 복사
   git add .
   git commit -m "Add GitHub Actions workflows for monitoring"
   git push
   ```

## 🔧 워크플로우 설명

### CI 워크플로우 (`ci.yml`)

- **트리거**: main/master 브랜치 push 시
- **작업**: 코드 체크아웃 → 의존성 설치 → 린트 체크 → 빌드 테스트
- **목적**: 코드 변경 시 기본적인 검증 수행

### 배포 모니터링 (`deploy-monitor.yml`)

- **트리거**: main/master 브랜치 push 시, 수동 실행
- **작업**: 배포 시작 알림 → 대기 → 배포 완료 확인 → 사이트 상태 체크
- **목적**: Vercel 배포 과정 모니터링

### 정기 상태 체크 (`scheduled-check.yml`)

- **트리거**: 매일 오전 9시 (KST), 수동 실행
- **작업**: 일일 상태 확인 → 성능 체크
- **목적**: 정기적인 시스템 상태 모니터링

## 🚀 테스트 방법

### 1. 즉시 테스트

워크플로우 파일 업로드 후 다음 중 하나를 수행:

- 리포지토리에 코드 변경 사항 푸시
- GitHub Actions 탭에서 "Run workflow" 버튼 클릭

### 2. 모니터링 확인

- `pipemate-frontend-next` 프로젝트의 Actions 모니터에서 확인
- 리포지토리 입력란에 `SeHIgh/BLOG-milkycoad` 입력
- 실시간 모니터링 시작

## 🎯 커스터마이징

### 사이트 URL 변경

`deploy-monitor.yml` 파일에서 실제 블로그 URL로 변경:

```yaml
echo "🔗 배포 URL: https://your-actual-blog-url.vercel.app"
```

### 스케줄 변경

`scheduled-check.yml` 파일에서 크론 표현식 수정:

```yaml
schedule:
  - cron: "0 0 * * *" # 매일 오전 9시 (KST)
```

### 알림 추가

Slack이나 Discord 알림을 원하는 경우:

```yaml
- name: Slack 알림
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🔍 모니터링 결과

워크플로우가 설정되면 다음과 같은 정보를 모니터링할 수 있습니다:

- ✅ 빌드 성공/실패 상태
- 🚀 배포 진행 과정
- ⏰ 실행 시간 및 소요 시간
- 📊 정기적인 상태 체크 결과
- 🔄 워크플로우 실행 빈도

## 💡 추가 기능

원하는 경우 다음 기능들을 추가할 수 있습니다:

1. **실제 사이트 응답 체크**
2. **Lighthouse 성능 측정**
3. **보안 스캔**
4. **의존성 업데이트 체크**
5. **커밋 메시지 검증**

이제 `SeHIgh/BLOG-milkycoad` 리포지토리에 이 워크플로우들을 설정하면 GitHub Actions 모니터링이 가능해집니다! 🎉
