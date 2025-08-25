import { Skeleton } from '@/components/ui/skeleton';

export default function BlogPostSkeleton() {
  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 뒤로가기 버튼 스켈레톤 */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* 커버 이미지 스켈레톤 */}
      <div className="relative w-full h-48 max-h-96 overflow-hidden mb-8 rounded-xl">
        <Skeleton className="w-full h-full" />
      </div>

      {/* 메타 정보 스켈레톤 */}
      <header className="mb-8">
        {/* 제목 스켈레톤 */}
        <div className="mb-4">
          <Skeleton className="h-10 w-4/5 mb-2" />
          <Skeleton className="h-10 w-3/5" />
        </div>

        {/* 요약 스켈레톤 */}
        <div className="mb-4">
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6" />
        </div>

        {/* 메타 정보 스켈레톤 */}
        <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
          {/* 날짜 */}
          <div className="flex items-center gap-1">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-28" />
          </div>

          {/* 읽기 시간 */}
          <div className="flex items-center gap-1">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>

          {/* 태그 */}
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded" />
              <Skeleton className="h-6 w-20 rounded" />
              <Skeleton className="h-6 w-14 rounded" />
            </div>
          </div>
        </div>

        <Skeleton className="h-px w-full" />
      </header>

      {/* 본문 스켈레톤 */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {/* H1 제목 스켈레톤 */}
        <div className="mb-6 p-4 border-l-4 border-primary bg-primary/10 rounded-r-lg">
          <Skeleton className="h-8 w-3/4 mb-2" />
          <Skeleton className="h-6 w-full" />
        </div>

        {/* 단락 스켈레톤 */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>

        {/* H2 제목 스켈레톤 */}
        <div className="mb-6 p-3 border-l-4 border-secondary bg-secondary/10 rounded-r-lg">
          <Skeleton className="h-7 w-2/3 mb-2" />
          <Skeleton className="h-6 w-4/5" />
        </div>

        {/* 단락 스켈레톤 */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>

        {/* 코드 블록 스켈레톤 */}
        <div className="mb-8 border border-border rounded-lg overflow-hidden">
          <div className="bg-primary text-primary-foreground px-4 py-2 text-sm font-mono border-b border-border">
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="bg-muted p-4">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-2" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>

        {/* 단락 스켈레톤 */}
        <div className="space-y-4 mb-8">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
        </div>

        {/* 콜아웃 스켈레톤 */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex gap-3">
            <Skeleton className="w-5 h-5 rounded" />
            <div className="flex-1">
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* 리스트 스켈레톤 */}
        <div className="mb-8">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
              <Skeleton className="h-4 w-48" />
            </li>
            <li className="flex items-start gap-2">
              <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
              <Skeleton className="h-4 w-52" />
            </li>
            <li className="flex items-start gap-2">
              <Skeleton className="w-2 h-2 rounded-full mt-2 flex-shrink-0" />
              <Skeleton className="h-4 w-40" />
            </li>
          </ul>
        </div>

        {/* 단락 스켈레톤 */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-4/5" />
        </div>
      </div>

      {/* 푸터 스켈레톤 */}
      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-28" />
        </div>
      </footer>
    </article>
  );
}
