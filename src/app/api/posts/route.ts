import { NextRequest, NextResponse } from 'next/server';
import { getBlogPosts } from '@/lib/notion';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publishedOnly = searchParams.get('published') !== 'false';

    const posts = await getBlogPosts(publishedOnly);

    return NextResponse.json({
      success: true,
      data: posts,
      count: posts.length,
    });
  } catch (error) {
    console.error('블로그 포스트 API 오류:', error);

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
