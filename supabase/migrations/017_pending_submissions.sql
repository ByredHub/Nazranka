-- =============================================
-- Временная таблица для обращений из Telegram
-- Попадают сюда, ждут одобрения админа, потом — в articles или удаляются
-- =============================================

CREATE TABLE IF NOT EXISTS pending_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name TEXT,
  user_telegram_id BIGINT,
  user_handle TEXT,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: только auth может читать и писать (через сервер-ключ)
ALTER TABLE pending_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_all_pending"
  ON pending_submissions
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
