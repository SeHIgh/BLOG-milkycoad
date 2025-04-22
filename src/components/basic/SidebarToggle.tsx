"use client";
import { Menu } from "lucide-react";
import { useSidebarStore } from "@/stores/useSidebarStore";

export default function SidebarToggle() {
    const { toggleSidebar } = useSidebarStore();

    return (
        <button
            className="md:hidden block rounded-xl w-8 h-8 text-sm transition-colors flex items-center justify-center group"
            onClick={toggleSidebar}
            aria-label="Open Sidebar"
        >
            <Menu className="h-[1.2rem] w-[1.2rem] group-hover:stroke-muted-foreground group-hover:scale-110" />
            <span className="sr-only">Toggle Sidebar</span>
        </button>
    );
}
