'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // shadcn/ui 버튼 컴포넌트 import

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-full flex flex-col items-center justify-center min-h-[60vh] py-16">
      <h1 className="text-4xl font-bold text-destructive mb-2">404</h1>
      <h2 className="text-xl font-semibold mb-4">페이지를 찾을 수 없습니다</h2>
      <p className="mb-8 text-muted-foreground text-center">
        요청하신 페이지가 존재하지 않거나
        <br />
        이동되었을 수 있습니다.
      </p>
      <Button variant="secondary" onClick={() => router.push('/')} className="px-6 py-2 text-lg">
        홈으로 돌아가기
      </Button>
    </div>
  );
}
