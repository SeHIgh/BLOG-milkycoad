"use client";

import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { categoryIconMap } from "../IconMap";

interface SideListProps {
    isOpen: boolean;
    title: string;
    Icon: React.ComponentType<{ className?: string }>;
}

export const SideList: React.FC<SideListProps> = ({ isOpen, title, Icon }) => {
    return (
        // 접을 때 아이콘이 이동하는 현상 발생
        // 아이콘이 고정 되게 하기 위해 수정
        <li
            title={title}
            className="h-10 pl-2.5 flex justify-start items-center rounded-md transition-all duration-300 ease-in-out hover:bg-slate-400"
        >
            <Link
                href={`/${title}`}
                passHref
                className="flex justify-center items-center"
            >
                {/* 아이콘 값이 없을 경우 기본 아이콘으로 folder 사용 */}
                <Icon className="w-5 h-5" />
                {isOpen && <span className="ml-2">{title.toUpperCase()}</span>}
                {/* isOpen이 true일 때만 제목 표시 */}
            </Link>
        </li>
    );
};

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const categories = [
        { title: "home" },
        { title: "docs" },
        { title: "dev" },
        { title: "profile" },
        // ... 추가
    ];

    return (
        <aside
            className={`p-2 bg-background transition-[width] duration-300 ease-in-out overflow-x-hidden overflow-y-auto ${
                isOpen ? "w-48" : "w-14"
            } flex flex-col`}
        >
            <div className="flex justify-end">
                <button className="mr-2" onClick={() => setIsOpen(!isOpen)}>
                    <ArrowLeftIcon
                        className={cn(
                            isOpen ? "" : "-rotate-180",
                            "transition duration-300 ease-in-out"
                        )}
                    />
                </button>
            </div>
            {/* {isOpen && ( */}
            {/* // 글 줄바꿈 방지 */}
            <nav className="truncate mt-2">
                <ul className="flex flex-col gap-2">
                    {categories.map(({ title }) => {
                        const Icon =
                            categoryIconMap[title] || categoryIconMap.default;
                        return (
                            <SideList
                                key={title}
                                isOpen={isOpen}
                                title={title}
                                Icon={Icon}
                            />
                        );
                    })}
                </ul>
            </nav>
            {/* )} */}
        </aside>
    );
}
