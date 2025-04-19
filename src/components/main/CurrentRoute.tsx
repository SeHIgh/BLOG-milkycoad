"use client";

import { ChevronRight, Folder, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CurrentRoute() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    // 누적 경로를 만들기 위한 유틸
    const getHref = (idx: number) => {
        return "/" + segments.slice(0, idx + 1).join("/");
    };

    return (
        <div className="p-2 bg-background">
            <ul className="flex flex-row items-center gap-2">
                {/* 항상 홈 아이템 먼저 */}
                <li className="w-fit h-fit">
                    <Link
                        href="/"
                        className="flex flex-row items-center gap-1 hover:underline"
                    >
                        <Home className="w-4 h-4" />
                        <span className="text-xs text-foreground">home</span>
                    </Link>
                </li>
                {/* 홈이 아닌 경우에만 chevron과 segment 표시 */}
                {segments.map((seg, idx) => (
                    <li key={idx} className="flex flex-row items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <Link
                            href={getHref(idx)}
                            className="flex flex-row items-center gap-1 hover:underline"
                        >
                            <Folder className="w-4 h-4" />
                            <span className="text-xs text-foreground">
                                {seg}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
