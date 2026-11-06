// Группы подразделов внутри каждого раздела.
// Ресурс попадает в первую группу, чьи теги совпали; остаток — в группу «Другое».

export const CATEGORY_GROUPS = {
  torrents: [
    { id: 'trackers', title: 'Трекеры', desc: 'Русские и зарубежные трекеры с открытыми раздачами', tags: ['трекеры'] },
    { id: 'indexes', title: 'Индексы', desc: 'Поиск раздач по всему каталогу', tags: ['индексы'] },
    { id: 'clients', title: 'Клиенты', desc: 'Торрент-клиенты для загрузки', tags: ['клиенты'] },
    { id: 'other', title: 'Торренты', desc: 'Раздачи, magnet-ссылки и тематические подборки', tags: ['торренты'] }
  ],
  streaming: [
    { id: 'online', title: 'Онлайн', desc: 'Смотрите онлайн без установки', tags: ['стриминг'] },
    { id: 'other', title: 'Раздачи и подборки', desc: 'Фильмы и сериалы, которые расходятся раздачами', tags: ['скачивание', 'бесплатно'] }
  ],
  anime: [
    { id: 'anime', title: 'Аниме', desc: 'Каталоги, озвучки и трекеры просмотра', tags: ['аниме'] },
    { id: 'subs', title: 'Субтитры', desc: 'Базы субтитров и таймкоды', tags: ['субтитры'] },
    { id: 'other', title: 'Онлайн и раздачи', desc: 'Просмотр и загрузка серий', tags: ['стриминг', 'скачивание'] }
  ],
  games: [
    { id: 'repacks', title: 'Репаки', desc: 'Готовые сборки игр', tags: ['репаки'] },
    { id: 'rom', title: 'ROM и эмуляторы', desc: 'Образы ретро-игр и эмуляторы', tags: ['ROM', 'эмуляторы'] },
    { id: 'other', title: 'Загрузка и раздачи', desc: 'Файлы игр и образы дисков', tags: ['скачивание', 'игры'] }
  ],
  books: [
    { id: 'libraries', title: 'Библиотеки', desc: 'Каталоги книг, статей и аудиокниг', tags: ['книги'] },
    { id: 'mirrors', title: 'Зеркала', desc: 'Домены, которые регулярно меняются', tags: ['зеркала'] },
    { id: 'audio', title: 'Аудиокниги', desc: 'Книги в озвучке', tags: ['аудиокниги'] },
    { id: 'other', title: 'Наука и статьи', desc: 'Журналы, статьи и препринты', tags: ['наука', 'бесплатно'] }
  ],
  music: [
    { id: 'music', title: 'Музыка', desc: 'Альбомы, рипы и лосслесс', tags: ['музыка', 'аудио'] },
    { id: 'radio', title: 'Радио и P2P', desc: 'Онлайн-радио и обмен музыкой', tags: ['радио', 'P2P'] },
    { id: 'other', title: 'Загрузка', desc: 'Скачивание треков и архивов', tags: ['скачивание'] }
  ],
  bypass: [
    { id: 'vpn', title: 'VPN', desc: 'Сервисы и клиенты для смены адреса', tags: ['VPN'] },
    { id: 'configs', title: 'Конфиги', desc: 'Готовые конфигурации и подписки', tags: ['конфиги'] },
    { id: 'dpi', title: 'Обход DPI', desc: 'Инструменты против глубокой инспекции', tags: ['DPI', 'обход'] },
    { id: 'other', title: 'Прокси и анонимность', desc: 'SOCKS, Tor и альтернативные схемы', tags: ['приватность', 'безопасность'] }
  ],
  tools: [
    { id: 'clients', title: 'Клиенты и загрузчики', desc: 'Менеджеры загрузок и клиенты раздач', tags: ['клиенты'] },
    { id: 'system', title: 'Архиваторы и плееры', desc: 'Распаковка и воспроизведение', tags: ['системные'] },
    { id: 'other', title: 'Утилиты', desc: 'Мелкие инструменты для работы с контентом', tags: ['утилиты'] }
  ],
  downloads: [
    { id: 'hosts', title: 'Файлообменники', desc: 'Временные ссылки на большие файлы', tags: ['файлообменники'] },
    { id: 'other', title: 'Загрузка', desc: 'Прямые ссылки и загрузчики', tags: ['скачивание'] }
  ]
};

/** Разбивает ресурсы раздела по группам. Пустые группы не возвращаются. */
export function groupResources(catId, resources) {
  const defs = CATEGORY_GROUPS[catId] || [];
  const buckets = defs.map((g) => ({ ...g, items: [] }));
  const other = { id: 'other', title: 'Другое', desc: '', tags: [], items: [] };

  for (const r of resources || []) {
    const tags = r.tags || [];
    const hit = buckets.find((g) => g.tags.some((t) => tags.includes(t)));
    (hit || other).items.push(r);
  }

  const out = buckets.filter((g) => g.items.length);
  if (other.items.length) out.push(other);
  return out;
}
