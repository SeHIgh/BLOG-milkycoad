'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TAG_COLOR } from '@/lib/tags';
import { CONTENTS_PATH } from '@/lib/contents';
import { BlogPost } from '@/lib/notion';

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact';
}

export default function BlogPostCard({ post, variant = 'default' }: BlogPostCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const isCompact = variant === 'compact';
  const imageHeight = isCompact ? 'h-32' : 'h-40';
  const titleSize = isCompact ? 'text-sm' : 'text-base';
  const descriptionSize = isCompact ? 'text-xs' : 'text-sm';
  const metaSize = isCompact ? 'text-xs' : 'text-xs';
  const tagSize = isCompact ? 'text-xs' : 'text-xs';
  const tagPadding = isCompact ? 'px-1.5 py-0.5' : 'px-2.5 py-1';

  return (
    <Link href={`/posts/${encodeURIComponent(post.slug)}`} className='block group'>
      <Card className='h-full bg-card/30 py-0 gap-3 backdrop-blur-sm border-2 border-border shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] overflow-hidden group-hover:bg-card/50 hover:border-primary/50'>
        {/* 커버 이미지 */}
        <div className={cn('relative w-full overflow-hidden', imageHeight)}>
          {imageLoading && (
            <div className='absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 animate-pulse' />
          )}
          <Image
            src={
              imageError
                ? CONTENTS_PATH.post.banner.main
                : post.coverImage || CONTENTS_PATH.post.banner.main
            }
            alt={post.title}
            width={400}
            height={200}
            className={cn(
              'w-full h-full object-cover object-top transition-all duration-500',
              imageLoading ? 'opacity-0' : 'opacity-100',
              'group-hover:scale-110',
            )}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            priority={false}
          />
          {/* 오버레이 */}
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />

          {/* 읽기 시간 표시 */}
          <div className='absolute top-3 right-3 bg-primary/80 backdrop-blur-sm text-primary-foreground text-xs px-2 py-1 rounded flex items-center gap-1 border border-primary/30'>
            <Clock className='w-3 h-3' />
            <span className='font-semibold'>5분</span>
          </div>
        </div>

        <CardHeader className='p-3 pb-1'>
          {/* 제목 */}
          <CardTitle
            className={cn(
              'line-clamp-2 font-bold group-hover:text-primary transition-colors duration-200 leading-tight',
              titleSize,
            )}
          >
            #{post.title}
          </CardTitle>

          {/* 요약, 설명 */}
          {post.summary && (
            <CardDescription
              className={cn(
                'line-clamp-1 leading-relaxed mt-1 text-muted-foreground',
                descriptionSize,
              )}
            >
              {post.summary}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className='p-3 pt-0'>
          <div className='space-y-2'>
            {/* 메타 정보 */}
            <div className='flex items-center justify-between'>
              <div
                className={cn('flex items-center gap-2 bg-muted/50 px-2 py-1 rounded', metaSize)}
              >
                <Calendar className='w-3 h-3 text-primary' />
                <time dateTime={post.lastEditedAt} className='text-muted-foreground font-medium'>
                  {format(new Date(post.lastEditedAt), 'yy년 M월 d일', {
                    locale: ko,
                  })}
                </time>
              </div>
            </div>

            {/* 태그 */}
            {(post.mainTags.length > 0 || post.subTags.length > 0) && (
              <div className='flex items-start justify-between gap-2'>
                {/* 메인 태그 - 왼쪽 */}
                {post.mainTags.length > 0 && (
                  <div className='flex flex-wrap gap-1.5 flex-1 min-w-0'>
                    {post.mainTags.slice(0, isCompact ? 2 : 3).map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          'font-semibold rounded border-2 transition-all duration-200 hover:scale-105 shadow-sm flex-shrink-0',
                          tagSize,
                          tagPadding,
                        )}
                        style={{
                          backgroundColor: TAG_COLOR.main_tags[tag] ?? TAG_COLOR.main_tags.default,
                          color: '#ffffff',
                          borderColor: TAG_COLOR.main_tags[tag] ?? TAG_COLOR.main_tags.default,
                        }}
                      >
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                    {post.mainTags.length > (isCompact ? 2 : 3) && (
                      <span
                        className={cn(
                          'font-medium text-muted-foreground bg-muted/30 rounded border border-border flex-shrink-0 hover:bg-muted/50 transition-colors',
                          tagSize,
                          tagPadding,
                        )}
                      >
                        +{post.mainTags.length - (isCompact ? 2 : 3)}
                      </span>
                    )}
                  </div>
                )}

                {/* 서브 태그 - 오른쪽 */}
                {post.subTags.length > 0 && (
                  <div className='flex flex-wrap gap-1.5 justify-end flex-shrink-0'>
                    {post.subTags.slice(0, isCompact ? 1 : 2).map((tag) => (
                      <span
                        key={tag}
                        className={cn(
                          'font-semibold rounded border-2 transition-all duration-200 hover:scale-105 shadow-sm',
                          tagSize,
                          tagPadding,
                        )}
                        style={{
                          backgroundColor: TAG_COLOR.sub_tags[tag] ?? TAG_COLOR.sub_tags.default,
                          color: '#1f2937',
                          borderColor: TAG_COLOR.sub_tags[tag] ?? TAG_COLOR.sub_tags.default,
                        }}
                      >
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                    {post.subTags.length > (isCompact ? 1 : 2) && (
                      <span
                        className={cn(
                          'font-medium text-muted-foreground bg-muted/30 rounded border border-border hover:bg-muted/50 transition-colors',
                          tagSize,
                          tagPadding,
                        )}
                      >
                        +{post.subTags.length - (isCompact ? 1 : 2)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
