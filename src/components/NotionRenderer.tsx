/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

// 자식 블록을 포함하는 블록 타입 정의
type BlockWithChildren = BlockObjectResponse & {
  children?: (BlockObjectResponse | PartialBlockObjectResponse)[];
};
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

interface NotionRendererProps {
  blocks: (BlockObjectResponse | PartialBlockObjectResponse)[];
}

// 코드 블록 컴포넌트
function CodeBlock({ block }: { block: BlockObjectResponse | PartialBlockObjectResponse }) {
  const { resolvedTheme } = useTheme();

  if (!('type' in block) || block.type !== 'code') {
    return null;
  }

  const codeText = block.code.rich_text
    .map((text: { plain_text: string }) => text.plain_text)
    .join('');
  const language = block.code.language || 'text';

  // 앱의 실제 테마 설정만 사용
  const isDark = resolvedTheme === 'dark';

  return (
    <div className='mb-4 border border-border rounded-lg overflow-hidden'>
      {language && !['text', 'plaintext'].includes(language) && (
        <div className='bg-primary text-primary-foreground px-4 py-2 text-sm font-mono border-b border-border'>
          {language}
        </div>
      )}
      <SyntaxHighlighter
        language={language}
        style={isDark ? oneDark : oneLight}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
        showLineNumbers={!['text', 'plaintext'].includes(language)}
        wrapLines={true}
      >
        {codeText}
      </SyntaxHighlighter>
    </div>
  );
}

export default function NotionRenderer({ blocks }: NotionRendererProps) {
  return <div className='prose prose-lg max-w-none dark:prose-invert'>{renderBlocks(blocks)}</div>;
}

// 목차 컴포넌트
function TableOfContents({
  blocks,
}: {
  blocks: (BlockObjectResponse | PartialBlockObjectResponse)[];
}) {
  // 모든 블록에서 헤딩을 찾는 함수 (재귀적)
  const findAllHeadings = (
    blocks: (BlockObjectResponse | PartialBlockObjectResponse)[],
  ): (BlockObjectResponse | PartialBlockObjectResponse)[] => {
    const headings: (BlockObjectResponse | PartialBlockObjectResponse)[] = [];

    blocks.forEach((block) => {
      if ('type' in block && ['heading_1', 'heading_2', 'heading_3'].includes(block.type)) {
        headings.push(block);
      }

      // 자식 블록들도 검색
      const blockWithChildren = block as BlockWithChildren;
      if (blockWithChildren.children && Array.isArray(blockWithChildren.children)) {
        headings.push(...findAllHeadings(blockWithChildren.children));
      }
    });

    return headings;
  };

  const headings = findAllHeadings(blocks);

  if (headings.length === 0) {
    return (
      <div className='bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
        <div className='text-blue-800 dark:text-blue-200 font-medium mb-2'>목차</div>
        <div className='text-blue-600 dark:text-blue-300 text-sm'>
          목차를 생성할 수 있는 헤딩이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-lg p-4 mb-6'>
      <div className='text-primary font-bold mb-3 text-lg border-b border-border/30 pb-2'>
        📋 목차
      </div>
      <nav className='space-y-1'>
        {headings.map((heading) => {
          if (!('type' in heading)) return null;

          const headingBlock = heading as any;
          const headingText =
            headingBlock[heading.type]?.rich_text?.map((text: any) => text.plain_text).join('') ||
            '';

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`block text-foreground text-sm hover:text-primary py-2 px-3 rounded-md hover:bg-card/50 transition-all duration-200 ${
                heading.type === 'heading_1'
                  ? 'font-bold border-l-4 border-primary'
                  : heading.type === 'heading_2'
                  ? 'ml-4 border-l-2 border-secondary'
                  : 'ml-8 border-l border-muted'
              }`}
            >
              {headingText}
            </a>
          );
        })}
      </nav>
    </div>
  );
}

