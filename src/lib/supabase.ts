import { createClient } from '@supabase/supabase-js';

// サーバーサイド専用 Supabase クライアント
// Service Role Key を使用し、RLS をバイパスする
// ※ このクライアントは API Routes (サーバーサイド) でのみ使用すること
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
