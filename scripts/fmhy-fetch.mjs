// FMHY scraper -> scripts/fmhy-links.json
// Обходит разделы FMHY, извлекает внешние ссылки с описаниями,
// отбрасывает open-source/легальный контент, оставляет пиратские ресурсы.
//
// Запуск: node scripts/fmhy-fetch.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'fmhy-links.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36';
const BASE = 'https://fmhy.net';

/* ------------------------------------------------------------------ pages */

const PAGES = [
  { path: '/video', section: 'movie-and-shows' },
  { path: '/gaming', section: 'games' },
  { path: '/torrenting', section: 'torrenting' },
  { path: '/reading', section: 'books' },
  { path: '/audio', section: 'music' },
  { path: '/downloading', section: 'software' },
  { path: '/file-tools', section: 'software' },
  { path: '/internet-tools', section: 'software' },
  { path: '/privacy', section: 'privacy' },
  { path: '/misc', section: 'misc' },
  { path: '/storage', section: 'misc' },
];

/* --------------------------------------------------- keep/drop by heading */

// Разрешённые заголовки (h2) для каждой страницы. Всё остальное отбрасывается.
const KEEP = {
  '/video': [
    'Stream Aggregators', 'P-Stream Forks', 'Dedicated-Server', 'Multi-Server',
    'Video Streaming', 'Streaming Apps', 'Anime Streaming Apps',
    'Specialty Streaming', 'Anime Streaming', 'Cartoon Streaming', 'TV Streaming',
    'Drama Streaming', 'Download Sites', 'Specialty Downloading', 'Anime Downloading',
    'Torrent Apps', 'Stremio Tools', 'Torrent Sites', 'Anime Torrenting',
    'Download Subtitles',
  ],
  '/gaming': [
    'Download Games', 'Game Repacks', 'Abandonware / Retro',
    'Emulators', 'ROM Resources',
    'ROM Sites', 'Nintendo ROMs', 'Playstation ROMs',
  ],
  '/torrenting': [
    'Torrent Sites', 'Aggregators', 'Torrent Clients', 'qBittorrent Tools',
    'Remote Torrenting', 'Private Trackers', 'Helpful Sites / Apps',
  ],
  '/reading': [
    'Ebooks', 'PDF Search', 'Light Novels', 'Downloading', 'Streaming',
    'Comics', 'Manga',
  ],
  '/audio': [
    'DJ Mixes / Livesets', 'Audio Ripping Sites',
    'Download Sites', 'Genre Specific Ripping', 'Audio Torrenting',
  ],
  '/downloading': [
    'Software Sites', 'Download Directories', 'Download Sites', 'Search Sites',
    'Usenet', 'Indexers', 'Debrid / Leeches', 'IRC Tools',
  ],
  '/file-tools': [
    'Download Managers', 'Archiving / Compression', 'File Transfer', 'P2P Transfer',
    'File Hosts', 'MEGA Tools',
  ],
  '/internet-tools': [
    'Paywall Bypass', 'Redirect Bypass', 'Browser Extensions', 'Firefox Extensions',
    'Chrome Extensions', 'Userscripts', 'Down Site Checkers',
  ],
  '/privacy': [
    'VPN', 'VPN Server', 'VPN Tools', 'Proxy', 'Proxy Servers', 'Proxy Clients',
    'Anti Censorship', 'Proxy Sites',
  ],
  '/misc': [],
  '/storage': [
    'Free VPN Configs', 'Free DNS Resolvers', 'LibGen Mirrors', 'Proxy Lists',
    'Searx Instances', 'Internet Archive Tools',
  ],
};

// Переопределение раздела для отдельных заголовков
const SECTION_BY_HEADING = {
  'File Hosts': 'misc',
  'LibGen Mirrors': 'books',
  'Free VPN Configs': 'privacy',
  'Proxy Lists': 'privacy',
  'Free DNS Resolvers': 'privacy',
};

// Заголовки, которые полезны пиратам всегда (клиенты, архиваторы, VPN, файлообменники)
const ESSENTIAL_HEADINGS = new Set([
  'Torrent Sites', 'Aggregators', 'Torrent Clients', 'qBittorrent Tools',
  'Remote Torrenting', 'Private Trackers',
  'Archiving / Compression', 'Download Managers', 'File Hosts', 'MEGA Tools',
  'File Transfer', 'P2P Transfer',
  'VPN', 'VPN Server', 'VPN Tools', 'Proxy', 'Proxy Servers', 'Proxy Clients',
  'Anti Censorship', 'Proxy Sites', 'Free VPN Configs', 'Proxy Lists',
  'Debrid / Leeches', 'Software Sites', 'IRC Tools',
  'Ebooks', 'Audio Ripping Sites', 'Download Sites', 'Anime Streaming',
]);

// Заголовки с бесполезными/документными заголовками
const JUNK_NAMES = /^(mirrors?|tools?|apps?|api|docs?|guide|extended|mods?|graph|gui|demo|script|program|application|index|indexes|torrent|torrents|search|download|downloads|website|site|list|lists|more|main|home|wiki|help|info|about|official|official site|homepage|entry|news|blog|forum|community|discord|telegram|channel|channels)$/i;

// Заголовки, которые переопределяют раздел (аниме).
const ANIME_HEADINGS = new Set([
  'Anime Streaming Apps', 'Anime Streaming', 'Anime Downloading', 'Anime Torrenting',
  'Anime Tracking / Databases',
]);

// Заголовки, где нужна покомпонентная фильтрация (по тексту пункта).
const ITEM_FILTER = {
  'Browser Extensions': /ad ?block|adblock|ublock|adguard|privacy|vpn|proxy|paywall|bypass|unblock|anti-?censor|debrid|warp|cookie|tracker|fingerprint|dns/i,
  'Firefox Extensions': /ad ?block|adblock|ublock|adguard|privacy|vpn|proxy|paywall|bypass|unblock|anti-?censor|debrid|cookie|tracker/i,
  'Chrome Extensions': /ad ?block|adblock|ublock|adguard|privacy|vpn|proxy|paywall|bypass|unblock|anti-?censor|debrid|cookie|tracker/i,
  'Userscripts': /ad ?block|adblock|ublock|adguard|privacy|vpn|proxy|paywall|bypass|unblock|anti-?censor|debrid|cookie/i,
  'Specialty Streaming': /anime|manga|comic|retro|classic|old|korean|indian|tamil|telugu|malayalam|hindi/i,
  'Anime Streaming': /anime|manga/i,
  'Specialty Downloading': /anime|manga|comic|retro|classic|old|movie|film|game|music|book/i,
  'Providers': /usenet|newsgroup|nzb|indexer|provider/i,
  'Providers (Free)': /usenet|newsgroup|nzb|indexer|provider/i,
};

/* ---------------------------------------------------------- domain filters */

