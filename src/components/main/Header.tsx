"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";

export default function Header() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const darkMode = localStorage.getItem("theme") === "dark";
        if (darkMode) {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
        }
    }, []);

    const toggleDarkMode = () => {
        const isDark = !isDarkMode;
        setIsDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

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

                {/* <p>: 그저 그렇지 않은 사람</p> */}
                <p>
                    : 💫 흐르는 정보와 아름다운 인터페이스를 은하수 처럼 잇는
                    개발자
                </p>
            </div>
            <div className="flex flex-row justify-between gap-2 item-center">
                <button
                    className="flex flex-row justify-between items-center hover:scale-110"
                    onClick={toggleDarkMode}
                >
                    {!isDarkMode ? (
                        <Sun
                            strokeWidth="2"
                            color="var(--foreground)"
                            fill="var(--foreground)"
                            className="w-7 h-7"
                        />
                    ) : (
                        <Moon
                            strokeWidth="2"
                            color="var(--foreground)"
                            fill="var(--foreground)"
                            className="w-7 h-7"
                        />
                    )}
                </button>
            </div>
        </header>
    );
}
