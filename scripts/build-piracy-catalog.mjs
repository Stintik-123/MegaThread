/* Собирает пиратский каталог из fmhy-links.json + reddit-links.json.
   Пишет js/data.js и js/groups.js.

   Запуск: node scripts/build-piracy-catalog.mjs */
import fs from 'node:fs';

/* ============================ разделы каталога ============================ */

const CATEGORIES = [
  { id: 'torrents', title: 'Торренты', desc: 'Трекеры, индексы и клиенты раздач', icon: 'download' },
  { id: 'streaming', title: 'Кино и сериалы', desc: 'Онлайн-просмотр и раздачи', icon: 'film' },
  { id: 'anime', title: 'Аниме', desc: 'Озвучки, каталоги и раздачи', icon: 'film' },
  { id: 'games', title: 'Игры', desc: 'Репаки, ROM и эмуляторы', icon: 'gamepad' },
  { id: 'books', title: 'Книги и аудиокниги', desc: 'Библиотеки, зеркала и статьи', icon: 'book' },
  { id: 'music', title: 'Музыка', desc: 'Раздачи, рипы и радио', icon: 'music' },
  { id: 'bypass', title: 'Обход блокировок', desc: 'VPN, конфиги и инструменты против DPI', icon: 'shield' },
  { id: 'tools', title: 'Инструменты', desc: 'Клиенты, архиваторы и загрузчики', icon: 'tool' },
  { id: 'downloads', title: 'Файлообменники', desc: 'Крупные файлы и временные ссылки', icon: 'download' },
];

/* ============================ фильтры ============================ */

// Явно не пиратское: софт, код, обучение, легальные стриминги.
const BLOCK_DOMAINS = [
  'github.com', 'gitlab.com', 'sourceforge.net', 'fosshub.net', 'codeberg.org', 'gitee.com',
  'gnu.org', 'kernel.org', 'apache.org', 'python.org', 'nodejs.org', 'rust-lang.org', 'golang.org',
  'developer.mozilla.org', 'stackoverflow.com', 'stackexchange.com', 'npmjs.com', 'pypi.org',
  'crates.io', 'rubygems.org', 'packagist.org', 'docker.com', 'hub.docker.com', 'kubernetes.io',
  'debian.org', 'ubuntu.com', 'fedora.org', 'archlinux.org', 'kernel.org', 'kernel.org',
  'freebsd.org', 'opendev.org', 'wikimedia.org', 'wikipedia.org', 'wikibooks.org',
  'freecodecamp.org', 'codecademy.com', 'udemy.com', 'coursera.org', 'edx.org', 'khanacademy.org',
  'leetcode.com', 'hackerrank.com', 'codewars.com', 'jetbrains.com', 'eclipse.org', 'netbeans.org',
  'opengl.org', 'kaggle.com', 'colab.research.google.com', 'jupyter.org',
  'openai.com', 'chatgpt.com', 'anthropic.com', 'gemini.google.com', 'huggingface.co', 'midjourney.com',
  'adobe.com', 'autodesk.com', 'figma.com', 'notion.so', 'trello.com', 'atlassian.net', 'slack.com',
  'zoom.us', 'dropbox.com', 'onedrive.live.com', 'box.com', 'icloud.com', 'mega.nz', 'mail.ru',
  'telegram.org', 'discord.com', 'whatsapp.com', 'signal.org', 'twitter.com', 'x.com', 'instagram.com',
  'facebook.com', 'vk.com', 'ok.ru', 'pikabu.ru', 'habr.com', 'vc.ru', 'dzen.ru', 'youtube.com',
  'vimeo.com', 'twitch.tv', 'spotify.com', 'apple.com', 'amazon.com', 'netflix.com', 'disneyplus.com',
  'hbo.max.com', 'sberbank.ru', 'sber.ru', 'gosuslugi.ru', 'gosuslugi.ru', 'avito.ru', 'ozon.ru',
  'wildberries.ru', 'aliexpress.com', 'ebay.com', 'etsy.com', 'steamcommunity.com', 'steampowered.com',
  'epicgames.com', 'gog.com', 'origin.com', 'battle.net', 'ubisoft.com', 'ea.com', 'playstation.com',
  'xbox.com', 'nintendo.com', 'roblox.com', 'minecraft.net', 'curseforge.com',
  'fl.ru', 'kwork.ru', 'avito.ru', 'youla.ru', 'qiwi.ru', 'sberbank', 'megogo.net',
  'pikabu', 'kaktus', 'habr', 'vc.ru', 'dtf.ru', 'sports.ru', 'championat.com',
  'whtr', 'moscowtimes', 'russian.rt', 'tass.ru', 'ria.ru', 'lenta.ru', 'gazeta.ru', 'kp.ru',
  // легальные стриминги музыки и видео
  'spotify.com', 'deezer.com', 'soundcloud.com', 'bandcamp.com', 'tidal.com', 'mixcloud.com',
  'genius.com', 'musixmatch.com', 'last.fm', 'beatport.com', 'junodownload.com', '7digital.com',
  'qobuz.com', 'audiomack.com', 'beatbump.com', 'songkick.com', 'bandsintown.com', 'jango.com',
  'music.youtube.com', 'crunchyroll.com', 'hidive.com', 'funimation.com', 'retrocrush.net',
  'mubi.com', 'filmin.pl', 'kinovoz.tv', 'more.tv', 'ivi.ru', 'okko.ru', 'megogo.net', 'kinopoisk.ru',
  'premier.ru', 'asfan.ru', 'live.mail.ru', 'my.mail.ru', 'russia.tv', '1tv.ru', 'tvkultura.ru',
  'pravenc.ru', 'cultinfo.ru', 'istoriya.ru', 'telestream.ru', 'kinorium.ru', 'hdplay.ru',
  'anime-planet.com', 'myanimelist.net', 'anilist.co', 'kitsu.io', 'mangadex.org', 'comick.io',
  // легальный софт и загрузчики
  'ninite.com', 'softpedia.com', 'filehorse.com', 'softonic.com', 'majorgeeks.com',
  'portablefreeware.com', 'uptodate.com', 'alternatives-to.com', 'filecr.com', 'zcrack.com',
  'cracke.me', 'keygens.win', 'noroots.com', 'www.dafont.com', 'dafont.com',
];

