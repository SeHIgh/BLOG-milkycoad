// 실제 Notion 데이터베이스 속성에 맞춘 매핑 설정
export const NOTION_PROPERTY_MAPPING = {
  title: ['name', 'title', 'Title', 'Name', '제목'],
  slug: ['slug', 'Slug', 'url', 'URL'], // 없으면 title에서 자동 생성
  summary: [
    'description',
    'summary',
    'Summary',
    'Description',
    'excerpt',
    'Excerpt',
    '요약',
    '설명',
  ],
  mainTags: ['mainTags', 'tags', 'Tags', 'categories', 'Categories', '주요태그', '태그'],
  subTags: ['subTags', 'subCategories', 'SubCategories', '보조태그', '서브태그'],
  published: ['published', 'Published', 'isPublished', 'IsPublished', '발행', '공개'],
  releasable: ['releasable', 'Releasable', 'draft', 'Draft', '임시저장'],
  featured: ['featured', 'Featured', 'isFeatured', 'IsFeatured', '추천', '중요'],
  createdAt: ['createdAt', 'CreatedAt', 'created_time', 'date', 'Date', '생성일'],
  updatedAt: ['updatedAt', 'UpdatedAt', 'last_edited_time', 'lastEdited', '수정일'],
  coverImage: [
    'thumbnailUrl',
    'cover',
    'Cover',
    'image',
    'Image',
    'thumbnail',
    'Thumbnail',
    '커버',
    '이미지',
  ],
  id: ['ID', 'id', 'unique_id', 'uniqueId'],
};

// 속성을 찾는 헬퍼 함수
export function findProperty(
  properties: Record<string, unknown>,
  propertyType: keyof typeof NOTION_PROPERTY_MAPPING,
): unknown {
  const possibleNames = NOTION_PROPERTY_MAPPING[propertyType];

  for (const name of possibleNames) {
    if (properties[name]) {
      return properties[name];
    }
  }

  return null;
}

// 데이터베이스 속성 분석 함수
export function analyzeNotionDatabase(properties: Record<string, unknown>): void {
  console.log('🔍 Notion 데이터베이스 속성 분석:');
  console.log('사용 가능한 속성들:');

  Object.keys(properties).forEach((key) => {
    const property = properties[key] as Record<string, unknown>;
    console.log(`  - ${key}: ${property.type || 'unknown'}`);
  });

  console.log('\n📋 속성 매핑 결과:');
  Object.keys(NOTION_PROPERTY_MAPPING).forEach((mappingKey) => {
    const found = findProperty(properties, mappingKey as keyof typeof NOTION_PROPERTY_MAPPING);
    if (found) {
      console.log(
        `  ✅ ${mappingKey}: 찾음 (${Object.keys(properties).find(
          (k) => properties[k] === found,
        )})`,
      );
    } else {
      console.log(`  ❌ ${mappingKey}: 찾을 수 없음`);
    }
  });
}

// 제목에서 slug 자동 생성 함수
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s가-힣]/g, '') // 특수문자 제거 (한글 포함)
    .replace(/\s+/g, '-') // 공백을 하이픈으로
    .replace(/-+/g, '-') // 중복 하이픈 제거
    .trim()
    .replace(/^-|-$/g, ''); // 시작과 끝의 하이픈 제거
}

// Files 속성에서 첫 번째 파일 URL 추출
export function getFileUrl(property: unknown): string | undefined {
  if (!property || typeof property !== 'object' || property === null) return undefined;

  const prop = property as Record<string, unknown>;

  if (prop.type === 'files' && Array.isArray(prop.files) && prop.files.length > 0) {
    const firstFile = prop.files[0] as Record<string, unknown>;

    if (firstFile.type === 'external' && firstFile.external) {
      const external = firstFile.external as Record<string, unknown>;
      return external.url as string;
    }

    if (firstFile.type === 'file' && firstFile.file) {
      const file = firstFile.file as Record<string, unknown>;
      return file.url as string;
    }
  }

  return undefined;
}
