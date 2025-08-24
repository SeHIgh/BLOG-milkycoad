'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi, apiKeys } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BlogPostCard from '@/components/BlogPostCard';

// BlogPostsSkeleton 컴포넌트 정의
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

interface ClientBlogListProps {
  publishedOnly?: boolean;
}

export default function ClientBlogList({ publishedOnly = true }: ClientBlogListProps) {
  // * 노션 DB로 부터 포스트 목록 가져오기
  const {
    data: posts,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: apiKeys.blogPosts(publishedOnly),
    queryFn: () => clientApi.getBlogPosts(publishedOnly),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
  });

  if (isLoading) {
    return <BlogPostsSkeleton />;
  }

  if (error) {
    return (
      <div className='text-center py-16 px-4'>
        <div className='max-w-md mx-auto'>
          <div className='w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center border-2 border-red-200 dark:border-red-800'>
            <svg
              className='w-10 h-10 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold mb-4 text-red-600 dark:text-red-400'>
            ⚠️ 오류가 발생했습니다
          </h2>
          <p className='text-muted-foreground mb-8 leading-relaxed text-lg'>
            {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
          </p>
          <button
            onClick={() => refetch()}
            className='px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 border-2 border-red-500'
          >
            🔄 다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className='text-center py-16 px-4'>
        <div className='max-w-lg mx-auto'>
          <div className='w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center border-2 border-yellow-200 dark:border-yellow-800'>
            <svg
              className='w-12 h-12 text-yellow-600 dark:text-yellow-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <h2 className='text-3xl font-bold mb-4 text-foreground'>
            📝 블로그 포스트를 불러올 수 없습니다
          </h2>
          <p className='text-muted-foreground mb-8 leading-relaxed text-lg'>
            Notion API 설정이 필요합니다. 환경변수를 확인해주세요.
          </p>
          <div className='bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-8 text-left shadow-lg'>
            <h3 className='font-bold text-yellow-800 dark:text-yellow-200 mb-6 flex items-center gap-3 text-xl'>
              <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
              설정 방법
            </h3>
            <ol className='text-base text-yellow-700 dark:text-yellow-300 space-y-3'>
              <li className='flex items-start gap-4'>
                <span className='flex-shrink-0 w-8 h-8 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold border border-yellow-300 dark:border-yellow-700'>
                  1
                </span>
                <span className='pt-1'>Notion Integration Token 생성</span>
              </li>
              <li className='flex items-start gap-4'>
                <span className='flex-shrink-0 w-8 h-8 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold border border-yellow-300 dark:border-yellow-700'>
                  2
                </span>
                <span className='pt-1'>Notion Database ID 확인</span>
              </li>
              <li className='flex items-start gap-4'>
                <span className='flex-shrink-0 w-8 h-8 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold border border-yellow-300 dark:border-yellow-700'>
                  3
                </span>
                <span className='pt-1'>.env.local 파일에 환경변수 설정</span>
              </li>
              <li className='flex items-start gap-4'>
                <span className='flex-shrink-0 w-8 h-8 bg-yellow-200 dark:bg-yellow-800 rounded-full flex items-center justify-center text-sm font-bold border border-yellow-300 dark:border-yellow-700'>
                  4
                </span>
                <span className='pt-1'>개발 서버 재시작</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} variant='default' />
      ))}
    </div>
  );
}
