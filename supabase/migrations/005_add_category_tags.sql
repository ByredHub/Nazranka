-- Добавить теги, совпадающие с категориями
-- Выполнить в Supabase Dashboard → SQL Editor

INSERT INTO tags (name, slug, is_hot) VALUES
  ('Политика',         'politika',         true),
  ('Экономика',        'ekonomika',        true),
  ('Общество',         'obshchestvo',      true),
  ('Культура',         'kultura',          false),
  ('Спорт',            'sport-tag',        false),
  ('Происшествия',     'proisshestviya',   true),
  ('Народные новости', 'narodnye-novosti', false),
  ('История',          'istoriya',         false),
  ('Образование',      'obrazovanie',      false)
ON CONFLICT (slug) DO NOTHING;
