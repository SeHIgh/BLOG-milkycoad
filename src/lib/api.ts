import { BlogPost } from './notion';
import { axiosClient } from './axiosClient';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  count?: number;
}

// 기본 API 호출 함수 (클라이언트 전용)
async function apiCall<T>(url: string): Promise<T> {
  // 클라이언트에서만 실행되는지 확인
  if (typeof window === 'undefined') {
    throw new Error(
      'clientApi는 클라이언트에서만 사용할 수 있습니다. 서버에서는 직접 notion 함수를 호출하세요.',
    );
  }

  const { data } = await axiosClient.get<ApiResponse<T>>(url);

  if (!data.success) {
    throw new Error(data.error || '알 수 없는 오류가 발생했습니다.');
  }

  if (!data.data) {
    throw new Error('데이터가 없습니다.');
  }

  return data.data;
}

// 클라이언트 전용 API 함수들
export const clientApi = {
  // 블로그 포스트 목록 가져오기 (클라이언트 전용)
  async getBlogPosts(publishedOnly: boolean = true): Promise<BlogPost[]> {
    const url = `/api/posts?published=${publishedOnly}`;
    return apiCall<BlogPost[]>(url);
  },

  // 특정 블로그 포스트 가져오기 (클라이언트 전용)
  async getBlogPost(slug: string): Promise<BlogPost> {
    const encodedSlug = encodeURIComponent(slug);
    const url = `/api/posts/${encodedSlug}`;
    return apiCall<BlogPost>(url);
  },
};

// React Query 키 생성 함수들
export const apiKeys = {
  blogPosts: (publishedOnly: boolean = true) =>
    ['blog-posts', publishedOnly] as const,
  blogPost: (slug: string) => ['blog-post', slug] as const,
};
