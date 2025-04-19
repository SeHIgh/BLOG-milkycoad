"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

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
        // 헤더 높이 25rem(100px), 상단 고정, 패딩 2.5
        // 배경 투명도 10%
        <header className="bg-background w-full h-10 p-1 flex flex-row justify-between items-center">
            <div>
            </div>
            <div className="flex flex-row justify-between gap-2 item-center">
                {/* <nav aria-label="Tabs" className="h-full flex items-center">
                    <ul className="flex flex-row justify-center">
                        <li id="tab_id">
                            <Link href="/docs">Docs</Link>
                        </li>
                        <li id="tab_id">
                            <Link href="/blog">Blog</Link>
                        </li>
                        <li id="tab_id">
                            <Link href="/update">Update</Link>
                        </li>
                    </ul>
                </nav> */}
                <button className="w-fit" onClick={toggleDarkMode}>
                    {isDarkMode ? (
                        <Sun strokeWidth="3" className="w-7 h-7" />
                    ) : (
                        <Moon strokeWidth="3" className="w-7 h-7" />
                    )}
                </button>
            </div>
        </header>
    );
}
