'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import NotionRenderer from '@/components/NotionRenderer';
import { clientApi, apiKeys } from '@/lib/api';
import { TAG_COLOR } from '@/lib/tags';
import CoverImage from '@/components/blog/CoverImage';
import BlogPostSkeleton from '@/components/blog/BlogPostSkeleton';
import ErrorState from '@/components/blog/ErrorState';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  // slug 디코딩
  let decodedSlug = slug;
  try {
    if (slug.includes('%')) {
      decodedSlug = decodeURIComponent(slug);
    }
  } catch {
    decodedSlug = slug;
  }

  // useQuery로 포스트 데이터 가져오기
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: apiKeys.blogPost(decodedSlug),
    queryFn: () => clientApi.getBlogPost(decodedSlug),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });

  // 로딩 상태
  if (isLoading) {
    return <BlogPostSkeleton />;
  }

  // 에러 상태
  if (error) {
    return (
      <ErrorState
        title="포스트를 불러올 수 없습니다"
        message="알 수 없는 오류가 발생했습니다."
        errorMessage={error instanceof Error ? error.message : undefined}
        iconColor="red"
      />
    );
  }

  // 포스트가 없는 경우
  if (!post) {
    return (
      <ErrorState
        title="포스트를 찾을 수 없습니다"
        message="요청하신 블로그 포스트가 존재하지 않습니다."
        iconColor="yellow"
      />
    );
  }

  return (
    <article className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          블로그로 돌아가기
        </Link>
      </div>

      {/* 커버 이미지 */}
      {post.coverImage && <CoverImage src={post.coverImage} alt={post.title} />}

      {/* 메타 정보 */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        {post.summary && <p className="text-xl text-muted-foreground mb-4">{post.summary}</p>}

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <div className="flex items-center gap-1 text-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <time dateTime={post.createdAt} className="text-foreground">
              {format(new Date(post.createdAt), 'yyyy년 MM월 dd일', {
                locale: ko,
              })}
            </time>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" />
              <div className="flex gap-2 flex-wrap">
                {post.tags.map((tag) => {
                  // 메인 태그와 서브 태그 구분
                  const isMainTag = post.mainTags?.includes(tag);
                  const isSubTag = post.subTags?.includes(tag);

                  let tagClass =
                    'px-2 py-1 text-xs font-bold tracking-wider uppercase border shadow-sm transform transition-all duration-200 hover:scale-105 hover:shadow-md';
                  let tagStyle: React.CSSProperties = {};

                  if (isMainTag) {
                    // 메인 태그: TAG_COLOR.main_tags에서 색상 가져오기
                    const mainTagColor =
                      TAG_COLOR.main_tags[tag.toLowerCase()] || TAG_COLOR.main_tags.default;
                    tagStyle = {
                      backgroundColor: mainTagColor,
                      color: '#ffffff',
                      borderColor: mainTagColor,
                      textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 4px rgba(0,0,0,0.1)',
                    };
                  } else if (isSubTag) {
                    // 서브 태그: TAG_COLOR.sub_tags에서 색상 가져오기
                    const subTagColor = TAG_COLOR.sub_tags[tag] || '#e5e7eb';
                    tagStyle = {
                      backgroundColor: subTagColor,
                      color: '#1f2937',
                      borderColor: subTagColor,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)',
                    };
                  } else {
                    // 일반 태그: 기본 스타일
                    tagClass += ' bg-secondary text-secondary-foreground border-secondary';
                    tagStyle = {
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3), 0 2px 4px rgba(0,0,0,0.1)',
                    };
                  }

                  return (
                    <span key={tag} className={tagClass} style={tagStyle}>
                      {tag.toUpperCase()}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <hr className="border-border" />
      </header>

      {/* 본문 내용 */}
      <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-pre:text-foreground prose-blockquote:text-foreground prose-li:text-foreground">
        {post.content && <NotionRenderer blocks={post.content} />}
      </div>

      {/* 푸터 */}
      <footer className="mt-12 pt-8 border-t border-border">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            마지막 수정:{' '}
            {format(new Date(post.lastEditedAt), 'yyyy년 MM월 dd일', {
              locale: ko,
            })}
          </p>

          <Link
            href="/posts"
            className="text-sm text-primary hover:text-primary/80 hover:underline transition-colors"
          >
            더 많은 글 보기 →
          </Link>
        </div>
      </footer>
    </article>
  );
}