function renderBlocks(blocks: (BlockObjectResponse | PartialBlockObjectResponse)[]) {
  const elements: React.ReactElement[] = [];
  let currentList: React.ReactElement[] = [];
  let currentListType: 'bulleted' | 'numbered' | null = null;

  blocks.forEach((block) => {
    if (!('type' in block)) {
      return;
    }

    const { type } = block;

    // 리스트 아이템 처리
    if (type === 'bulleted_list_item' || type === 'numbered_list_item') {
      const listType = type === 'bulleted_list_item' ? 'bulleted' : 'numbered';

      if (currentListType !== listType) {
        // 이전 리스트가 있으면 완성
        if (currentList.length > 0) {
          const ListTag = currentListType === 'bulleted' ? 'ul' : 'ol';
          elements.push(
            <ListTag key={`list-${elements.length}`} className='mb-4 space-y-1'>
              {currentList}
            </ListTag>,
          );
        }
        currentList = [];
        currentListType = listType;
      }

      currentList.push(<RenderBlock key={block.id} block={block} allBlocks={blocks} />);
    } else {
      // 리스트가 아닌 블록이 나오면 이전 리스트 완성
      if (currentList.length > 0) {
        const ListTag = currentListType === 'bulleted' ? 'ul' : 'ol';
        elements.push(
          <ListTag key={`list-${elements.length}`} className='mb-4 space-y-1'>
            {currentList}
          </ListTag>,
        );
        currentList = [];
        currentListType = null;
      }

      elements.push(<RenderBlock key={block.id} block={block} allBlocks={blocks} />);
    }
  });

  // 마지막 리스트 처리
  if (currentList.length > 0) {
    const ListTag = currentListType === 'bulleted' ? 'ul' : 'ol';
    elements.push(
      <ListTag key={`list-${elements.length}`} className='mb-4 space-y-1'>
        {currentList}
      </ListTag>,
    );
  }

  return elements;
}

