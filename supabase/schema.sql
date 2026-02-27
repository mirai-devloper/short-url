-- =============================================
-- 短縮URLサービス データベーススキーマ
-- =============================================

-- 短縮URLテーブル
CREATE TABLE IF NOT EXISTS short_urls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(8) NOT NULL UNIQUE,
  original_url TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 削除済みコード管理テーブル（再利用防止）
CREATE TABLE IF NOT EXISTS used_codes (
  code VARCHAR(8) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_short_urls_code ON short_urls(code);
CREATE INDEX IF NOT EXISTS idx_short_urls_expires_at ON short_urls(expires_at);

-- =============================================
-- RLS (Row Level Security)
-- Service Role Key を使用するため、anon ユーザーには全操作を拒否
-- API Routes (サーバーサイド) から Service Role Key でアクセスし、
-- RLS をバイパスするため、ポリシーは不要
-- =============================================

ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_codes ENABLE ROW LEVEL SECURITY;

-- anon ユーザーからの直接アクセスを全て拒否（ポリシーなし = 全拒否）
-- Service Role Key は RLS をバイパスするため、API Routes からは正常に動作する

-- =============================================
-- 期限切れURL自動削除 (pg_cron)
-- Supabase で pg_cron が有効な場合、以下を実行してください
-- =============================================

-- SELECT cron.schedule(
--   'cleanup-expired-urls',
--   '0 * * * *',
--   $$DELETE FROM short_urls WHERE expires_at < now()$$
-- );
