/* Собирает пиратские ссылки из зеркал r/Piracy megathread и агрегаторов.
   Запуск: node scripts/reddit-fetch.mjs
   Результат: scripts/reddit-links.json */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_FILE = path.join(ROOT, 'scripts', 'reddit-links.json');

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36';
const TIMEOUT_MS = 30000;

/* ------------------------------------------------------------------ */
/* Источники                                                            */
/* ------------------------------------------------------------------ */

const GITHUB_MD = 'https://raw.githubusercontent.com';

const SOURCES = [
  // --- зеркала r/Piracy megathread ---
  {
    id: 'rpiracy-wiki',
    kind: 'md',
    url: 'https://gist.githubusercontent.com/teraflik/f718fd2611cb1eb589a3e5e6599290f6/raw',
    section: 'misc',
  },
  {
    id: 'omegathread',
    kind: 'md',
    url: `${GITHUB_MD}/dwongdev/THE-OMEGATHREAD/main/README.md`,
    section: 'misc',
  },
  {
    id: 'megathread-archive',
    kind: 'md',
    files: [
      'All Purpose.md',
      'Anime.md',
      'Books.md',
      'Emulators & ROMs.md',
      'Games.md',
      'Mobile.md',
      'Movies & TV.md',
      'Music.md',
      'Personal Favs.md',
      'Sports.md',
      'Tools.md',
    ],
    base: `${GITHUB_MD}/mysteriousbeanseller/megathread/main/`,
    section: 'misc',
  },
  {
    id: 'piracy-megathread',
    kind: 'md',
    url: `${GITHUB_MD}/Alacer55555/PIRACY-MEGATHREAD/main/README.md`,
    section: 'misc',
  },
  {
    id: 'reddit-piracy-megathread',
    kind: 'md',
    files: [
      'readme.md',
      'data/copykindle.md',
      'data/findingtextbooks.md',
      'data/renttextbooks.md',
      'data/dedrming.md',
      'data/tools.md',
    ],
    base: `${GITHUB_MD}/magicoflolis/Reddit-Piracy-Megathread/master/`,
    section: 'books',
  },
  {
    id: 'megathread-pirata',
    kind: 'md',
    files: [
      'docs/trackers.md',
      'docs/filmes-tv.md',
      'docs/otaku.md',
      'docs/jogos.md',
      'docs/livros.md',
      'docs/musica.md',
      'docs/emuladores-roms.md',
      'docs/ferramentas.md',
      'docs/warez.md',
      'docs/sites-geral.md',
      'docs/mobile.md',
    ],
    base: `${GITHUB_MD}/piratarialink/megathread_pirata/main/`,
    section: 'misc',
  },

  // --- крупные списки пиратских ресурсов ---
  {
    id: 'awesome-piracy',
    kind: 'md',
    url: `${GITHUB_MD}/Igglybuff/awesome-piracy/master/readme.md`,
    section: 'misc',
  },
  {
    id: 'lucetia-piracy',
    kind: 'md',
    url: `${GITHUB_MD}/Lucetia/piracy/master/docs/README.md`,
    section: 'misc',
  },
  {
    id: 'german-piracy',
    kind: 'md',
    files: [
      'Pages/Movies.md',
      'Pages/Movies_English.md',
      'Pages/Movies_Other.md',
      'Pages/Series.md',
      'Pages/Series_English.md',
      'Pages/Series_Other.md',
      'Pages/Anime.md',
      'Pages/MangaAnime.md',
      'Pages/Games.md',
      'Pages/Music.md',
      'Pages/AudioBooks.md',
      'Pages/eBooks.md',
      'Pages/ScienceLibaries.md',
      'Pages/Torrents.md',
      'Pages/Warez.md',
      'Pages/UsenetForums.md',
      'Pages/UsenetSearchEngines.md',
      'Pages/SportStreams.md',
      'Pages/Mobile.md',
      'Pages/AndroidApps.md',
      'Pages/iOSApps.md',
      'Pages/Keygens.md',
      'Pages/Nfo.md',
      'Pages/Lists.md',
    ],
    base: `${GITHUB_MD}/SeppPenner/awesome-german-piracy/master/`,
    section: 'misc',
  },
  {
    id: 'nafanz',
    kind: 'md',
    url: `${GITHUB_MD}/nafanz/nafanz.github.io/master/README.md`,
    section: 'downloads',
  },

  // --- агрегаторы и вики (HTML) ---
  {
    id: 'everythingmoe',
    kind: 'everythingmoe',
    url: 'https://everythingmoe.com/',
    section: 'anime',
  },
  {
    id: 'champagne',
    kind: 'champagne',
    url: 'https://champagne.pages.dev/',
    pages: [
      'literature',
      'movies-shows-sports',
      'gaming',
      'music',
      'weebpedia',
      'mobile',
      'useful-tools',
      'piracy-guides',
      'software',
    ],
    section: 'misc',
  },
];

/* ------------------------------------------------------------------ */
/* Загрузка                                                             */
/* ------------------------------------------------------------------ */