// Домены, которые у нас есть, но как «инструмент для пиратства» — оставляем.
const KEEP_TOOLS = [
  '7-zip.org', 'win-rar.com', 'rarlab.com', 'vlc.me', 'videolan.org', 'jdownloader.org',
  'internetdownloadmanager.com', 'slickvt.com', 'filezilla-project.org', 'filezilla.org',
  'qbittorrent.org', 'transmissionbt.com', 'deluge-torrent.org', 'rutracker.org', 'rutor.info',
  'u-block.org', 'ublock.org', 'adguard.com', 'protonvpn.com', 'mullvad.net', 'windscribe.com',
  '4kdownload.com', 'mediaarea.net', 'handbrake.fr', 'mpv.io', 'yt-dlp.github.io',
];

// Порно — не добавляем.
const ADULT_HINTS = [
  'onlyfans', 'pornhub', 'xvideos', 'xnxx', 'redtube', 'youporn', 'spankbang', 'camwhores',
  'chaturbate', 'fansly', 'erome', 'motherless', 'brazzers', 'hentai', 'rule34', 'booru',
  'nhentai', 'hitomi', 'tsumino', 'e-hentai', 'exhentai', 'sukebei', 'sukebei.nyaa',
  'adult', 'porn', 'xxx',
];

const MIRROR_DOMAINS = [
  'libgen', 'z-lib', 'zlibrary', 'annas-archive', 'b-ok.org', 'bookzz', 'mobilism', 'booksc',
  'freedigitals', 'vdoc.pub', 'dokumen.pub', 'z-lib.gd',
];

const BLOCKED_DOMAINS = ['z-library', 'zlibrary', 'z-lib.gd', 'hentai', 'e-hentai'];

/* ============================ правила распределения ============================ */

