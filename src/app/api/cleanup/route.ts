import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // 期限切れのURLを削除
    const { data: expiredUrls, error: selectError } = await supabase
      .from('short_urls')
      .select('code')
      .lt('expires_at', new Date().toISOString());

    if (selectError) {
      console.error('Select error:', selectError);
      return NextResponse.json(
        { error: 'クリーンアップに失敗しました' },
        { status: 500 }
      );
    }

    if (!expiredUrls || expiredUrls.length === 0) {
      return NextResponse.json({
        message: '削除対象のURLはありません',
        deleted: 0,
      });
    }

    const { error: deleteError } = await supabase
      .from('short_urls')
      .delete()
      .lt('expires_at', new Date().toISOString());

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: '削除に失敗しました' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: `${expiredUrls.length}件の期限切れURLを削除しました`,
      deleted: expiredUrls.length,
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
