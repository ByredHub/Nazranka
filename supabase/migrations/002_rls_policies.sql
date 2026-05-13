-- =============================================
-- nazranka.ru — Row Level Security (RLS)
-- SECURITY: RLS включена на КАЖДОЙ таблице
-- Выполнить в Supabase Dashboard → SQL Editor
-- =============================================

-- === CATEGORIES ===
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Все могут читать категории
CREATE POLICY "categories_select_all" ON categories
  FOR SELECT USING (true);

-- Только авторизованные могут изменять
CREATE POLICY "categories_insert_auth" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "categories_update_auth" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "categories_delete_auth" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- === TAGS ===
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tags_select_all" ON tags
  FOR SELECT USING (true);

CREATE POLICY "tags_insert_auth" ON tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "tags_update_auth" ON tags
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "tags_delete_auth" ON tags
  FOR DELETE USING (auth.role() = 'authenticated');

-- === ARTICLES ===
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Публичное чтение: только опубликованные ИЛИ свои (если авторизован)
CREATE POLICY "articles_select_public" ON articles
  FOR SELECT USING (
    status = 'published'
    OR auth.role() = 'authenticated'
  );

-- Только авторизованные могут создавать/редактировать/удалять
CREATE POLICY "articles_insert_auth" ON articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "articles_update_auth" ON articles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "articles_delete_auth" ON articles
  FOR DELETE USING (auth.role() = 'authenticated');

-- === ARTICLE_TAGS ===
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "article_tags_select_all" ON article_tags
  FOR SELECT USING (true);

CREATE POLICY "article_tags_insert_auth" ON article_tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "article_tags_delete_auth" ON article_tags
  FOR DELETE USING (auth.role() = 'authenticated');

-- === USERS ===
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Каждый видит только свой профиль
CREATE POLICY "users_select_own" ON users
  FOR SELECT USING (auth.uid() = id);

-- Только admin может изменять пользователей
-- (создание через Supabase Auth + триггер)
CREATE POLICY "users_update_admin" ON users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- === MEDIA ===
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Все могут читать медиа (публичный бакет)
CREATE POLICY "media_select_all" ON media
  FOR SELECT USING (true);

CREATE POLICY "media_insert_auth" ON media
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "media_delete_auth" ON media
  FOR DELETE USING (auth.role() = 'authenticated');

-- =============================================
-- STORAGE: Bucket "covers"
-- Создайте через Dashboard → Storage → New bucket
-- Имя: covers, Public: включено
-- Затем добавьте политики:
-- =============================================

-- Публичное чтение файлов из covers
-- (Сделать через Dashboard → Storage → covers → Policies)
-- SELECT: Разрешить всем
-- INSERT: Только authenticated
-- DELETE: Только authenticated