async function fetchText(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        Accept: 'text/html,application/xhtml+xml,application/xml,text/markdown,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const text = await res.text();
    if (!text || text.length < 200) return null;
    if (/just a moment|enable javascript and cookies|attention required/i.test(text.slice(0, 4000))) return null;
    return text;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ */
/* Определение раздела по заголовку                                     */
/* ------------------------------------------------------------------ */

const SECTION_RULES = [
  ['torrents', /torrent|tracker|rutor|rutracker|trackers|dht|indexer|indexers|usenet|private trackers?|p2p|торрент|трекер/i],
  ['anime', /anime|manga|manhwa|otaku|donghua|animepak|raws?|aesex|tsumugi|waifu|질량|アニメ|マンガ|animac[a-zä-ÿ]|^otaku|luigi|anidl|aniwatch|anim[a-z]* ?site|anime streaming|animes /i],
  ['games', /games?|jogos|spiele|gaming|roms?|emulators?|emuladores|repack|repacks|Steam ?& ? ?Emulator|game ?(?:sites|clients)/i],
  ['books', /books?|ebooks?|e-?books?|livros|literatur|bücher|buecher|comics?|manga ?libs?|textbooks?|libgen|lib ?share|z-?library|goodreads|annas ?archive|audiobooks?|audio ?books?|hörbücher/i],
  ['music', /music|música|musica|musik|audio|music torrents?|spotify ?alternatives/i],
  ['bypass', /proxy|proxies|vpn|unblock|deblock|anti-?block|в обход|обход блокиров|adblock/i],
  ['streaming', /streaming|movies|films|filmes|filme|movie|cinema|series|tv ?shows?|watch online|watch free|web ?series|kino|кино|seznam ?movie|smolstreaming|on demand|torrent streaming/i],
  ['downloads', /download|ddl|direct download|fileshare|file ?share|file ?hosting|uploads?|warez ?sites?|upload /i],
  ['books', /magazine|magazines|журнал/i],
];

const SECTION_EXCLUDE = /vpn|privacy|security|adblock|extension|userscript|course|tutorial|education|learn|programming|develop|office|browser|email|mail ?client|translate|translator|ai |chatbot|chat ?gpt|news|weather|shopping|forum|discord|telegram|wiki ?how ?to|how to|guide ?to|setup|install|toolbox|crack ?watch|newsletter/i;

function sectionFor(heading, fallback) {
  if (heading && SECTION_EXCLUDE.test(heading) && !/proxy|vpn|torrent/i.test(heading)) {
    // Заголовки вроде "Torrent clients" всё же полезны — проверяем по правилам ниже.
  }
  for (const [section, re] of SECTION_RULES) {
    if (heading && re.test(heading)) return section;
  }
  return fallback;
}

/* ------------------------------------------------------------------ */
/* Разбор Markdown                                                      */
/* ------------------------------------------------------------------ */

const MD_LINK = /\[([^\]]*)\]\(\s*<?([^)>\s]+)>?(?:\s+"[^"]*")?\s*\)/g;

