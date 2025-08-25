import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
  getProperty,
  generateSlugFromTitle,
  getFileUrl,
  getPlainText,
  getMultiSelect,
  getCheckbox,
  getDate,
} from './notion-utils';

// ! 환경변수 검증 및 설정
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    // 개발 환경에서는 기본값 제공, 프로덕션에서는 오류 발생
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `⚠️ ${key} 환경변수가 설정되지 않았습니다. 개발 모드에서는 기본값을 사용합니다.`,
      );
      return '';
    }
    throw new Error(`${key} 환경변수가 설정되지 않았습니다.`);
  }
  return value;
}

// * 토큰 가져오기 (개발 환경에서는 기본값 허용)
const NOTION_TOKEN =
  process.env.NODE_ENV === 'development'
    ? process.env.NOTION_TOKEN || ''
    : getRequiredEnv('NOTION_TOKEN');
const NOTION_DATABASE_ID =
  process.env.NODE_ENV === 'development'
    ? process.env.NOTION_DATABASE_ID || ''
    : getRequiredEnv('NOTION_DATABASE_ID');

// * Notion 클라이언트 설정 (서버사이드 전용)
export const notion = NOTION_TOKEN
  ? new Client({
      auth: NOTION_TOKEN,
    })
  : null;

// * 포스트 타입 정의
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  mainTags: string[];
  subTags: string[];
  tags: string[]; // mainTags + subTags 합친 것
  createdAt: string;
  lastEditedAt: string;
  isPublished: boolean;
  isFeatured: boolean;
  coverImage?: string;
  content?: (BlockObjectResponse | PartialBlockObjectResponse)[];
}

// * 데이터베이스에서 모든 게시글 가져오기
export async function getBlogPosts(
  publishedOnly: boolean = true,
): Promise<BlogPost[]> {
  try {
    // 환경변수가 설정되지 않은 경우 빈 배열 반환
    if (!notion || !NOTION_DATABASE_ID) {
      console.warn(
        '⚠️ Notion 설정이 완료되지 않았습니다. 빈 배열을 반환합니다.',
      );
      return [];
    }

    // * 필터 없이 모든 데이터 가져오기 (정렬 제거하여 속성 오류 방지)
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
    });

    // * 포스트 목록
    const blogPosts = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(mapNotionPageToBlogPost)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ); // 클라이언트에서 정렬

    //* 발행된 포스트만 필터링
    const filteredPosts = publishedOnly
      ? blogPosts.filter((post) => post.isPublished)
      : blogPosts;

    return filteredPosts;
  } catch (error) {
    console.error('❌ 블로그 포스트를 가져오는 중 오류 발생:', error);
    throw error;
  }
}

// * 특정 게시글 가져오기
export async function getBlogPost(pageId: string): Promise<BlogPost | null> {
  try {
    // 환경변수가 설정되지 않은 경우 null 반환
    if (!notion) {
      console.warn('⚠️ Notion 설정이 완료되지 않았습니다. null을 반환합니다.');
      return null;
    }

    // * 페이지 가져오기
    const page = await notion.pages.retrieve({ page_id: pageId });

    // * 페이지 속성 확인
    if (!('properties' in page)) {
      return null;
    }

    // * 블록 가져오기 (재귀적으로 자식 블록들 포함)
    const blocks = await getBlocksWithChildren(pageId);

    // * 포스트 매핑
    const blogPost = mapNotionPageToBlogPost(page);
    blogPost.content = blocks;

    return blogPost;
  } catch (error) {
    console.error('블로그 포스트를 가져오는 중 오류 발생:', error);
    return null;
  }
}

