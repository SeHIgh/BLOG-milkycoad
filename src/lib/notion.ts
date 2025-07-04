import { Client } from '@notionhq/client';
import {
  PageObjectResponse,
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';
import {
  findProperty,
  analyzeNotionDatabase,
  generateSlugFromTitle,
  getFileUrl,
} from './notion-utils';

// 환경변수 검증 및 설정
function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} 환경변수가 설정되지 않았습니다.`);
  }
  return value;
}

const NOTION_TOKEN = getRequiredEnv('NOTION_TOKEN');
const NOTION_DATABASE_ID = getRequiredEnv('NOTION_DATABASE_ID');

// Notion 클라이언트 설정 (서버사이드 전용)
export const notion = new Client({
  auth: NOTION_TOKEN,
});

// 타입 정의
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

// 데이터베이스에서 모든 게시글 가져오기
export async function getBlogPosts(publishedOnly: boolean = true): Promise<BlogPost[]> {
  try {
    console.log('📋 모든 블로그 포스트 가져오기...');

    // 필터 없이 모든 데이터 가져오기 (정렬 제거하여 속성 오류 방지)
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      // sorts 제거 - 클라이언트에서 정렬
    });

    const blogPosts = response.results
      .filter((page): page is PageObjectResponse => 'properties' in page)
      .map(mapNotionPageToBlogPost)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // 클라이언트에서 정렬

    console.log(`✅ ${blogPosts.length}개의 포스트를 가져왔습니다`);

    // 발행된 포스트만 필터링
    const filteredPosts = publishedOnly ? blogPosts.filter((post) => post.isPublished) : blogPosts;

    console.log(`📌 최종 반환: ${filteredPosts.length}개 포스트 (발행만: ${publishedOnly})`);

    return filteredPosts;
  } catch (error) {
    console.error('❌ 블로그 포스트를 가져오는 중 오류 발생:', error);
    throw error;
  }
}

// 특정 게시글 가져오기
export async function getBlogPost(pageId: string): Promise<BlogPost | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId });

    if (!('properties' in page)) {
      return null;
    }

    const blocks = await notion.blocks.children.list({
      block_id: pageId,
    });

    const blogPost = mapNotionPageToBlogPost(page);
    blogPost.content = blocks.results;

    return blogPost;
  } catch (error) {
    console.error('블로그 포스트를 가져오는 중 오류 발생:', error);
    return null;
  }
}

// slug로 게시글 가져오기
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    console.log('🔍 slug로 포스트 검색:', slug);

    // 전체 포스트를 가져와서 slug로 필터링 (더 안전한 방법)
    const allPosts = await getBlogPosts(false); // 미발행 포스트도 포함

    // slug가 일치하는 포스트 찾기
    const matchedPost = allPosts.find((post) => post.slug === slug);

    if (!matchedPost) {
      console.log('❌ 해당 slug로 포스트를 찾을 수 없음:', slug);
      return null;
    }

    console.log('✅ 포스트 찾음:', matchedPost.title);

    // 포스트의 내용(content)을 가져오기 위해 추가 API 호출
    const blocks = await notion.blocks.children.list({
      block_id: matchedPost.id,
    });

    // content 추가
    matchedPost.content = blocks.results;

    return matchedPost;
  } catch (error) {
    console.error('❌ 블로그 포스트 조회 중 오류 발생:', error);
    return null;
  }
}

// 속성 분석을 한 번만 실행하기 위한 플래그
let hasAnalyzedDatabase = false;

// Notion 페이지를 BlogPost 타입으로 변환
function mapNotionPageToBlogPost(page: PageObjectResponse): BlogPost {
  const properties = page.properties;

  // 개발 모드에서 속성 분석 (디버깅 목적으로 항상 실행)
  if (process.env.NODE_ENV === 'development' && !hasAnalyzedDatabase) {
    console.log('🔍 Notion 데이터베이스 속성 분석 시작...');
    analyzeNotionDatabase(properties);
    hasAnalyzedDatabase = true;
  }

  // 발행 여부 확인 - releasable이 false이거나 published가 true이면 발행됨
  const releasableProperty = findProperty(properties, 'releasable');
  const publishedProperty = findProperty(properties, 'published');

  let isPublished = true; // 기본값

  if (releasableProperty) {
    // releasable이 false면 발행됨 (기존 로직)
    isPublished = !getCheckbox(releasableProperty);
  } else if (publishedProperty) {
    // published가 true면 발행됨
    isPublished = getCheckbox(publishedProperty);
  }

  // 제목 추출
  const title = getPlainText(findProperty(properties, 'title'));

  // slug 추출 또는 자동 생성
  const slugFromProperty = getPlainText(findProperty(properties, 'slug'));
  const slug = slugFromProperty || generateSlugFromTitle(title);

  // 태그 추출
  const mainTags = getMultiSelect(findProperty(properties, 'mainTags'));
  const subTags = getMultiSelect(findProperty(properties, 'subTags'));
  const allTags = [...mainTags, ...subTags];

  // 커버 이미지 추출
  const coverImageFromProperty = getFileUrl(findProperty(properties, 'coverImage'));
  const coverImageFromCover = getCoverImage(page.cover);
  const coverImage = coverImageFromProperty || coverImageFromCover;

  return {
    id: page.id,
    title,
    slug,
    summary: getPlainText(findProperty(properties, 'summary')),
    mainTags,
    subTags,
    tags: allTags,
    createdAt: page.created_time,
    lastEditedAt: page.last_edited_time,
    isPublished,
    isFeatured: getCheckbox(findProperty(properties, 'featured')),
    coverImage,
  };
}

// 유틸리티 함수들
function getPlainText(property: unknown): string {
  if (!property || typeof property !== 'object' || property === null) return '';

  const prop = property as Record<string, unknown>;

  if (prop.type === 'title' && prop.title && Array.isArray(prop.title)) {
    return prop.title.map((text: Record<string, unknown>) => text.plain_text).join('');
  }

  if (prop.type === 'rich_text' && prop.rich_text && Array.isArray(prop.rich_text)) {
    return prop.rich_text.map((text: Record<string, unknown>) => text.plain_text).join('');
  }

  return '';
}

function getMultiSelect(property: unknown): string[] {
  if (!property || typeof property !== 'object' || property === null) return [];

  const prop = property as Record<string, unknown>;

  if (prop.type !== 'multi_select' || !Array.isArray(prop.multi_select)) return [];
  return prop.multi_select.map((option: Record<string, unknown>) => option.name as string);
}

function getCheckbox(property: unknown): boolean {
  if (!property || typeof property !== 'object' || property === null) return false;

  const prop = property as Record<string, unknown>;

  if (prop.type !== 'checkbox') return false;
  return prop.checkbox as boolean;
}

function getCoverImage(cover: unknown): string | undefined {
  if (!cover || typeof cover !== 'object' || cover === null) return undefined;

  const coverObj = cover as Record<string, unknown>;

  if (coverObj.type === 'external' && coverObj.external && typeof coverObj.external === 'object') {
    const external = coverObj.external as Record<string, unknown>;
    return external.url as string;
  }

  if (coverObj.type === 'file' && coverObj.file && typeof coverObj.file === 'object') {
    const file = coverObj.file as Record<string, unknown>;
    return file.url as string;
  }

  return undefined;
}