function cleanText(s) {
  return String(s || '')
    .replace(/https?:\/\/\S+/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`~]/g, '')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function isExternal(url) {
  return /^https?:\/\//i.test(url) && !url.includes(' ').length;
}

function parseMarkdown(text, source, fallbackSection) {
  const out = [];
  const lines = String(text).split(/\r?\n/);
  let heading = '';
  let inFence = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (/^```|^~~~/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || !line) continue;

    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      heading = cleanText(h[2]);
      continue;
    }

    // Строки оглавления и служебные — пропускаем.
    if (/^[-*+]\s*\[.*\]\(#/.test(line)) continue;

    const section = sectionFor(heading, fallbackSection);

    // Таблица: | Name | URL | Description |
    if (/^\|/.test(line)) {
      const cells = line.split('|').slice(1, -1).map((c) => c.trim());
      if (cells.length < 2) continue;
      const urlCell = cells.find((c) => /^<?https?:\/\//i.test(c));
      if (!urlCell) continue;
      const url = urlCell.replace(/[<>]/g, '').split(/\s+/)[0];
      const others = cells.filter((c) => c !== urlCell && c.replace(/[*_`]/g, '').trim());
      const name = cleanText(others[0] || '');
      const desc = cleanText(others.slice(1).join(' — '));
      out.push({ name, url, desc, section, source });
      continue;
    }

    // Обычные ссылки в строке.
    MD_LINK.lastIndex = 0;
    let match;
    const found = [];
    while ((match = MD_LINK.exec(line))) {
      found.push({ text: cleanText(match[1]), url: match[2].trim() });
    }
    if (!found.length) {
      const bare = line.match(/(?:^|[\s(])((?:https?:\/\/)[^\s<>()"']+)/);
      if (bare) {
        out.push({ name: '', url: bare[1].replace(/[.,;:]$/, ''), desc: cleanText(line.replace(bare[1], '')), section, source });
      }
      continue;
    }
    for (const f of found) {
      const rest = cleanText(line.split(f.url).join(' ').replace(MD_LINK, ' '));
      const name = f.text && f.text.length > 1 ? f.text : '';
      out.push({ name, url: f.url, desc: rest, section, source });
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Разбор HTML (everythingmoe / champagne)                              */
/* ------------------------------------------------------------------ */

function parseEverythingMoe(html, source) {
  const out = [];
  const sectionRe = /<div class="section-title"[^>]*>([\s\S]{0,400}?)<\/div>/g;
  const marks = [];
  let m;
  while ((m = sectionRe.exec(html))) {
    marks.push({ pos: m.index, title: cleanText(m[1]) });
  }
  const titleAt = (pos) => {
    let title = '';
    for (const mark of marks) {
      if (mark.pos <= pos) title = mark.title;
      else break;
    }
    return title;
  };

  const itemRe = /<div[^>]*class="section-item"[^>]*data-filter="([^"]*)"[^>]*>([\s\S]{0,900}?)<\/div>\s*<\/div>?/g;
  let item;
  while ((item = itemRe.exec(html))) {
    const block = item[2];
    const link = block.match(/data-link="([^"]+)"/) || block.match(/<a[^>]+href="(https?:\/\/[^"]+)"/);
    if (!link) continue;
    const text = cleanText(block);
    const title = titleAt(item.index);
    out.push({ name: text, url: link[1], desc: '', section: sectionFor(title, 'anime'), source });
  }
  return out;
}

function parseChampagne(html, source, fallbackSection) {
  const out = [];
  const anchorRe = /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([\s\S]{0,300}?)<\/a>/g;
  let m;
  while ((m = anchorRe.exec(html))) {
    const url = m[1];
    const name = cleanText(m[2]);
    if (!name || name.length > 120) continue;
    // Описание берём из текста ячейки таблицы вокруг ссылки.
    const tail = cleanText(html.slice(m.index + m[0].length, m.index + m[0].length + 300));
    const tailCell = tail.split('</td>')[0] || '';
    out.push({ name, url, desc: cleanText(tailCell).slice(0, 200), section: fallbackSection, source });
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Фильтры                                                              */
/* ------------------------------------------------------------------ */

const BLOCK_HOST = [
  'github.com', 'githubusercontent.com', 'gist.github.com', 'gitlab.com', 'bitbucket.org',
  'reddit.com', 'redd.it', 'twitter.com', 'x.com', 't.me', 'telegram.me', 'discord.gg',
  'discord.com', 'patreon.com', 'paypal.com', 'paypal.me', 'ko-fi.com', 'buymeacoffee.com',
  'steamcommunity.com', 'store.steampowered.com', 'steampowered.com', 'play.google.com',
  'apps.apple.com', 'itunes.apple.com', 'apple.com', 'microsoft.com', 'windowsupdate.com',
  'amazon.com', 'amazon.de', 'ebay.com', 'aliexpress.com', 'wikipedia.org', 'wikimedia.org',
  'wikidata.org', 'archive.org', 'web.archive.org', 'youtube.com', 'youtu.be', 'netflix.com',
  'spotify.com', 'soundcloud.com', 'bandcamp.com', 'applemusic', 'deezer.com', 'tidal.com',
  'twitch.tv', 'vimeo.com', 'dailymotion.com', 'facebook.com', 'instagram.com', 'linkedin.com',
  'google.com', 'bing.com', 'duckduckgo.com', 'yandex.ru', 'yandex.com', 'mail.ru', 'gmail.com',
  'outlook.com', 'protonmail.com', 'tutanota.com', 'mega.nz', 'mega.co.nz', 'mediafire.com',
  'dropbox.com', 'onedrive.com', 'drive.google.com', 'box.com', 'pcloud.com', 'zippyshare.com',
  'freepik.com', 'shutterstock.com', 'unsplash.com', 'pexels.com', 'pixabay.com', 'deviantart.com',
  'flickr.com', 'librelist.com', 'meta.com', 'quora.com', 'stackoverflow.com',
  'openstreetmap.org', 'speedtest.net', 'codepen.io', 'jsfiddle.net',
  'sourceforge.net', 'fosshub.org', 'sf.net', 'en.wikipedia.org', 'gitee.com',
  'npmjs.com', 'pypi.org', 'nuget.org', 'rubygems.org', 'crates.io', 'packagist.org',
  'hub.docker.com', 'docker.com', 'apache.org', 'mozilla.org', 'debian.org', 'ubuntu.com',
  'kernel.org', 'gnu.org', 'gimp.org', 'inkscape.org', 'blender.org', 'krita.org',
  'openoffice.org', 'libreoffice.org', 'onlyoffice.com', 'notion.so', 'obsidian.md',
  'trello.com', 'figma.com', 'canva.com', 'miro.com', 'airtable.com', 'hubspot.com',
  'salesforce.com', 'zendesk.com', 'intercom.com', 'atlassian.com', 'slack.com',
  'matrix.org', 'signal.org', 'whatsapp.com', 'skype.com', 'zoom.us', 'viber.com',
  'wechat.com', 'line.me', 'filebin.net', 'pixeldrain.com', 'wetransfer.com', 'sendspace.com',
  'terabox.com', 'cyberdrop.me', 'buzzheavier.com', 'krakenfiles.com', 'uploadhaven.com',
  'bigfile.io', '1fichier.com', 'mixdrop.co',
  // Легальные стриминги и free-софт.
  'tubi.com', 'tubitv.com', 'crackle.com', 'tvfplay.com', 'radarr.video', 'sonarr.video',
  'sickbeard.com', 'scriptslug.com', 'springfieldspringfield.co.uk', 'launchpad.net',
  'neocities.org', '4everland.io', 'plex.tv', 'jellyfin.org', 'kodi.tv', 'sabnzbd.org',
  'nzbget.com', 'qbittorrent.org', 'transmissionbt.com', 'deluge-torrent.org', 'rtorrent.org',
  'utorrent.com', 'vuze.com', 'handbrake.fr', 'obsproject.com', 'readthedocs.io',
  'disneyplus.com', 'hulu.com', 'hbomax.com', 'max.com', 'primevideo.com', 'peacocktv.com',
  'paramountplus.com', 'mubi.com', 'crunchyroll.com', 'hidive.co', 'funimation.com',
  'viki.com', 'iq.com', 'acorn.tv', 'britbox.com', 'nowtv.com', 'sky.com', 'stan.com',
  'cbc.ca', 'abc.net.au', 'bbc.co.uk', 'arte.tv', 'france.tv', 'rtbf.be', 'zdf.de',
  'swisscows.com', 'startpage.com', 'ecosia.org', 'search.brave.com', 'opera.com',
  'vivaldi.com', 'brave.com', 'torproject.org', 'tailscale.com', 'mullvad.net',
  'protonvpn.com', 'nordvpn.com', 'expressvpn.com', 'surfshark.com', 'privateinternetaccess.com',
  'pi-hole.net', 'getoutline.org', 'infradead.org', 'ericzhang.me', 'mendeley.com',
  'adguard-dns.io', 'adaway.org', 'adnauseam.io', 'blokada.org', 'controld.com',
  'ef.org', 'eff.org', 'openconnect', 'openvpn.net', 'peervpn.net', 'privacytools.io',
  'backblaze.com', 'rclone.org', 'syncthing.net', 'nextcloud.com', 'mega.io',
  'gutenberg.org', 'standardebooks.org', 'goodreads.com', 'storygraph.com', 'libbyapp.com',
  'overdrive.com', 'audible.com', 'scribd.com', 'issuu.com', 'slideshare.net',
  'chatgpt.com', 'openai.com', 'perplexity.ai', 'claude.ai', 'anthropic.com', 'gemini.google.com',
  'notion.so', 'obsidian.md', 'trayscale.com', 'deepl.com', 'google.com', 'translate.goog',
  'techradar.com', 'pcgamesn.com', 'pcgamer.com', 'ign.com', 'gamespot.com', 'kotaku.com',
  'eurogamer.net', 'polygon.com', 'rockpapershotgun.com', 'gamerant.com',
];

const BLOCK_KEYWORD = [
  /\bopen[- ]source\b/i, /\bfree and open\b/i, /\bfreemium\b/i, /\bfree software\b/i,
  /\bcourse(s)?\b/i, /\btutorial(s)?\b/i, /\blearn(ing)?\b/i, /\beducational?\b/i,
  /\bprogramming\b/i, /\bdeveloper\b/i, /\bdevelopment\b/i, /\bsdk\b/i, /\bapi\b/i,
  /\boffice suite\b/i, /\bword processor\b/i, /\bspreadsheet\b/i, /\bcalendar\b/i,
  /\bweb ?browser\b/i, /\bemail (client|service)\b/i, /\bmail client\b/i, /\bnewsletter\b/i,
  /\btranslat(e|or|ion)\b/i, /\bchatgpt\b/i, /\bopenai\b/i, /\bmachine learning\b/i,
  /\btext to image\b/i, /\bpassword manager\b/i, /\breference management\b/i,
  /\bhow to\b/i, /\binstall\b/i, /\bplayground\b/i, /\bdemo\b/i,
  /\bforums?\b/i, /\bdiscord server\b/i, /\btelegram (channel|group)\b/i,
  /\bantivirus\b/i, /\brecovery tool\b/i, /\bcleaner\b/i, /\boverclock\b/i,
  /\bwireless\b/i, /\brouter\b/i, /\bprint(er)?\b/i, /\bmonitoring\b/i,
  /\bfonts?\b/i, /\bicons?\b/i, /\bemoji\b/i, /\bsvg\b/i, /\bwallpapers?\b/i, /\bthemes?\b/i,
  /\bextensions?\b/i, /\buserscripts?\b/i, /\bplugins?\b/i, /\badd-?ons?\b/i,
  /\bchess\b/i, /\bweather\b/i, /\bshopping\b/i, /\bdeals?\b/i, /\bnews\b/i,
  /\bweb hosting\b/i, /\bdomain registrar\b/i, /\bserver provider\b/i,
  /\bbackups?\b/i, /\bnotes? app\b/i, /\btodo\b/i, /\bkanban\b/i,
  /\bequalizer\b/i, /\bmidi\b/i, /\bdr ?machines?\b/i, /\bsoundboard/i,
  /\bspectrum analyser?\b/i, /\banalyzer\b/i, /\bmixer\b/i, /\bmastering\b/i,
  /\bvst\b/i, /\bableton\b/i, /\bsample packs?\b/i, /\bloops?\b/i, /\blyrics\b/i,
  /\btracklist(s)?\b/i, /\bdj software\b/i, /\bguitar tab/i, /\btablature/i,
  /\bspotify\b/i, /\blast\.fm\b/i, /\bbandcamp\b/i, /\bsoundcloud\b/i, /\bdeezer\b/i,
  /\btidal\b/i, /\bamazon music\b/i, /\bapple music\b/i, /\bnapster\b/i, /\bbeatport\b/i,
  /\bpodcasts?\b/i, /\bdownload manager\b/i,
  /\bvideo converter\b/i, /\baudio converter\b/i, /\btagger\b/i, /\bripping\b/i,
  /\bocr\b/i, /\bepub (reader|editor)\b/i, /\bcomic reader\b/i,
  /\bmanga reader\b/i, /\bmanga viewer\b/i, /\bdesktop app\b/i,
  /\bfree trial\b/i, /\bpricing\b/i,
  /\bapp store\b/i, /\bplay store\b/i, /\bdownload the app\b/i, /\bget it on\b/i,
  /\bwiki\b/i, /\bsubmission guidelines\b/i, /\bfeedback\b/i, /\bsponsor\b/i,
  /\bdiscord\b/i, /\breddit\b/i, /\btelegram\b/i, /\bnewsletter\b/i, /\birc\b/i,
  /\bchangelog\b/i, /\bgithub\b/i, /\bcontribute\b/i, /\bdonate\b/i, /\bsupport us\b/i,
  /\bsubtitle (?:file|sync|editor)\b/i, /\bencoding\b/i, /\bscript (?:slug|download)\b/i,
];

const PIRACY_HINT = /torrent|tracker|magnet|warez|crack(ed|s)?\b|repack|ddl|direct download|pirat|seed|leech|usenet|nzb|ebook|audiobook|anime|manga|manhwa|film|movie|cinema|series\b|episode|season\b|streaming site|watch (free|online)|sports (stream|live)|album|discograph|lossless|flac|mp3|vinyl|music (torrent|pack|collection)|dj pool|live set|mix(es)?\b|download(ing|s)? (link|page)|file ?(host|shar|upload)|uploader|mega ?link|onlinedisk|upload ?service|bypass|unblock|debrid|proxy|onion|dark ?web|\.onion|mirror/i;

const MUSIC_PIRACY_HINT = /torrent|ddl|download|album|discograph|lossless|flac|mp3|vinyl|dj pool|live set|mix|warez|folder|collection/i;

const BYPASS_HINT = /proxy|proxysite|debrid|unblock|bypass|censorship|tor ?bridge|onion|mirror|socks|warp/i;

const FREE_SOFTWARE_NAME = /^(radarr|sonarr|lidarr|prowlarr|bazarr|jellyfin|plex|emby|kodi|sabnzbd|nzbget|qbittorrent|transmission|deluge|rtorrent|utorrent|vuze|handbrake|obs|nextcloud|syncthing|rclone|freebsd|openbsd|netbsd|arch linux|manjaro|elementary os|pop ?os|linux mint|ubuntu|debian|centos|red hat|fedora|opensuse|gentoo|slackware|mint|reactos|haiku|solus|alpine linux|void linux|kali linux|parrot os|qubes|whonix|tailscale|wireguard|openvpn|outline|pi-?hole|adguard|brave|vivaldi|firefox|chromium|libre ?office|open ?office|inkscape|gimp|blender|krita|darktable|shotcut|hand ?brake|transcode|vlc|mpv|foobar2000|audacity|obsidian|logseq|bitwarden|keepass|1password|bitwarden|nextcloud|filezilla|winscp|putty|mobaxterm|tailscale|zerotier|nordlayer|raspberry pi|arduino|esphome|home ?assistant|jellyfin media|calibre|kindle calibre)/i;

const MUST_KEEP_HOST = [
  'rutracker.org', 'nnmclub.to', '1337x.to', 'nyaa.si', 'rarbg.to', 'anidex.info',
  'annas-archive.org', 'libgen.is', 'libgen.li', 'libgen.rs', 'z-lib.org', 'zlibrary-global.se',
  'nzbgeek.info', 'demonoid.is', 'tokyotosho.info', 'yggtorrent.download', 'bt4a.prx0x0c0.de',
  'hianime.to', 'animelon.tv', '9anime.pl', 'watchanime.to', 'animespa.info', 'torbox.app',
  'real-debrid.com', 'alldebrid.com', 'privato.st', 'cyberdrop.me', 'gofile.io', 'anonfiles.com',
  '1fichier.com', 'krakenfiles.com', 'pixeldrain.com', 'mega.nz', 'rutracker.ru',
  'ziggurat.rip', 'piratebay.org', 'thepiratebay.org', 'yts.mx', 'rarbg.to', 'nzbclub.com',
  'e-hentai.org', 'nhentai.net', 'tsumugi.com', 'mangasee123.com', 'mangakatana.com',
];

const GENERIC_NAME = /^(api|mirror|accessed|for videos?|bind it to your client|source|url|link|website|site|home|index|main|page|official|download|downloads|free|video|videos|docs?|documentation|guide|guides|tutorial|tools?|toolbox|forum|community|blog|news|list|lists|index page|search|search engine|backup|config|settings|default|homepage|readme|changelog|credits?|contact|about|legal|privacy|terms|dmca|unknown|n\/a|none|example|test|demo|sample|blank|new|old|top|best|list|more|more info|read more|click here|here|link here|official site|source code|raw|view)$/i;

const ALLOW_HOST = [
  '1337x.to', 'rarbg.to', 'nyaa.si', 'anidex.info', 'rutracker.org', 'nnmclub.to',
];

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isBlockedHost(host) {
  if (!host) return true;
  return BLOCK_HOST.some((h) => host === h || host.endsWith('.' + h));
}

function nameLooksUseless(name) {
  if (!name) return true;
  if (GENERIC_NAME.test(name.trim())) return true;
  const words = name.trim().split(/\s+/);
  if (words.length >= 4) return true;
  if (/^(for|and|the|with|how|to|of|in|on|best|top|new)\b/i.test(name.trim()) && words.length >= 3) return true;
  if (name.length < 2) return true;
  return false;
}

function looksPiratical(entry) {
  const host = hostOf(entry.url);
  if (!host) return false;
  const hay = `${entry.name || ''} ${entry.desc || ''}`;

  if (BLOCK_KEYWORD.some((re) => re.test(hay))) return false;
  if (FREE_SOFTWARE_NAME.test((entry.name || '').trim())) return false;
  if (isBlockedHost(host)) return ALLOW_HOST.includes(host);
  // Названия хостов из технических зон — явный шум.
  if (/\.(github\.io|gitlab\.io|vercel\.app|netlify\.app|pages\.dev|workers\.dev|glitch\.me|repl\.co|herokuapp\.com|web\.app|firebaseapp\.com|blogspot\.|wordpress\.com|wixsite\.com|weebly\.com|carrd\.co|notion\.site|readthedocs\.io|surge\.sh|fly\.dev|onrender\.com|deno\.dev|neocities\.org|ipns\.4everland\.io)$/i.test(host)) {
    return false;
  }

  if (entry.section === 'misc' && !PIRACY_HINT.test(hay) && !PIRACY_HINT.test(host)) return false;
  if (entry.section === 'music' && !MUSIC_PIRACY_HINT.test(hay + ' ' + host)) return false;
  if (entry.section === 'bypass' && !BYPASS_HINT.test(hay + ' ' + host)) return false;
  if (entry.section === 'books' && !/book|ebook|lit|liter|novel|textbook|comic|manga|audiobook|чита|книг/i.test(hay + ' ' + host)) return false;

  return true;
}

/* ------------------------------------------------------------------ */
/* Перевод описаний                                                     */
/* ------------------------------------------------------------------ */

const PHRASES = [
  [/\bprivate trackers?\b/gi, 'приватный трекер'],
  [/\bpublic trackers?\b/gi, 'публичный трекер'],
  [/\btorrent sites?\b/gi, 'торрент-сайт'],
  [/\btorrents?\b/gi, 'торренты'],
  [/\bdirect downloads?\b/gi, 'прямая загрузка'],
  [/\bdownload links?\b/gi, 'ссылки на загрузку'],
  [/\bfree downloads?\b/gi, 'бесплатная загрузка'],
  [/\bwithout registration\b/gi, 'без регистрации'],
  [/\bno registration\b/gi, 'без регистрации'],
  [/\bstreaming sites?\b/gi, 'сайт для стриминга'],
  [/\bwatch (?:movies|films) (?:online|free)\b/gi, 'фильмы онлайн бесплатно'],
  [/\banime streaming\b/gi, 'стриминг аниме'],
  [/\bmanga readers?\b/gi, 'читалка манги'],
  [/\bread manga\b/gi, 'читать манга'],
  [/\bsubbed\b|\bdubbed\b/gi, 'субы и дабы'],
  [/\bsubtitles?\b/gi, 'субтитры'],
  [/\bfansub\b/gi, 'фансуб'],
  [/\bgames? (?:site|repack|downloads?)\b/gi, 'игровые раздачи'],
  [/\bgame ?repacks?\b/gi, 'репаки игр'],
  [/\bcracked\b/gi, 'взломанные версии'],
  [/\bkeygens?\b/gi, 'кейгены'],
  [/\bemulators?\b/gi, 'эмуляторы'],
  [/\broms?\b/gi, 'ромы'],
  [/\be-?books?\b/gi, 'электронные книги'],
  [/\baudiobooks?\b/gi, 'аудиокниги'],
  [/\blibrary\b/gi, 'библиотека'],
  [/\bmusic torrents?\b/gi, 'музыкальные раздачи'],
  [/\bmusic\b/gi, 'музыка'],
  [/\bprox(?:y|ies)\b/gi, 'прокси'],
  [/\bvpns?\b/gi, 'VPN'],
  [/\badblockers?\b/gi, 'блокировщик рекламы'],
  [/\bfile ?sharing\b/gi, 'файлообменник'],
  [/\buploads?\b/gi, 'загрузка файлов'],
  [/\bhosting\b/gi, 'хостинг'],
  [/\bfast(?:er)?\b/gi, 'быстрый'],
  [/\bsafe\b/gi, 'безопасный'],
  [/\bunofficial\b/gi, 'неофициальный'],
  [/\bofficial\b/gi, 'официальный'],
  [/\bmirrors?\b/gi, 'зеркало'],
  [/\bno ads\b/gi, 'без рекламы'],
  [/\bwithout ads\b/gi, 'без рекламы'],
  [/\bhigh quality\b/gi, 'высокое качество'],
  [/\bmulti ?language\b/gi, 'мультиязычность'],
  [/\btorrent clients?\b/gi, 'торрент-клиент'],
  [/\bindexers?\b/gi, 'индексатор'],
  [/\bforum\b/gi, 'форум'],
  [/\bcommunity\b/gi, 'сообщество'],
  [/\bupdated\b/gi, 'обновляется'],
  [/\bdaily\b/gi, 'ежедневно'],
  [/\bbest\b/gi, 'лучший'],
  [/\bpopular\b/gi, 'популярный'],
  [/\brecommended\b/gi, 'рекомендуемый'],
  [/\bverified\b/gi, 'проверенный'],
  [/\beasy to use\b/gi, 'простой в использовании'],
  [/\bclean interface\b/gi, 'удобный интерфейс'],
  [/\bno sign ?up\b/gi, 'без регистрации'],
  [/\brequires\b/gi, 'нужно'],
  [/\baccount\b/gi, 'аккаунт'],
  [/\bmobile\b/gi, 'мобильная версия'],
  [/\bdesktop\b/gi, 'десктоп'],
  [/\bweb ?app\b/gi, 'веб-версия'],
  [/\blarge (?:database|catalogue|catalog)\b/gi, 'большая база'],
  [/\bhuge (?:database|catalogue|catalog)\b/gi, 'огромная база'],
  [/\bactive community\b/gi, 'активное сообщество'],
];

const KIND_RULES = [
  [/tracker|rutor|rutracker/i, 'Трекер и индекс пиратских раздач'],
  [/torrent/i, 'Торрент-трекер с большой базой раздач'],
  [/usenet|nzb/i, 'Usenet-индекс с ньюсбек-раздачами'],
  [/anime|ani[A-Z]|otaku|nyaa|animepak/i, 'Пиратский стриминг и раздачи аниме'],
  [/manga|manhwa/i, 'Читалка пиратной манги'],
  [/rom|emulator|retro/i, 'Эмуляторы и ROM-файлы'],
  [/repack|crack|dodi|fitlm/i, 'Репаки и взломанные игры'],
  [/ebook|e-?book|libgen|z-?library|annas/i, 'Библиотека пиратных книг'],
  [/audiobook|hörbuch/i, 'Аудиокниги'],
  [/music|música|musica/i, 'Музыкальные раздачи и аудио'],
  [/proxy|vpn|debrid|unblock/i, 'Инструмент обхода блокировок'],
  [/ddl|direct download|upload|file ?host|filebin|gofile/i, 'Сервис прямых загрузок и файлообменник'],
  [/comic|manga/i, 'Пиратные комиксы и манга'],
  [/sport/i, 'Пиратные трансляции спорта'],
  [/movie|film|cinema|series|tv|kino/i, 'Онлайн-кино и сериалы'],
  [/warez|software|app/i, 'Пиратный софт и сборки'],
];

function kindRu(entry) {
  const hay = `${entry.name || ''} ${entry.url}`;
  for (const [re, ru] of KIND_RULES) if (re.test(hay)) return ru;
  const bySection = {
    torrents: 'Пиратский трекер и индекс раздач',
    streaming: 'Онлайн-кино и сериалы без подписки',
    anime: 'Пиратские аниме, манга и озвучки',
    games: 'Пиратные игры, репаки и эмуляторы',
    books: 'Библиотека пиратных книг и аудиокниг',
    music: 'Музыкальные раздачи и аудио',
    bypass: 'Инструмент обхода блокировок и анонимности',
    downloads: 'Файлообменник и прямые загрузки',
    misc: 'Пиратский ресурс из подборки мегатреда',
  };
  return bySection[entry.section] || bySection.misc;
}

const SECTION_TAIL = {
  torrents: 'Торренты и magnet-раздачи в одном месте.',
  streaming: 'Фильмы и сериалы смотрите без подписки и регистрации.',
  anime: 'Аниме с озвучкой, субтитрами и манга в открытом доступе.',
  games: 'Игры, репаки и прошивки скачиваются напрямую из архива.',
  books: 'Книги и аудиокниги доступны для скачивания без регистрации.',
  music: 'Музыкальные альбомы и треки в свободном доступе.',
  bypass: 'Помогает обходить блокировки и оставаться анонимным.',
  downloads: 'Файлы загружаются напрямую, без ожидания и рекламы.',
  misc: 'Ресурс из пиратской подборки, доступен по прямой ссылке.',
};

function isCyrillic(s) {
  const letters = s.match(/[A-Za-zА-Яа-яЁё]/g) || [];
  if (!letters.length) return false;
  const cyr = letters.filter((c) => /[А-Яа-яЁё]/.test(c)).length;
  return cyr / letters.length > 0.5;
}

function translateDescription(entry) {
  const raw = cleanText(entry.desc);
  let tr = '';

  if (raw) {
    if (isCyrillic(raw)) {
      tr = raw;
    } else {
      let t = raw;
      for (const [re, repl] of PHRASES) t = t.replace(re, repl);
      // Если в переводе остались английские слова — используем шаблон.
      if (!/[A-Za-z]{4,}/.test(t)) tr = t;
    }
  }

  const kind = kindRu(entry);
  const tail = SECTION_TAIL[entry.section] || SECTION_TAIL.misc;
  let desc = tr ? `${kind}: ${tr}` : `${kind}. ${tail}`;
  desc = cleanText(desc).replace(/\s*\.\s*\./g, '.').replace(/^[-–—:,\s]+/, '');
  desc = desc.replace(/\s+/g, ' ').trim();
  if (!desc.endsWith('.')) desc += '.';

  if (desc.length < 40) desc = `${kind}. ${tail}`;
  if (desc.length > 120) {
    desc = desc.slice(0, 117).replace(/[\s,;:—–-]+$/, '') + '.';
  }
  return desc;
}

function cleanName(entry) {
  const host = hostOf(entry.url);
  let name = cleanText(entry.name);
  name = name.replace(/[\u2060\u200b\ufeff]/g, '');
  name = name.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '');
  name = name.replace(/\s*[|—–-]\s*(description|note|notes|comment|desc)\s*$/i, '').trim();
  name = name.replace(/\s{2,}/g, ' ').trim();

  if (name.length > 60) name = name.slice(0, 60).trim();
  if (nameLooksUseless(name)) {
    name = host;
  }
  return name || host;
}

/* ------------------------------------------------------------------ */
/* Основной проход                                                      */
/* ------------------------------------------------------------------ */

async function collect() {
  const entries = [];
  const stats = [];

  for (const source of SOURCES) {
    const urls = source.files
      ? source.files.map((f) => ({ url: `${source.base}${f.split(' ').map(encodeURIComponent).join('%20')}`, name: f }))
      : [{ url: source.url, name: source.id }];

    let ok = 0;
    for (const u of urls) {
      const text = await fetchText(u.url);
      if (!text) continue;
      ok++;
      if (source.kind === 'md') {
        entries.push(...parseMarkdown(text, source.id, source.section));
      } else if (source.kind === 'everythingmoe') {
        entries.push(...parseEverythingMoe(text, source.id));
      } else if (source.kind === 'champagne') {
        entries.push(...parseChampagne(text, source.id, source.section));
      }
    }

    if (source.kind === 'champagne') {
      for (const page of source.pages || []) {
        const text = await fetchText(`${source.url}${page}`);
        if (!text) continue;
        ok++;
        entries.push(...parseChampagne(text, source.id, source.section));
      }
    }
    stats.push({ id: source.id, ok, total: urls.length });
    console.log(`  ${source.id}: ${ok}/${urls.length}`);
  }

  return { entries, stats };
}

const SECTION_CAPS = {
  torrents: 130,
  streaming: 150,
  anime: 110,
  games: 90,
  books: 80,
  music: 50,
  bypass: 40,
  downloads: 70,
  misc: 90,
};

const BRAND_TAIL = ['vf', 'rip', 'cc', 'to', 'tv', 'apk', 'se', 'me', 'net', 'org', 'co', 'ws', 'ru', 'com', 'io', 'xyz', 'site', 'online', 'pro', 'hd', '2d', '3d', 'ru', 'world', 'zone', 'click', 'link', 'site'];

/** Грубовая «брендовая» метка домена — склеивает клоны одного сайта. */
function brandKey(host, name) {
  const base = (host.split('.')[0] || '').toLowerCase().replace(/[^a-zа-я0-9]/gi, '');
  let key = base.replace(/[0-9]+/g, '');
  if (key.length < 4) key = (name || '').toLowerCase().replace(/[^a-zа-я0-9]/gi, '').replace(/[0-9]+/g, '');
  for (let i = 0; i < 3; i++) {
    const tail = key.slice(-2);
    if (BRAND_TAIL.includes(tail)) key = key.slice(0, -2);
    else break;
  }
  return key;
}

function scoreOf(entry) {
  let score = 0;
  const sources = new Set((entry.sources || []).filter(Boolean));
  score += sources.size * 3;
  const hay = `${entry.name} ${entry.desc} ${entry.url}`;
  if (PIRACY_HINT.test(hay)) score += 2;
  if (MUST_KEEP_HOST.includes(hostOf(entry.url))) score += 10;
  if (/^(https?:)?\/\/[^/]+\/?$/.test(entry.url)) score += 1;
  if (entry.name && entry.name.length > 2 && !/^[\d.]+$/.test(entry.name)) score += 1;
  return score;
}

function buildItems(entries) {
  const byDomain = new Map();

  for (const entry of entries) {
    if (!entry.url) continue;
    const host = hostOf(entry.url);
    if (!host) continue;
    if (!looksPiratical(entry)) continue;

    const desc = translateDescription(entry);
    const name = cleanName(entry);
    if (!name) continue;

    const existing = byDomain.get(host);
    if (!existing) {
      byDomain.set(host, {
        name,
        url: entry.url,
        section: entry.section,
        desc,
        notes: [],
        sources: entry.source ? [entry.source] : [],
      });
      continue;
    }
    if (entry.source && !existing.sources.includes(entry.source)) existing.sources.push(entry.source);
    if (entry.desc) {
      const note = cleanText(entry.desc);
      if (note && note.length <= 220 && !existing.notes.includes(note) && note !== existing.desc) {
        existing.notes.push(note);
      }
    }
    // Приоритет раздела: более специфичный раздел побеждает «misc».
    if (existing.section === 'misc' && entry.section !== 'misc') existing.section = entry.section;
  }

  let items = [...byDomain.values()];

  // Схлопываем клоны одного бренда внутри раздела.
  const byBrand = new Map();
  for (const item of items) {
    const key = `${item.section}|${brandKey(hostOf(item.url), item.name)}`;
    const current = byBrand.get(key);
    if (!current) {
      byBrand.set(key, item);
      continue;
    }
    const a = { ...item, _score: scoreOf(item) };
    const b = { ...current, _score: scoreOf(current) };
    const winner = a._score >= b._score ? a : b;
    const loser = a._score >= b._score ? b : a;
    winner.notes = [...new Set([...winner.notes, ...loser.notes])];
    winner.sources = [...new Set([...winner.sources, ...loser.sources])];
    byBrand.set(key, winner);
  }
  items = [...byBrand.values()];

  // Ограничиваем разделы, оставляя наиболее подтверждённые ресурсы.
  const perSection = {};
  for (const item of items) (perSection[item.section] ||= []).push(item);
  const kept = [];
  for (const [section, list] of Object.entries(perSection)) {
    const cap = SECTION_CAPS[section] || 100;
    list.sort((a, b) => scoreOf(b) - scoreOf(a) || a.name.localeCompare(b.name));
    kept.push(...list.slice(0, cap));
  }
  items = kept;

  const order = { torrents: 0, streaming: 1, anime: 2, games: 3, books: 4, music: 5, bypass: 6, downloads: 7, misc: 8 };
  items.sort((a, b) => (order[a.section] - order[b.section]) || a.name.localeCompare(b.name));
  return items.map((item) => ({
    name: item.name,
    url: item.url,
    section: item.section,
    desc: item.desc,
    notes: item.notes.slice(0, 6),
  }));
}

async function main() {
  console.log('Читаю источники...');
  const { entries, stats } = await collect();

  const items = buildItems(entries);
  const domains = new Set(items.map((i) => hostOf(i.url)));

  const bySection = {};
  for (const item of items) bySection[item.section] = (bySection[item.section] || 0) + 1;

  const out = { source: 'r/Piracy megathread + агрегаторы', items };
  await fs.writeFile(OUT_FILE, JSON.stringify(out, null, 2) + '\n', 'utf8');

  const readSources = stats.filter((s) => s.ok > 0).length;
  console.log(`\nИсточников прочитано: ${readSources} из ${stats.length}`);
  console.log(`Ссылок собрано: ${entries.length}`);
  console.log(`Уникальных доменов: ${domains.size}`);
  console.log('По разделам:');
  for (const [section, count] of Object.entries(bySection).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${section}: ${count}`);
  }
  console.log(`Результат: ${path.relative(ROOT, OUT_FILE)}`);
}

main().catch((err) => {
  console.error('Фатальная ошибка:', err);
  process.exit(1);
});