function RenderBlock({
  block,
  allBlocks,
}: {
  block: BlockObjectResponse | PartialBlockObjectResponse;
  allBlocks: (BlockObjectResponse | PartialBlockObjectResponse)[];
}) {
  if (!('type' in block)) {
    return null;
  }

  const { type, id } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p className='mb-4'>
          <RichText text={block.paragraph.rich_text} />
        </p>
      );

    case 'heading_1':
      return (
        <h1
          id={id}
          className='text-3xl font-bold mt-8 mb-6 scroll-mt-20 p-3 border-l-4 border-primary bg-primary/5 rounded-r-lg'
        >
          <RichText text={block.heading_1.rich_text} />
        </h1>
      );

    case 'heading_2':
      return (
        <h2
          id={id}
          className='text-2xl font-semibold mt-8 mb-4 scroll-mt-20 p-2 border-l-3 border-secondary bg-secondary/5 rounded-r-md'
        >
          <RichText text={block.heading_2.rich_text} />
        </h2>
      );

    case 'heading_3':
      return (
        <h3
          id={id}
          className='text-xl font-semibold mt-6 mb-3 scroll-mt-20 p-2 border-l-2 border-muted bg-muted/5 rounded-r-sm'
        >
          <RichText text={block.heading_3.rich_text} />
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li className='mb-2 flex items-start gap-2'>
          <span className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0'></span>
          <div className='flex-1'>
            <RichText text={block.bulleted_list_item.rich_text} />
          </div>
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className='mb-2 flex items-start gap-3'>
          <span className='w-5 h-5 bg-secondary text-secondary-foreground rounded flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 numbered-list-counter'>
            {/* 번호는 CSS counter로 자동 생성됨 */}
          </span>
          <div className='flex-1'>
            <RichText text={block.numbered_list_item.rich_text} />
          </div>
        </li>
      );

    case 'to_do':
      return (
        <div className='flex items-start gap-2 mb-2'>
          <input
            type='checkbox'
            checked={block.to_do.checked}
            readOnly
            className='mt-1 w-4 h-4 text-primary border-border rounded focus:ring-primary'
          />
          <span className={block.to_do.checked ? 'line-through opacity-70' : ''}>
            <RichText text={block.to_do.rich_text} />
          </span>
        </div>
      );

    case 'toggle':
      return (
        <details className='mb-4 border border-border rounded-lg bg-card/20'>
          <summary className='cursor-pointer font-medium p-3 hover:bg-card/30 transition-colors duration-200'>
            <RichText text={block.toggle.rich_text} />
          </summary>
          <div className='ml-4 mt-2 p-3 border-t border-border/30'>
            {/* 자식 블록들 렌더링 */}
            {(block as BlockWithChildren).children &&
              renderBlocks((block as BlockWithChildren).children!)}
          </div>
        </details>
      );

    case 'code':
      return <CodeBlock block={block} />;

    case 'quote':
      return (
        <blockquote className='border-l-4 border-primary pl-4 italic mb-4 bg-primary/10 p-4 rounded-r-lg'>
          <RichText text={block.quote.rich_text} />
          {/* 자식 블록들 렌더링 */}
          {(block as BlockWithChildren).children && (
            <div className='mt-2'>{renderBlocks((block as BlockWithChildren).children!)}</div>
          )}
        </blockquote>
      );

    case 'callout':
      let icon = '💡';
      if (block.callout.icon?.type === 'emoji') {
        icon = block.callout.icon.emoji;
      } else if (block.callout.icon?.type === 'external') {
        // 외부 아이콘 URL에서 적절한 이모지로 매핑
        const iconUrl = block.callout.icon.external.url;
        if (iconUrl.includes('hashtag')) {
          icon = '🔗';
        } else if (iconUrl.includes('info')) {
          icon = 'ℹ️';
        } else if (iconUrl.includes('warning')) {
          icon = '⚠️';
        } else if (iconUrl.includes('check')) {
          icon = '✅';
        } else {
          icon = '💡';
        }
      }

      const colorMap = {
        blue_background: 'bg-blue-50 dark:bg-blue-950 border-blue-400',
        gray_background: 'bg-gray-50 dark:bg-gray-950 border-gray-400',
        brown_background: 'bg-amber-50 dark:bg-amber-950 border-amber-400',
        orange_background: 'bg-orange-50 dark:bg-orange-950 border-orange-400',
        yellow_background: 'bg-yellow-50 dark:bg-yellow-950 border-yellow-400',
        green_background: 'bg-green-50 dark:bg-green-950 border-green-400',
        pink_background: 'bg-pink-50 dark:bg-pink-950 border-pink-400',
        purple_background: 'bg-purple-50 dark:bg-purple-950 border-purple-400',
        red_background: 'bg-red-50 dark:bg-red-950 border-red-400',
      };

      const bgColor =
        colorMap[block.callout.color as keyof typeof colorMap] ||
        'bg-yellow-50 dark:bg-yellow-950 border-yellow-400';

      return (
        <div className={`flex gap-3 p-4 ${bgColor} mb-4 border-l-4 border-border`}>
          <span className='text-xl flex-shrink-0'>{icon}</span>
          <div className='flex-1'>
            <RichText text={block.callout.rich_text} />
            {/* 자식 블록들 렌더링 */}
            {(block as BlockWithChildren).children && (
              <div className='mt-2'>{renderBlocks((block as BlockWithChildren).children!)}</div>
            )}
          </div>
        </div>
      );

    case 'divider':
      return <hr className='my-8 border border-border' />;

    case 'table_of_contents':
      return <TableOfContents blocks={allBlocks} />;

    case 'table':
      return <TableBlock block={block} />;

    case 'image':
      const imageUrl =
        block.image.type === 'external' ? block.image.external.url : block.image.file.url;
      const caption =
        block.image.caption?.length > 0
          ? block.image.caption.map((text) => text.plain_text).join('')
          : '';

      return (
        <figure className='mb-6 border border-border rounded-lg overflow-hidden'>
          <div className='relative w-full aspect-video'>
            <Image
              src={imageUrl}
              alt={caption || '이미지'}
              className='object-cover'
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              unoptimized
            />
          </div>
          {caption && (
            <figcaption className='text-center text-sm text-muted-foreground mt-2 p-2 bg-card/50 border-t border-border'>
              {caption}
            </figcaption>
          )}
        </figure>
      );

    case 'video':
      const videoUrl =
        block.video.type === 'external' ? block.video.external.url : block.video.file.url;
      const videoCaption =
        block.video.caption?.length > 0
          ? block.video.caption.map((text) => text.plain_text).join('')
          : '';

      return (
        <figure className='mb-6 border border-border rounded-lg overflow-hidden'>
          <div className='relative w-full aspect-video'>
            <video
              src={videoUrl}
              controls
              className='w-full h-full object-cover'
              preload='metadata'
            >
              <source src={videoUrl} type='video/mp4' />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
          </div>
          {videoCaption && (
            <figcaption className='text-center text-sm text-muted-foreground mt-2 p-2 bg-card/50 border-t border-border'>
              {videoCaption}
            </figcaption>
          )}
        </figure>
      );

    case 'file':
      const fileUrl =
        block.file.type === 'external' ? block.file.external.url : block.file.file.url;
      const fileName =
        block.file.caption?.length > 0
          ? block.file.caption.map((text) => text.plain_text).join('')
          : '파일';

      return (
        <div className='mb-4 p-4 border border-border rounded-lg bg-card/30 hover:bg-card/50 transition-colors duration-200'>
          <a
            href={fileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-3 text-primary hover:text-primary/80 transition-colors'
          >
            <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>
            <div className='flex-1'>
              <div className='font-medium'>{fileName}</div>
              <div className='text-sm text-muted-foreground'>파일 다운로드</div>
            </div>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14'
              />
            </svg>
          </a>
        </div>
      );

    case 'pdf':
      const pdfUrl = block.pdf.type === 'external' ? block.pdf.external.url : block.pdf.file.url;
      const pdfCaption =
        block.pdf.caption?.length > 0
          ? block.pdf.caption.map((text) => text.plain_text).join('')
          : 'PDF 문서';

      return (
        <div className='mb-6 border border-border rounded-lg overflow-hidden'>
          <div className='relative w-full aspect-[4/3]'>
            <iframe src={pdfUrl} className='w-full h-full' title={pdfCaption} />
          </div>
          {pdfCaption && (
            <div className='text-center text-sm text-muted-foreground mt-2 p-2 bg-card/50 border-t border-border'>
              {pdfCaption}
            </div>
          )}
        </div>
      );

    case 'bookmark':
      return (
        <a
          href={block.bookmark.url}
          target='_blank'
          rel='noopener noreferrer'
          className='block border border-border rounded-lg p-4 hover:bg-card/50 transition-colors duration-200 mb-4'
        >
          <div className='font-medium text-primary'>{block.bookmark.url}</div>
          {block.bookmark.caption?.length > 0 && (
            <div className='text-sm text-muted-foreground mt-1'>
              <RichText text={block.bookmark.caption} />
            </div>
          )}
        </a>
      );

    default:
      return (
        <div className='mb-4 p-3 border border-border/30 rounded-lg bg-muted/30 text-sm'>
          지원하지 않는 블록 타입: {type}
        </div>
      );
  }
}

