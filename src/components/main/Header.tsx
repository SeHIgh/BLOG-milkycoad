"use client";

import Image from "next/image";
import ThemeToggle from "../basic/ThemeToggle";

export default function Header() {

    return (
        <header className="bg-background w-full h-10 p-1 px-2 flex flex-row justify-between items-center">
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

                <p className="truncate hidden sm:block lg:hidden">
                    : 그저 그렇지 않은 사람
                </p>
                <p className="truncate hidden lg:block">
                    : 💫 흐르는 정보와 아름다운 인터페이스를 은하수 처럼 잇는
                    개발자
                </p>
            </div>
            <ThemeToggle />
        </header>
    );
}
