import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function notFoundResponse() {
  const html = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>404 - ページが見つかりません | Short URL</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', -apple-system, sans-serif;
      background: #0a0a0f;
      color: #f0f0f5;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(129,140,248,0.08) 0%, transparent 60%);
      pointer-events: none;
    }
    .container {
      text-align: center;
      position: relative;
      z-index: 1;
      padding: 2rem;
    }
    .icon { margin-bottom: 1.5rem; opacity: 0.7; }
    .title {
      font-size: 4rem;
      font-weight: 700;
      background: linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1;
      margin-bottom: 0.5rem;
    }
    .subtitle { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
    .desc { font-size: 0.95rem; color: #9ca3af; margin-bottom: 2rem; }
    .link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      color: #818cf8;
      font-size: 0.9rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    .link:hover {
      background: rgba(255,255,255,0.05);
      border-color: #818cf8;
      transform: translateX(-4px);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="url(#g)" stroke-width="1.5"/>
        <path d="M16 16s-1.5-2-4-2-4 2-4 2" stroke="url(#g)" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="9" y1="9" x2="9.01" y2="9" stroke="url(#g)" stroke-width="2" stroke-linecap="round"/>
        <line x1="15" y1="9" x2="15.01" y2="9" stroke="url(#g)" stroke-width="2" stroke-linecap="round"/>
        <defs><linearGradient id="g" x1="2" y1="22" x2="22" y2="2"><stop stop-color="#818cf8"/><stop offset="1" stop-color="#f472b6"/></linearGradient></defs>
      </svg>
    </div>
    <h1 class="title">404</h1>
    <h2 class="subtitle">ページが見つかりません</h2>
    <p class="desc">この短縮URLは存在しないか、有効期限が切れています。</p>
    <a href="/" class="link">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <polyline points="12 19 5 12 12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      トップに戻る
    </a>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 404,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

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
      return notFoundResponse();
    }

    // 期限切れチェック
    const now = new Date();
    const expiresAt = new Date(data.expires_at);
    if (now > expiresAt) {
      // 期限切れの場合は削除
      await supabase.from('short_urls').delete().eq('code', code);
      return notFoundResponse();
    }

    // リダイレクト
    return NextResponse.redirect(data.original_url, 307);
  } catch (error) {
    console.error('Redirect error:', error);
    return notFoundResponse();
  }
}
