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
import { TAG_COLOR } from '@/lib/tags';
import { Calendar, Hash } from 'lucide-react';

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
        <h2 className='text-xl font-semibold mb-2'>블로그 포스트를 불러올 수 없습니다</h2>
        <p className='text-muted-foreground mb-4'>
          Notion API 설정이 필요합니다. 환경변수를 확인해주세요.
        </p>
        <div className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md mx-auto text-left'>
          <h3 className='font-semibold text-yellow-800 dark:text-yellow-200 mb-2'>설정 방법:</h3>
          <ol className='text-sm text-yellow-700 dark:text-yellow-300 space-y-1'>
            <li>1. Notion Integration Token 생성</li>
            <li>2. Notion Database ID 확인</li>
            <li>3. .env.local 파일에 환경변수 설정</li>
            <li>4. 개발 서버 재시작</li>
          </ol>
        </div>
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
          'gap-5',
        )}
      >
        <div className='relative w-full aspect-[16/9] overflow-hidden group'>
          {/* 커버 이미지 */}
          {/* 커버 이미지가 있다면, 그대로 렌더링, 없다면 기본 이미지 렌더링 */}
          <Image
            src={post.coverImage ? post.coverImage : CONTENTS_PATH.post.banner.main}
            alt={post.title}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            className='object-cover transition-transform duration-300 group-hover:scale-105'
          />
        </div>
        <CardHeader className='flex-1'>
          {/* 제목 */}
          <CardTitle className='line-clamp-2 group-hover:text-sidebar-accent-foreground transition-colors'>
            {post.title}
          </CardTitle>
          {/* 요약, 설명 */}
          {post.summary && (
            <CardDescription className='line-clamp-3'>{post.summary}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 gap-2 text-sm text-muted-foreground pb-1'>
            {/* 시간 */}
            {/* <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              <time dateTime={post.createdAt}>
                {format(new Date(post.createdAt), 'yy년 MM월 dd일 HH:MM', {
                  locale: ko,
                })}
              </time>
            </div> */}
            {/* 시간 */}
            <div className='flex items-center gap-2'>
              <Calendar className='w-4 h-4' />
              <time dateTime={post.lastEditedAt}>
                {format(new Date(post.lastEditedAt), 'yy년 M월 d일 HH:MM', {
                  locale: ko,
                })}
              </time>
            </div>
            {/* 태그 */}
            <div className='flex flex-row items-center gap-2'>
              <Hash className='w-4 h-4' />
              {(post.mainTags.length > 0 || post.subTags.length > 0) && (
                <div className='flex flex-row flex-wrap gap-1'>
                  {post.mainTags.length > 0 && (
                    <div className='flex gap-1 flex-wrap'>
                      {post.mainTags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className='px-2 py-1 bg-secondary text-accent-foreground dark:text-white rounded-md text-xs font-bold'
                          style={{
                            backgroundColor:
                              TAG_COLOR.main_tags[tag] ?? TAG_COLOR.main_tags.default,
                          }}
                        >
                          {tag.toUpperCase()}
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
                          className='px-2 py-1 bg-secondary text-accent-foreground dark:text-white rounded-md text-xs font-bold'
                          style={{
                            backgroundColor: TAG_COLOR.sub_tags[tag] ?? TAG_COLOR.main_tags.default,
                          }}
                        >
                          {tag.toUpperCase()}
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
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// * 로딩 스캘레톤 화면
function BlogListSkeleton() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      {[...Array(6)].map((_, i) => (
        <Card
          key={i}
          className='h-full transition-all duration-300 group-hover:scale-[1.02] p-0 pb-3 overflow-hidden gap-5'
        >
          {/* 커버 이미지 영역 */}
          <div className='relative w-full aspect-[16/9] overflow-hidden'>
            <Skeleton className='absolute inset-0 w-full h-full object-cover' />
          </div>
          <CardHeader className='flex-1'>
            <Skeleton className='h-6 w-3/4 mb-2' /> {/* 제목 */}
            <Skeleton className='h-4 w-full mb-1' /> {/* 요약 1 */}
            <Skeleton className='h-4 w-2/3' /> {/* 요약 2 */}
          </CardHeader>
          <CardContent>
            <div className='flex items-start justify-between text-sm'>
              {/* 날짜 */}
              <Skeleton className='h-4 w-24' />
              {/* 태그 영역 */}
              <div className='space-y-1'>
                <div className='flex gap-1 flex-wrap mb-1'>
                  <Skeleton className='h-6 w-12 rounded-full' />
                  <Skeleton className='h-6 w-12 rounded-full' />
                  {/* +N 태그 표시용 */}
                  <Skeleton className='h-6 w-8 rounded-full' />
                </div>
                <div className='flex gap-1 flex-wrap'>
                  <Skeleton className='h-6 w-10 rounded-full' />
                  <Skeleton className='h-6 w-10 rounded-full' />
                  {/* +N 태그 표시용 */}
                  <Skeleton className='h-6 w-8 rounded-full' />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
