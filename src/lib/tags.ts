type StringMap = { [key: string]: string };

// * 태그 색상
export const TAG_COLOR: {
  main_tags: StringMap;
  sub_tags: StringMap;
} = {
  // * 메인 태그
  main_tags: {
    cs: '#8ecae6', // 파랑
    language: '#ffb703', // 노랑
    algorithm: '#219ebc', // 진파랑
    frontend: '#fb8500', // 주황
    backend: '#023047', // 남색
    review: '#ff006e', // 핑크
    default: '#adb5bd', // 회색
  },
  // * 서브 태그
  sub_tags: {
    Nextjs: '#d6bcfa', // 연보라
    Notion: '#fde9d9', // 연한 살구
    Typescript: '#f3d1e0', // 연한 핑크
    Blog: '#e6ccb2', // 베이지
    React: '#cce3de', // 연녹색
    Bug: '#f8d7da', // 연분홍 (오류)
    TailwindCSS: '#e2e3e5', // 회색빛 흰색
    JavaScript: '#ffb347', // 연노랑
    Test: '#dbeafe', // 연한 하늘색
  },
};