const DROP_DOMAINS = [
  // open source / репозитории / код
  'github.com', 'githubusercontent.com', 'raw.githubusercontent.com', 'gist.github.com',
  'sourceforge.net', 'sourceforge.com', 'fosshub.com', 'gitlab.com', 'bitbucket.org',
  'codeberg.org', 'gitee.com', 'gitcode.com', 'kernel.org', 'gnu.org', 'fsf.org',
  'github.io', 'gitlab.io', 'readthedocs.io', 'vercel.app', 'netlify.app',
  'pages.dev', 'workers.dev', 'f-droid.org', 'sourceforge.io', 'gitea.com',
  'gitweb.de', 'git.sr.ht', 'tildegit.org', 'sr.ht', 'launchpad.net',
  'apache.org', 'mozilla.org', 'developer.mozilla.org', 'npmjs.com', 'pypi.org',
  'crates.io', 'packagist.org', 'rubygems.org', 'nuget.org', 'docker.com', 'docker.io',
  'hub.docker.com', 'launchpad.net', 'code.google.com', 'googlecode.com',
  // софт/дистрибутивы/дев-тулы
  'apps.apple.com', 'play.google.com', 'microsoft.com', 'microsoftonline.com', 'windows.com',
  'apple.com', 'adobe.com', 'oracle.com', 'ibm.com', 'redhat.com', 'canonical.com',
  'ubuntu.com', 'debian.org', 'fedora.org', 'archlinux.org', 'linuxmint.com',
  'opendistro.org', 'elastic.co', 'suse.com', 'linuxfoundation.org',
  'vscode.dev', 'code.visualstudio.com', 'visualstudio.com', 'jetbrains.com',
  'intellij.com', 'pycharm.com', 'eclipse.org', 'netbeans.org', 'sublimetext.com',
  'figma.com', 'canva.com', 'vercel.com', 'netlify.app', 'netlify.com',
  'heroku.com', 'render.com', 'cloudflare.com', 'workers.dev', 'pages.dev',
  'notion.so', 'trello.com', 'atlassian.com', 'slack.com', 'discord.com',
  'wikipedia.org', 'wikimedia.org', 'wikihow.com', 'imdb.com', 'themoviedb.org',
  'tvdb.com', 'trakt.tv', 'letterboxd.com', 'myanimelist.net', 'anilist.co',
  'mangadex.org', 'mangaplus.shueisha.co.jp', 'crunchyroll.com', 'hidive.co',
  'dazn.com', 'mubi.com', 'shudder.com', 'plex.tv', 'spotify.com', 'bandcamp.com',
  'deezer.com', 'tidal.com', 'soundcloud.com', 'mixcloud.com', 'audible.com',
  'patreon.com', 'kofi.com', 'buymeacoffee.com', 'boosty.to', 'gumroad.com',
  'itch.io', 'unity.com', 'godotengine.org', 'blender.org', 'gimp.org',
  'audacityteam.org', 'lmms.io', 'obsproject.com', 'blackmagicdesign.com',
  'epicgames.com', 'gog.com', 'itch.io', 'steamcommunity.com', 'steampowered.com',
  'leagueoflegends.com', 'ea.com', 'ubisoft.com', 'playstation.com',
  'xbox.com', 'nintendo.com', 'atari.com', 'minecraft.net', 'roblox.com',
  'legal', 'yle.fi', 'example.com', 'sentry.io', 'blogspot.com', 'wordpress.com',
  'blogger.com', 'tumblr.com', 'medium.com', 'dev.to', 'hashnode.dev', 'substack.com',
  'facebook.com', 'instagram.com', 'twitter.com', 'x.com', 'tiktok.com',
  'linkedin.com', 't.me', 'telegram.me', 'vk.com', 'ok.ru', 'youtube.com',
  'youtu.be', 'google.com', 'goo.gl', 'bing.com', 'duckduckgo.com', 'baidu.com',
  'yandex.com', 'yandex.ru', 'mail.ru', 'rambler.ru', 'gmail.com', 'outlook.com',
  'proton.me', 'protonmail.com', 'icloud.com', 'mega.nz', 'mega.co.nz',
  'dropbox.com', 'onedrive.com', 'box.com', 'wetransfer.com', 'we.tl',
  'discord.gg', 'paypal.com', 'stripe.com', 'wise.com', 'ebay.com', 'aliexpress.ru',
  'aliexpress.com', 'amazon.com', 'avito.ru', 'ozon.ru', 'wildberries.ru',
  'flaticon.com', 'freepik.com', 'unsplash.com', 'pexels.com', 'pixabay.com',
  'fontawesome.com', 'shutterstock.com', 'istockphoto.com', 'adobe.com',
  'fandom.com', 'wikia.com', 'steamcommunity.com', 'discordapp.com',
  'mastodon.social', 'bsky.app', 'linkedin.com', 'qwant.com', 'ecosia.org',
  'startpage.com', 'mojeek.com', 'searx.be', 'searxng.site', '4get.ca',
  'wikipedia.org', 'archive.org', 'web.archive.org', 'annas-archive.org',
];

// Домены, которые обязаны быть (исключения к правилам выше).
const FORCE_KEEP = new Set([
  'annas-archive.org', 'annas-archive.se', 'libgen.is', 'libgen.rs', 'libgen.li',
  'z-lib.org', 'zlibgen.is', 'annas-archive.li',
]);

/* ----------------------------------------------------------- сбор данных */

const UA_RE = /^https?:\/\//i;

function isExternal(href) {
  return UA_RE.test(href);
}