// * slug로 게시글 가져오기
export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  try {
    // 환경변수가 설정되지 않은 경우 null 반환
    if (!notion || !NOTION_DATABASE_ID) {
      console.warn('⚠️ Notion 설정이 완료되지 않았습니다. null을 반환합니다.');
      return null;
    }

    // * 모든 포스트 가져오기
    const allPosts = await getBlogPosts(false);

    // * slug로 포스트 찾기
    const matchedPost = allPosts.find((post) => post.slug === slug);

    // * 포스트 찾음
    if (!matchedPost) {
      return null;
    }

    // * 블록 가져오기 (재귀적으로 자식 블록들 포함)
    const blocks = await getBlocksWithChildren(matchedPost.id);

    // * 포스트 컨텐츠 설정
    matchedPost.content = blocks;

    return matchedPost;
  } catch (error) {
    console.error('❌ 블로그 포스트 조회 중 오류 발생:', error);
    return null;
  }
}

// * 블록의 자식 블록들을 재귀적으로 가져오기 (필요한 경우에만)
export async function getBlocksWithChildren(
  blockId: string,
): Promise<(BlockObjectResponse | PartialBlockObjectResponse)[]> {
  try {
    if (!notion) {
      console.warn(
        '⚠️ Notion 설정이 완료되지 않았습니다. 빈 배열을 반환합니다.',
      );
      return [];
    }

    const response = await notion.blocks.children.list({
      block_id: blockId,
    });

    // 각 블록의 자식 블록들도 재귀적으로 가져오기
    const blocksWithChildren = await Promise.all(
      response.results.map(async (block) => {
        if ('type' in block) {
          // 자식 블록을 가질 수 있는 블록 타입들
          const hasChildren = [
            'callout',
            'toggle',
            'quote',
            'table_of_contents',
            'column_list',
            'column',
            'synced_block',
          ].includes(block.type);

          if (hasChildren) {
            try {
              const children = await getBlocksWithChildren(block.id);
              return { ...block, children };
            } catch (error) {
              console.warn(
                `⚠️ 블록 ${block.id}의 자식 블록을 가져오는 중 오류:`,
                error,
              );
              return block;
            }
          }
        }
        return block;
      }),
    );

    return blocksWithChildren;
  } catch (error) {
    console.error('❌ 블록을 가져오는 중 오류 발생:', error);
    throw error;
  }
}

// * 테이블 블록의 자식 블록들 가져오기
export async function getTableBlocks(
  blockId: string,
): Promise<(BlockObjectResponse | PartialBlockObjectResponse)[]> {
  try {
    if (!notion) {
      console.warn(
        '⚠️ Notion 설정이 완료되지 않았습니다. 빈 배열을 반환합니다.',
      );
      return [];
    }

    const response = await notion.blocks.children.list({
      block_id: blockId,
    });

    return response.results;
  } catch (error) {
    console.error('❌ 테이블 블록을 가져오는 중 오류 발생:', error);
    throw error;
  }
}

// * Notion 페이지를 BlogPost 타입으로 변환
function mapNotionPageToBlogPost(page: PageObjectResponse): BlogPost {
  const properties = page.properties;

  // * 제목 (name 속성)
  const title = getPlainText(getProperty(properties, 'name'));

  // * slug 생성 (slug 속성은 없으므로 title에서 자동 생성)
  const slug = generateSlugFromTitle(title);

  // * 발행 여부 (releasable 속성)
  const isPublished = getCheckbox(getProperty(properties, 'releasable'));

  // * 태그들
  const mainTags = getMultiSelect(getProperty(properties, 'mainTags'));
  const subTags = getMultiSelect(getProperty(properties, 'subTags'));
  const allTags = [...mainTags, ...subTags];

  // * 썸네일 이미지
  const coverImage = getFileUrl(getProperty(properties, 'thumbnailUrl'));

  // * 생성일/수정일
  const createdAt =
    getDate(getProperty(properties, 'createdAt')) || page.created_time;
  const lastEditedAt =
    getDate(getProperty(properties, 'updatedAt')) || page.last_edited_time;

  return {
    id: page.id,
    title,
    slug,
    summary: getPlainText(getProperty(properties, 'description')),
    mainTags,
    subTags,
    tags: allTags,
    createdAt,
    lastEditedAt,
    isPublished,
    isFeatured: getCheckbox(getProperty(properties, 'featured')),
    coverImage,
  };
}
