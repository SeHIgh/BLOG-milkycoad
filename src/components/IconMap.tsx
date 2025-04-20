import {
    Home,
    Folder,
    BookMarked,
    Code,
    User,
    FolderGit2,
    Hash,
    GalleryVerticalEnd,
    Circle,
} from "lucide-react";

// 카테고리명 → 아이콘 컴포넌트 매핑
export const pinnedIconMap: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    home: Home,
    posts: BookMarked,
    "dev.log": Code,
    tags: Hash,
    about: User,
    projects: FolderGit2,
    default: Folder,
};

// 카테고리명 → 아이콘 컴포넌트 매핑
export const tagIconMap: Record<
    string,
    React.ComponentType<{ className?: string }>
> = {
    all: GalleryVerticalEnd,
    cs: (props) => <Circle fill="#8ecae6" {...props} />,   // 파랑
    language: (props) => <Circle fill="#ffb703" {...props} />, // 노랑
    algorithm: (props) => <Circle fill="#219ebc" {...props} />,    // 진파랑
    frontend: (props) => <Circle fill="#fb8500" {...props} />, // 주황
    backend: (props) => <Circle fill="#023047" {...props} />,  // 남색
    review: (props) => <Circle fill="#ff006e" {...props} />,   // 핑크
    default: (props) => <Circle fill="#adb5bd" {...props} />, // 회색
};
