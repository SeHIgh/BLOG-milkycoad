# Notion API 블로그 구현 가이드

이 가이드는 Next.js와 Notion API를 사용하여 안전하고 현대적인 블로그를 구축하는 방법을 설명합니다.

## 🔧 환경 설정

### 1. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Notion API 설정 (서버사이드 전용)
NOTION_TOKEN=your_notion_integration_token_here
NOTION_DATABASE_ID=your_notion_database_id_here
```

### 2. Notion 설정

#### 2.1 Notion Integration 생성

1. [Notion Developers](https://www.notion.so/my-integrations)에서 새 integration 생성
2. `NOTION_TOKEN`에 Integration Token 입력

#### 2.2 Notion 데이터베이스 설정

블로그 데이터베이스에 다음 속성들을 추가하세요:

| 속성명                       | 타입         | 설명           |
| ---------------------------- | ------------ | -------------- |
| `title` 또는 `Title`         | Title        | 블로그 글 제목 |
| `slug` 또는 `Slug`           | Rich Text    | URL 슬러그     |
| `summary` 또는 `Summary`     | Rich Text    | 글 요약 (선택) |
| `tags` 또는 `Tags`           | Multi-select | 태그 목록      |
| `published` 또는 `Published` | Checkbox     | 발행 여부      |
| `createdAt`                  | Created time | 생성 날짜      |

#### 2.3 권한 설정

1. 데이터베이스 → Share → 생성한 Integration 추가
2. `NOTION_DATABASE_ID`에 데이터베이스 ID 입력

## 🏗️ 구조 설명

### 1. 서버사이드 렌더링 (추천)

```typescript
// src/app/blog/page.tsx
import { getBlogPosts } from "@/lib/notion";

export default async function BlogPage() {
  const posts = await getBlogPosts(); // 서버에서 실행
  // ...
}
```

**장점:**

- SEO 최적화
- 초기 로딩 속도 빠름
- 환경변수에 안전하게 접근

### 2. API Routes

```typescript
// src/app/api/blog/route.ts
import { getBlogPosts } from "@/lib/notion";

export async function GET() {
  const posts = await getBlogPosts();
  return NextResponse.json({ data: posts });
}
```

**사용 사례:**

- 클라이언트에서 데이터 새로고침
- 실시간 업데이트 필요한 경우
- 외부 API 연동

### 3. 클라이언트 사이드 (React Query)

```typescript
// src/components/ClientBlogList.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api";

export default function ClientBlogList() {
  const { data: posts } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => clientApi.getBlogPosts(),
  });
  // ...
}
```

**장점:**

- 캐싱 및 백그라운드 업데이트
- 로딩 상태 관리
- 오류 처리

## 🔒 보안 고려사항

### 1. 환경변수 보안

```typescript
// ❌ 위험: 클라이언트에서 직접 접근
const token = process.env.NOTION_TOKEN; // undefined in client

// ✅ 안전: 서버사이드에서만 접근
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} 환경변수가 설정되지 않았습니다.`);
  }
  return value;
}

const NOTION_TOKEN = getRequiredEnv("NOTION_TOKEN");
```

### 2. 공개 환경변수

클라이언트에서 접근해야 하는 값은 `NEXT_PUBLIC_` 접두사 사용:

```env
NEXT_PUBLIC_APP_NAME=MilkyCoad Blog
```

```typescript
// 클라이언트에서 안전하게 접근 가능
const appName = process.env.NEXT_PUBLIC_APP_NAME;
```

## 📝 사용법

### 1. 블로그 목록 페이지

```typescript
// src/app/blog/page.tsx - 서버 컴포넌트
import { getBlogPosts } from "@/lib/notion";

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      {posts.map((post) => (
        <Link key={post.id} href={`/blog/${post.slug}`}>
          <h2>{post.title}</h2>
          <p>{post.summary}</p>
        </Link>
      ))}
    </div>
  );
}
```

### 2. 개별 포스트 페이지

```typescript
// src/app/blog/[slug]/page.tsx
import { getBlogPostBySlug } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";

export default async function BlogPostPage({ params }) {
  const post = await getBlogPostBySlug(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <NotionRenderer blocks={post.content} />
    </article>
  );
}
```

### 3. 클라이언트 컴포넌트 (선택적)

```typescript
// 상호작용이 필요한 경우
"use client";

import ClientBlogList from "@/components/ClientBlogList";

export default function InteractiveBlogPage() {
  return <ClientBlogList />;
}
```

## 🎨 스타일링

### Tailwind CSS Typography

```bash
npm install @tailwindcss/typography
```

```javascript
// tailwind.config.js
module.exports = {
  plugins: [require("@tailwindcss/typography")],
};
```

```typescript
// prose 클래스 사용
<div className="prose prose-lg max-w-none dark:prose-invert">
  <NotionRenderer blocks={content} />
</div>
```

## 🚀 배포 시 주의사항

### 1. 환경변수 설정

배포 환경(Vercel, Netlify 등)에서 환경변수를 설정하세요:

- `NOTION_TOKEN`
- `NOTION_DATABASE_ID`

### 2. 캐싱 전략

```typescript
// ISR (Incremental Static Regeneration) 설정
export const revalidate = 3600; // 1시간마다 재생성

// 또는 특정 조건에서 재검증
import { revalidatePath } from "next/cache";

export async function POST() {
  revalidatePath("/blog");
  return NextResponse.json({ revalidated: true });
}
```

## 📊 성능 최적화

### 1. 이미지 최적화

```typescript
import Image from "next/image";

// Notion 이미지 최적화
<Image
  src={post.coverImage}
  alt={post.title}
  width={800}
  height={400}
  className="rounded-lg"
/>;
```

### 2. 메타데이터 설정

```typescript
// SEO 최적화
export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug);

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [post.coverImage],
    },
  };
}
```

이제 안전하고 확장 가능한 Notion 기반 블로그를 운영할 수 있습니다!
