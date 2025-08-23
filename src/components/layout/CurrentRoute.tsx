"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { pinnedIconMap, tagIconMap } from "../IconMap";
import { cn } from "@/lib/utils";

export default function CurrentRoute() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);

    // 누적 경로를 만들기 위한 유틸
    const getHref = (idx: number) => {
        return "/" + segments.slice(0, idx + 1).join("/");
    };

    // 세그먼트명에 맞는 아이콘 반환
    const getIcon = (seg: string) => {
        // 소문자 처리, 띄어쓰기 등 normalization 필요할 수 있음
        const key = seg.toLowerCase();
        const Icon =
            pinnedIconMap[key] || tagIconMap[key] || pinnedIconMap["default"];
        return <Icon className="w-4 h-4" />;
    };

    return (
        <div
            className={cn(
                // "p-2 bg-background",
                // "border-4 border-border",
                // "inset-ring-4 inset-ring-border"
            )}
        >
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
                            {getIcon(seg)}
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
