/* Один разовый патч каталога: адаптация под аудиторию r/Ru_Piracy.
   Применяет правки к js/data.js и перезаписывает его. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataPath = path.join(ROOT, 'js', 'data.js');

const { CATEGORIES, RESOURCES } = await import(pathToFileURL(dataPath).href + `?t=${Date.now()}`);

/* ---------------- новые категории ---------------- */

const NEW_CATS = [
  {
    id: 'bypass',
    title: 'Обход блокировок',
    desc: 'VPN, конфиги и инструменты, которые работают в России',
    icon: 'shield',
  },
];
const catIndex = CATEGORIES.findIndex((c) => c.id === 'privacy');
const categories = [
  ...CATEGORIES.slice(0, catIndex + 1),
  ...NEW_CATS,
  ...CATEGORIES.slice(catIndex + 1),
];

/* ---------------- удаляем: мёртвые и нерелевантные ---------------- */

const REMOVE = new Set([
  'Soap2Day style indexes', // служебная заглушка
  'IVPN', // платный, в РФ не подключается
  'Mobilism', // проект закрыт
  'AppDB', // сайт не работает
  'SpotX', // патч для Spotify, который ушёл из РФ
]);

/* ---------------- правки существующих ---------------- */

const UPDATE = {
  'Proton VPN': {
    ru: 'limited',
    note: 'В РФ подключается нестабильно: 43 из 61 опрошенных не смогли выйти. Сайт и приложения недоступны, оплата картой РФ не проходит.',
  },
  'Mullvad VPN': {
    ru: 'limited',
    note: 'Работает через мосты и обфускацию, но сайт и оплата из РФ недоступны.',
  },
  'Proton Mail': {
    ru: 'limited',
    note: 'Открывается через мост Proton, в вебе может быть недоступен.',
  },
  'Tor Browser': {
    ru: 'limited',
    note: 'tor.org в РФ заблокирован — качайте с официальных зеркал проекта.',
  },
  'RuTracker': {
    ru: 'mirror',
    note: 'Домен rutracker.org заблокирован РКН. Работают зеркала и Telegram-канал трекера.',
    url: 'https://rutracker.org/',
  },
  'RuTor': {
    ru: 'mirror',
    note: 'Основной домен недоступен из РФ, держите под рукой зеркала rutor.info.',
  },
  'Z-Library': {
    ru: 'mirror',
    note: 'Домены Z-Library постоянно блокируют. Актуальные зеркала: z-lib.gd, z-lib.fm, 1lib.sk, go-to-library.sk.',
    url: 'https://z-lib.gd/',
  },
  'Library Genesis': {
    ru: 'mirror',
    note: 'libgen.* регулярно блокируют, актуальный домен ищите на annas-archive.info.',
  },
  'Sci-Hub': {
    ru: 'limited',
    note: 'Часть адресов в списке РКН. Рабочие зеркала: sci-hub.ru, sci-hub.box.',
    url: 'https://sci-hub.ru/',
  },
  'The Pirate Bay': {
    ru: 'ok',
    note: 'DNS блокируется у части провайдеров — заходите через onion-зеркало.',
  },
  '1337x': {
    ru: 'ok',
    note: 'Доступен напрямую, у части провайдеров требуется смена DNS.',
  },
  'TorrentGalaxy': {
    ru: 'ok',
    note: 'Работает, но качество раздач скачет — проверяйте рейтинг.',
  },
  'Кинопоиск': {
    ru: 'ok',
    note: 'Бесплатный раздел с контентом ВГТРК открывается без VPN.',
  },
  'Perplexity': {
    ru: 'ok',
    note: 'Открывается из России без VPN, поиск с источниками работает на русском.',
  },
  'ChatGPT': {
    ru: 'limited',
    note: 'Регистрация с российского номера может не пройти. Рабочие агрегаторы — в разделе «ИИ».',
  },
  'Claude': {
    ru: 'limited',
    note: 'Аккаунт с российским номером телефона не регистрируется.',
  },
  'Gemini': {
    ru: 'limited',
    note: 'Доступ к Google-сервисам из РФ ограничен, нужна обходная подписка.',
  },
  'Suno': {
    ru: 'limited',
    note: 'Регистрация и оплата из РФ ограничены.',
  },
  'Udio': {
    ru: 'limited',
    note: 'Оплата картами РФ не проходит, нужен способ оплаты из-за рубежа.',
  },
  'Last.fm': {
    ru: 'limited',
    note: 'Периодически блокируется в РФ, работает через зеркала и обходные ссылки.',
  },
  'Hugging Face': {
    ru: 'limited',
    note: 'Часть моделей и файлов скачивается медленно, зеркала — на hf-mirror.com.',
  },
  'Internet Archive': {
    ru: 'ok',
  },
  'SteamRIP': {
    ru: 'ok',
    note: 'Домен и зеркала меняются — держите актуальную ссылку из сообщества.',
  },
  'FitGirl Repacks': {
    ru: 'ok',
    note: 'Домен регулярно блокируют, зеркала указаны на главной странице.',
  },
  'Online-Fix': {
    ru: 'ok',
  },
  'GOG Games': {
    ru: 'ok',
    note: 'Зеркало DRM-free игр GOG. Оригинальные покупки доступны на gog.com.',
  },
  'Massgrave': {
    ru: 'ok',
    note: 'Открытые скрипты активации Windows и Office. Используйте на свой страх и риск.',
  },
  'uBlock Origin': {
    ru: 'ok',
  },
  'Firefox': {
    ru: 'ok',
    note: 'Доступен, страницы Google и YouTube открываются медленнее.',
  },
  'Brave': {
    ru: 'ok',
  },
  'SearXNG': {
    ru: 'ok',
  },
  'DuckDuckGo': {
    ru: 'ok',
  },
  'Letterboxd': {
    ru: 'ok',
  },
  'MyAnimeList': {
    ru: 'ok',
  },
  'AniList': {
    ru: 'ok',
  },
  'Simkl': {
    ru: 'ok',
  },
};