function decodeEntities(s) {
  return String(s)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

function cleanText(s) {
  return decodeEntities(s)
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function parseDom(html) {
  const root = { tag: '#root', attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<(\/?)([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*?)(\/?)>/g;
  let last = 0, m;
  const pushText = (t) => {
    if (!t) return;
    stack[stack.length - 1].children.push({ text: t });
  };
  while ((m = re.exec(html))) {
    if (m.index > last) pushText(html.slice(last, m.index));
    last = re.lastIndex;
    if (m[0].startsWith('<!')) continue;
    const closing = m[1] === '/';
    const tag = m[2].toLowerCase();
    const selfClose = m[4] === '/';
    if (closing) {
      for (let i = stack.length - 1; i > 0; i--) {
        if (stack[i].tag === tag) { stack.length = i; break; }
      }
      continue;
    }
    const attrs = {};
    const attrRe = /([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+)))?/g;
    let a;
    while ((a = attrRe.exec(m[3] || ''))) attrs[a[1].toLowerCase()] = decodeEntities(a[2] ?? a[3] ?? a[4] ?? '');
    const node = { tag, attrs, children: [] };
    stack[stack.length - 1].children.push(node);
    if (!VOID.has(tag) && !selfClose) stack.push(node);
  }
  if (last < html.length) pushText(html.slice(last));
  return root;
}

function textOf(node) {
  if (node.text !== undefined) return node.text;
  let s = '';
  for (const c of node.children || []) s += c.text !== undefined ? c.text : textOf(c);
  return s;
}

function walk(node, out = []) {
  for (const c of node.children || []) {
    if (c.text === undefined) { out.push(c); walk(c, out); }
  }
  return out;
}

function mainContent(root) {
  const nodes = walk(root);
  const doc = nodes.find((n) => (n.attrs.class || '').split(/\s+/).includes('vp-doc'));
  return doc || root;
}

// Текст и ссылки в порядке документа (для извлечения описаний после ссылок)
function collectSeq(node, out) {
  for (const c of node.children || []) {
    if (c.text !== undefined) {
      const t = cleanText(c.text);
      if (t) out.push({ type: 'text', value: t });
      continue;
    }
    if (c.tag === 'a') {
      out.push({ type: 'a', node: c });
      continue;
    }
    collectSeq(c, out);
  }
}

async function getHtml(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': UA,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.text();
}

/* ------------------------------------------------------ перевод описаний */

// Словарь англо-русских терминов, встречающихся в описаниях FMHY.
const GLOSSARY = [
  [/\bTorrent(?:ing| Sites?| Clients?| Apps?| Index(es)?| Trackers?)?\b/gi, 'торрент'],
  [/\bTrackers?\b/gi, 'трекер'],
  [/\bIndexers?\b/gi, 'индекс'],
  [/\bAggregators?\b/gi, 'агрегатор'],
  [/\bMovies?\b/gi, 'фильмы'],
  [/\bTV Shows?\b|\bShows?\b/gi, 'сериалы'],
  [/\bAnime\b/gi, 'аниме'],
  [/\bManga\b/gi, 'манга'],
  [/\bComics?\b/gi, 'комиксы'],
  [/\bBooks?\b/gi, 'книги'],
  [/\bE-?books?\b/gi, 'электронные книги'],
  [/\bNovels?\b/gi, 'новеллы'],
  [/\bLight Novels?\b/gi, 'лайт-новеллы'],
  [/\bAudiobooks?\b/gi, 'аудиокниги'],
  [/\bPodcasts?\b/gi, 'подкасты'],
  [/\bMusic\b/gi, 'музыка'],
  [/\bSongs?\b/gi, 'треки'],
  [/\bAlbums?\b/gi, 'альбомы'],
  [/\bSoundtracks?\b/gi, 'саундтреки'],
  [/\bMovies\b/gi, 'фильмы'],
  [/\bGames?\b/gi, 'игры'],
  [/\bGaming\b/gi, 'игры'],
  [/\bROMs?\b/gi, 'ROM'],
  [/\bEmulators?\b/gi, 'эмуляторы'],
  [/\bAbandonware\b/gi, 'абандонware'],
  [/\bStreaming\b|\bStream\b/gi, 'стриминг'],
  [/\bStreamers?\b/gi, 'стримеры'],
  [/\bDownload(?:s|ing|ed)?\b/gi, 'скачивание'],
  [/\bDirect(?:ly)?\b/gi, 'прямые ссылки'],
  [/\bFree\b/gi, 'бесплатно'],
  [/\bRequires? Sign-?Up\b/gi, 'нужна регистрация'],
  [/\bSign-?Up\b|\bRegistration\b/gi, 'регистрация'],
  [/\bNo Sign-?Up\b/gi, 'без регистрации'],
  [/\bVPN\b/gi, 'VPN'],
  [/\bProxy\b/gi, 'прокси'],
  [/\bServers?\b/gi, 'серверы'],
  [/\bConfigs?\b/gi, 'конфиги'],
  [/\bCensorship\b/gi, 'обход блокировок'],
  [/\bAnti-?Censorship\b/gi, 'обход блокировок'],
  [/\bPaywall(?: Bypass)?\b/gi, 'обход платных стен'],
  [/\bAdblock(?:ing|er)?\b|\bAd ?Block(?:er|ing)?\b/gi, 'блокировка рекламы'],
  [/\bPrivacy\b/gi, 'приватность'],
  [/\bAnonymity\b/gi, 'анонимность'],
  [/\bUsenet\b/gi, 'usenet'],
  [/\bNZB\b/gi, 'nzb'],
  [/\bDebrid\b|\bLeech(?:ing)?\b/gi, 'дебрид'],
  [/\bDownloads? Hosting\b/gi, 'файлообменник'],
  [/\bFile Hosts?\b/gi, 'файлообменник'],
  [/\bHosting\b/gi, 'хостинг'],
  [/\bP2P\b/gi, 'P2P'],
  [/\bSubtitles?\b/gi, 'субтитры'],
  [/\bSubbing\b/gi, 'субтитры'],
  [/\bDubbing\b/gi, 'озвучка'],
  [/\bDual-?Audio\b/gi, 'двуязычная озвучка'],
  [/\b4K\b|\b1080p\b|\b720p\b|\bHD\b/gi, 'HD'],
  [/\bAuto-?Next\b/gi, 'автопереход'],
  [/\bMulti-?Server\b/gi, 'мульти-сервер'],
  [/\bDedicated\b/gi, 'выделенный сервер'],
  [/\bApplication\b/gi, 'приложение'],
  [/\bApps?\b/gi, 'приложения'],
  [/\bWindows\b/gi, 'Windows'],
  [/\bmacOS\b|\bMac\b/gi, 'macOS'],
  [/\bLinux\b/gi, 'Linux'],
  [/\bAndroid\b/gi, 'Android'],
  [/\biOS\b|\bIPhone\b|\biPhone\b/gi, 'iOS'],
  [/\bBrowser\b/gi, 'браузер'],
  [/\bExtensions?\b/gi, 'расширения'],
  [/\bUserscripts?\b/gi, 'юзерскрипты'],
  [/\bArchiv(?:ing|ers?)\b|\bCompression\b/gi, 'архиваторы'],
  [/\bManagers?\b/gi, 'менеджеры'],
  [/\bBackup\b/gi, 'резервные копии'],
  [/\bMetadata\b/gi, 'метаданные'],
  [/\bSearch\b/gi, 'поиск'],
  [/\bIndex(?:es)?\b/gi, 'индексы'],
  [/\bArchives?\b/gi, 'архивы'],
  [/\bPublic Domain\b/gi, 'общественное достояние'],
  [/\bRemoved\b/gi, 'удалённые'],
  [/\bBanned\b/gi, 'заблокированные'],
  [/\bTracks?\b/gi, 'треки'],
  [/\bMultitrack\b/gi, 'мультитрек'],
  [/\bTelemetry\b/gi, 'телеметрия'],
  [/\bMod(?:ded)?\b/gi, 'модded'],
  [/\bRipping\b/gi, 'рип'],
  [/\bRip\b/gi, 'рип'],
  [/\bRepacks?\b/gi, 'репаки'],
  [/\bReleases?\b/gi, 'релизы'],
  [/\bVOD\b/gi, 'VOD'],
  [/\bLive TV\b/gi, 'Live TV'],
  [/\bSports?\b/gi, 'спорт'],
  [/\bDocumentar(?:y|ies)\b/gi, 'документалистика'],
  [/\bNews\b/gi, 'новости'],
  [/\bLeaked?\b/gi, 'утечки'],
  [/\bPrivate Trackers?\b/gi, 'приватные трекеры'],
  [/\bInvite\b/gi, 'инвайт'],
  [/\bTorrent Client\b/gi, 'торрент-клиент'],
];

// Готовые русские описания для известных сайтов.
const OVERRIDES = {
  'rutracker.org': 'Русский трекер с огромной базой раздач: фильмы, сериалы, игры, музыка, софт',
  'rutracker.net': 'Зеркало RuTracker на случай блокировки основного домена',
  '1337x.to': 'Торрент-индекс с раздачами фильмов, сериалов, музыки и игр',
  'kinozal.tv': 'Русский трекер с большой базой кинораздач и релизов',
  'nnm-club.me': 'Русский трекер с актуальными раздачами игр, кино и сериалов',
  'rutracker.org/forum': 'Форум RuTracker с обсуждениями и списками раздач',
  'libgen.is': 'Крупнейшая библиотека электронных книг, статей и журналов',
  'libgen.rs': 'Зеркало LibGen с каталогом книг и научных статей',
  'annas-archive.org': 'Крупнейший поисковик по электронным книгам и статьям',
  'z-lib.org': 'Библиотека электронных книг, учебников и аудиокниг',
  'zlibgen.is': 'Зеркало Z-Library с электронными книгами и статьями',
  'onlinelibrary.io': 'Онлайн-библиотека с книгами и аудиокнигами',
  'libgen.li': 'Зеркало LibGen для доступа к библиотеке книг',
  'myanimelist.net': 'База аниме и манги с оценками, расписанием и ссылками на раздачи',
  'anilist.co': 'База аниме и манги с трекингом просмотренного и ссылками на торренты',
  'anilist.co': 'База аниме и манги с трекингом просмотренного и ссылками на торренты',
  'steamcommunity.com': 'Магазин с дешёвыми ключами игр и раздачами от сообщества',
  'fitgirl-repacks.site': 'Репаки игр от FitGirl с обходом проверки файлов',
  'repack.me': 'Каталог репаков игр с актуальными версиями',
  'dodi-repacks.site': 'Репаки игр с Dodi: чистые установщики без проверки файлов',
  'steamrip.com': 'Каталог пиратских релизов игр со SteamRip',
  'elamigos.net': 'Пиратские релизы игр по предзаказу с обходом DRM',
  'gog-games.com': 'Пиратские релизы игр с платформы GOG',
  'crackgames3d.com': 'Архив пиратских игр и репаков с кряками',
  'skidrowrepack.com': 'Репаки игр со Skidrow, crack и полные версии',
  'x-boxgamestrap.com': 'Пиратные игры для Xbox: репаки и беты',
  'yuzu-emu.org': 'Эмулятор Nintendo Switch для запуска пиратских игр',
  'ryujinx.org': 'Эмулятор Nintendo Switch с поддержкой игр и обновлений',
  'rpcs3.net': 'Эмулятор PlayStation 3 для запуска игр с дисков',
  'pcsx2.net': 'Эмулятор PlayStation 2 для запуска пиратских игр',
  'ppsspp.org': 'Эмулятор PSP для запуска пиратских игр и демо',
  'dolphin-emu.org': 'Эмулятор GameCube и Wii для запуска игр с дисков',
  'retroarch.com': 'Фронтенд-эмулятор с множеством ядер для ретро-консолей',
  'myrient.erista.me': 'Файлообменник с ROM-играми и коллекциями для эмуляторов',
  'vimmstv.com': 'Эмулятор с большой библиотекой ROM для ретро-консолей',
  'romhacking.net': 'Хабы и утилиты для моддинга классических игр',
  'romm.app': 'Веб-эмулятор с каталогом ROM-игр прямо в браузере',
  'emulatorjs.com': 'Эмуляторы прямо в браузере: играйте в консольные игры без установки',
  'proton.me': 'VPN и менеджер приложений для обхода блокировок и региона',
  'protonvpn.com': 'VPN-сервис для обхода блокировок и доступа к заблокированным сайтам',
  'windscribe.com': 'VPN с бесплатным тарифом и обходом блокировок',
  'nordvpn.com': 'VPN-сервис для обхода блокировок и смены IP-адреса',
  'mullvad.net': 'Анонимный VPN с оплатой криптой и без логов',
  'expressvpn.com': 'VPN для обхода блокировок и доступа к заблокированным сайтам',
  'surfshark.com': 'VPN-сервис с обходом блокировок и защитой приватности',
  'psiphon.com': 'Бесплатный инструмент обхода блокировок и цензуры',
  'lantern.io': 'Приложение для обхода блокировок в странах с цензурой',
  'goodbye-dpi.ru': 'Утилита обхода DPI-заглушек для доступа к заблокированным сайтам',
  ' Goodbye-dpi.ru': 'Утилита обхода DPI-заглушек для доступа к заблокированным сайтам',
  'youtube.com': 'Крупнейший видеосервис с пользовательским контентом',
  'rutracker.org': 'Русский трекер с огромной базой раздач: фильмы, сериалы, игры, музыка, софт',
  'nyaa.si': 'Торрент-индекс аниме с субтитрами и озвучкой',
  'nyaa.land': 'Зеркало Nyaa с аниме-раздачами и озвучкой',
  'e-hentai.org': 'Крупнейшая галерея хентай-манги и артов',
  'f95zone.com': 'Форум с раздачами игр, порно и модов без регистрации',
  'nograr.com': 'Форум с раздачами игр, репаков и переводов',
  'rutracker.org': 'Русский трекер с огромной базой раздач: фильмы, сериалы, игры, музыка, софт',
  'spdm.link': 'Файлообменник для крупных файлов с быстрыми ссылками',
  'pixeldrain.com': 'Файлообменник с большими лимитами и анонимной загрузкой',
  'gofile.io': 'Файлообменник с большими файлами и прямыми ссылками',
  'zippyshare.com': 'Файлообменник для крупных файлов и архивов',
  'mediafire.com': 'Файлообменник для хранения и скачивания крупных файлов',
  'mega.nz': 'Облачное хранилище с большими файлами и шифрованием',
  'jdownloader.org': 'Менеджер загрузок: загрузка с торрентов, HTTP и премиум-аккаунтов',
  'free-download-manager.com': 'Бесплатный менеджер загрузок с ускорением и возобновлением',
  'internetdownloadmanager.com': 'Менеджер загрузок IDM с ускорением и докачкой',
  '7-zip.org': 'Бесплатный архиватор для распаковки rar, zip, iso и других форматов',
  'rarlab.com': 'WinRAR: архиватор для работы с rar и zip архивами',
  'videolan.org': 'VLC: бесплатный медиаплеер для любых видео и потоков',
  'mpc-hc.org': 'MPC-HC: лёгкий медиаплеер с поддержкой кодеков и субтитров',
  'ublockorigin.com': 'uBlock Origin: расширение для блокировки рекламы и трекеров',
  'adguard.com': 'AdGuard: блокировка рекламы и трекеров в браузере и сети',
  'qbittorrent.org': 'qBittorrent: бесплатный торрент-клиент без рекламы',
  'transmissionbt.com': 'Transmission: простой торрент-клиент для всех платформ',
  'delugetracker.org': 'Deluge: лёгкий торрент-клиент с гибким планированием загрузок',
  'rutorrent.org': 'ruTorrent: веб-интерфейс для rTorrent в браузере',
  'medianet.to': 'MediaGet: торрент-клиент с поиском и загрузкой без рекламы',
  'piratebay.org': 'Один из старейших торрент-индексов с обширной базой раздач',
  'torrentgalaxy.to': 'Торрент-индекс с раздачами фильмов, игр и софта',
  'eztv.re': 'Торрент-индекс с раздачами сериалов и шоу',
  'rarbg.to': 'Торрент-индекс с большой базой раздач разных типов',
  'limetorrents.info': 'Торрент-индекс с раздачами фильмов и сериалов',
  'thepiratebay.org': 'Торрент-индекс с раздачами всего подряд',
  'rutracker.org': 'Русский трекер с огромной базой раздач: фильмы, сериалы, игры, музыка, софт',
  'magnet-dl.com': 'Магнет-ссылки и поиск по торрентам без рекламы',
  'archive.org': 'Интернет-архив с книгами, фильмами, музыкой и программами',
  'openload.co': 'Файлообменник с предпросмотром и ссылками на крупные файлы',
  's.to': 'Поисковая система по торрент-файлам без рекламы',
  'solidfiles.com': 'Файлообменник без лимитов и с быстрыми ссылками',
  'uploadhaven.com': 'Файлообменник с быстрым скачиванием и без ограничений',
  'krakenfiles.com': 'Файлообменник для крупных файлов и архивов',
  'bayfiles.com': 'Файлообменник с простыми ссылками на крупные файлы',
  'cyberdrop.me': 'Файлообменник с обходом блокировок и анонимной загрузкой',
  'gofile.me': 'Файлообменник с лимитами и ссылками на крупные файлы',
  '1fichier.com': 'Файлообменник с большими файлами и защитой ссылок',
  'mixdrop.com': 'Файлообменник для крупных файлов с быстрыми ссылками',
  'blupload.com': 'Файлообменник без ожидания и с прямыми ссылками',
  'filemaster.su': 'Файлообменник для крупных файлов без регистрации',
  'pcloud.com': 'Облачное хранилище с большими файлами и делением ссылок',
  'mega.io': 'Облачное хранилище с шифрованием и большими файлами',
  '4shared.com': 'Файлообменник для хранения и скачивания файлов',
  'seedr.cc': 'Трекер для приватной сессии с обменом музыкой и фильмами',
  'demonoid.is': 'Трекер приватных сессий с большой базой раздач',
  'academia.edu': 'Сайт с академическими статьями и PDF-документами',
  'sci-hub.se': 'Доступ к научным статьям и PDF по подписке Elsevier и Springer',
  'annas-archive.org': 'Крупнейший поисковик по электронным книгам и статьям',
  'hathitrust.org': 'Цифровая библиотека книг и периодики',
  'openlibrary.org': 'Открытая библиотека с каталогом книг и авторов',
  'stdlib.com': 'Библиотека классических книг и стандартов',
  'gutenberg.org': 'Библиотека бесплатных книг ПРОЕКТА Гутенберга',
  'manybooks.net': 'Большая подборка бесплатных книг в разных форматах',
  'royalbible.com': 'Коллекция бесплатных книг для скачивания',
  'polarisbooks.com': 'Библиотека бесплатных книг для чтения и скачивания',
  'epdf.pub': 'Поисковик по PDF-книгам с возможностью скачивания',
  'z-lib.fm': 'Зеркало Z-Library с каталогом книг и статей',
  '1lib.sk': 'Зеркало библиотеки книг с регистрацией',
  'vnlib.net': 'Зеркало Z-Library с книгами на нескольких языках',
  'b-ok.cc': 'Зеркало Z-Library для доступа к книгам',
  'b-ok.eu': 'Зеркало Z-Library для доступа к книгам',
  'ok.ru': 'Русский файлообменник с большими файлами и ссылками',
  'drive.google.com': 'Облачное хранилище Google с файлами и папками',
  'mediafire.com': 'Файлообменник для хранения и скачивания крупных файлов',
  'rutracker.org': 'Русский трекер с огромной базой раздач: фильмы, сериалы, игры, музыка, софт',
  'zoekt.pw': 'Торрент-индекс с раздачами игр и софта',
  'therarbg.to': 'Торрент-индекс с раздачами фильмов, сериалов и музыки',
  'bt4gprx.com': 'Зеркало BT4G с поиском по торрентам',
  'solidtorrents.to': 'Торрент-индекс с раздачами разных типов контента',
  'knaben.org': 'Быстрый поисковик по торрент-файлам без рекламы',
  'nyaa.si': 'Торрент-индекс аниме с субтитрами и озвучкой',
  'subsplease.org': 'Раздачи аниме-эпизодов с субтитрами на следующий день',
  'sakugabooru.com': 'Боoru с исходниками аниме-видео в высоком качестве',
  'e-hentai.org': 'Крупнейшая галерея хентай-манги и артов',
  'mangasee123.com': 'Чтение манги онлайн без регистрации',
  'mangairo.com': 'Манга-сайт с бесплатным чтением серий',
  'chapmanganato.com': 'Манга-сайт с большой коллекцией для чтения онлайн',
  'readmanga.today': 'Онлайн-чтение манги с каталогом тысяч тайтлов',
  'mangafox.info': 'Онлайн-чтение манги на разных языках',
  'rawdl.to': 'Файлообменник с фильмами, сериалами и играми',
  'sibsoft.net': 'Файлобменник с раздачами софта и книг',
  'uploaded.to': 'Файлообменник с крупными файлами и защищёнными ссылками',
  'rapidgator.net': 'Файлообменник с премиум-скоростью и большими файлами',
  'fileboom.com': 'Файлообменник с большими файлами и быстрыми ссылками',
  'ddownload.com': 'Файлообменник с премиум-аккаунтами и большими файлами',
  'turbofile.net': 'Файлообменник с быстрыми ссылками на крупные файлы',
  'filestore.io': 'Файлообменник для крупных файлов и архивов',
  'hitfile.net': 'Файлообменник с крупными файлами и очередью',
  'keep2share.com': 'Файлообменник с большими файлами и рекламой',
  'magnet.torrentbay.net': 'Магнет-ссылки поисковика по торрентам',
};

const CATEGORY_LABEL = {
  'movie-and-shows': 'онлайн-кино и сериалы',
  'anime': 'аниме',
  'games': 'игры',
  'torrenting': 'торренты',
  'books': 'книги',
  'music': 'музыка',
  'software': 'софт и инструменты',
  'privacy': 'VPN и обход блокировок',
  'misc': 'разное',
};

// Русская формулировка для каждого заголовка FMHY (ключ: страница :: заголовок)
const RU_PHRASE = {
  '/video :: Stream Aggregators': 'Агрегатор стриминговых ссылок на фильмы, сериалы и аниме',
  '/video :: P-Stream Forks': 'Форк пиратского стриминг-сервиса для онлайн-просмотра без рекламы',
  '/video :: Dedicated-Server': 'Пиратский стриминг с выделенным сервером и быстрым откликом',
  '/video :: Multi-Server': 'Пиратский стриминг с несколькими зеркалами на случай блокировки',
  '/video :: Video Streaming': 'Сайт для онлайн-просмотра фильмов в хорошем качестве',
  '/video :: TV Streaming': 'Сайт для онлайн-просмотра сериалов и шоу',
  '/video :: Drama Streaming': 'Сайт для просмотра дорам и сериалов онлайн',
  '/video :: Cartoon Streaming': 'Сайт для просмотра мультсериалов и анимации онлайн',
  '/video :: Specialty Streaming': 'Специализированный сайт онлайн-просмотра по жанрам',
  '/video :: Anime Streaming': 'Сайт для онлайн-просмотра аниме с озвучкой и субтитрами',
  '/video :: Anime Streaming Apps': 'Приложение для онлайн-просмотра аниме на телефоне и ПК',
  '/video :: Streaming Apps': 'Приложение для онлайн-просмотра фильмов и сериалов',
  '/video :: Anime Downloading': 'Сайт для скачивания аниме в разных форматах и озвучках',
  '/video :: Download Sites': 'Сайт для скачивания фильмов и сериалов в хорошем качестве',
  '/video :: Specialty Downloading': 'Сайт для скачивания фильмов по жанрам и странам',
  '/video :: Download Subtitles': 'Сайт для скачивания субтитров к фильмам и сериалам',
  '/video :: Torrent Apps': 'Приложения для торрентов, онлайн-просмотра и управления',
  '/video :: Stremio Tools': 'Дополнения и надстройки для медиаплеера Stremio',
  '/video :: Torrent Sites': 'Торрент-индекс с раздачами фильмов, сериалов и аниме',
  '/video :: Anime Torrenting': 'Торрент-раздачи аниме с озвучкой и субтитрами',

  '/gaming :: Download Games': 'Сайт для скачивания пиратских игр, репаков и DLC',
  '/gaming :: Game Repacks': 'Репаки игр с уже установленными файлами, без проверки',
  '/gaming :: Abandonware / Retro': 'Старые игры, abandonware и классические ретро-игры',
  '/gaming :: Emulators': 'Эмулятор консолей для запуска игр с дисков и картриджей',
  '/gaming :: ROM Resources': 'Ресурсы с ROM-играми, BIOS и утилитами для эмуляторов',
  '/gaming :: ROM Sites': 'Сайт с ROM-играми для эмуляторов консолей',
  '/gaming :: Nintendo ROMs': 'ROM-игры для консолей Nintendo: NES, SNES, N64, GameCube',
  '/gaming :: Playstation ROMs': 'ROM-игры для консолей PlayStation: PS1, PS2, PSP',

  '/torrenting :: Torrent Sites': 'Торрент-индекс с раздачами фильмов, игр и программ',
  '/torrenting :: Aggregators': 'Агрегатор ссылок на торрент-раздачи и magnet-ссылки',
  '/torrenting :: Torrent Clients': 'Торрент-клиент для загрузки и раздачи пиратного контента',
  '/torrenting :: qBittorrent Tools': 'Дополнения, плагины и темы оформления для qBittorrent',
  '/torrenting :: Remote Torrenting': 'Удалённое скачивание торрентов через облачный сервис',
  '/torrenting :: Private Trackers': 'Приватный трекер с эксклюзивными раздачами и аннонсами',
  '/torrenting :: Helpful Sites / Apps': 'Помощники для поиска, проверки и скачивания раздач',

  '/reading :: Ebooks': 'Библиотека электронных книг, статей и журналов',
  '/reading :: PDF Search': 'Поисковик по PDF-книгам, статьям и учебникам',
  '/reading :: Light Novels': 'Сайты с лайт-новеллами для чтения и скачивания',
  '/reading :: Downloading': 'Сайт для скачивания книг, журналов и файлов',
  '/reading :: Streaming': 'Сайт для чтения книг и манги прямо в браузере',
  '/reading :: Comics': 'Сайты с комиксами для чтения онлайн и скачивания',
  '/reading :: Manga': 'Сайты с мангой для чтения онлайн и скачивания',

  '/audio :: Audio Ripping Sites': 'Сайты для скачивания (риппа) музыки и альбомов',
  '/audio :: Download Sites': 'Сайт для скачивания музыки, альбомов и подкастов',
  '/audio :: DJ Mixes / Livesets': 'Миксы и лайв-сеты диджеев для скачивания музыки',
  '/audio :: Audio Torrenting': 'Торрент-раздачи музыки, альбомов и сборников',

  '/downloading :: Software Sites': 'Сайты с пиратским софтом, кряками и патчами',
  '/downloading :: Download Directories': 'Каталог файлов и раздач для скачивания без рекламы',
  '/downloading :: Download Sites': 'Сайт для скачивания файлов, программ и раздач',
  '/downloading :: Search Sites': 'Поисковик по файлам, программам и раздачам',
  '/downloading :: Usenet': 'Usenet-раздачи, ньюсгруппы и индексы статей',
  '/downloading :: Indexers': 'Индексы nzb-раздач с пиратным контентом',
  '/downloading :: Debrid / Leeches': 'Дебрид-сервисы и лечи для ускоренной загрузки',
  '/downloading :: IRC Tools': 'IRC-клиенты для scene-раздач и анонсов релизов',

  '/file-tools :: Archiving / Compression': 'Архиватор для распаковки rar, zip, iso и других форматов',
  '/file-tools :: Download Managers': 'Менеджер загрузок с докачкой, ускорением и очередью',
  '/file-tools :: File Transfer': 'Сервис для передачи крупных файлов и архивов',
  '/file-tools :: P2P Transfer': 'P2P-передача файлов напрямую между устройствами',
  '/file-tools :: File Hosts': 'Файлообменник для крупных файлов, архивов и раздач',
  '/file-tools :: MEGA Tools': 'Утилиты и клиенты для облачного хранилища MEGA',

  '/internet-tools :: Paywall Bypass': 'Инструменты и расширения для обхода платных стен',
  '/internet-tools :: Redirect Bypass': 'Обход редиректов и сокращателей ссылок на файлы',
  '/internet-tools :: Browser Extensions': 'Расширение браузера для блокировки рекламы и трекеров',
  '/internet-tools :: Firefox Extensions': 'Расширение Firefox для блокировки рекламы и обхода блокировок',
  '/internet-tools :: Chrome Extensions': 'Расширение Chrome для блокировки рекламы и обхода блокировок',
  '/internet-tools :: Userscripts': 'Юзерскрипт для браузера: обход блокировок и рекламы',
  '/internet-tools :: Down Site Checkers': 'Сервис проверки доступности сайтов и ссылок на контент',

  '/privacy :: VPN': 'VPN-сервис для обхода блокировок и смены IP-адреса',
  '/privacy :: VPN Server': 'Серверы и готовые конфиги VPN для обхода блокировок',
  '/privacy :: VPN Tools': 'Утилиты и клиенты для VPN, прокси и DNS-туннелей',
  '/privacy :: Proxy': 'Прокси-сервисы для обхода блокировок и доступа к сайтам',
  '/privacy :: Proxy Servers': 'Списки прокси-серверов для обхода блокировок',
  '/privacy :: Proxy Clients': 'Клиент для подключения к прокси, VPN и SOCKS',
  '/privacy :: Anti Censorship': 'Инструмент обхода блокировок и цензуры в интернете',
  '/privacy :: Proxy Sites': 'Веб-прокси для доступа к заблокированным сайтам',

  '/storage :: Free VPN Configs': 'Готовые конфиги VPN для обхода блокировок',
  '/storage :: Free DNS Resolvers': 'Публичные DNS-резолверы для обхода блокировок и ускорения',
  '/storage :: LibGen Mirrors': 'Зеркала библиотеки электронных книг LibGen',
  '/storage :: Proxy Lists': 'Списки прокси-серверов для обхода блокировок',
  '/storage :: Searx Instances': 'Публичные инстансы SearXNG для анонимного поиска',
  '/storage :: Internet Archive Tools': 'Инструменты для работы с интернет-архивом и оцифровкой',
};

// Запасные описания, если для заголовка нет формулировки
const FALLBACK_DESC = {
  'movie-and-shows': ['Сайт для онлайн-просмотра фильмов и сериалов бесплатно', 'Ресурс с фильмами и сериалами для просмотра в браузере'],
  'anime': ['Сайт для онлайн-просмотра аниме с озвучкой и субтитрами', 'Ресурс с аниме для просмотра онлайн'],
  'games': ['Сайт с играми и репаками для скачивания', 'Ресурс с играми и их версиями'],
  'torrenting': ['Сайт с торрент-раздачами и magnet-ссылками', 'Ресурс для поиска и скачивания раздач'],
  'books': ['Сайт с книгами и мангой для скачивания и чтения', 'Ресурс с книгами, статьями и файлами'],
  'music': ['Сайт для скачивания музыки и альбомов', 'Ресурс с музыкальными раздачами'],
  'software': ['Инструмент для работы с файлами и загрузками', 'Утилита для скачивания и обработки файлов'],
  'privacy': ['Инструмент для обхода блокировок и защиты приватности', 'Сервис для обхода блокировок и смены IP'],
  'misc': ['Сервис для обмена крупными файлами и раздачами', 'Ресурс для обмена файлами и архивами'],
};

// Дополнительные уточнения из текста описания FMHY
const QUALIFIERS = [
  [/Hard ?Sub/i, 'с вшитыми субтитрами'],
  [/\bSub\b/i, 'с субтитрами'],
  [/\bDub\b/i, 'с озвучкой'],
  [/Torrent/i, 'через торренты'],
  [/\bVOD\b/i, 'видеотека'],
  [/Auto-?Next/i, 'с автопереходом'],
  [/\b4K\b|\b1080p\b|\bHD\b/i, 'в HD-качестве'],
  [/Requires? Sign-?Up/i, 'требуется регистрация'],
  [/No Sign-?Up/i, 'без регистрации'],
  [/Direct/i, 'прямые ссылки'],
  [/Apps?\b/i, 'приложение'],
  [/Extensions?\b/i, 'расширение браузера'],
  [/Manga|Comics?/i, 'комиксы и манга'],
  [/Nov(?:el|els)/i, 'новеллы'],
  [/Books?/i, 'книги'],
  [/Music|Songs?|Albums?/i, 'музыка'],
  [/Movies?|Films?/i, 'фильмы'],
  [/Series|Shows?/i, 'сериалы'],
  [/Games?/i, 'игры'],
  [/Usenet|NZB/i, 'usenet-раздачи'],
  [/Tracker/i, 'трекер'],
  [/Scen(?:e)/i, 'scene-раздачи'],
  [/Pre-?Installed/i, 'уже установленные версии'],
];

function translateToRu(text) {
  let s = text;
  for (const [re, ru] of GLOSSARY) s = s.replace(re, ru);
  s = s.replace(/\s*\/+\s*/g, ' / ');
  s = s.replace(/\s*-\s*/g, ' — ');
  s = s.replace(/,\s*,\s*/g, ', ').replace(/\s+,/g, ',');
  s = s.replace(/\s{2,}/g, ' ').trim();
  s = s.replace(/^[\s,\-–—/]+/, '').replace(/[\s,\-–—/]+$/, '');
  return s;
}

function cleanName(name) {
  return cleanText(name)
    .replace(/[\u2705\u274c\u2b50\u2b50\ufe0f\u2714\u2716\u2757\u2753]/g, '')
    .replace(/\u{1F1E6}-\u{1F1FF}/gu, '')
    .replace(/^[\s\u{1F300}-\u{1FAFF}\u2600-\u27BF]+/u, '')
    .replace(/^[\s\W_]+/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function domainOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '').toLowerCase();
  } catch { return ''; }
}

function registrable(host) {
  const parts = host.split('.');
  if (parts.length <= 2) return host;
  const twoLevel = /^(co|com|net|org|gov|edu|ac|uk|ua|ru|de|pl|nl|se|no|fi|dk|cz|sk|hu|ro|bg|gr|pt|es|it|fr|br|in|jp|kr|tw|hk|cn|me|io|co|info|biz|xyz|site|online|pro|cc|tv|us|eu|ca|au|to|ly|gl|ws|am|im|fm|mobi|name|link|top|space|club|gift|icu|buzz|live|life|world|today|news|media|store|shop|blog|zone|rocks|run|dev|art|design|studio|team|works|agency|digital|cloud|tech|network|services|solutions|systems|safe|quest|fun|host|website|press|email|team|group|company|center|zone)\.[a-z]{2}$/i;
  const last2 = parts.slice(-2).join('.');
  if (twoLevel.test(last2)) return last2;
  return last2;
}

/* ------------------------------------------------------------- обработка */

function isDropDomain(domain) {
  if (FORCE_KEEP.has(domain)) return false;
  const reg = registrable(domain);
  if (FORCE_KEEP.has(reg)) return false;
  for (const d of DROP_DOMAINS) {
    if (domain === d || reg === d) return true;
  }
  return false;
}

const BAD_TEXT = /\b(open[- ]source|opensource|free and open|licen[cs]e|github|sourceforge|fosshub|documentation|docs\.|tutorial|course|learning|certification|degree|university|free tier|free plan)\b/i;

// предпочитаем короткие URL верхнего уровня (каноничный домен без путей)
function urlScore(url) {
  try {
    const u = new URL(url);
    return u.pathname.length + u.pathname.split('/').filter(Boolean).length * 10;
  } catch { return 999; }
}

function buildDesc(item, section, domain) {
  if (OVERRIDES[domain]) return OVERRIDES[domain];
  const phrase = RU_PHRASE[`${item.page} :: ${item.heading}`] || RU_PHRASE[item.heading];
  const quals = [];
  for (const [re, ru] of QUALIFIERS) {
    if (re.test(item.desc || '') && !quals.includes(ru)) quals.push(ru);
  }
  // убираем уточнения, уже отражённые в формулировке
  let kept = quals.filter((q) => {
    if (/субтитр/i.test(q) && /субтитр/i.test(phrase || '')) return false;
    if (/озвучк/i.test(q) && /озвучк/i.test(phrase || '')) return false;
    if (/\b(фильмы|сериалы|игры|книги|музыка)$/i.test(q) && new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(phrase || '')) return false;
    return true;
  });
  if (kept.some((q) => /вшитыми/i.test(q))) kept = kept.filter((q) => !/^с субтитрами$/i.test(q));
  let desc = phrase
    ? phrase + (quals.length ? ': ' + kept.slice(0, 3).join(', ') : '')
    : (FALLBACK_DESC[section] || FALLBACK_DESC.software)[0] + (quals.length ? ': ' + kept.slice(0, 3).join(', ') : '');
  if (desc.length < 40) {
    const alt = (FALLBACK_DESC[section] || FALLBACK_DESC.software);
    desc = desc + ' — ' + alt[1];
  }
  if (desc.length > 120) desc = desc.slice(0, 117).replace(/[\s,;:/—-]+$/, '') + '…';
  return desc;
}

async function main() {
  const raw = [];
  let pagesDone = 0;
  const failed = [];

  for (const p of PAGES) {
    try {
      const html = await getHtml(BASE + p.path);
      const dom = parseDom(html);
      const content = mainContent(dom);
      const nodes = walk(content);
      let heading = '';
      for (const node of nodes) {
        if (node.tag === 'h1' || node.tag === 'h2' || node.tag === 'h3') {
          const t = cleanText(textOf(node));
          if (t) heading = t;
          continue;
        }
        if (node.tag !== 'li') continue;
        const allowed = (KEEP[p.path] || []).includes(heading);
        if (!allowed) continue;
        // FMHY помечает рекомендованные (★) пункты; берём их и «всегда нужные» разделы
        const starred = walk(node).some((n) => /starred|twemoji-star|⭐/i.test((n.attrs.class || '') + ' ' + (n.attrs.title || '')));
        if (!starred && !ESSENTIAL_HEADINGS.has(heading)) continue;

        // последовательность текста и ссылок в порядке документа
        const seq = [];
        collectSeq(node, seq);
        const anchors = [];
        for (let i = 0; i < seq.length; i++) {
          const s = seq[i];
          if (s.type !== 'a') continue;
          const href = s.node.attrs.href || '';
          if (!isExternal(href)) continue;
          const name = cleanName(textOf(s.node));
          if (!name || /^\d+$/.test(name) || /^(or|и)$/i.test(name)) continue;
          if (JUNK_NAMES.test(name)) continue;
          // текст сразу после ссылки до следующей ссылки
          let tail = '';
          for (let j = i + 1; j < seq.length && seq[j].type !== 'a'; j++) tail += seq[j].value;
          anchors.push({ href, name, tail: cleanText(tail) });
        }
        if (!anchors.length) continue;

        const liText = cleanText(textOf(node));
        const filter = ITEM_FILTER[heading];
        for (const a of anchors) {
          const domain = domainOf(a.href);
          if (!domain) continue;
          if (isDropDomain(domain)) continue;
          let desc = a.tail.replace(/^[\s,;/–—-]+/, '').replace(/[\s,;/–—-]+$/, '').trim();
          if (!desc || /^(or|и|\d+)$/i.test(desc)) {
            desc = liText.replace(new RegExp(a.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), ' ');
            desc = cleanText(desc).replace(/^[\s,;/–—-]+/, '').trim();
          }
          if (filter && !filter.test(liText)) continue;
          if (BAD_TEXT.test(liText) && !/torrent|pirat|release|repack|movie|anime|comic|manga|novel|book/i.test(liText)) continue;
          const section = SECTION_BY_HEADING[heading]
            || (ANIME_HEADINGS.has(heading) ? 'anime' : p.section);
          raw.push({ name: a.name, url: a.href, domain, section, heading, desc, page: p.path });
        }
      }
      pagesDone++;
      console.log(`[ok] ${p.path} — собрано ${raw.filter(r => r.page === p.path).length}`);
    } catch (e) {
      failed.push(p.path);
      console.error(`[fail] ${p.path}: ${e.message}`);
    }
  }

  // дедуп по домену, названию и «бренду» (зеркала/варианты одного сайта)
  const byDomain = new Map();
  const byName = new Map();
  const byBrand = new Map();
  const STOP = new Set(['tv', 'plus', 'hd', 'free', 'pro', 'max', 'best', 'top', 'watch', 'new', 'app', 'apps', 'ru', 'com', 'net', 'io', 'site', 'online', 'live', '2', '3', '4', '5', '1', 'the', 'of', 'and']);
  const normName = (n) => n.toLowerCase().replace(/[^a-z0-9а-яё]+/gi, '');
  const brandKey = (n) => {
    const parts = n.toLowerCase().split(/[^a-z0-9а-яё]+/).filter(Boolean);
    const kept = parts.filter((p) => !STOP.has(p));
    return (kept.length ? kept : parts).join('');
  };
  const seen = (map, key, rec) => {
    if (!key) return false;
    if (map.has(key)) return true;
    map.set(key, rec);
    return false;
  };
  for (const r of raw) {
    const nk = normName(r.name);
    const bk = brandKey(r.name);
    const dupName = seen(byName, nk, r);
    const dupBrand = !dupName && seen(byBrand, bk, r);
    if (dupName || dupBrand) {
      const prev = dupName ? byName.get(nk) : byBrand.get(bk);
      const prevRec = byDomain.get(prev.domain);
      if (urlScore(r.url) < urlScore(prev.url)) {
        if (prevRec) {
          byDomain.delete(prev.domain);
          if (prevRec.desc && r.desc && prevRec.desc !== r.desc) prevRec.notes.push(prevRec.desc);
        }
        const rec = { ...r, notes: prevRec?.notes || [] };
        byDomain.set(r.domain, rec);
        byName.set(nk, rec);
        byBrand.set(bk, rec);
      } else if (prevRec && r.desc && !prevRec.notes.includes(r.desc) && prevRec.desc !== r.desc) {
        prevRec.notes.push(r.desc);
      }
      continue;
    }
    if (!byDomain.has(r.domain)) {
      const rec = { ...r, notes: [] };
      byDomain.set(r.domain, rec);
      continue;
    }
    const cur = byDomain.get(r.domain);
    if (r.desc && !cur.notes.includes(r.desc) && cur.desc !== r.desc) cur.notes.push(r.desc);
    if (cur.desc.length < 30 && r.desc.length > cur.desc.length) {
      cur.notes.push(cur.desc);
      cur.desc = r.desc;
    }
  }

  const items = [...byDomain.values()].map((r) => {
    const notes = (r.notes || []).filter((n) => n && n !== r.desc).slice(0, 8);
    return {
      name: r.name,
      url: r.url,
      section: r.section,
      desc: buildDesc(r, r.section, r.domain),
      notes,
    };
  });

  items.sort((a, b) => a.section.localeCompare(b.section) || a.name.localeCompare(b.name));

  const out = { source: 'fmhy.net', items };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf8');

  const sections = {};
  for (const it of items) sections[it.section] = (sections[it.section] || 0) + 1;
  if (process.argv.includes('--stats')) {
    const byHeading = {};
    for (const r of raw) byHeading[`${r.page} | ${r.heading}`] = (byHeading[`${r.page} | ${r.heading}`] || 0) + 1;
    for (const k of Object.keys(byHeading).sort()) console.log(`   ${byHeading[k]} — ${k}`);
  }
  console.log('');
  console.log(`Страниц обойдено: ${pagesDone}${failed.length ? ` (ошибок: ${failed.join(', ')})` : ''}`);
  console.log(`Ссылок собрано: ${raw.length}`);
  console.log(`Уникальных доменов: ${items.length}`);
  console.log('По разделам: ' + Object.entries(sections).map(([k, v]) => `${k}=${v}`).join(', '));
}

await main();
