'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi, apiKeys } from '@/lib/api';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BlogPostCard from '@/components/BlogPostCard';

interface RecentPostsProps {
  limit?: number;
  showHeader?: boolean;
}

// 최근 포스트 스켈레톤
function RecentPostsSkeleton({ limit = 4 }: { limit?: number }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {[...Array(limit)].map((_, i) => (
        <Card
          key={i}
          className='h-full bg-card/30 py-0 gap-3 backdrop-blur-sm border-2 border-border shadow-lg overflow-hidden'
        >
          {/* 커버 이미지 영역 */}
          <div className='relative w-full h-32 overflow-hidden'>
            <Skeleton className='w-full h-full' />
            {/* 읽기 시간 표시 스켈레톤 */}
            <div className='absolute top-3 right-3'>
              <Skeleton className='h-6 w-12 rounded' />
            </div>
          </div>

          <CardHeader className='p-3 pb-1'>
            <Skeleton className='h-4 w-3/4 mb-2' /> {/* 제목 */}
            <Skeleton className='h-3 w-full mb-1' /> {/* 요약 */}
          </CardHeader>

          <CardContent className='p-3 pt-0'>
            <div className='space-y-2'>
              {/* 메타 정보 */}
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2 bg-muted/50 px-2 py-1 rounded'>
                  <Skeleton className='w-3 h-3 rounded' />
                  <Skeleton className='h-3 w-16' />
                </div>
              </div>

              {/* 태그 영역 */}
              <div className='flex items-start justify-between gap-2'>
                {/* 메인 태그 - 왼쪽 */}
                <div className='flex flex-wrap gap-1.5 flex-1 min-w-0'>
                  <Skeleton className='h-5 w-12 rounded' />
                  <Skeleton className='h-5 w-10 rounded' />
                </div>

                {/* 서브 태그 - 오른쪽 */}
                <div className='flex flex-wrap gap-1.5 justify-end flex-shrink-0'>
                  <Skeleton className='h-5 w-8 rounded' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function RecentPosts({ limit = 4 }: RecentPostsProps) {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: apiKeys.blogPosts(true),
    queryFn: () => clientApi.getBlogPosts(true),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  if (isLoading) {
    return <RecentPostsSkeleton limit={limit} />;
  }

  if (error || !posts || posts.length === 0) {
    return (
      <div className='text-center py-8'>
        <div className='text-muted-foreground'>최근 포스트를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const recentPosts = posts.slice(0, limit);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {recentPosts.map((post) => (
        <BlogPostCard key={post.id} post={post} variant='compact' />
      ))}
    </div>
  );
}