/* ---------------- новые ресурсы ---------------- */

const ADD = [
  /* --- обход блокировок --- */
  {
    cat: 'bypass',
    name: 'AmneziaVPN',
    desc: 'Русский VPN на AmneziaWG и VLESS Reality — лучший выбор в РФ',
    url: 'https://amnezia.org/',
    tags: ['VPN', 'обход', 'русский'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
    note: 'Работал у 28 из 39 опрошенных в октябре 2026 — лучший результат среди VPN. Свои серверы, оплата рублями, конфиги можно раздать друзьям.',
  },
  {
    cat: 'bypass',
    name: 'AdGuard VPN',
    desc: 'Блокирует рекламу и работает в российских магазинах приложений',
    url: 'https://adguard-vpn.com/',
    tags: ['VPN', 'обход', 'легально'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
    note: 'Один из самых стабильных зарубежных VPN в РФ, есть в российском App Store. Бесплатно 3 ГБ в месяц.',
  },
  {
    cat: 'bypass',
    name: 'vpn-configs-for-russia',
    desc: 'Бесплатные конфиги VLESS и Hysteria2, обновляются автоматически',
    url: 'https://github.com/SeamniZ/vpn-configs-for-russia',
    tags: ['VPN', 'обход', 'бесплатно', 'конфиги'],
    os: ['any'],
    ru: 'ok',
    note: 'Подписка TXT для v2rayN, Throne, NekoBox и Streisand. Конфиги фильтруются по чёрным и белым спискам РКН.',
  },
  {
    cat: 'bypass',
    name: 'GoodbyeDPI',
    desc: 'Локальный обход DPI для Windows, Linux и macOS',
    url: 'https://github.com/ValdikSS/GoodbyeDPI',
    tags: ['обход', 'DPI', 'бесплатно', 'системные'],
    os: ['w', 'l', 'm'],
    ru: 'ok',
    note: 'Не VPN: просто чинит доступ к YouTube и другим сайтам без установки туннеля.',
  },
  {
    cat: 'bypass',
    name: 'Zapret',
    desc: 'Набор скриптов обхода DPI для роутеров и Linux',
    url: 'https://github.com/bol-van/zapret',
    tags: ['обход', 'DPI', 'бесплатно', 'системные'],
    os: ['l', 'any'],
    ru: 'ok',
    note: 'Работает на роутере и заменяет связку VPN+прокси там, где обычный VPN режут.',
  },
  {
    cat: 'bypass',
    name: '3x-ui',
    desc: 'Панель управления своим VLESS-сервером',
    url: 'https://github.com/MHSanaei/3x-ui',
    tags: ['обход', 'конфиги', 'разработка'],
    os: ['any'],
    ru: 'ok',
    note: 'Свой сервер за полчаса: домен, сертификат, автоподбор обхода блокировок.',
  },
  {
    cat: 'bypass',
    name: 'v2rayN',
    desc: 'Клиент VLESS, VMess и Shadowsocks для Windows',
    url: 'https://github.com/2dust/v2rayN',
    tags: ['клиенты', 'обход', 'системные'],
    os: ['w'],
    ru: 'ok',
  },
  {
    cat: 'bypass',
    name: 'Throne',
    desc: 'Андроид-клиент для VLESS с подбором протокола',
    url: 'https://github.com/throneproj/Throne',
    tags: ['клиенты', 'обход', 'APK'],
    os: ['a'],
    ru: 'ok',
  },
  {
    cat: 'bypass',
    name: 'NekoBox',
    desc: 'Клиент для Android с поддержкой sing-box',
    url: 'https://github.com/MatsuriDayo/NekoBoxForAndroid',
    tags: ['клиенты', 'обход', 'APK'],
    os: ['a'],
    ru: 'ok',
  },
  {
    cat: 'bypass',
    name: 'Hiddify',
    desc: 'Кроссплатформенный клиент с режимом обхода DPI',
    url: 'https://github.com/hiddify/hiddify-app',
    tags: ['клиенты', 'обход', 'системные'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
  },
  {
    cat: 'bypass',
    name: 'Streisand',
    desc: 'Клиент для iOS и Android с подбором работающих протоколов',
    url: 'https://github.com/StreisandSetter/Streisand',
    tags: ['клиенты', 'обход', 'приложения'],
    os: ['a', 'i'],
    ru: 'ok',
  },
  {
    cat: 'bypass',
    name: 'Karing',
    desc: 'Кроссплатформенный клиент с рекламой в приложении',
    url: 'https://github.com/Ivan-Milchev/Karing',
    tags: ['клиенты', 'обход', 'системные'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
  },
  {
    cat: 'bypass',
    name: 'WireGuard',
    desc: 'База для AmneziaWG и других схем обхода',
    url: 'https://www.wireguard.com/',
    tags: ['VPN', 'обход', 'легально', 'системные'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'limited',
    note: 'Чистый WireGuard в РФ режут, работает только в обёртке AmneziaWG.',
  },
  {
    cat: 'bypass',
    name: 'Hysteria2',
    desc: 'Протокол для обхода блокировок на медленных сетях',
    url: 'https://hysteria.network/',
    tags: ['VPN', 'обход', 'легально'],
    os: ['any'],
    ru: 'ok',
    note: 'Держит скорость там, где другие протоколы душат, — вариант для мобильного интернета.',
  },
  {
    cat: 'bypass',
    name: 'Anna’s Archive: зеркала',
    desc: 'Индекс актуальных зеркал библиотек и трекеров',
    url: 'https://annas-archive.info/',
    tags: ['зеркала', 'индексы', 'книги', 'бесплатно'],
    os: ['any'],
    ru: 'ok',
    note: 'Показывает живые зеркала Z-Library, Sci-Hub и Library Genesis с аптаймом. Обновляется каждые пять минут.',
  },
  {
    cat: 'bypass',
    name: 'Рутрекер в Telegram',
    desc: 'Каналы трекера с актуальными зеркалами',
    url: 'https://t.me/rutracker_news',
    tags: ['зеркала', 'торренты', 'русский'],
    os: ['any'],
    ru: 'ok',
    note: 'Рабочий доступ к трекеру, когда домен закрыт. Бот @ru_tracker_bot пришлёт свежее зеркало.',
  },

  /* --- кино и аниме --- */
  {
    cat: 'media',
    name: 'Смотрим',
    desc: 'ВГТРК: фильмы, сериалы и прямые эфиры бесплатно',
    url: 'https://smotrim.ru/',
    tags: ['стриминг', 'легально', 'русский'],
    os: ['any'],
    ru: 'ok',
    note: 'Полностью легальный контент, открывается из России без VPN и регистрации.',
  },
  {
    cat: 'media',
    name: 'Мосфильм',
    desc: 'Фильмотека киностудии: классика в открытом доступе',
    url: 'https://mosfilm.ru/',
    tags: ['стриминг', 'легально', 'русский'],
    os: ['any'],
    ru: 'ok',
  },
  {
    cat: 'media',
    name: 'Lampa',
    desc: 'Каталог фильмов для Android и Smart TV',
    url: 'https://lampa.app/',
    tags: ['стриминг', 'торренты', 'приложения'],
    os: ['w', 'a'],
    ru: 'ok',
    note: 'Сам приложение хранит только метаданные, а видео подключает через плагины. Официальная сборка в Google Play ограничена, есть сборки без ограничений.',
  },
  {
    cat: 'media',
    name: 'TorrServer',
    desc: 'Сервер для стриминга торрентов на Android TV',
    url: 'https://github.com/YouROK/TorrServer',
    tags: ['торренты', 'стриминг', 'приложения', 'системные'],
    os: ['w', 'a'],
    ru: 'ok',
  },

  /* --- игры --- */
  {
    cat: 'games',
    name: 'Steam',
    desc: 'Магазин игр с оплатой рублями и постоянными распродажами',
    url: 'https://store.steampowered.com/',
    tags: ['легально', 'системные'],
    os: ['w', 'm', 'l'],
    ru: 'ok',
    note: 'Работает из России, принимает российские карты. Раздачи и демки бесплатны.',
  },
  {
    cat: 'games',
    name: 'itch.io',
    desc: 'Магазин инди-игр, демо и бесплатных браузерных игр',
    url: 'https://itch.io/',
    tags: ['легально', 'бесплатно'],
    os: ['any'],
    ru: 'ok',
  },
  {
    cat: 'games',
    name: 'Modrinth',
    desc: 'Открытые моды и сборки для Minecraft и других игр',
    url: 'https://modrinth.com/',
    tags: ['легально', 'бесплатно', 'моды'],
    os: ['w', 'm', 'l', 'a'],
    ru: 'ok',
  },
  {
    cat: 'games',
    name: 'SteamDB',
    desc: 'Цены, распродажи и история скидок Steam',
    url: 'https://steamdb.info/',
    tags: ['легально', 'бесплатно', 'инструменты'],
    os: ['any'],
    ru: 'ok',
    note: 'Показывает реальные цены по регионам и историю скидок — чтобы не переплачивать.',
  },
  {
    cat: 'games',
    name: 'Epic Games Store',
    desc: 'Магазин с бесплатными играми каждую неделю',
    url: 'https://store.epicgames.com/',
    tags: ['легально', 'бесплатно'],
    os: ['w', 'm'],
    ru: 'ok',
  },

  /* --- софт --- */
  {
    cat: 'software',
    name: 'МойОфис',
    desc: 'Российский офисный пакет, бесплатно для дома',
    url: 'https://myoffice.ru/',
    tags: ['легально', 'русский', 'системные'],
    os: ['w', 'm', 'l', 'a'],
    ru: 'ok',
  },
  {
    cat: 'software',
    name: 'Р7-Офис',
    desc: 'Бесплатный офисный пакет с российскими сертификатами',
    url: 'https://r7-office.ru/',
    tags: ['легально', 'русский', 'системные'],
    os: ['w', 'm', 'l'],
    ru: 'ok',
  },
  {
    cat: 'software',
    name: 'yt-dlp',
    desc: 'Скачивание видео и аудио с сотен сайтов',
    url: 'https://github.com/yt-dlp/yt-dlp',
    tags: ['утилиты', 'бесплатно', 'разработка', 'системные'],
    os: ['w', 'm', 'l'],
    ru: 'ok',
    note: 'Работает с YouTube, VK, Rutube и другими платформами. Актуальная версия важна: YouTube регулярно ломает старые сборки.',
  },
  {
    cat: 'software',
    name: 'AIMP',
    desc: 'Лёгкий плеер с поддержкой Lossless и русским интерфейсом',
    url: 'https://www.aimp.ru/',
    tags: ['легально', 'бесплатно', 'системные', 'русский'],
    os: ['w', 'a'],
    ru: 'ok',
  },
  {
    cat: 'software',
    name: 'MPC-BE',
    desc: 'Видеоплеер с аппаратным ускорением',
    url: 'https://mpc-be.org/',
    tags: ['видео', 'легально', 'бесплатно', 'системные'],
    os: ['w'],
    ru: 'ok',
  },
  {
    cat: 'software',
    name: 'Kodi',
    desc: 'Медиатеатр с торрент-аддонами для ТВ и приставок',
    url: 'https://kodi.tv/',
    tags: ['видео', 'легально', 'бесплатно', 'системные'],
    os: ['w', 'm', 'l', 'a'],
    ru: 'ok',
  },

  /* --- приватность --- */
  {
    cat: 'privacy',
    name: 'Session',
    desc: 'Мессенджер без номера телефона и без регистрации',
    url: 'https://getsession.org/',
    tags: ['легально', 'бесплатно', 'приватность'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
    note: 'Не требует SIM и не привязан к номеру — рабочая замена Signal, который в РФ заблокирован.',
  },
  {
    cat: 'privacy',
    name: 'AdGuard DNS',
    desc: 'Блокировка рекламы на уровне DNS для всей сети',
    url: 'https://adguard-dns.io/',
    tags: ['adblock', 'легально', 'бесплатно'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
    note: 'Работает в России. Защищает все устройства в сети, а не только браузер.',
  },
  {
    cat: 'privacy',
    name: 'Quad9',
    desc: 'Бесплатный DNS-резолвер с фильтрацией вредоносных доменов',
    url: 'https://quad9.net/',
    tags: ['легально', 'бесплатно', 'безопасность'],
    os: ['any'],
    ru: 'ok',
  },

  /* --- ИИ --- */
  {
    cat: 'ai',
    name: 'Qwen',
    desc: 'Бесплатный чат от Alibaba с сильной работой на русском',
    url: 'https://chat.qwen.ai/',
    tags: ['чаты', 'бесплатно', 'китайский'],
    os: ['any'],
    ru: 'ok',
    note: 'Открывается из России без VPN, есть бесплатная веб-версия и API.',
  },
  {
    cat: 'ai',
    name: 'Mistral Le Chat',
    desc: 'Европейский чат с бесплатным тарифом',
    url: 'https://chat.mistral.ai/',
    tags: ['чаты', 'бесплатно', 'легально'],
    os: ['any'],
    ru: 'ok',
  },
  {
    cat: 'ai',
    name: 'OpenRouter',
    desc: 'Единый доступ к сотне моделей с бесплатным лимитом',
    url: 'https://openrouter.ai/',
    tags: ['чаты', 'разработка', 'бесплатно'],
    os: ['any'],
    ru: 'limited',
    note: 'Сайт открывается, но оплата картами РФ не проходит. Часть моделей доступна бесплатно.',
  },

  /* --- музыка --- */
  {
    cat: 'music',
    name: 'Яндекс Музыка',
    desc: 'Крупнейшая русскоязычная библиотека треков',
    url: 'https://music.yandex.ru/',
    tags: ['легально', 'русский', 'стриминг'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
  },
  {
    cat: 'music',
    name: 'VK Музыка',
    desc: 'Музыка ВКонтакте с бесплатной версией',
    url: 'https://music.vk.com/',
    tags: ['легально', 'русский', 'стриминг'],
    os: ['w', 'm', 'a', 'i'],
    ru: 'ok',
  },
  {
    cat: 'music',
    name: 'АКНИГА',
    desc: 'Бесплатные аудиокниги с качественной озвучкой',
    url: 'https://akniga.org/',
    tags: ['книги', 'бесплатно', 'аудио', 'русский'],
    os: ['w', 'a'],
    ru: 'ok',
  },

  /* --- книги --- */
  {
    cat: 'books',
    name: 'ЛитРес',
    desc: 'Легальный книжный магазин с бесплатным разделом',
    url: 'https://www.litres.ru/',
    tags: ['легально', 'русский', 'книги'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
  },
  {
    cat: 'books',
    name: 'FictionLib',
    desc: 'Большая библиотека художественной литературы',
    url: 'https://fictionlib.ru/',
    tags: ['книги', 'бесплатно', 'русский'],
    os: ['any'],
    ru: 'ok',
  },

  /* --- торренты --- */
  {
    cat: 'torrents',
    name: 'EZTVx',
    desc: 'Индекс сериалов в виде торрентов',
    url: 'https://eztvx.to/',
    tags: ['торренты', 'сериалы'],
    os: ['any'],
    ru: 'ok',
  },
  {
    cat: 'torrents',
    name: 'TorrentSearch',
    desc: 'Поиск по трекерам без регистрации',
    url: 'https://torrentsearch.info/',
    tags: ['торренты', 'поиск', 'русский'],
    os: ['any'],
    ru: 'ok',
  },

  /* --- android и ios --- */
  {
    cat: 'mobile',
    name: 'RuStore',
    desc: 'Российский магазин приложений от VK и Минцифры',
    url: 'https://www.rustore.ru/',
    tags: ['приложения', 'легально', 'русский', 'APK'],
    os: ['a'],
    ru: 'ok',
    note: 'Предустановлен на смартфоны, которые продают в России. В каталоге приложения банков, удалённые из Google Play.',
  },
  {
    cat: 'mobile',
    name: 'Huawei AppGallery',
    desc: 'Альтернативный магазин приложений для любых Android',
    url: 'https://appgallery.huawei.com/',
    tags: ['приложения', 'APK'],
    os: ['a'],
    ru: 'ok',
  },
  {
    cat: 'mobile',
    name: 'APKPure',
    desc: 'Архив APK с версиями под разные архитектуры',
    url: 'https://apkpure.com/',
    tags: ['APK', 'приложения'],
    os: ['a'],
    ru: 'ok',
  },
  {
    cat: 'mobile',
    name: 'NashStore',
    desc: 'Российский магазин с банковскими приложениями',
    url: 'https://nashstore.com/',
    tags: ['APK', 'приложения', 'легально', 'русский'],
    os: ['a'],
    ru: 'ok',
  },
  {
    cat: 'mobile',
    name: 'Uptodown',
    desc: 'Каталог APK и старых версий программ',
    url: 'https://uptodown.com/',
    tags: ['APK', 'приложения'],
    os: ['w', 'a'],
    ru: 'ok',
  },
  {
    cat: 'mobile',
    name: 'Aptoide',
    desc: 'Магазин APK с собственным клиентом',
    url: 'https://aptoide.com/',
    tags: ['APK', 'приложения'],
    os: ['a'],
    ru: 'ok',
  },
  {
    cat: 'mobile',
    name: 'Telegram',
    desc: 'Мессенджер, официальное приложение для Android и iOS',
    url: 'https://telegram.org/',
    tags: ['легально', 'бесплатно', 'приложения', 'русский'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
    note: 'Приложение убрали из российских магазинов — ставьте APK с официального сайта.',
  },

  /* --- обучение --- */
  {
    cat: 'learning',
    name: 'Stepik',
    desc: 'Бесплатные курсы на русском от российских вузов',
    url: 'https://stepik.org/',
    tags: ['курсы', 'легально', 'бесплатно', 'русский'],
    os: ['any'],
    ru: 'ok',
  },
  {
    cat: 'learning',
    name: 'Habr',
    desc: 'Русскоязычное сообщество разработчиков',
    url: 'https://habr.com/ru/',
    tags: ['разработка', 'русский', 'бесплатно', 'документация'],
    os: ['any'],
    ru: 'ok',
  },

  /* --- инструменты --- */
  {
    cat: 'tools',
    name: 'DeepL',
    desc: 'Переводчик с хорошим качеством русского перевода',
    url: 'https://www.deepl.com/',
    tags: ['легально', 'бесплатно', 'инструменты'],
    os: ['any'],
    ru: 'ok',
  },

  /* --- скачивание --- */
  {
    cat: 'downloads',
    name: 'Облако Mail',
    desc: 'Российское облачное хранилище с большими файлами',
    url: 'https://cloud.mail.ru/',
    tags: ['файлообменники', 'легально', 'русский'],
    os: ['any'],
    ru: 'ok',
  },
  {
    cat: 'downloads',
    name: 'Яндекс Диск',
    desc: 'Облачное хранилище с приложением для Android',
    url: 'https://disk.yandex.ru/',
    tags: ['файлообменники', 'легально', 'русский'],
    os: ['w', 'm', 'l', 'a', 'i'],
    ru: 'ok',
  },
];

/* ---------------- применяем ---------------- */

const removed = [];
let resources = RESOURCES.filter((r) => {
  if (REMOVE.has(r.name)) {
    removed.push(r.name);
    return false;
  }
  return true;
});

let updated = 0;
resources = resources.map((r) => {
  const patch = UPDATE[r.name];
  if (!patch) return { ...r, ru: r.ru || 'ok' };
  updated++;
  return {
    ...r,
    ...patch,
    ru: patch.ru || r.ru || 'ok',
    tags: patch.tags || r.tags,
    os: patch.os || r.os,
  };
});

for (const a of ADD) {
  resources.push({ ru: 'ok', ...a });
}

// новые метки в общий словарь
const newTags = new Set();
for (const r of resources) for (const t of r.tags) newTags.add(t);

/* ---------------- пишем ---------------- */

const order = categories.map((c) => c.id);
resources.sort((a, b) => {
  const d = order.indexOf(a.cat) - order.indexOf(b.cat);
  return d !== 0 ? d : a.name.localeCompare(b.name, 'ru');
});

const j = (v) => JSON.stringify(v, null, 2);
const out = `// Данные каталога MegaThread. Единственный источник правды — этот файл.
// ${categories.length} категорий, ${resources.length} ресурсов.
// ru: ok — работает в России, limited — с оговорками, blocked — заблокирован,
// mirror — нужен зеркальный домен.

export const CATEGORIES = ${j(categories)};

export const RESOURCES = ${j(resources)};

export const CAT_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
`;

fs.writeFileSync(dataPath, out, 'utf8');

console.log('удалено:', removed.join(', ') || '—');
console.log('обновлено:', updated);
console.log('добавлено:', ADD.length);
console.log('новых меток:', [...newTags].filter((t) => !['APK','P2P','ROM','VPN','adblock','iOS','аниме','аудио','безопасность','бесплатно','браузеры','видео','гайды','документация','индексы','инструменты','картинки','клиенты','книги','комиксы','курсы','легально','манга','моды','наука','поиск','почта','приватность','приложения','радио','разработка','расширения','русский','системные','скачивание','стриминг','торренты','трекеры','утилиты','файлообменники','чаты','эмуляторы'].includes(t)).join(', '));
console.log('итого:', categories.length, 'категорий,', resources.length, 'ресурсов');
