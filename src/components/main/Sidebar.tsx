"use client";

import { cn } from "@/lib/utils";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { pinnedIconMap, tagIconMap } from "../IconMap";
import { SidebarNavCollapsible } from "../ui/customCollapsible";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [pinnedIsOpen, setPinnedIsOpen] = useState(true);
  const [tagsIsOpen, setTagsIsOpen] = useState(true);

  const pinnedList = [
    { title: "home", url: "/" },
    { title: "about", url: "/about" },
    { title: "posts", url: "/posts" },
    { title: "dev.log", url: "/dev.log" },
    { title: "projects", url: "/projects" },
  ];

  const tagsList = [
    { title: "all", url: "/tags" },
    { title: "cs", url: "/tags/cs" },
    { title: "language", url: "/tags/language" },
    { title: "algorithm", url: "/tags/algorithm" },
    { title: "frontend", url: "/tags/frontend" },
    { title: "backend", url: "/tags/backend" },
    { title: "review", url: "/tags/review" },
  ];

  return (
    <aside
      className={cn(
        "p-2 bg-background transition-[width] duration-300 ease-in-out overflow-x-hidden overflow-y-auto",
        isOpen ? "w-48 md:w-42" : "w-14",
        "flex flex-col justify-between h-full",
        // "border-4 border-border rounded-s-lg",
        "inset-ring-4 inset-ring-border md:rounded-tl-lg",
        className
      )}
    >
      <div className="flex flex-col justify-between gap-5">
        <div className="flex justify-end">
          <button
            className="mr-2 hidden md:block"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ArrowLeftIcon
              className={cn(
                isOpen ? "" : "-rotate-180",
                "transition duration-300 ease-in-out"
              )}
            />
          </button>
        </div>
        {/* // 글 줄바꿈 방지 */}
        <nav aria-label="sidebar nav" className="truncate">
          <h2 className="sr-only">Sidebar Nav</h2>
          {/* Pinned 그룹 */}
          <SidebarNavCollapsible
            open={pinnedIsOpen}
            onOpenChange={setPinnedIsOpen}
            title="Pinned"
            categories={pinnedList}
            categoryIconMap={pinnedIconMap}
            isOpen={isOpen}
          />
          {/* Tags 그룹 */}
          <SidebarNavCollapsible
            className="mt-4"
            open={tagsIsOpen}
            onOpenChange={setTagsIsOpen}
            title="Tags"
            categories={tagsList}
            categoryIconMap={tagIconMap}
            isOpen={isOpen}
          />
        </nav>
      </div>
    </aside>
  );
}
