'use client';

import Image from 'next/image';
import ThemeToggle from '../common/ThemeToggle';
import { cn } from '@/lib/utils';
import SidebarToggle from '../common/SidebarToggle';

export default function Header() {
  return (
    // (임시) border-4
    <header
      className={cn(
        'bg-background w-full h-10 p-1 px-2 flex flex-row justify-between items-center',
        // "border-4 border-border rounded-tr-lg",
        'inset-ring-4 inset-ring-border rounded-t-lg md:rounded-tr-lg md:rounded-tl-none',
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/SeHi_Profile_Blue_BG_2x.png"
            width={32}
            height={32}
            className="rounded-lg border-2 border-foreground"
            alt="profile_img"
          />
          <h3>SeHi</h3>
        </div>

        <p className="truncate block sm:hidden">: 💫</p>
        <p className="truncate hidden sm:block lg:hidden">
          : &quot;그저 그렇지 않은 사람이 되자.&quot;
        </p>
        <p className="truncate hidden lg:block">
          : 💫 흐르는 정보와 아름다운 인터페이스를 은하수 처럼 잇는 개발자
        </p>
      </div>
      <div className="flex flex-row gap-2">
        {/* 모바일 : 사이드바 토글 버튼 */}
        <SidebarToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
