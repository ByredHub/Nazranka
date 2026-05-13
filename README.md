# nazranka.ru

Новостной портал Республики Ингушетия.

## Стек

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL, Auth, Storage)
- **Tiptap** (WYSIWYG-редактор)

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните ключи Supabase.

## Структура

```
app/              — страницы (App Router)
components/       — React-компоненты
lib/              — утилиты, запросы, типы, валидация
scripts/          — скрипты генерации обложек
supabase/         — SQL-миграции
public/images/    — статические изображения
doc/              — документация проекта
```

## Админ-панель

Доступна по адресу `/nz-cp-8f3k/` (требуется авторизация).

## Документация

- [План разработки](doc/DEVELOPMENT_PLAN.md)
- [Описание проекта](doc/README.md)
