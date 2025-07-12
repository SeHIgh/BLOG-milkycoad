import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import NotionRenderer from '@/components/posts/NotionRenderer';
import { getBlogPostBySlug } from '@/lib/notion';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // slug가 이미 인코딩되어 있다면 디코딩
  let decodedSlug = slug;
  try {
    if (slug.includes('%')) {
      decodedSlug = decodeURIComponent(slug);
    }
  } catch {
    // 디코딩 실패 시 원본 사용
    decodedSlug = slug;
  }

  console.log('포스트 페이지 - 원본 slug:', slug, '→ 디코딩:', decodedSlug);

  // 서버사이드에서 직접 notion 함수 호출 (API 경유하지 않음)
  const post = await getBlogPostBySlug(decodedSlug);

  if (!post) {
    notFound();
  }

  return (
    <article className='container mx-auto px-4 py-8 max-w-4xl'>
      {/* 뒤로가기 버튼 */}
      <div className='mb-6'>
        <Link
          href='/posts'
          className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          블로그로 돌아가기
        </Link>
      </div>

      {/* 커버 이미지 */}
      {post.coverImage && (
        <div className='aspect-video overflow-hidden rounded-xl mb-8'>
          <Image
            src={post.coverImage}
            alt={post.title}
            className='w-full h-full object-cover'
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw'
          />
        </div>
      )}

      {/* 메타 정보 */}
      <header className='mb-8'>
        <h1 className='text-4xl font-bold mb-4'>{post.title}</h1>

        {post.summary && <p className='text-xl text-muted-foreground mb-4'>{post.summary}</p>}

        <div className='flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6'>
          <div className='flex items-center gap-1'>
            <Calendar className='w-4 h-4' />
            <time dateTime={post.createdAt}>
              {format(new Date(post.createdAt), 'yyyy년 MM월 dd일', {
                locale: ko,
              })}
            </time>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className='flex items-center gap-2'>
              <Tag className='w-4 h-4' />
              <div className='flex gap-2 flex-wrap'>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-2 py-1 bg-secondary text-secondary-foreground rounded-full text-xs'
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <hr className='border-border' />
      </header>

      {/* 본문 내용 */}
      <div className='prose prose-lg max-w-none dark:prose-invert'>
        {post.content && <NotionRenderer blocks={post.content} />}
      </div>

      {/* 푸터 */}
      <footer className='mt-12 pt-8 border-t border-border'>
        <div className='flex justify-between items-center'>
          <p className='text-sm text-muted-foreground'>
            마지막 수정:{' '}
            {format(new Date(post.lastEditedAt), 'yyyy년 MM월 dd일', {
              locale: ko,
            })}
          </p>

          <Link href='/posts' className='text-sm text-blue-600 dark:text-blue-400 hover:underline'>
            더 많은 글 보기 →
          </Link>
        </div>
      </footer>
    </article>
  );
}

// 메타데이터 생성
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;

  // slug가 이미 인코딩되어 있다면 디코딩
  let decodedSlug = slug;
  try {
    if (slug.includes('%')) {
      decodedSlug = decodeURIComponent(slug);
    }
  } catch {
    // 디코딩 실패 시 원본 사용
    decodedSlug = slug;
  }

  console.log('메타데이터 - 원본 slug:', slug, '→ 디코딩:', decodedSlug);

  const post = await getBlogPostBySlug(decodedSlug);

  if (!post) {
    return {
      title: '포스트를 찾을 수 없음',
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
