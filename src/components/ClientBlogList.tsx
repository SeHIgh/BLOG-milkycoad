'use client';

import { useQuery } from '@tanstack/react-query';
import { clientApi, apiKeys } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { BlogPost } from '@/lib/notion';
import { CONTENTS_PATH } from '@/lib/contents';
import Image from 'next/image';
import { cn } from '@/lib/utils';

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
    return <BlogListSkeleton />;
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-xl font-semibold mb-2 text-red-600'>오류가 발생했습니다</h2>
        <p className='text-muted-foreground mb-4'>
          {error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}
        </p>
        <button
          onClick={() => refetch()}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-xl font-semibold mb-2'>아직 게시된 글이 없습니다</h2>
        <p className='text-muted-foreground'>첫 번째 블로그 포스트를 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

// * 포스트 카드
function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/posts/${encodeURIComponent(post.slug)}`} className='block group'>
      <Card
        className={cn(
          'h-full transition-all duration-300 hover:shadow-lg group-hover:scale-[1.02]',
          'p-0 pb-3 overflow-hidden',
        )}
      >
        <div className='aspect-video overflow-hidden rounded-t-lg relative'>
          <Image
            src={post.coverImage ? post.coverImage : CONTENTS_PATH.post.banner.main}
            alt={post.title}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>
        <CardHeader>
          <CardTitle className='line-clamp-2 group-hover:text-blue-600 transition-colors'>
            {post.title}
          </CardTitle>
          {post.summary && (
            <CardDescription className='line-clamp-3'>{post.summary}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between text-sm text-muted-foreground'>
            <time dateTime={post.createdAt}>
              {format(new Date(post.createdAt), 'yyyy년 MM월 dd일', {
                locale: ko,
              })}
            </time>
            {(post.mainTags.length > 0 || post.subTags.length > 0) && (
              <div className='space-y-1'>
                {post.mainTags.length > 0 && (
                  <div className='flex gap-1 flex-wrap'>
                    {post.mainTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium'
                      >
                        {tag}
                      </span>
                    ))}
                    {post.mainTags.length > 2 && (
                      <span className='text-xs'>+{post.mainTags.length - 2}</span>
                    )}
                  </div>
                )}
                {post.subTags.length > 0 && (
                  <div className='flex gap-1 flex-wrap'>
                    {post.subTags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs'
                      >
                        {tag}
                      </span>
                    ))}
                    {post.subTags.length > 2 && (
                      <span className='text-xs'>+{post.subTags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function BlogListSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(6)].map((_, i) => (
        <Card key={i} className='h-full'>
          <Skeleton className='aspect-video rounded-t-lg' />
          <CardHeader>
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </CardHeader>
          <CardContent>
            <div className='flex justify-between'>
              <Skeleton className='h-4 w-24' />
              <div className='flex gap-1'>
                <Skeleton className='h-6 w-12 rounded-full' />
                <Skeleton className='h-6 w-16 rounded-full' />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
