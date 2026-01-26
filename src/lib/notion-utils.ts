// 실제 Notion 데이터베이스 속성 매핑 (단순화)
export const NOTION_PROPERTIES = {
  ID: 'ID',
  name: 'name',
  description: 'description',
  mainTags: 'mainTags',
  subTags: 'subTags',
  releasable: 'releasable',
  featured: 'featured',
  thumbnailUrl: 'thumbnailUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
} as const;

// 속성에 직접 접근하는 헬퍼 함수
export function getProperty(
  properties: Record<string, unknown>,
  propertyName: keyof typeof NOTION_PROPERTIES,
): unknown {
  return properties[NOTION_PROPERTIES[propertyName]] || null;
}

// * 제목에서 slug 자동 생성 함수
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
  if (!property || typeof property !== 'object' || property === null)
    return undefined;

  const prop = property as Record<string, unknown>;

  if (
    prop.type === 'files' &&
    Array.isArray(prop.files) &&
    prop.files.length > 0
  ) {
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

// 텍스트 추출 함수
export function getPlainText(property: unknown): string {
  if (!property || typeof property !== 'object' || property === null) return '';

  const prop = property as Record<string, unknown>;

  if (prop.type === 'title' && prop.title && Array.isArray(prop.title)) {
    return prop.title
      .map((text: Record<string, unknown>) => text.plain_text)
      .join('');
  }

  if (
    prop.type === 'rich_text' &&
    prop.rich_text &&
    Array.isArray(prop.rich_text)
  ) {
    return prop.rich_text
      .map((text: Record<string, unknown>) => text.plain_text)
      .join('');
  }

  return '';
}

// Multi-select 추출 함수
export function getMultiSelect(property: unknown): string[] {
  if (!property || typeof property !== 'object' || property === null) return [];

  const prop = property as Record<string, unknown>;

  if (prop.type !== 'multi_select' || !Array.isArray(prop.multi_select))
    return [];
  return prop.multi_select.map(
    (option: Record<string, unknown>) => option.name as string,
  );
}

// Checkbox 추출 함수
export function getCheckbox(property: unknown): boolean {
  if (!property || typeof property !== 'object' || property === null)
    return false;

  const prop = property as Record<string, unknown>;

  if (prop.type !== 'checkbox') return false;
  return prop.checkbox as boolean;
}

// 날짜 추출 함수
export function getDate(property: unknown): string | undefined {
  if (!property || typeof property !== 'object' || property === null)
    return undefined;

  const prop = property as Record<string, unknown>;

  if (prop.type === 'date' && prop.date && typeof prop.date === 'object') {
    const date = prop.date as Record<string, unknown>;
    return date.start as string;
  }

  return undefined;
}
