import { Home, Folder, Book, Code, User } from "lucide-react";

// 카테고리명 → 아이콘 컴포넌트 매핑
export const categoryIconMap: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    home: Home,
    docs: Book,
    dev: Code,
    profile: User,
    default: Folder,
};
