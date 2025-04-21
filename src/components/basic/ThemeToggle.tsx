// components/ThemeToggle.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    // 초기 테마 설정 (localStorage → system preference)
    useEffect(() => {
        const root = window.document.documentElement;
        const stored = localStorage.getItem("theme");
        if (
            stored === "dark" ||
            (!stored &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            root.classList.add("dark");
            setIsDark(true);
        } else {
            root.classList.remove("dark");
            setIsDark(false);
        }
    }, []);

    // 토글 함수
    const toggleTheme = () => {
        const root = window.document.documentElement;
        const isDarkMode = root.classList.contains("dark");
        if (isDarkMode) {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
            setIsDark(false);
        } else {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
            setIsDark(true);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl px-4 py-2 text-sm transition-colors"
        >
            {isDark ? (
                <Sun
                    fill="var(--foreground)"
                    className="h-[1.2rem] w-[1.2rem]"
                />
            ) : (
                <Moon
                    fill="var(--foreground)"
                    className="h-[1.2rem] w-[1.2rem]"
                />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
