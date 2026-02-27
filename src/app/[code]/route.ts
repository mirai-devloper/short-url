import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // 短縮コードで検索
    const { data, error } = await supabase
      .from('short_urls')
      .select('original_url, expires_at')
      .eq('code', code)
      .single();

    if (error || !data) {
      // 見つからない場合は404
      return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // 期限切れチェック
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    if (now > expiresAt) {
      // 期限切れの場合は削除して404
      await supabase.from('short_urls').delete().eq('code', code);
      return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // リダイレクト
    return NextResponse.redirect(data.original_url, 307);
  } catch (error) {
    console.error('Redirect error:', error);
    return NextResponse.redirect(new URL('/not-found', request.url));
  }
}
