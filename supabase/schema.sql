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
-- RLS (Row Level Security) ポリシー
-- 認証不要のため、匿名アクセスを許可
-- =============================================

ALTER TABLE short_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_codes ENABLE ROW LEVEL SECURITY;

-- short_urls: 全操作を匿名ユーザーに許可
CREATE POLICY "Allow anonymous select" ON short_urls FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON short_urls FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous delete" ON short_urls FOR DELETE USING (true);

-- used_codes: SELECT と INSERT を許可
CREATE POLICY "Allow anonymous select" ON used_codes FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert" ON used_codes FOR INSERT WITH CHECK (true);

-- =============================================
-- 期限切れURL自動削除 (pg_cron)
-- Supabase で pg_cron が有効な場合、以下を実行してください
-- =============================================

-- SELECT cron.schedule(
--   'cleanup-expired-urls',
--   '0 * * * *',
--   $$DELETE FROM short_urls WHERE expires_at < now()$$
-- );
