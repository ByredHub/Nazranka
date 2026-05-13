import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика конфиденциальности и обработки персональных данных сайта nazranka.ru',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Политика конфиденциальности
      </h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">1. Общие положения</h2>
          <p>
            Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных
            пользователей сайта nazranka.ru (далее — Сайт). Используя Сайт, вы соглашаетесь с условиями
            данной Политики.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">2. Сбор информации</h2>
          <p>Сайт может собирать следующую информацию:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Техническая информация о посещении (IP-адрес, тип браузера, время посещения)</li>
            <li>Данные систем аналитики (Яндекс.Метрика)</li>
            <li>Cookies для корректной работы сайта</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">3. Использование информации</h2>
          <p>Собранная информация используется для:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Обеспечения работоспособности Сайта</li>
            <li>Анализа посещаемости и улучшения контента</li>
            <li>Обеспечения безопасности Сайта</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">4. Защита данных</h2>
          <p>
            Мы принимаем необходимые организационные и технические меры для защиты персональных данных
            от несанкционированного доступа, изменения, раскрытия или уничтожения.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">5. Cookies</h2>
          <p>
            Сайт использует файлы cookies для обеспечения корректной работы и сбора статистики.
            Вы можете отключить cookies в настройках вашего браузера, однако это может повлиять
            на функциональность Сайта.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">6. Яндекс.Метрика</h2>
          <p>
            Для анализа посещаемости Сайт использует сервис Яндекс.Метрика, предоставляемый
            ООО &laquo;ЯНДЕКС&raquo;. Сервис собирает обезличенные данные о посещениях с помощью
            cookies. Подробнее:{' '}
            <a
              href="https://yandex.ru/legal/confidential/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-600 hover:underline"
            >
              Политика конфиденциальности Яндекса
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">7. Права пользователей</h2>
          <p>
            В соответствии с Федеральным законом от 27.07.2006 N 152-ФЗ &laquo;О персональных данных&raquo;,
            вы имеете право на доступ к своим персональным данным, их уточнение, блокирование или уничтожение.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-3">8. Изменения</h2>
          <p>
            Мы оставляем за собой право вносить изменения в настоящую Политику. Актуальная версия
            всегда доступна на данной странице.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-10 pt-6 border-t border-gray-200">
          Дата последнего обновления: 7 апреля 2026 года.
        </p>
      </div>
    </div>
  )
}