const SECTION_TO_CAT = {
  torrenting: 'torrents',
  'movie-and-shows': 'streaming',
  movies: 'streaming',
  streaming: 'streaming',
  anime: 'anime',
  games: 'games',
  books: 'books',
  music: 'music',
  privacy: 'bypass',
  software: 'tools',
  misc: 'downloads',
  downloads: 'downloads',
  adult: null,
};

const KEYWORD_CATS = [
  [/торрент|torrent|трекер|tracker|индекс|rutor|rutracker|nnm-club|1337x|toorgle|zooqle|torrentz|rarbg|piratebay|limetorrents|magnet/i, 'torrents'],
  [/аниме|anime|nyaa|anidex|wotaku|theindex|everythingmoe|animepahe|kissanime|animeka|kunoms/i, 'anime'],
  [/репак|repack|fitgirl|steamrip|online-fix|dodi|gog.?games|взлом|crack|кряк|патч|activation|активац/i, 'games'],
  [/игр|game|rom|эмулятор|emulator|retroarch|dolphin|rpcs3|pcsx|retro/i, 'games'],
  [/книг|book|litres|libgen|z-lib|zlibrary|annas-archive|аудиокниг|audiobook|manga|манга|comic|комикс|ya novels/i, 'books'],
  [/музык|music|альбом|album|dj-mix|lossless|flac|podcast|радио|radio/i, 'music'],
  [/vpn|dpi|обход|bypass|конфиг|config|proxy|tor\b|socks|amnezia|goodbyedpi|zapret|shadowsocks|wireguard|outline|v2ray|xray|3x-ui/i, 'bypass'],
  [/трекер|torrent|qbittorrent|transmission|deluge|rutorrent|7-zip|winrar|rar|archivator|vlc|плеер|медиа|плеер|download manager|загрузчик|jdownloader|idm|filezilla|megatools|скачивал/i, 'tools'],
  [/файлообмен|filehost|upload|transfer|мега|mediafire|dropbox|гигапик|gigapack|pixeldrain|1fichier|zippyshare|bayfiles|krakenfiles|fileditch|wormhole/i, 'downloads'],
  [/онлайн|watch|смотреть|кино|фильм|movie|сериал|series|kino|rezka|hd-rezka|rutracker|kis|kissanime|tsarstudio|hd-torrents|линк|раздат/i, 'streaming'],
  [/активац|activation|кряк|crack|keygen|патч|warranty|лиценз/i, 'cracks'],
];

const TAGS_BY_CAT = {
  torrents: ['торренты', 'трекеры', 'индексы', 'клиенты'],
  streaming: ['стриминг', 'бесплатно'],
  anime: ['аниме', 'стриминг'],
  games: ['игры', 'скачивание', 'репаки'],
  books: ['книги', 'бесплатно'],
  music: ['музыка', 'аудио'],
  bypass: ['VPN', 'обход', 'конфиги', 'DPI'],
  tools: ['утилиты', 'клиенты', 'системные'],
  downloads: ['файлообменники', 'скачивание'],
  cracks: ['утилиты', 'системные'],
};

/* ============================ сбор ============================ */

function readItems(file) {
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Array.isArray(data) ? data : data.items || [];
  } catch {
    console.log('не удалось прочитать', file);
    return [];
  }
}

function hostOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return '';
  }
}

/** Убирает из описания мусор FMHY: эмодзи, служебные символы, хвост с разделом. */
function cleanDesc(desc, section) {
  let d = String(desc || '');
  d = d.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200B}-\u{200F}\u{2060}\u{2713}\u{2714}\u{274C}\u{26A0}]/gu, ' ');
  d = d.replace(/[^\p{L}\p{N}\s.,:;()«»\-—–/%+]/gu, ' ');
  d = d.replace(/\s+/g, ' ').trim();
  d = d.replace(/^[\s\-—–.,:;]+/, '').replace(/[\s\-—–.,:;]+$/, '');
  // хвост вида «(аниме)» — название раздела, дублирующее категорию
  d = d.replace(new RegExp('\\(\\s*' + (section || '') + '\\s*\\)\\s*$', 'i'), '').trim();
  if (d.length < 12) return '';
  return d.length > 140 ? d.slice(0, 137).trim() + '…' : d;
}

