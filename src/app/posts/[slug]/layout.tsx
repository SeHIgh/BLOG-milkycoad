import { getBlogPostBySlug } from '@/lib/notion';
import { Metadata } from 'next';

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogPostLayoutProps): Promise<Metadata> {
  const { slug } = await params;

  // slug 디코딩
  let decodedSlug = slug;
  try {
    if (slug.includes('%')) {
      decodedSlug = decodeURIComponent(slug);
    }
  } catch {
    decodedSlug = slug;
  }

  const post = await getBlogPostBySlug(decodedSlug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없음 | MilkyCoad Blog',
      description: '요청하신 블로그 포스트를 찾을 수 없습니다.',
    };
  }

  return {
    title: `${post.title} | MilkyCoad Blog`,
    description: post.summary || `${post.title}에 대한 블로그 포스트입니다.`,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.createdAt,
      modifiedTime: post.lastEditedAt,
      authors: ['MilkyCoad'],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default function BlogPostLayout({ children }: BlogPostLayoutProps) {
  return children;
}
