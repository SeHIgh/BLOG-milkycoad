import { Suspense } from 'react';
import ClientBlogList from '@/components/ClientBlogList';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { pinnedIconMap } from '@/components/IconMap';

// * 로딩 스켈레톤 컴포넌트
function BlogPostsSkeleton() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
      {[...Array(6)].map((_, i) => (
        <Card
          key={i}
          className='h-full bg-card/30 py-0 gap-3 backdrop-blur-sm border-2 border-border shadow-lg overflow-hidden'
        >
          {/* 커버 이미지 영역 */}
          <div className='relative w-full h-40 overflow-hidden'>
            <Skeleton className='w-full h-full' />
            {/* 읽기 시간 표시 스켈레톤 */}
            <div className='absolute top-3 right-3'>
              <Skeleton className='h-6 w-12 rounded' />
            </div>
          </div>

          <CardHeader className='p-3 pb-1'>
            <Skeleton className='h-5 w-3/4 mb-2' /> {/* 제목 */}
            <Skeleton className='h-4 w-full mb-1' /> {/* 요약 */}
          </CardHeader>

          <CardContent className='p-3 pt-0'>
            <div className='space-y-2'>
              {/* 메타 정보 */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 bg-muted/50 px-2 py-1 rounded'>
                  <Skeleton className='w-3 h-3 rounded' />
                  <Skeleton className='h-3 w-20' />
                </div>
              </div>

              {/* 태그 영역 */}
              <div className='flex items-start justify-between gap-2'>
                {/* 메인 태그 - 왼쪽 */}
                <div className='flex flex-wrap gap-1.5 flex-1 min-w-0'>
                  <Skeleton className='h-6 w-16 rounded' />
                  <Skeleton className='h-6 w-14 rounded' />
                  <Skeleton className='h-6 w-12 rounded' />
                </div>

                {/* 서브 태그 - 오른쪽 */}
                <div className='flex flex-wrap gap-1.5 justify-end flex-shrink-0'>
                  <Skeleton className='h-6 w-12 rounded' />
                  <Skeleton className='h-6 w-10 rounded' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// * 메인 포스트 페이지
export default function PostsPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 py-4'>
        <div className='flex gap-3 items-center mb-4'>
          <pinnedIconMap.posts className='w-8 h-8 text-primary drop-shadow-sm' />
          <h1 className='text-3xl font-bold text-foreground drop-shadow-sm'>POSTS</h1>
        </div>
        <p className='text-muted-foreground ml-11 text-lg drop-shadow-sm'>
          개발과 일상에 대한 생각들을 기록합니다.
        </p>
      </div>

      {/* 데이터 준비 이전 까지 fallback UI(스켈레톤) 지정*/}
      <Suspense fallback={<BlogPostsSkeleton />}>
        <ClientBlogList />
      </Suspense>
    </div>
  );
}

// * 메타데이터 설정
export const metadata = {
  title: '블로그 | MilkyCoad',
  description: '개발과 일상에 대한 생각들을 기록하는 블로그입니다.',
  openGraph: {
    title: '블로그 | MilkyCoad',
    description: '개발과 일상에 대한 생각들을 기록하는 블로그입니다.',
    type: 'website',
  },
};
