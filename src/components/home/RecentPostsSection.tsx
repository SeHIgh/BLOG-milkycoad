'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { apiKeys, clientApi } from '@/lib/api';
import { BlogListSkeleton, BlogPostCard } from '../posts/ClientBlogList';

// * 최근 포스트 섹션
export const RecentPostsSection = () => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: apiKeys.blogPosts(),
    queryFn: () => clientApi.getBlogPosts(),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분 (이전 cacheTime)
  });

  // // !(오류) 로딩 중 혹은 에러 시 스켈레톤 UI 표시
  // if (isLoading || error) {
  //   return <BlogListSkeleton />;
  // }

  // // *(정상) 작성된(or 배포된) 포스트가 없을 때
  // if (!posts || posts.length === 0) {
  //   return (
  //     <div className='text-center py-12'>
  //       <h2 className='text-xl font-semibold mb-2'>아직 게시된 글이 없습니다</h2>
  //       <p className='text-muted-foreground'>첫 번째 블로그 포스트를 작성해보세요!</p>
  //     </div>
  //   );
  // }

  // // *(정상) 포스트 렌더링
  // return (
  //   <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
  //     {posts.map((post) => (
  //       <BlogPostCard key={post.id} post={post} />
  //     ))}
  //   </div>
  // );

  return (
    // <Card className='border-2 border-foreground m-0'>
    <Card className='relative py-0 border-none shadow-none'>
      <CardHeader className='border-border border-y-4 sticky top-0 left-0 z-100 py-3 blur-md'>
        <CardTitle className='text-start px-4'>최근 포스트</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 로딩 또는 에러 시 스켈레톤 */}
        {(isLoading || error) && (
          // <div className='space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 min-h-50'>
          //   {[...Array(4)].map((_, i) => (
          //     <Skeleton key={i} className='h-full min-h-40 w-full rounded-md' />
          //   ))}
          // </div>
          <BlogListSkeleton />
        )}

        {/* 포스트 없음 */}
        {!isLoading && !error && (!posts || posts.length === 0) && (
          <div className='text-center py-12 w-full col-span-full'>
            <h2 className='text-xl font-semibold mb-2'>아직 게시된 글이 없습니다</h2>
            <p className='text-muted-foreground'>첫 번째 블로그 포스트를 작성해보세요!</p>
          </div>
        )}

        {/* 포스트 목록 */}
        {!isLoading && !error && posts && posts.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