const GENERIC_DESC = {
  torrents: 'Трекер или индекс раздач',
  streaming: 'Онлайн-просмотр без установки',
  anime: 'Каталог аниме и раздачи',
  games: 'Раздачи игр и репаки',
  books: 'Библиотека книг и статей',
  music: 'Раздачи и рипы музыки',
  bypass: 'Инструмент обхода блокировок',
  tools: 'Инструмент для загрузки и распаковки',
  downloads: 'Файлообменник для больших файлов',
  cracks: 'Обход лицензий и проверки подлинности',
};

function isBlocked(item) {
  const host = hostOf(item.url);
  const hay = (item.name + ' ' + item.url + ' ' + (item.desc || '')).toLowerCase();
  if (ADULT_HINTS.some((w) => hay.includes(w))) return true;
  if (BLOCK_DOMAINS.some((d) => host === d || host.endsWith('.' + d))) return true;
  return false;
}

function pickCategory(item) {
  const section = (item.section || '').toLowerCase();
  const hay = (item.name + ' ' + item.url + ' ' + (item.desc || '') + ' ' + (item.notes || []).join(' ')).toLowerCase();
  for (const [re, cat] of KEYWORD_CATS) {
    if (re.test(hay)) return cat;
  }
  return SECTION_TO_CAT[section] || null;
}

const items = [...readItems('scripts/fmhy-links.json'), ...readItems('scripts/reddit-links.json')];

