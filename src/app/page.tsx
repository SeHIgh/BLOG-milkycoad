import React from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import RecentPosts from '@/components/RecentPosts';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="w-full h-full p-4 text-center flex flex-col justify-between">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
        미리내를 잇는 코드
      </h1>
      <h2 className="text-xl md:text-2xl text-accent-foreground">
        SeHi&apos;s Tech Blog
      </h2>

      <div className="mt-4 flex-1 space-y-8 text-gray-400 flex flex-col justify-between gap-4">
        {/* 최근 포스트 섹션 */}
        <Card className="border-2 border-foreground m-0 gap-2">
          <CardTitle className="text-start px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                최근 포스트
              </h3>
              <Link
                href="/posts"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-muted-foreground/80 transition-colors"
              >
                모든 포스트 보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </CardTitle>
          <CardContent className="px-6">
            <RecentPosts limit={4} />
          </CardContent>
        </Card>

        {/* 최근 작업 로그 섹션 */}
        <Card className="border-2 border-foreground flex-1 m-0">
          <CardTitle className="text-start px-4">최근 작업 기록</CardTitle>
          <CardContent className="h-full">
            <div className="h-full flex flex-col justify-between gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="w-full flex-1 min-h-6 rounded-md m-0"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
