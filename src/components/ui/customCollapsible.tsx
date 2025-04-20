import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChevronDown, Hash, Pin } from "lucide-react";
import { cn } from "@/lib/utils"; // 유틸리티 함수가 필요하다면 import
import Link from "next/link";

type IconComponent = React.ComponentType<{ className?: string }>;

type SidebarNavCollapsibleProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    categories: { title: string, url?: string }[];
    categoryIconMap: Record<string, IconComponent>;
    isOpen: boolean; // SideList에 전달할 용도
    className?: string;
};

interface SideListProps {
    isOpen: boolean;
    title: string;
    Icon: React.ComponentType<{ className?: string }>;
    url?: string;
}

export const SideList: React.FC<SideListProps> = ({ isOpen, title, Icon, url }) => {
    return (
        // 접을 때 아이콘이 이동하는 현상 발생
        // 아이콘이 고정 되게 하기 위해 수정
        <li
            title={title}
            className="h-8 pl-2.5 flex justify-start items-center rounded-md transition-all duration-300 ease-in-out group cursor-pointer"
        >
            <Link
                href={url || "/"}
                passHref
                className="flex justify-center items-center"
            >
                {/* 아이콘 값이 없을 경우 기본 아이콘으로 folder 사용 */}
                <Icon className="w-5 h-5 opacity-100 group-hover:opacity-60" />
                {isOpen && (
                    <span className="ml-2 opacity-100 group-hover:opacity-60">
                        {title.toUpperCase()}
                    </span>
                )}
                {/* isOpen이 true일 때만 제목 표시 */}
            </Link>
        </li>
    );
};

export function SidebarNavCollapsible({
    open,
    onOpenChange,
    title,
    categories,
    categoryIconMap,
    isOpen,
    className,
}: SidebarNavCollapsibleProps) {
    return (
        <Collapsible
            open={open}
            onOpenChange={onOpenChange}
            className={className}
        >
            <div className="flex flex-row items-center justify-between pe-2.5 group">
                <div className="px-3 py-1 flex flex-row justify-start gap-1 mb-1">
                    {
                        title === "Pinned" ? 
                        <Pin className="w-4 h-4 rotate-325" fill="#A70100" />:
                        <Hash className="w-4 h-4" />
                    }
                    {isOpen && (
                        <h3 className="text-xs font-bold text-muted-foreground">
                            {title}
                        </h3>
                    )}
                </div>
                <CollapsibleTrigger asChild>
                    <button className="h-5 w-5 flex items-center">
                        <ChevronDown
                            color="var(--muted-foreground)"
                            className={cn(
                                open ? "rotate-180" : "rotate-0",
                                "h-5 w-5",
                                "opacity-0 group-hover:opacity-100 transition duration-200"
                            )}
                        />
                    </button>
                </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
                <ul className="flex flex-col gap-2">
                    {categories.map(({ title, url }) => {
                        const Icon =
                            categoryIconMap[title] || categoryIconMap.default;
                        return (
                            <SideList
                                key={title}
                                isOpen={isOpen}
                                title={title}
                                Icon={Icon}
                                url={url}
                            />
                        );
                    })}
                </ul>
            </CollapsibleContent>
        </Collapsible>
    );
}
