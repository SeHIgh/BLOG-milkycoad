import { Suspense } from 'react';
import ClientBlogList from '@/components/posts/ClientBlogList';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { pinnedIconMap } from '@/components/IconMap';
import { POSTS_TITLE } from '@/components/common/pageTitleData';

// * 로딩 스켈레톤 컴포넌트
function BlogPostsSkeleton() {
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

// * 메인 포스트 페이지
export default function PostsPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <div className='flex gap-2 items-center mb-4'>
          <pinnedIconMap.posts className='w-8 h-8' />
          <h1 className='text-3xl font-bold'>{POSTS_TITLE.title}</h1>
        </div>
        <p className='text-muted-foreground ml-2'>{POSTS_TITLE.subtitle}</p>
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