const byHost = new Map();
for (const item of items) {
  if (!item || !item.url || !/^https?:\/\//i.test(item.url)) continue;
  if (isBlocked(item)) continue;
  const host = hostOf(item.url);
  if (!host) continue;
  const cat = pickCategory(item);
  if (!cat) continue;

  const prev = byHost.get(host);
  if (prev) {
    if (!prev.notes.includes(item.desc)) prev.notes.push(item.desc);
    if (!prev.sources.includes(item.section)) prev.sources.push(item.section);
    continue;
  }
  byHost.set(host, {
    name: (item.name || host).replace(/\s*[✅⚠️🚫|].*$/u, '').trim() || host,
    url: item.url,
    cat,
    desc: cleanDesc(item.desc, item.section),
    notes: item.desc ? [item.desc] : [],
    sources: item.section ? [item.section] : [],
  });
}

function statusOf(host, url) {
  const hay = (host + ' ' + url).toLowerCase();
  if (BLOCKED_DOMAINS.some((d) => hay.includes(d))) return 'blocked';
  if (MIRROR_DOMAINS.some((d) => hay.includes(d))) return 'mirror';
  return 'ok';
}

/* Платформы для известных инструментов: у с��ралок платформа не указана. */
const OS_BY_HOST = {
  'qbittorrent.org': ['w', 'm', 'l'],
  'transmissionbt.com': ['w', 'm', 'l'],
  '7-zip.org': ['w'],
  'videolan.org': ['w', 'm', 'l', 'a', 'i'],
  'ublockorigin.com': ['w', 'm', 'l', 'a', 'i'],
  '4kdownload.com': ['w', 'm', 'l'],
  'mediaarea.net': ['w', 'm', 'l'],
  'amnezia.org': ['w', 'm', 'l', 'a', 'i'],
  'protonvpn.com': ['w', 'm', 'l', 'a', 'i'],
  'mullvad.net': ['w', 'm', 'l', 'a', 'i'],
  'adguard-dns.com': ['w', 'm', 'l', 'a', 'i'],
  'goodbyedpi.com': ['w', 'm', 'l'],
  'zapret.tools': ['w', 'm', 'l'],
  'apkpure.com': ['a'],
  'apkmirror.com': ['a'],
  'itch.io': ['w', 'm', 'l'],
  'telegram.org': ['w', 'm', 'l', 'a', 'i'],
  'discord.com': ['w', 'm', 'l', 'a', 'i'],
  'spotify.com': ['w', 'm', 'l', 'a', 'i'],
  'github.com': ['w', 'm', 'l'],
  'mega.nz': ['w', 'm', 'l', 'a', 'i'],
  'pixeldrain.com': ['w', 'm', 'l', 'a', 'i'],
  'mediafire.com': ['w', 'm', 'l', 'a', 'i'],
};

function osFor(url) {
  const host = hostOf(url);
  const found = OS_BY_HOST[host] || OS_BY_HOST[host.replace(/^www\./, '')];
  return found ? found.slice() : ['any'];
}

const resources = [];
for (const [host, item] of byHost) {
  const cat = CATEGORIES.find((c) => c.id === item.cat);
  if (!cat) continue;
  const desc = (item.desc || '').replace(/\s+/g, ' ').trim() || GENERIC_DESC[item.cat] || 'Ссылка из пиратских мегатредов';
  const note = item.notes.filter((n) => n && n !== desc).slice(0, 2).join(' · ');
  resources.push({
    cat: item.cat,
    name: item.name.replace(/\s+/g, ' ').trim(),
    desc: desc,
    url: item.url,
    tags: TAGS_BY_CAT[item.cat].slice(0, 3),
    os: osFor(item.url),
    ru: statusOf(host, item.url),
    ...(note ? { note } : {}),
  });
}

/* ============================ опорные ресурсы ============================ */
// То, без чего пиратский набор не работает: русские трекеры, обход блокировок,
// клиенты и инструменты. Добавляются вручную, чтобы не потерялись при сборе.

const CORE = [
  { cat: 'torrents', name: 'RuTracker', url: 'https://rutracker.org/', desc: 'Русский трекер с огромной базой: кино, сериалы, музыка, игры, софт', tags: ['трекеры', 'русский'], ru: 'mirror', note: 'Основной домен не открывается напрямую — работают зеркала и Telegram-канал трекера.' },
  { cat: 'torrents', name: 'rutor.info', url: 'https://rutor.info/', desc: 'Русский индекс открытых торрентов, поиск без регистрации', tags: ['индексы', 'русский'], ru: 'ok' },
  { cat: 'torrents', name: 'NNM-Club', url: 'https://nnm-club.me/', desc: 'Русский трекер и форум: раздачи, обсуждения, рецензии', tags: ['трекеры', 'русский'], ru: 'ok' },
  { cat: 'torrents', name: '1337x', url: 'https://1337x.to/', desc: 'Популярный торрент-индекс с magnet-ссылками', tags: ['индексы'], ru: 'ok' },
  { cat: 'torrents', name: 'The Pirate Bay', url: 'https://thepiratebay.org/', desc: 'Старейший индекс: всё, что нашли пользователи', tags: ['индексы'], ru: 'ok' },
  { cat: 'torrents', name: 'Torrentz2', url: 'https://torrentz2.nz/', desc: 'Индекс метафайлов .torrent без рекламных переходов', tags: ['индексы'], ru: 'ok' },
  { cat: 'torrents', name: 'Zooqle', url: 'https://zooqle.com/', desc: 'Индекс с хорошей индексацией редких раздач', tags: ['индексы'], ru: 'ok' },
  { cat: 'torrents', name: 'Toorgle', url: 'https://toorgle.me/', desc: 'Ищет сразу по нескольким индексам', tags: ['индексы', 'поиск'], ru: 'ok' },
  { cat: 'torrents', name: 'LimeTorrents', url: 'https://www.limetorrents.lol/', desc: 'Индекс с быстрым поиском по имени файла', tags: ['индексы'], ru: 'ok' },
  { cat: 'torrents', name: 'TorrentGalaxy', url: 'https://torrentgalaxy.to/', desc: 'Индекс с большой базой и подборками по тегам', tags: ['индексы'], ru: 'ok' },
  { cat: 'tools', name: 'qBittorrent', url: 'https://www.qbittorrent.org/', desc: 'Торрент-клиент без рекламы: создаёт свой трек', tags: ['клиенты', 'утилиты'], ru: 'ok' },
  { cat: 'tools', name: 'Transmission', url: 'https://transmissionbt.com/', desc: 'Лёгкий торрент-клиент, есть сборки под Windows, macOS и Linux', tags: ['клиенты'], ru: 'ok' },
  { cat: 'tools', name: '7-Zip', url: 'https://www.7-zip.org/', desc: 'Архиватор: распаковывает RAR, ZIP, ISO и многое другое', tags: ['системные'], ru: 'ok' },
  { cat: 'tools', name: 'VLC', url: 'https://www.videolan.org/vlc/', desc: 'Плеер: открывает почти любой видеофайл и поток', tags: ['системные', 'утилиты'], ru: 'ok' },
  { cat: 'tools', name: '4K Video Downloader', url: 'https://www.4kdownload.com/', desc: 'Загрузка видео и аудиодорожек с YouTube и других сервисов', tags: ['утилиты', 'видео'], ru: 'ok' },
  { cat: 'tools', name: 'MediaInfo', url: 'https://mediaarea.net/en/MediaInfo', desc: 'Показывает метаданные файла: кодек, битрейт, дорожки, субтитры', tags: ['утилиты', 'системные'], ru: 'ok' },
  { cat: 'tools', name: 'uBlock Origin', url: 'https://ublock.org/', desc: 'Расширение блокирует рекламу и вредоносные скрипты', tags: ['расширения', 'браузеры'], ru: 'ok' },
  { cat: 'bypass', name: 'AmneziaVPN', url: 'https://amnezia.org/', desc: 'Русский VPN с обходом DPI и собственным протоколом', tags: ['VPN', 'обход', 'русский'], ru: 'ok' },
  { cat: 'bypass', name: 'AmneziaWG', url: 'https://amnezia.org/documentation/instructions/amneziawg/', desc: 'Протокол WireGuard с маскировкой трафика', tags: ['VPN', 'обход', 'конфиги'], ru: 'ok' },
  { cat: 'bypass', name: 'Proton VPN', url: 'https://protonvpn.com/', desc: 'Швейцарский VPN с бесплатным тарифом и собственными серверами', tags: ['VPN'], ru: 'limited', note: 'Бесплатный тариф ограничен по серверам, часть функций — платно.' },
  { cat: 'bypass', name: 'Mullvad VPN', url: 'https://mullvad.net/', desc: 'VPN без логи и без слежки, оплата криптовалютой', tags: ['VPN', 'приватность'], ru: 'ok' },
  { cat: 'bypass', name: 'AdGuard DNS', url: 'https://adguard-dns.io/', desc: 'Блокировка рекламы на уровне DNS, работает на любом устройстве', tags: ['adblock', 'приватность'], ru: 'ok' },
  { cat: 'bypass', name: 'GoodbyeDPI', url: 'https://github.com/valeriangalliat/goodbyedpi', desc: 'Локальный обход DPI без VPN', tags: ['DPI', 'обход'], ru: 'ok' },
  { cat: 'bypass', name: 'Zapret', url: 'https://github.com/bol-van/zapret', desc: 'Набор инструментов против блокировок и DPI', tags: ['DPI', 'обход'], ru: 'ok' },
  { cat: 'books', name: 'LibGen', url: 'https://libgen.is/', desc: 'Библиотека: книги, статьи, стандарты, аудиокниги', tags: ['книги', 'зеркала'], ru: 'mirror', note: 'Домены LibGen меняются каждые несколько недель — актуальный ищите в поиске.' },
  { cat: 'books', name: "Anna's Archive", url: 'https://annas-archive.org/', desc: 'Крупнейший каталог книг и статей с быстрым поиском', tags: ['книги', 'бесплатно'], ru: 'ok' },
  { cat: 'books', name: 'Z-Library', url: 'https://z-lib.gd/', desc: 'Библиотека книг с поиском по ISBN и названию', tags: ['книги', 'зеркала'], ru: 'blocked', note: 'Домены заблокированы: открывается через обход, часть зеркал требует аккаунт.' },
  { cat: 'books', name: 'Б-ОК / Bookzz', url: 'https://b-ok.org/', desc: 'Библиотека книг на нескольких языках, поиск по автору', tags: ['книги'], ru: 'ok' },
  { cat: 'anime', name: 'Nyaa', url: 'https://nyaa.si/', desc: 'Индекс аниме и восточных сериалов, часто в lossless', tags: ['торренты', 'аниме'], ru: 'ok' },
  { cat: 'anime', name: 'AniDex', url: 'https://anidex.info/', desc: 'Трекер аниме с двойными озвучками и субтитрами', tags: ['аниме', 'торренты'], ru: 'ok' },
  { cat: 'anime', name: 'Wotaku', url: 'https://wotaku.moe/', desc: 'Агрегатор аниме: ссылки на стриминг, торренты и загрузки', tags: ['аниме', 'стриминг'], ru: 'ok' },
  { cat: 'anime', name: 'The Index', url: 'https://theindex.moe/', desc: 'Каталог аниме с торрентами и magnet-ссылками', tags: ['аниме'], ru: 'ok' },
  { cat: 'games', name: 'FitGirl Repacks', url: 'https://fitgirl-repacks.site/', desc: 'Репаки игр с установкой из двух кликов, нужен большой диск', tags: ['репаки', 'игры'], ru: 'ok' },
  { cat: 'games', name: 'SteamRIP', url: 'https://steamrip.com/', desc: 'Репаки популярных игр с быстрым скачиванием', tags: ['репаки', 'игры'], ru: 'ok' },
  { cat: 'games', name: 'Online-Fix', url: 'https://online-fix.me/', desc: 'Репаки с обновлениями и русификацией', tags: ['репаки', 'игры'], ru: 'ok' },
  { cat: 'games', name: 'CS.RIN.RU', url: 'https://cs.rin.ru/forum/', desc: 'Форум по играм: обсуждения, патчи, раздачи', tags: ['игры', 'русский'], ru: 'ok' },
  { cat: 'games', name: 'The Eye', url: 'https://the-eye.eu/', desc: 'Крупная архив ROM: консоли, автоматы, handheld', tags: ['ROM', 'эмуляторы'], ru: 'ok' },
  { cat: 'games', name: 'Myrient', url: 'https://myrient.erista.me/', desc: 'Открытый архив ROM и дисков для ретро-систем', tags: ['ROM', 'эмуляторы'], ru: 'ok' },
  { cat: 'downloads', name: 'Gigapack', url: 'https://gigapack.live/', desc: 'Файлообменник без рекламы: быстрые прямые ссылки', tags: ['файлообменники', 'бесплатно'], ru: 'ok' },
  { cat: 'downloads', name: 'Mediafire', url: 'https://www.mediafire.com/', desc: 'Файлообменник с быстрыми ссылками и превью файлов', tags: ['файлообменники'], ru: 'ok' },
  { cat: 'downloads', name: 'Pixeldrain', url: 'https://pixeldrain.com/', desc: 'Файлообменник без рекламы и без ожидания', tags: ['файлообменники', 'бесплатно'], ru: 'ok' },
  { cat: 'downloads', name: '1fichier', url: 'https://1fichier.com/', desc: 'Файлообменник с большими лимитами и защитой от спама', tags: ['файлообменники'], ru: 'ok' },

  // Ресурсы, добавленные вручную через issues (issue #4): они не собираются
  // автоматически из мегатредов, поэтому живут здесь, в CORE.
  { cat: 'books', name: 'BookTracker', url: 'https://booktracker.org/', desc: 'Библиотека книг и сборников, включая зеркала Флибусты. Поиск по авторам и жанрам.', tags: ['книги', 'библиотека', 'флибуста'], ru: 'ok' },
  { cat: 'tools', name: 'Futon (Android)', url: 'https://github.com/AppFuton/Futon', desc: 'Форк Kotatsu для Android: чтение манги и новелл из 1200+ источников, история, закладки, трекинг прочитанного.', tags: ['манга', 'приложения'], os: ['a'], ru: 'ok' },
  { cat: 'books', name: 'Akuma', url: 'https://akuma.moe/', desc: 'Манга, додзинси и другая печатная продукция с каталогом и поиском.', tags: ['манга', 'додзинси'], ru: 'limited', note: 'Отвечает не всегда — домен может не открываться без обхода.' },
  { cat: 'streaming', name: 'Mogu (Hololive)', url: 'https://mogu.holopirates.moe/', desc: 'Архив платных стримов и видео Hololive.', tags: ['стриминг', 'архив'], ru: 'ok' },
  { cat: 'tools', name: 'Pawchive', url: 'https://pawchive.pw/', desc: 'Архив постов авторов с Patreon, визуальный аналог Kemono.', tags: ['патreon', 'архив'], ru: 'ok' },
  { cat: 'games', name: 'VRCpirate', url: 'https://vrcpirate.com/', desc: 'Модели персонажей, аксессуары и интерактивные объекты для VRChat.', tags: ['VRChat', 'модели'], ru: 'ok' },
  { cat: 'games', name: 'F95Zone', url: 'https://f95zone.to/', desc: 'Форум по играм, комиксам и анимациям для взрослых. Для скачивания требуется регистрация.', tags: ['18+', 'игры', 'форум'], ru: 'ok' },
  { cat: 'games', name: 'Flashpoint Archive', url: 'https://flashpointarchive.org/downloads', desc: 'Архив флеш-игр и анимаций: сохранение утраченного веб-контента.', tags: ['флеш', 'архив', 'браузерные'], ru: 'ok' },
  { cat: 'games', name: 'LewdPatcher', url: 'https://lewdpatcher.com/', desc: 'Патчи, снимающие цензуру в играх.', tags: ['патчи', '18+'], os: ['w'], ru: 'ok' },
];

const known = new Set(resources.map((r) => r.url.replace(/^www\./, '').replace(/\/+$/, '')));
for (const c of CORE) {
  const key = c.url.replace(/^www\./, '').replace(/\/+$/, '');
  if (known.has(key)) continue;
  known.add(key);
  resources.push({ os: osFor(c.url), ...c });
}

resources.sort((a, b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name, 'ru'));

/* ============================ запись в data.js ============================ */

const esc = (v) => JSON.stringify(v);

const catJson = CATEGORIES.map(
  (c) =>
    `  {\n    "id": ${esc(c.id)},\n    "title": ${esc(c.title)},\n    "desc": ${esc(c.desc)},\n    "icon": ${esc(c.icon)}\n  }`
).join(',\n');

const resJson = resources
  .map(
    (r) =>
      `  {\n    "cat": ${esc(r.cat)},\n    "name": ${esc(r.name)},\n    "desc": ${esc(r.desc)},\n    "url": ${esc(r.url)},\n    "tags": [${r.tags.map(esc).join(', ')}],\n    "os": [${r.os.map(esc).join(', ')}],\n    "ru": ${esc(r.ru)}${r.note ? ',\n    "note": ' + esc(r.note) : ''}\n  }`
  )
  .join(',\n');

const header = `// Пиратский каталог MegaThread. Единственный источник правды по составу.
// ${CATEGORIES.length} категорий, ${resources.length} ресурсов.
// Собран из FMHY, мегатреда Reddit и открытых пиратских списков.
// ru: ok — открывается напрямую, limited — работает не всегда, blocked — нужен обход,
// mirror — нужен актуальный домен или зеркало.

export const CATEGORIES = [
${catJson}
];

export const RESOURCES = [
${resJson}
];

export const CAT_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
`;

fs.writeFileSync('js/data.js', header, 'utf8');

const perCat = {};
for (const r of resources) perCat[r.cat] = (perCat[r.cat] || 0) + 1;
console.log('категорий:', CATEGORIES.length, '| ресурсов:', resources.length);
for (const c of CATEGORIES) console.log('  ', c.id.padEnd(11), String(perCat[c.id] || 0).padStart(4), c.title);
