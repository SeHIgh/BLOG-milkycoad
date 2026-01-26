import { NextRequest, NextResponse } from 'next/server';
import { getTableBlocks } from '@/lib/notion';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blockId: string }> },
) {
  try {
    const { blockId } = await params;

    if (!blockId) {
      return NextResponse.json(
        { error: '블록 ID가 필요합니다.' },
        { status: 400 },
      );
    }

    const blocks = await getTableBlocks(blockId);

    return NextResponse.json(blocks);
  } catch (error) {
    console.error('❌ 테이블 블록 조회 중 오류 발생:', error);
    return NextResponse.json(
      { error: '테이블 블록을 가져오는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
