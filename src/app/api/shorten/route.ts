import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { nanoid } from 'nanoid';

const VALID_DAYS = [3, 7, 15, 30, 60, 90];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, days } = body;

    // バリデーション
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'URLを入力してください' },
        { status: 400 }
      );
    }

    // URL形式チェック
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: '有効なURLを入力してください' },
        { status: 400 }
      );
    }

    if (!days || !VALID_DAYS.includes(days)) {
      return NextResponse.json(
        { error: '有効な保持期間を選択してください' },
        { status: 400 }
      );
    }

    // ユニークなコードを生成（used_codesと衝突しないまで繰り返す）
    let code: string;
    let attempts = 0;
    const maxAttempts = 10;

    do {
      code = nanoid(8);
      attempts++;

      // used_codesテーブルで重複チェック
      const { data: existingCode } = await supabase
        .from('used_codes')
        .select('code')
        .eq('code', code)
        .single();

      if (!existingCode) break;

      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: 'コードの生成に失敗しました。再度お試しください。' },
          { status: 500 }
        );
      }
    } while (true);

    // 有効期限を計算
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + days);

    // short_urlsテーブルに保存
    const { error: insertError } = await supabase
      .from('short_urls')
      .insert({
        code,
        original_url: url,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'データベースへの保存に失敗しました' },
        { status: 500 }
      );
    }

    // used_codesテーブルにも登録（再利用防止）
    const { error: usedCodeError } = await supabase
      .from('used_codes')
      .insert({ code });

    if (usedCodeError) {
      console.error('Used code insert error:', usedCodeError);
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/${code}`;

    return NextResponse.json({
      shortUrl,
      code,
      expiresAt: expiresAt.toISOString(),
      days,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    );
  }
}
