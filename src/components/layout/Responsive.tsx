'use client';

import { XIcon } from 'lucide-react';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/stores/useSidebarStore';

export default function ResponsiveSidebar() {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  // 페이지 이동 시 사이드바가 자동으로 닫히도록 설정
  // (사이드 바를 통해 페이지 이동 시 바로 해당 페이지 콘텐츠를 보여주기 위함)
  const pathname = usePathname();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]); // 페이지 이동 시 변경되는 pathname을 감지하여 사이드바 닫힘

  return (
    <>
      {/* PC/태블릿: 항상 보이는 사이드 바 */}
      <div className="w-fit hidden md:block">
        <Sidebar />
      </div>

      {/* 모바일: 오버레이 사이드바 */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          {/* 오버레이 배경 */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
          {/* 사이드바 패널 */}
          <div
            className={cn(
              'relative z-50 w-50 max-w-full bg-background shadow-lg h-full animate-in slide-in-from-left duration-300 border-4 border-foreground',
            )}
          >
            {/* 닫기 버튼 */}
            <button
              className="absolute top-4 right-4 hover:opacity-60 group"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close Sidebar"
            >
              <XIcon className="w-6 h-6 group-hover:stroke-muted-foreground group-hover:scale-110" />
            </button>
            <Sidebar className="md:p-2 pt-4 rounded-none md:rounded-tl-lg" />
          </div>
        </div>
      )}
    </>
  );
}
