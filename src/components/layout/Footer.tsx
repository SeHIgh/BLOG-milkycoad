import { cn } from "@/lib/utils";
import CurrentRoute from "./CurrentRoute";

export default function Footer() {
    return (
        <footer
            className={cn(
                "p-2 bg-background",
                // "border-4 border-border",
                "inset-ring-4 inset-ring-border",
                "flex flex-row justify-between"
            )}
        >
            <CurrentRoute />
            {/* 년도 자동 추적 및 할당 */}
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}. <a href="https://github.com/SeHIgh" className="hover:underline">SeHi</a>. All rights reserved.</p>
        </footer>
    );
}
