import { NextRequest, NextResponse } from 'next/server';
import { getBlogPostBySlug } from '@/lib/notion';

interface RouteParams {
  params: {
    slug: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // await 제거하고 안전한 slug 처리
    let slug = params.slug;

    // 안전한 디코딩 처리
    try {
      // 이미 디코딩된 상태인지 확인
      if (slug.includes('%')) {
        slug = decodeURIComponent(slug);
      }
    } catch {
      console.warn('Slug 디코딩 실패, 원본 사용:', slug);
    }

    console.log('API 라우트에서 처리된 slug:', slug);

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error: '슬러그가 제공되지 않았습니다.',
        },
        { status: 400 },
      );
    }

    const post = await getBlogPostBySlug(slug);

    if (!post) {
      return NextResponse.json(
        {
          success: false,
          error: '해당 포스트를 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('블로그 포스트 조회 API 오류:', error);

    return NextResponse.json(
      {
        success: false,
        error: '블로그 포스트를 가져오는 중 오류가 발생했습니다.',
        message: error instanceof Error ? error.message : '알 수 없는 오류',
      },
      { status: 500 },
    );
  }
}

// CORS 설정 (필요한 경우)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