// 테이블 블록 컴포넌트
function TableBlock({ block }: { block: BlockObjectResponse | PartialBlockObjectResponse }) {
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTableData() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blocks/${block.id}`);
        if (!response.ok) {
          throw new Error('테이블 데이터를 가져올 수 없습니다.');
        }
        const data = await response.json();
        setTableRows(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    }

    if ('type' in block && block.type === 'table') {
      // 테이블에 자식 블록이 있는지 확인
      if ((block as any).children && Array.isArray((block as any).children)) {
        setTableRows((block as any).children);
        setIsLoading(false);
      } else {
        loadTableData();
      }
    }
  }, [block.id]);

  if (isLoading) {
    return (
      <div className='overflow-x-auto mb-6'>
        <table className='min-w-full border border-gray-300 dark:border-gray-600 rounded-lg'>
          <tbody>
            <tr className='border-b border-gray-300 dark:border-gray-600'>
              <td className='px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center'>
                테이블 내용을 불러오는 중...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className='overflow-x-auto mb-6'>
        <table className='min-w-full border border-gray-300 dark:border-gray-600 rounded-lg'>
          <tbody>
            <tr className='border-b border-gray-300 dark:border-gray-600'>
              <td className='px-4 py-3 text-sm text-red-500 dark:text-red-400 text-center'>
                {error}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  // 빈 테이블 처리
  if (tableRows.length === 0) {
    return (
      <div className='overflow-x-auto mb-6'>
        <table className='min-w-full border border-gray-300 dark:border-gray-600 rounded-lg'>
          <tbody>
            <tr className='border-b border-gray-300 dark:border-gray-600'>
              <td className='px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center'>
                빈 테이블입니다.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto mb-6 border border-border rounded-lg'>
      <table className='min-w-full'>
        {tableRows.length > 0 && (
          <>
            <thead>
              <tr className='bg-primary/10 border-b-2 border-border'>
                {tableRows[0]?.table_row?.cells?.map((cell: any[], cellIndex: number) => (
                  <th
                    key={cellIndex}
                    className='px-4 py-3 text-sm font-bold text-left border-r border-border last:border-r-0'
                  >
                    {cell.map((text: any, textIndex: number) => (
                      <span key={textIndex}>{text.plain_text}</span>
                    ))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className='border-b border-border/50 last:border-b-0 hover:bg-card/30 transition-colors duration-200'
                >
                  {row.table_row?.cells?.map((cell: any[], cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className='px-4 py-3 text-sm border-r border-border/30 last:border-r-0'
                    >
                      {cell.map((text: any, textIndex: number) => (
                        <span key={textIndex}>{text.plain_text}</span>
                      ))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
    </div>
  );
}

function RichText({
  text,
}: {
  text: Array<{
    type: string;
    plain_text: string;
    annotations: {
      bold: boolean;
      code: boolean;
      color: string;
      italic: boolean;
      strikethrough: boolean;
      underline: boolean;
    };
    href?: string | null;
  }>;
}) {
  const colorMap = {
    default: '',
    gray: 'text-gray-600 dark:text-gray-400',
    brown: 'text-amber-700 dark:text-amber-300',
    orange: 'text-orange-600 dark:text-orange-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    pink: 'text-pink-600 dark:text-pink-400',
    red: 'text-red-600 dark:text-red-400',
    gray_background: 'bg-gray-100 dark:bg-gray-800',
    brown_background: 'bg-amber-100 dark:bg-amber-900',
    orange_background: 'bg-orange-100 dark:bg-orange-900',
    yellow_background: 'bg-yellow-100 dark:bg-yellow-900',
    green_background: 'bg-green-100 dark:bg-green-900',
    blue_background: 'bg-blue-100 dark:bg-blue-900',
    purple_background: 'bg-purple-100 dark:bg-purple-900',
    pink_background: 'bg-pink-100 dark:bg-pink-900',
    red_background: 'bg-red-100 dark:bg-red-900',
  };

  return (
    <>
      {text.map((value, index) => {
        const {
          annotations: { bold, code, color, italic, strikethrough, underline },
          plain_text,
          href,
        } = value;

        const colorClass = colorMap[color as keyof typeof colorMap] || '';

        let element = (
          <span
            key={index}
            className={[
              bold && 'font-bold',
              italic && 'italic',
              strikethrough && 'line-through',
              underline && 'underline',
              code && 'bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm font-mono',
              colorClass,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {plain_text}
          </span>
        );

        if (href) {
          element = (
            <a
              key={index}
              href={href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 dark:text-blue-400 hover:underline'
            >
              {element}
            </a>
          );
        }

        return element;
      })}
    </>
  );
}
