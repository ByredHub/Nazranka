/**
 * Единая точка правды для серверного кода (revalidatePath, router.push,
 * redirect, middleware-проверки).
 *
 * ВАЖНО: если меняешь значение — нужно поменять ещё 3 места:
 *   1. Название папки /app/<здесь>/ (все подпапки)
 *   2. middleware.ts → config.matcher (требует literal)
 *   3. next.config.ts → headers().source (требует literal)
 *
 * В JSX `<Link href="...">` используем hardcoded строки, чтобы
 * typedRoutes (Next 16) мог валидировать их на этапе билда.
 */
export const ADMIN_PATH = '/nz-cp-8f3k'
