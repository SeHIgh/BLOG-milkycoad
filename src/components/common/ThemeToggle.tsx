'use client';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 마운트 후에만 렌더링 (hydration 문제 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="rounded-xl w-8 h-8 text-sm transition-colors flex items-center justify-center group">
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="rounded-xl w-8 h-8 text-sm transition-colors flex items-center justify-center group"
    >
      {isDark ? (
        <Sun
          fill="var(--foreground)"
          className="h-[1.2rem] w-[1.2rem] group-hover:stroke-muted-foreground group-hover:scale-110 group-hover:fill-muted-foreground"
        />
      ) : (
        <Moon
          fill="var(--foreground)"
          className="h-[1.2rem] w-[1.2rem] group-hover:stroke-muted-foreground group-hover:scale-110 group-hover:fill-muted-foreground"
        />
      )}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
