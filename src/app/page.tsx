import React from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { HomeTitle } from '@/components/home/HomeTitle';
import { RecentPostsSection } from '@/components/home/RecentPostsSection';

export default function Home() {
  return (
    <div className='w-full h-full p-4 text-center flex flex-col justify-between'>
      <HomeTitle />

      <div className='mt-4 flex-1 space-y-8 text-gray-400 flex flex-col justify-between gap-4'>
        <RecentPostsSection />

        {/* 최근 작업 로그 섹션 */}
        <Card className='border-2 border-foreground flex-1 m-0'>
          <CardTitle className='text-start px-4'>최근 작업 기록</CardTitle>
          <CardContent className='h-full'>
            <div className='h-full flex flex-col justify-between gap-2'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='w-full flex-1 min-h-6 rounded-md m-0' />
              ))}
            </div>
          </CardContent>
        </Card>
        {/* 최근 작업 로그 섹션 */}
        <Card className='border-2 border-foreground flex-1 m-0'>
          <CardTitle className='text-start px-4'>최근 작업 기록</CardTitle>
          <CardContent className='h-full'>
            <div className='h-full flex flex-col justify-between gap-2'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='w-full flex-1 min-h-6 rounded-md m-0' />
              ))}
            </div>
          </CardContent>
        </Card>
        {/* 최근 작업 로그 섹션 */}
        <Card className='border-2 border-foreground flex-1 m-0'>
          <CardTitle className='text-start px-4'>최근 작업 기록</CardTitle>
          <CardContent className='h-full'>
            <div className='h-full flex flex-col justify-between gap-2'>
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className='w-full flex-1 min-h-6 rounded-md m-0' />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
