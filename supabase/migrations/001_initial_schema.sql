-- =============================================
-- nazranka.ru — Начальная схема базы данных
-- Выполнить в Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Разделы и подкатегории
CREATE TABLE categories (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  slug       TEXT UNIQUE NOT NULL,
  parent_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX idx_categories_slug ON categories(slug);

-- 2. Теги
CREATE TABLE tags (
  id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name   TEXT NOT NULL,
  slug   TEXT UNIQUE NOT NULL,
  is_hot BOOLEAN DEFAULT false
);

CREATE INDEX idx_tags_slug ON tags(slug);

-- 3. Пользователи (admin / editor)
-- id берётся из Supabase Auth (auth.uid())
CREATE TABLE users (
  id           UUID PRIMARY KEY,
  email        TEXT NOT NULL,
  display_name TEXT,
  role         TEXT DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  avatar_url   TEXT
);

-- 4. Публикации (новости, статьи по всем разделам)
CREATE TABLE articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  lead             TEXT,
  content          JSONB,
  cover_image      TEXT,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  author_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  status           TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  views            INTEGER DEFAULT 0,
  is_featured      BOOLEAN DEFAULT false,
  sort_order       INTEGER DEFAULT 0,
  meta_title       TEXT,
  meta_description TEXT,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_is_featured ON articles(is_featured) WHERE is_featured = true;

-- 5. Связь статей и тегов (many-to-many)
CREATE TABLE article_tags (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  tag_id     UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_tag_id ON article_tags(tag_id);

-- 6. Медиатека
CREATE TABLE media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url         TEXT NOT NULL,
  filename    TEXT,
  alt_text    TEXT,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 7. Триггер автообновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
