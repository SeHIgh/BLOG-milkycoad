"use client";

import { Menu, XIcon } from "lucide-react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function ResponsiveSidebar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            {/* 모바일: 상단 왼쪽 토글 버튼 */}
            <Button
                variant="ghost"
                className="fixed top-4.5 right-16 md:hidden rounded-xl px-4 py-2 text-sm transition-colors"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open Sidebar"
            >
                <Menu className="h-[1.2rem] w-[1.2rem]" />
            </Button>

            {/* PC/태블릿: 항상 보이는 사이드 바 */}
            <div className="w-fit hidden md:block">
                <Sidebar />
            </div>

            {/* 모바일: 오버레이 사이드바 */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 flex">
                    {/* 오버레이 배경 */}
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setSidebarOpen(false)}
                        aria-label="Close sidebar"
                    />
                    {/* 사이드바 패널 */}
                    <div
                        className={cn(
                            "relative z-50 w-48 max-w-full pt-4 bg-background shadow-lg h-full animate-in slide-in-from-left duration-300"
                        )}
                    >
                        {/* 닫기 버튼 */}
                        <button
                            className="absolute top-4 right-4 hover:opacity-60"
                            onClick={() => setSidebarOpen(false)}
                            aria-label="Close Sidebar"
                        >
                            <XIcon className="w-6 h-6" />
                        </button>
                        <Sidebar />
                    </div>
                </div>
            )}
        </>
    );
}
