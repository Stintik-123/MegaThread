// Данные каталога MegaThread. Единственный источник правды — этот файл.
// 13 категорий, 264 ресурсов.
// ru: ok — работает в России, limited — с оговорками, blocked — заблокирован,
// mirror — нужен зеркальный домен.

export const CATEGORIES = [
  {
    "id": "media",
    "title": "Кино и аниме",
    "desc": "Онлайн, скачивание и торренты",
    "icon": "film"
  },
  {
    "id": "games",
    "title": "Игры",
    "desc": "Репаки, ROM, эмуляторы и халява",
    "icon": "gamepad"
  },
  {
    "id": "software",
    "title": "Софт",
    "desc": "Программы, утилиты, open-source",
    "icon": "app"
  },
  {
    "id": "privacy",
    "title": "Приватность",
    "desc": "VPN, adblock, браузеры, безопасность",
    "icon": "shield"
  },
  {
    "id": "bypass",
    "title": "Обход блокировок",
    "desc": "VPN, конфиги и инструменты для обхода блокировок",
    "icon": "shield"
  },
  {
    "id": "ai",
    "title": "ИИ",
    "desc": "Чаты, генерация картинок и голоса",
    "icon": "spark"
  },
  {
    "id": "music",
    "title": "Музыка",
    "desc": "Стриминг, скачивание, радио",
    "icon": "music"
  },
  {
    "id": "books",
    "title": "Книги",
    "desc": "Электронные книги, манга, аудиокниги",
    "icon": "book"
  },
  {
    "id": "torrents",
    "title": "Торренты",
    "desc": "Клиенты, трекеры, индексы",
    "icon": "download"
  },
  {
    "id": "mobile",
    "title": "Android и iOS",
    "desc": "APK, моды, sideloading",
    "icon": "phone"
  },
  {
    "id": "learning",
    "title": "Обучение",
    "desc": "Курсы, документация, материалы",
    "icon": "book"
  },
  {
    "id": "tools",
    "title": "Инструменты",
    "desc": "Браузерные и системные утилиты",
    "icon": "tool"
  },
  {
    "id": "downloads",
    "title": "Скачивание",
    "desc": "Файлообменники и менеджеры загрузок",
    "icon": "download"
  }
];

export const RESOURCES = [
  {
    "cat": "media",
    "name": "Кинопоиск",
    "desc": "Легальный раздел с бесплатным контентом",
    "url": "https://www.kinopoisk.ru/",
    "tags": [
      "стриминг",
      "русский",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok",
    "note": "Бесплатный раздел с контентом ВГТРК открывается без VPN."
  },
  {
    "ru": "ok",
    "cat": "media",
    "name": "Мосфильм",
    "desc": "Фильмотека киностудии: классика в открытом доступе",
    "url": "https://mosfilm.ru/",
    "tags": [
      "стриминг",
      "легально",
      "русский"
    ],
    "os": [
      "any"
    ]
  },
  {
    "ru": "ok",
    "cat": "media",
    "name": "Смотрим",
    "desc": "ВГТРК: фильмы, сериалы и прямые эфиры бесплатно",
    "url": "https://smotrim.ru/",
    "tags": [
      "стриминг",
      "легально",
      "русский"
    ],
    "os": [
      "any"
    ],
    "note": "Полностью легальный контент, открывается напрямую, без VPN и регистрации."
  },
  {
    "cat": "media",
    "name": "Aether",
    "desc": "Стриминг фильмов и сериалов",
    "url": "https://aether.mom/",
    "tags": [
      "стриминг"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "AllManga",
    "desc": "Аниме и манга",
    "url": "https://allmanga.to/",
    "tags": [
      "стриминг",
      "аниме"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "AniList",
    "desc": "Современный трекер аниме и манги",
    "url": "https://anilist.co/",
    "tags": [
      "трекеры",
      "аниме"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "animepahe",
    "desc": "Аниме в хорошем качестве",
    "url": "https://animepahe.ru/",
    "tags": [
      "стриминг",
      "аниме"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "Cineby",
    "desc": "Онлайн-кинотеатр с большим каталогом",
    "url": "https://cineby.app/",
    "tags": [
      "стриминг"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "Ext.to",
    "desc": "Торрент-поиск по категориям",
    "url": "https://ext.to/",
    "tags": [
      "торренты"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "HiAnime",
    "desc": "Каталог аниме онлайн",
    "url": "https://hianime.to/",
    "tags": [
      "стриминг",
      "аниме"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "Internet Archive Movies",
    "desc": "Фильмы в общественном достоянии",
    "url": "https://archive.org/details/movies",
    "tags": [
      "скачивание",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "media",
    "name": "Lampa",
    "desc": "Каталог фильмов для Android и Smart TV",
    "url": "https://lampa.app/",
    "tags": [
      "стриминг",
      "торренты",
      "приложения"
    ],
    "os": [
      "w",
      "a"
    ],
    "note": "Сам приложение хранит только метаданные, а видео подключает через плагины. Официальная сборка в Google Play ограничена, есть сборки без ограничений."
  },
  {
    "cat": "media",
    "name": "Letterboxd",
    "desc": "Трекинг и отзывы на фильмы",
    "url": "https://letterboxd.com/",
    "tags": [
      "трекеры"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "Miruro",
    "desc": "Стриминг аниме",
    "url": "https://www.miruro.com/",
    "tags": [
      "стриминг",
      "аниме"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "MyAnimeList",
    "desc": "Трекинг аниме и манги",
    "url": "https://myanimelist.net/",
    "tags": [
      "трекеры",
      "аниме"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "NEPU",
    "desc": "Стриминг фильмов и сериалов",
    "url": "https://nepu.to/",
    "tags": [
      "стриминг"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "Simkl",
    "desc": "Трекинг сериалов и аниме",
    "url": "https://simkl.com/",
    "tags": [
      "трекеры"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "media",
    "name": "TorrServer",
    "desc": "Сервер для стриминга торрентов на Android TV",
    "url": "https://github.com/YouROK/TorrServer",
    "tags": [
      "торренты",
      "стриминг",
      "приложения",
      "системные"
    ],
    "os": [
      "w",
      "a"
    ]
  },
  {
    "cat": "media",
    "name": "Vidsrc",
    "desc": "Встраиваемые источники видео",
    "url": "https://vidsrc.to/",
    "tags": [
      "стриминг"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "0 A.D.",
    "desc": "Открытая стратегия",
    "url": "https://play0ad.com/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "AnkerGames",
    "desc": "Каталог игр для скачивания",
    "url": "https://ankergames.net/",
    "tags": [
      "скачивание"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Backloggd",
    "desc": "Трекинг игрового бэклога",
    "url": "https://www.backloggd.com/",
    "tags": [
      "трекеры"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "CDRomance",
    "desc": "PS1/PS2 и ретро-игры",
    "url": "https://cdromance.com/",
    "tags": [
      "эмуляторы",
      "ROM"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "CS2",
    "desc": "Counter-Strike 2 бесплатно в Steam",
    "url": "https://store.steampowered.com/app/730/",
    "tags": [
      "легально",
      "бесплатно"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Dota 2",
    "desc": "Бесплатная MOBA",
    "url": "https://store.steampowered.com/app/570/",
    "tags": [
      "легально",
      "бесплатно"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Emulation Wiki",
    "desc": "Гайды по эмуляторам всех платформ",
    "url": "https://emulation.gametechwiki.com/",
    "tags": [
      "эмуляторы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Epic Games Free",
    "desc": "Халява недели от Epic",
    "url": "https://store.epicgames.com/free-games",
    "tags": [
      "легально",
      "бесплатно"
    ],
    "os": [
      "w",
      "m"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "games",
    "name": "Epic Games Store",
    "desc": "Магазин с бесплатными играми каждую неделю",
    "url": "https://store.epicgames.com/",
    "tags": [
      "легально",
      "бесплатно"
    ],
    "os": [
      "w",
      "m"
    ]
  },
  {
    "cat": "games",
    "name": "FitGirl Repacks",
    "desc": "Сжатые репаки игр",
    "url": "https://fitgirl-repacks.site/",
    "tags": [
      "скачивание"
    ],
    "os": [
      "w"
    ],
    "ru": "ok",
    "note": "Домен регулярно блокируют, зеркала указаны на главной странице."
  },
  {
    "cat": "games",
    "name": "GOG Games",
    "desc": "DRM-free игры с GOG",
    "url": "https://gog-games.to/",
    "tags": [
      "скачивание"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok",
    "note": "Зеркало DRM-free игр GOG. Оригинальные покупки доступны на gog.com."
  },
  {
    "ru": "ok",
    "cat": "games",
    "name": "itch.io",
    "desc": "Магазин инди-игр, демо и бесплатных браузерных игр",
    "url": "https://itch.io/",
    "tags": [
      "легально",
      "бесплатно"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "games",
    "name": "Minetest",
    "desc": "Открытый аналог Minecraft",
    "url": "https://www.minetest.net/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "games",
    "name": "Modrinth",
    "desc": "Открытые моды и сборки для Minecraft и других игр",
    "url": "https://modrinth.com/",
    "tags": [
      "легально",
      "бесплатно",
      "моды"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a"
    ]
  },
  {
    "cat": "games",
    "name": "Myrient",
    "desc": "Большой архив образов",
    "url": "https://myrient.erista.me/",
    "tags": [
      "эмуляторы",
      "ROM"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Online-Fix",
    "desc": "Фиксы мультиплеера для offline-игр",
    "url": "https://online-fix.me/",
    "tags": [
      "скачивание"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Ovagames",
    "desc": "Репаки и полный дистрибутив",
    "url": "https://ovagames.com/",
    "tags": [
      "скачивание"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Path of Exile",
    "desc": "ARPG с честной F2P-моделью",
    "url": "https://www.pathofexile.com/",
    "tags": [
      "легально",
      "бесплатно"
    ],
    "os": [
      "w",
      "m"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "r/ROMs Mega",
    "desc": "Каталог ROM и ISO",
    "url": "https://r-roms.github.io/",
    "tags": [
      "эмуляторы",
      "ROM"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "games",
    "name": "Steam",
    "desc": "Магазин игр с оплатой рублями и постоянными распродажами",
    "url": "https://store.steampowered.com/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "note": "Работает напрямую, принимает российские карты. Раздачи и демки бесплатны."
  },
  {
    "ru": "ok",
    "cat": "games",
    "name": "SteamDB",
    "desc": "Цены, распродажи и история скидок Steam",
    "url": "https://steamdb.info/",
    "tags": [
      "легально",
      "бесплатно",
      "инструменты"
    ],
    "os": [
      "any"
    ],
    "note": "Показывает реальные цены по регионам и историю скидок — чтобы не переплачивать."
  },
  {
    "cat": "games",
    "name": "SteamRIP",
    "desc": "Предустановленные игры без Steam",
    "url": "https://steamrip.com/",
    "tags": [
      "скачивание"
    ],
    "os": [
      "w"
    ],
    "ru": "ok",
    "note": "Домен и зеркала меняются — держите актуальную ссылку из сообщества."
  },
  {
    "cat": "games",
    "name": "SuperTuxKart",
    "desc": "Открытые аркадные гонки",
    "url": "https://supertuxkart.net/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Vimm's Lair",
    "desc": "Классические ROM и ISO",
    "url": "https://vimm.net/",
    "tags": [
      "эмуляторы",
      "ROM"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "Warframe",
    "desc": "Кооперативный шутер F2P",
    "url": "https://www.warframe.com/",
    "tags": [
      "легально",
      "бесплатно"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "7-Zip",
    "desc": "Архиватор",
    "url": "https://www.7-zip.org/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "software",
    "name": "МойОфис",
    "desc": "Российский офисный пакет, бесплатно для дома",
    "url": "https://myoffice.ru/",
    "tags": [
      "легально",
      "русский",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a"
    ]
  },
  {
    "ru": "ok",
    "cat": "software",
    "name": "Р7-Офис",
    "desc": "Бесплатный офисный пакет с российскими сертификатами",
    "url": "https://r7-office.ru/",
    "tags": [
      "легально",
      "русский",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ]
  },
  {
    "ru": "ok",
    "cat": "software",
    "name": "AIMP",
    "desc": "Лёгкий плеер с поддержкой Lossless и русским интерфейсом",
    "url": "https://www.aimp.ru/",
    "tags": [
      "легально",
      "бесплатно",
      "системные",
      "русский"
    ],
    "os": [
      "w",
      "a"
    ]
  },
  {
    "cat": "software",
    "name": "Audacity",
    "desc": "Запись и монтаж звука",
    "url": "https://www.audacityteam.org/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "Balena Etcher",
    "desc": "Запись образов на USB",
    "url": "https://etcher.balena.io/",
    "tags": [
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "Blender",
    "desc": "3D, анимация и рендер",
    "url": "https://www.blender.org/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "DaVinci Resolve",
    "desc": "Профессиональный монтаж, бесплатная версия",
    "url": "https://www.blackmagicdesign.com/products/davinciresolve",
    "tags": [
      "легально",
      "видео"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "Everything",
    "desc": "Мгновенный поиск файлов в Windows",
    "url": "https://www.voidtools.com/",
    "tags": [
      "легально"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "GIMP",
    "desc": "Редактор изображений",
    "url": "https://www.gimp.org/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "HandBrake",
    "desc": "Конвертер видео",
    "url": "https://handbrake.fr/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "software",
    "name": "Kodi",
    "desc": "Медиатеатр с торрент-аддонами для ТВ и приставок",
    "url": "https://kodi.tv/",
    "tags": [
      "видео",
      "легально",
      "бесплатно",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a"
    ]
  },
  {
    "cat": "software",
    "name": "Krita",
    "desc": "Цифровая живопись",
    "url": "https://krita.org/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "LibreOffice",
    "desc": "Офисный пакет",
    "url": "https://www.libreoffice.org/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "Massgrave",
    "desc": "Активация Windows и Office",
    "url": "https://massgrave.dev/",
    "tags": [
      "инструменты"
    ],
    "os": [
      "w"
    ],
    "ru": "ok",
    "note": "Открытые скрипты активации Windows и Office. Используйте на свой страх и риск."
  },
  {
    "ru": "ok",
    "cat": "software",
    "name": "MPC-BE",
    "desc": "Видеоплеер с аппаратным ускорением",
    "url": "https://mpc-be.org/",
    "tags": [
      "видео",
      "легально",
      "бесплатно",
      "системные"
    ],
    "os": [
      "w"
    ]
  },
  {
    "cat": "software",
    "name": "MPV",
    "desc": "Минималистичный видеоплеер",
    "url": "https://mpv.io/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "Notepad++",
    "desc": "Быстрый текстовый редактор",
    "url": "https://notepad-plus-plus.org/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "OBS Studio",
    "desc": "Запись экрана и стриминг",
    "url": "https://obsproject.com/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "PeaZip",
    "desc": "Кроссплатформенный архиватор",
    "url": "https://peazip.github.io/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "PowerToys",
    "desc": "Утилиты для Windows",
    "url": "https://learn.microsoft.com/windows/powertoys/",
    "tags": [
      "легально"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "Rufus",
    "desc": "Загрузочные USB",
    "url": "https://rufus.ie/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "ShareX",
    "desc": "Скриншоты и запись экрана",
    "url": "https://getsharex.com/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "Ventoy",
    "desc": "Мультизагрузочная флешка",
    "url": "https://www.ventoy.net/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "VLC",
    "desc": "Плеер любого формата",
    "url": "https://www.videolan.org/",
    "tags": [
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "VS Code",
    "desc": "Редактор кода",
    "url": "https://code.visualstudio.com/",
    "tags": [
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "software",
    "name": "yt-dlp",
    "desc": "Скачивание видео и аудио с сотен сайтов",
    "url": "https://github.com/yt-dlp/yt-dlp",
    "tags": [
      "утилиты",
      "бесплатно",
      "разработка",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "note": "Работает с YouTube, VK, Rutube и другими платформами. Актуальная версия важна: YouTube регулярно ломает старые сборки."
  },
  {
    "ru": "ok",
    "cat": "privacy",
    "name": "AdGuard DNS",
    "desc": "Блокировка рекламы на уровне DNS для всей сети",
    "url": "https://adguard-dns.io/",
    "tags": [
      "adblock",
      "легально",
      "бесплатно"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "note": "Работает в России. Защищает все устройства в сети, а не только браузер."
  },
  {
    "cat": "privacy",
    "name": "Bitwarden",
    "desc": "Менеджер паролей",
    "url": "https://bitwarden.com/",
    "tags": [
      "безопасность",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "Brave",
    "desc": "Chromium с блокировкой трекеров",
    "url": "https://brave.com/",
    "tags": [
      "браузеры",
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "ClearURLs",
    "desc": "Удаление трекеров из ссылок",
    "url": "https://docs.clearurls.xyz/",
    "tags": [
      "расширения",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "DuckDuckGo",
    "desc": "Поиск без персонализации",
    "url": "https://duckduckgo.com/",
    "tags": [
      "поиск",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "Firefox",
    "desc": "Браузер с сильной приватностью",
    "url": "https://www.mozilla.org/firefox/",
    "tags": [
      "браузеры",
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a"
    ],
    "ru": "ok",
    "note": "Доступен, страницы Google и YouTube открываются медленнее."
  },
  {
    "cat": "privacy",
    "name": "Have I Been Pwned",
    "desc": "Проверка утечек паролей и почты",
    "url": "https://haveibeenpwned.com/",
    "tags": [
      "безопасность",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "KeePassXC",
    "desc": "Локальный менеджер паролей",
    "url": "https://keepassxc.org/",
    "tags": [
      "безопасность",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "Librewolf",
    "desc": "Firefox под приватность",
    "url": "https://librewolf.net/",
    "tags": [
      "браузеры",
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "Mullvad Browser",
    "desc": "Браузер от Mullvad и Tor Project",
    "url": "https://mullvad.net/browser",
    "tags": [
      "браузеры",
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "Mullvad VPN",
    "desc": "Приватный VPN без аккаунта",
    "url": "https://mullvad.net/",
    "tags": [
      "VPN",
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "ru": "limited",
    "note": "Работает через мосты и обфускацию, но сайт и оплата из РФ недоступны."
  },
  {
    "cat": "privacy",
    "name": "Privacy Guides",
    "desc": "Гайды по приватности",
    "url": "https://www.privacyguides.org/",
    "tags": [
      "гайды",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "Proton Mail",
    "desc": "Зашифрованная почта",
    "url": "https://proton.me/mail",
    "tags": [
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Открывается через мост Proton, в вебе может быть недоступен."
  },
  {
    "cat": "privacy",
    "name": "Proton VPN",
    "desc": "VPN с бесплатным тарифом",
    "url": "https://proton.me/vpn",
    "tags": [
      "VPN",
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "ru": "limited",
    "note": "В РФ подключается нестабильно: 43 из 61 опрошенных не смогли выйти. Сайт и приложения недоступны, оплата картой РФ не проходит."
  },
  {
    "ru": "ok",
    "cat": "privacy",
    "name": "Quad9",
    "desc": "Бесплатный DNS-резолвер с фильтрацией вредоносных доменов",
    "url": "https://quad9.net/",
    "tags": [
      "легально",
      "бесплатно",
      "безопасность"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "privacy",
    "name": "SearXNG",
    "desc": "Метапоиск без слежки",
    "url": "https://searx.space/",
    "tags": [
      "поиск",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "privacy",
    "name": "Session",
    "desc": "Мессенджер без номера телефона и без регистрации",
    "url": "https://getsession.org/",
    "tags": [
      "легально",
      "бесплатно",
      "приватность"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "note": "Не требует SIM и не привязан к номеру — рабочая замена Signal, который в РФ заблокирован."
  },
  {
    "cat": "privacy",
    "name": "SimpleLogin",
    "desc": "Email-алиасы",
    "url": "https://simplelogin.io/",
    "tags": [
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "Tor Browser",
    "desc": "Анонимный браузер",
    "url": "https://www.torproject.org/",
    "tags": [
      "браузеры",
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a"
    ],
    "ru": "limited",
    "note": "tor.org в РФ заблокирован — качайте с официальных зеркал проекта."
  },
  {
    "cat": "privacy",
    "name": "Tria.ge",
    "desc": "Песочница для анализа файлов",
    "url": "https://tria.ge/",
    "tags": [
      "безопасность",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "uBlock Origin",
    "desc": "Блокировщик рекламы",
    "url": "https://ublockorigin.com/",
    "tags": [
      "adblock",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "privacy",
    "name": "VirusTotal",
    "desc": "Проверка файлов на вирусы",
    "url": "https://www.virustotal.com/",
    "tags": [
      "безопасность",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "3x-ui",
    "desc": "Панель управления своим VLESS-сервером",
    "url": "https://github.com/MHSanaei/3x-ui",
    "tags": [
      "обход",
      "конфиги",
      "разработка"
    ],
    "os": [
      "any"
    ],
    "note": "Свой сервер за полчаса: домен, сертификат, автоподбор обхода блокировок."
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "Рутрекер в Telegram",
    "desc": "Каналы трекера с актуальными зеркалами",
    "url": "https://t.me/rutracker_news",
    "tags": [
      "зеркала",
      "торренты",
      "русский"
    ],
    "os": [
      "any"
    ],
    "note": "Рабочий доступ к трекеру, когда домен закрыт. Бот @ru_tracker_bot пришлёт свежее зеркало."
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "AdGuard VPN",
    "desc": "Блокирует рекламу и работает в российских магазинах приложений",
    "url": "https://adguard-vpn.com/",
    "tags": [
      "VPN",
      "обход",
      "легально"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "note": "Один из самых стабильных зарубежных VPN в РФ, есть в российском App Store. Бесплатно 3 ГБ в месяц."
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "AmneziaVPN",
    "desc": "Русский VPN на AmneziaWG и VLESS Reality — лучший выбор в РФ",
    "url": "https://amnezia.org/",
    "tags": [
      "VPN",
      "обход",
      "русский"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "note": "Работал у 28 из 39 опрошенных в октябре 2026 — лучший результат среди VPN. Свои серверы, оплата рублями, конфиги можно раздать друзьям."
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "Anna’s Archive: зеркала",
    "desc": "Индекс актуальных зеркал библиотек и трекеров",
    "url": "https://annas-archive.info/",
    "tags": [
      "зеркала",
      "индексы",
      "книги",
      "бесплатно"
    ],
    "os": [
      "any"
    ],
    "note": "Показывает живые зеркала Z-Library, Sci-Hub и Library Genesis с аптаймом. Обновляется каждые пять минут."
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "GoodbyeDPI",
    "desc": "Локальный обход DPI для Windows, Linux и macOS",
    "url": "https://github.com/ValdikSS/GoodbyeDPI",
    "tags": [
      "обход",
      "DPI",
      "бесплатно",
      "системные"
    ],
    "os": [
      "w",
      "l",
      "m"
    ],
    "note": "Не VPN: просто чинит доступ к YouTube и другим сайтам без установки туннеля."
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "Hiddify",
    "desc": "Кроссплатформенный клиент с режимом обхода DPI",
    "url": "https://github.com/hiddify/hiddify-app",
    "tags": [
      "клиенты",
      "обход",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ]
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "Hysteria2",
    "desc": "Протокол для обхода блокировок на медленных сетях",
    "url": "https://hysteria.network/",
    "tags": [
      "VPN",
      "обход",
      "легально"
    ],
    "os": [
      "any"
    ],
    "note": "Держит скорость там, где другие протоколы душат, — вариант для мобильного интернета."
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "Karing",
    "desc": "Кроссплатформенный клиент с рекламой в приложении",
    "url": "https://github.com/Ivan-Milchev/Karing",
    "tags": [
      "клиенты",
      "обход",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ]
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "NekoBox",
    "desc": "Клиент для Android с поддержкой sing-box",
    "url": "https://github.com/MatsuriDayo/NekoBoxForAndroid",
    "tags": [
      "клиенты",
      "обход",
      "APK"
    ],
    "os": [
      "a"
    ]
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "Streisand",
    "desc": "Клиент для iOS и Android с подбором работающих протоколов",
    "url": "https://github.com/StreisandSetter/Streisand",
    "tags": [
      "клиенты",
      "обход",
      "приложения"
    ],
    "os": [
      "a",
      "i"
    ]
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "Throne",
    "desc": "Андроид-клиент для VLESS с подбором протокола",
    "url": "https://github.com/throneproj/Throne",
    "tags": [
      "клиенты",
      "обход",
      "APK"
    ],
    "os": [
      "a"
    ]
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "v2rayN",
    "desc": "Клиент VLESS, VMess и Shadowsocks для Windows",
    "url": "https://github.com/2dust/v2rayN",
    "tags": [
      "клиенты",
      "обход",
      "системные"
    ],
    "os": [
      "w"
    ]
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "vpn-configs-for-russia",
    "desc": "Бесплатные конфиги VLESS и Hysteria2, обновляются автоматически",
    "url": "https://github.com/SeamniZ/vpn-configs-for-russia",
    "tags": [
      "VPN",
      "обход",
      "бесплатно",
      "конфиги"
    ],
    "os": [
      "any"
    ],
    "note": "Подписка TXT для v2rayN, Throne, NekoBox и Streisand. Конфиги фильтруются по чёрным и белым спискам РКН."
  },
  {
    "ru": "limited",
    "cat": "bypass",
    "name": "WireGuard",
    "desc": "База для AmneziaWG и других схем обхода",
    "url": "https://www.wireguard.com/",
    "tags": [
      "VPN",
      "обход",
      "легально",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "note": "Чистый WireGuard в РФ режут, работает только в обёртке AmneziaWG."
  },
  {
    "ru": "ok",
    "cat": "bypass",
    "name": "Zapret",
    "desc": "Набор скриптов обхода DPI для роутеров и Linux",
    "url": "https://github.com/bol-van/zapret",
    "tags": [
      "обход",
      "DPI",
      "бесплатно",
      "системные"
    ],
    "os": [
      "l",
      "any"
    ],
    "note": "Работает на роутере и заменяет связку VPN+прокси там, где обычный VPN режут."
  },
  {
    "cat": "ai",
    "name": "ChatGPT",
    "desc": "ИИ-чат, есть бесплатный тариф",
    "url": "https://chatgpt.com/",
    "tags": [
      "чаты"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Регистрация с российского номера может не пройти. Рабочие агрегаторы — в разделе «ИИ»."
  },
  {
    "cat": "ai",
    "name": "Claude",
    "desc": "ИИ от Anthropic",
    "url": "https://claude.ai/",
    "tags": [
      "чаты"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Аккаунт с российским номером телефона не регистрируется."
  },
  {
    "cat": "ai",
    "name": "ComfyUI",
    "desc": "Нодовый интерфейс для генерации",
    "url": "https://github.com/comfyanonymous/ComfyUI",
    "tags": [
      "картинки",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "ai",
    "name": "DeepSeek",
    "desc": "Сильный бесплатный ИИ, хорош в коде",
    "url": "https://chat.deepseek.com/",
    "tags": [
      "чаты"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "ai",
    "name": "Fooocus",
    "desc": "Локальная генерация картинок",
    "url": "https://github.com/lllyasviel/Fooocus",
    "tags": [
      "картинки",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "ai",
    "name": "Gemini",
    "desc": "ИИ от Google",
    "url": "https://gemini.google.com/",
    "tags": [
      "чаты"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Доступ к Google-сервисам из РФ ограничен, нужна обходная подписка."
  },
  {
    "cat": "ai",
    "name": "GigaChat",
    "desc": "ИИ от Сбера",
    "url": "https://giga.chat/",
    "tags": [
      "чаты",
      "русский"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "ai",
    "name": "Hugging Face",
    "desc": "Каталог открытых моделей",
    "url": "https://huggingface.co/",
    "tags": [
      "системные"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Часть моделей и файлов скачивается медленно, зеркала — на hf-mirror.com."
  },
  {
    "cat": "ai",
    "name": "Kandinsky",
    "desc": "Генерация картинок по-русски",
    "url": "https://fusionbrain.ai/",
    "tags": [
      "картинки",
      "русский"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "ai",
    "name": "LM Studio",
    "desc": "GUI для локальных моделей",
    "url": "https://lmstudio.ai/",
    "tags": [
      "чаты"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "ai",
    "name": "Mistral Le Chat",
    "desc": "Европейский чат с бесплатным тарифом",
    "url": "https://chat.mistral.ai/",
    "tags": [
      "чаты",
      "бесплатно",
      "легально"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "ai",
    "name": "Ollama",
    "desc": "Локальный запуск LLM",
    "url": "https://ollama.com/",
    "tags": [
      "системные",
      "чаты"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "ai",
    "name": "Open WebUI",
    "desc": "Веб-интерфейс для локальных LLM",
    "url": "https://openwebui.com/",
    "tags": [
      "чаты",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "ru": "limited",
    "cat": "ai",
    "name": "OpenRouter",
    "desc": "Единый доступ к сотне моделей с бесплатным лимитом",
    "url": "https://openrouter.ai/",
    "tags": [
      "чаты",
      "разработка",
      "бесплатно"
    ],
    "os": [
      "any"
    ],
    "note": "Сайт открывается, но оплата картами РФ не проходит. Часть моделей доступна бесплатно."
  },
  {
    "cat": "ai",
    "name": "Perplexity",
    "desc": "ИИ-поиск с источниками",
    "url": "https://www.perplexity.ai/",
    "tags": [
      "чаты",
      "поиск"
    ],
    "os": [
      "any"
    ],
    "ru": "ok",
    "note": "Открывается напрямую, без VPN; поиск с источниками работает на русском."
  },
  {
    "ru": "ok",
    "cat": "ai",
    "name": "Qwen",
    "desc": "Бесплатный чат от Alibaba с сильной работой на русском",
    "url": "https://chat.qwen.ai/",
    "tags": [
      "чаты",
      "бесплатно",
      "китайский"
    ],
    "os": [
      "any"
    ],
    "note": "Открывается напрямую, без VPN, есть бесплатная веб-версия и API."
  },
  {
    "cat": "ai",
    "name": "Stable Diffusion",
    "desc": "Открытая генерация изображений",
    "url": "https://stability.ai/",
    "tags": [
      "картинки",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "ai",
    "name": "Suno",
    "desc": "Генерация музыки по тексту",
    "url": "https://suno.com/",
    "tags": [
      "аудио"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Регистрация и оплата из РФ ограничены."
  },
  {
    "cat": "ai",
    "name": "Udio",
    "desc": "Генерация песен",
    "url": "https://www.udio.com/",
    "tags": [
      "аудио"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Оплата картами РФ не проходит, нужен способ оплаты из-за рубежа."
  },
  {
    "cat": "ai",
    "name": "YandexGPT",
    "desc": "ИИ от Яндекса",
    "url": "https://alice.yandex.ru/",
    "tags": [
      "чаты",
      "русский"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "music",
    "name": "АКНИГА",
    "desc": "Бесплатные аудиокниги с качественной озвучкой",
    "url": "https://akniga.org/",
    "tags": [
      "книги",
      "бесплатно",
      "аудио",
      "русский"
    ],
    "os": [
      "w",
      "a"
    ]
  },
  {
    "ru": "ok",
    "cat": "music",
    "name": "Яндекс Музыка",
    "desc": "Крупнейшая русскоязычная библиотека треков",
    "url": "https://music.yandex.ru/",
    "tags": [
      "легально",
      "русский",
      "стриминг"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ]
  },
  {
    "cat": "music",
    "name": "Bandcamp",
    "desc": "Инди-музыка, часто бесплатные релизы",
    "url": "https://bandcamp.com/",
    "tags": [
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "Free Music Archive",
    "desc": "Свободная музыка",
    "url": "https://freemusicarchive.org/",
    "tags": [
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "Funkwhale",
    "desc": "Федеративный музыкальный сервис",
    "url": "https://funkwhale.audio/",
    "tags": [
      "стриминг",
      "системные"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "Internet Archive Audio",
    "desc": "Большой аудиоархив",
    "url": "https://archive.org/details/audio",
    "tags": [
      "легально",
      "скачивание"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "Last.fm",
    "desc": "Скробблинг и рекомендации",
    "url": "https://www.last.fm/",
    "tags": [
      "трекеры"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Периодически блокируется в РФ, работает через зеркала и обходные ссылки."
  },
  {
    "cat": "music",
    "name": "lucida",
    "desc": "Скачивание треков в высоком качестве",
    "url": "https://lucida.to/",
    "tags": [
      "скачивание"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "Nicotine+",
    "desc": "Soulseek-клиент",
    "url": "https://nicotine-plus.org/",
    "tags": [
      "P2P",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "Radio Browser",
    "desc": "Каталог интернет-радио",
    "url": "https://www.radio-browser.info/",
    "tags": [
      "радио",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "RateYourMusic",
    "desc": "Рейтинги альбомов",
    "url": "https://rateyourmusic.com/",
    "tags": [
      "трекеры"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "Soulseek",
    "desc": "P2P-обмен музыкой",
    "url": "https://www.slsknet.org/",
    "tags": [
      "P2P"
    ],
    "os": [
      "w",
      "m"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "SoundCloud",
    "desc": "Стриминг и открытие артистов",
    "url": "https://soundcloud.com/",
    "tags": [
      "стриминг"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "music",
    "name": "squid.wtf",
    "desc": "Скачивание музыки",
    "url": "https://squid.wtf/",
    "tags": [
      "скачивание"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "music",
    "name": "VK Музыка",
    "desc": "Музыка ВКонтакте с бесплатной версией",
    "url": "https://music.vk.com/",
    "tags": [
      "легально",
      "русский",
      "стриминг"
    ],
    "os": [
      "w",
      "m",
      "a",
      "i"
    ]
  },
  {
    "ru": "ok",
    "cat": "books",
    "name": "ЛитРес",
    "desc": "Легальный книжный магазин с бесплатным разделом",
    "url": "https://www.litres.ru/",
    "tags": [
      "легально",
      "русский",
      "книги"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ]
  },
  {
    "cat": "books",
    "name": "Anna's Archive",
    "desc": "Крупный библиотечный индекс",
    "url": "https://annas-archive.org/",
    "tags": [
      "книги"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Audiobook Bay",
    "desc": "Аудиокниги",
    "url": "https://audiobookbay.lu/",
    "tags": [
      "аудио"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "books",
    "name": "FictionLib",
    "desc": "Большая библиотека художественной литературы",
    "url": "https://fictionlib.ru/",
    "tags": [
      "книги",
      "бесплатно",
      "русский"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "books",
    "name": "FOCAL",
    "desc": "Поиск книг и статей",
    "url": "https://focal.fmhy.net/",
    "tags": [
      "индексы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "GetComics",
    "desc": "Комиксы",
    "url": "https://getcomics.org/",
    "tags": [
      "комиксы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Koodo Reader",
    "desc": "Кроссплатформенная читалка",
    "url": "https://www.koodoreader.com/",
    "tags": [
      "приложения",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Library Genesis",
    "desc": "Научные и художественные книги",
    "url": "https://libgen.is/",
    "tags": [
      "книги"
    ],
    "os": [
      "any"
    ],
    "ru": "mirror",
    "note": "libgen.* регулярно блокируют, актуальный домен ищите на annas-archive.info."
  },
  {
    "cat": "books",
    "name": "Librera",
    "desc": "Читалка для Android",
    "url": "https://librera.mobi/",
    "tags": [
      "приложения"
    ],
    "os": [
      "a"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "MangaDex",
    "desc": "Каталог манги от сообщества",
    "url": "https://mangadex.org/",
    "tags": [
      "манга"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Project Gutenberg",
    "desc": "Книги в общественном достоянии",
    "url": "https://www.gutenberg.org/",
    "tags": [
      "легально",
      "книги"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Readcomiconline",
    "desc": "Онлайн-комиксы",
    "url": "https://readcomiconline.li/",
    "tags": [
      "комиксы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Sci-Hub",
    "desc": "Научные статьи",
    "url": "https://sci-hub.ru/",
    "tags": [
      "наука"
    ],
    "os": [
      "any"
    ],
    "ru": "limited",
    "note": "Часть адресов в списке РКН. Рабочие зеркала: sci-hub.ru, sci-hub.box."
  },
  {
    "cat": "books",
    "name": "Standard Ebooks",
    "desc": "Бесплатные книги с аккуратной вёрсткой",
    "url": "https://standardebooks.org/",
    "tags": [
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "StoryGraph",
    "desc": "Трекинг книг",
    "url": "https://thestorygraph.com/",
    "tags": [
      "трекеры"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Weeb Central",
    "desc": "Чтение манги",
    "url": "https://weebcentral.com/",
    "tags": [
      "манга"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Z-Library",
    "desc": "Электронные книги",
    "url": "https://z-lib.gd/",
    "tags": [
      "книги"
    ],
    "os": [
      "any"
    ],
    "ru": "mirror",
    "note": "Домены Z-Library постоянно блокируют. Актуальные зеркала: z-lib.gd, z-lib.fm, 1lib.sk, go-to-library.sk."
  },
  {
    "cat": "torrents",
    "name": "1337x",
    "desc": "Популярный торрент-индекс",
    "url": "https://1337x.to/",
    "tags": [
      "индексы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok",
    "note": "Доступен напрямую, у части провайдеров требуется смена DNS."
  },
  {
    "cat": "torrents",
    "name": "BiglyBT",
    "desc": "Продвинутый клиент на базе Vuze",
    "url": "https://www.biglybt.com/",
    "tags": [
      "клиенты"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "Deluge",
    "desc": "Торрент-клиент с плагинами",
    "url": "https://deluge-torrent.org/",
    "tags": [
      "клиенты",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "torrents",
    "name": "EZTVx",
    "desc": "Индекс сериалов в виде торрентов",
    "url": "https://eztvx.to/",
    "tags": [
      "торренты",
      "сериалы"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "torrents",
    "name": "Nyaa",
    "desc": "Аниме-торренты",
    "url": "https://nyaa.si/",
    "tags": [
      "индексы",
      "аниме"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "qBittorrent",
    "desc": "Открытый торрент-клиент",
    "url": "https://www.qbittorrent.org/",
    "tags": [
      "клиенты",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "RuTor",
    "desc": "Русскоязычный торрент-трекер",
    "url": "https://rutor.info/",
    "tags": [
      "индексы",
      "русский"
    ],
    "os": [
      "any"
    ],
    "ru": "mirror",
    "note": "Основной домен недоступен из РФ, держите под рукой зеркала rutor.info."
  },
  {
    "cat": "torrents",
    "name": "RuTracker",
    "desc": "Крупный русскоязычный трекер",
    "url": "https://rutracker.org/",
    "tags": [
      "индексы",
      "русский"
    ],
    "os": [
      "any"
    ],
    "ru": "mirror",
    "note": "Домен rutracker.org заблокирован РКН. Работают зеркала и Telegram-канал трекера."
  },
  {
    "cat": "torrents",
    "name": "The Pirate Bay",
    "desc": "Классический торрент-индекс",
    "url": "https://thepiratebay.org/",
    "tags": [
      "индексы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok",
    "note": "DNS блокируется у части провайдеров — заходите через onion-зеркало."
  },
  {
    "cat": "torrents",
    "name": "TorrentGalaxy",
    "desc": "Торрент-индекс",
    "url": "https://torrentgalaxy.to/",
    "tags": [
      "индексы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok",
    "note": "Работает, но качество раздач скачет — проверяйте рейтинг."
  },
  {
    "cat": "torrents",
    "name": "Torrentio",
    "desc": "Addon-индекс для стриминга через debrid",
    "url": "https://torrentio.strem.fun/",
    "tags": [
      "индексы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "torrents",
    "name": "TorrentSearch",
    "desc": "Поиск по трекерам без регистрации",
    "url": "https://torrentsearch.info/",
    "tags": [
      "торренты",
      "поиск",
      "русский"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "torrents",
    "name": "Transmission",
    "desc": "Лёгкий торрент-клиент",
    "url": "https://transmissionbt.com/",
    "tags": [
      "клиенты",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "YTS",
    "desc": "Фильмы в компактном размере",
    "url": "https://yts.mx/",
    "tags": [
      "индексы"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "mobile",
    "name": "AltStore",
    "desc": "Sideloading через AltServer",
    "url": "https://altstore.io/",
    "tags": [
      "iOS"
    ],
    "os": [
      "i"
    ],
    "ru": "ok"
  },
  {
    "cat": "mobile",
    "name": "APKMirror",
    "desc": "Чистые APK без модов",
    "url": "https://www.apkmirror.com/",
    "tags": [
      "APK",
      "легально"
    ],
    "os": [
      "a"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "mobile",
    "name": "APKPure",
    "desc": "Архив APK с версиями под разные архитектуры",
    "url": "https://apkpure.com/",
    "tags": [
      "APK",
      "приложения"
    ],
    "os": [
      "a"
    ]
  },
  {
    "ru": "ok",
    "cat": "mobile",
    "name": "Aptoide",
    "desc": "Магазин APK с собственным клиентом",
    "url": "https://aptoide.com/",
    "tags": [
      "APK",
      "приложения"
    ],
    "os": [
      "a"
    ]
  },
  {
    "cat": "mobile",
    "name": "Aurora Store",
    "desc": "Клиент Google Play без аккаунта Google",
    "url": "https://auroraoss.com/",
    "tags": [
      "APK",
      "системные"
    ],
    "os": [
      "a"
    ],
    "ru": "ok"
  },
  {
    "cat": "mobile",
    "name": "Droid-ify",
    "desc": "Современный клиент F-Droid",
    "url": "https://github.com/Droid-ify/client",
    "tags": [
      "APK",
      "системные"
    ],
    "os": [
      "a"
    ],
    "ru": "ok"
  },
  {
    "cat": "mobile",
    "name": "F-Droid",
    "desc": "Каталог open-source Android-приложений",
    "url": "https://f-droid.org/",
    "tags": [
      "APK",
      "системные"
    ],
    "os": [
      "a"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "mobile",
    "name": "Huawei AppGallery",
    "desc": "Альтернативный магазин приложений для любых Android",
    "url": "https://appgallery.huawei.com/",
    "tags": [
      "приложения",
      "APK"
    ],
    "os": [
      "a"
    ]
  },
  {
    "ru": "ok",
    "cat": "mobile",
    "name": "NashStore",
    "desc": "Российский магазин с банковскими приложениями",
    "url": "https://nashstore.com/",
    "tags": [
      "APK",
      "приложения",
      "легально",
      "русский"
    ],
    "os": [
      "a"
    ]
  },
  {
    "cat": "mobile",
    "name": "NewPipe",
    "desc": "YouTube-клиент без рекламы",
    "url": "https://newpipe.net/",
    "tags": [
      "приложения",
      "системные"
    ],
    "os": [
      "a"
    ],
    "ru": "ok"
  },
  {
    "cat": "mobile",
    "name": "Obtainium",
    "desc": "Обновления приложений с GitHub и сайтов",
    "url": "https://github.com/ImranR98/Obtainium",
    "tags": [
      "утилиты",
      "системные"
    ],
    "os": [
      "a"
    ],
    "ru": "ok"
  },
  {
    "cat": "mobile",
    "name": "Revanced",
    "desc": "Патчи для YouTube и других приложений",
    "url": "https://revanced.app/",
    "tags": [
      "моды"
    ],
    "os": [
      "a"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "mobile",
    "name": "RuStore",
    "desc": "Российский магазин приложений от VK и Минцифры",
    "url": "https://www.rustore.ru/",
    "tags": [
      "приложения",
      "легально",
      "русский",
      "APK"
    ],
    "os": [
      "a"
    ],
    "note": "Предустановлен на смартфоны, которые продают в России. В каталоге приложения банков, удалённые из Google Play."
  },
  {
    "cat": "mobile",
    "name": "Sideloadly",
    "desc": "Установка IPA с компьютера",
    "url": "https://sideloadly.io/",
    "tags": [
      "iOS"
    ],
    "os": [
      "w",
      "m"
    ],
    "ru": "ok"
  },
  {
    "cat": "mobile",
    "name": "SideStore",
    "desc": "Sideloading на iOS без джейлбрейка",
    "url": "https://sidestore.io/",
    "tags": [
      "iOS"
    ],
    "os": [
      "i"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "mobile",
    "name": "Telegram",
    "desc": "Мессенджер, официальное приложение для Android и iOS",
    "url": "https://telegram.org/",
    "tags": [
      "легально",
      "бесплатно",
      "приложения",
      "русский"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ],
    "note": "Приложение убрали из российских магазинов — ставьте APK с официального сайта."
  },
  {
    "cat": "mobile",
    "name": "TrollStore",
    "desc": "Постоянный sideload на части iOS",
    "url": "https://github.com/opa334/TrollStore",
    "tags": [
      "iOS"
    ],
    "os": [
      "i"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "mobile",
    "name": "Uptodown",
    "desc": "Каталог APK и старых версий программ",
    "url": "https://uptodown.com/",
    "tags": [
      "APK",
      "приложения"
    ],
    "os": [
      "w",
      "a"
    ]
  },
  {
    "cat": "learning",
    "name": "Arch Wiki",
    "desc": "Linux-документация",
    "url": "https://wiki.archlinux.org/",
    "tags": [
      "документация",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "Coursera",
    "desc": "Курсы от университетов",
    "url": "https://www.coursera.org/",
    "tags": [
      "курсы",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "CPPreference",
    "desc": "Справочник C и C++",
    "url": "https://en.cppreference.com/",
    "tags": [
      "документация",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "edX",
    "desc": "Онлайн-курсы MIT, Harvard и других",
    "url": "https://www.edx.org/",
    "tags": [
      "курсы",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "freeCodeCamp",
    "desc": "Бесплатное обучение программированию",
    "url": "https://www.freecodecamp.org/",
    "tags": [
      "курсы",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "learning",
    "name": "Habr",
    "desc": "Русскоязычное сообщество разработчиков",
    "url": "https://habr.com/ru/",
    "tags": [
      "разработка",
      "русский",
      "бесплатно",
      "документация"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "learning",
    "name": "Internet Archive",
    "desc": "Книги, видео, софт, веб-архив",
    "url": "https://archive.org/",
    "tags": [
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "Khan Academy",
    "desc": "Бесплатное обучение с нуля",
    "url": "https://www.khanacademy.org/",
    "tags": [
      "курсы",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "MDN Web Docs",
    "desc": "Документация по веб-технологиям",
    "url": "https://developer.mozilla.org/",
    "tags": [
      "документация",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "MIT OCW",
    "desc": "Открытые курсы MIT",
    "url": "https://ocw.mit.edu/",
    "tags": [
      "курсы",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "Odysee",
    "desc": "Видео и документалистика",
    "url": "https://odysee.com/",
    "tags": [
      "видео"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "learning",
    "name": "OSSU",
    "desc": "Открытый путь обучения Computer Science",
    "url": "https://github.com/ossu/computer-science",
    "tags": [
      "курсы",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "learning",
    "name": "Stepik",
    "desc": "Бесплатные курсы на русском от российских вузов",
    "url": "https://stepik.org/",
    "tags": [
      "курсы",
      "легально",
      "бесплатно",
      "русский"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "tools",
    "name": "10MinuteMail",
    "desc": "Одноразовая почта",
    "url": "https://10minutemail.com/",
    "tags": [
      "почта"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "Can I Use",
    "desc": "Поддержка веб-фич в браузерах",
    "url": "https://caniuse.com/",
    "tags": [
      "разработка"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "Convertio",
    "desc": "Конвертация файлов",
    "url": "https://convertio.co/",
    "tags": [
      "утилиты"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "CyberChef",
    "desc": "Набор утилит для данных и кодировок",
    "url": "https://gchq.github.io/CyberChef/",
    "tags": [
      "разработка",
      "утилиты"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "tools",
    "name": "DeepL",
    "desc": "Переводчик с хорошим качеством русского перевода",
    "url": "https://www.deepl.com/",
    "tags": [
      "легально",
      "бесплатно",
      "инструменты"
    ],
    "os": [
      "any"
    ]
  },
  {
    "cat": "tools",
    "name": "DownDetector",
    "desc": "Статус популярных сервисов",
    "url": "https://downdetector.com/",
    "tags": [
      "утилиты"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "Excalidraw",
    "desc": "Быстрые схемы и наброски",
    "url": "https://excalidraw.com/",
    "tags": [
      "утилиты"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "IPLeak",
    "desc": "Проверка утечек IP, DNS и WebRTC",
    "url": "https://ipleak.net/",
    "tags": [
      "приватность"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "JSON Crack",
    "desc": "Визуализация JSON",
    "url": "https://jsoncrack.com/",
    "tags": [
      "разработка"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "Photopea",
    "desc": "Онлайн-аналог Photoshop",
    "url": "https://www.photopea.com/",
    "tags": [
      "картинки",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "regex101",
    "desc": "Тестирование регулярных выражений",
    "url": "https://regex101.com/",
    "tags": [
      "разработка"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "Remove.bg",
    "desc": "Удаление фона с фото",
    "url": "https://www.remove.bg/",
    "tags": [
      "картинки"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "Speedtest",
    "desc": "Проверка скорости интернета",
    "url": "https://www.speedtest.net/",
    "tags": [
      "утилиты"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "Squoosh",
    "desc": "Сжатие изображений",
    "url": "https://squoosh.app/",
    "tags": [
      "картинки",
      "легально"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "Temp-Mail",
    "desc": "Временная почта",
    "url": "https://temp-mail.org/",
    "tags": [
      "почта"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "tools",
    "name": "TinyWow",
    "desc": "Набор онлайн-инструментов",
    "url": "https://tinywow.com/",
    "tags": [
      "утилиты"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "ru": "ok",
    "cat": "downloads",
    "name": "Облако Mail",
    "desc": "Российское облачное хранилище с большими файлами",
    "url": "https://cloud.mail.ru/",
    "tags": [
      "файлообменники",
      "легально",
      "русский"
    ],
    "os": [
      "any"
    ]
  },
  {
    "ru": "ok",
    "cat": "downloads",
    "name": "Яндекс Диск",
    "desc": "Облачное хранилище с приложением для Android",
    "url": "https://disk.yandex.ru/",
    "tags": [
      "файлообменники",
      "легально",
      "русский"
    ],
    "os": [
      "w",
      "m",
      "l",
      "a",
      "i"
    ]
  },
  {
    "cat": "downloads",
    "name": "AB Download Manager",
    "desc": "Современный менеджер загрузок",
    "url": "https://abdownloadmanager.com/",
    "tags": [
      "клиенты",
      "системные"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "aria2",
    "desc": "Мощный консольный загрузчик",
    "url": "https://aria2.github.io/",
    "tags": [
      "клиенты",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "Gofile",
    "desc": "Загрузка файлов без жёстких лимитов",
    "url": "https://gofile.io/",
    "tags": [
      "файлообменники"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "IDM",
    "desc": "Internet Download Manager",
    "url": "https://www.internetdownloadmanager.com/",
    "tags": [
      "клиенты"
    ],
    "os": [
      "w"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "JDownloader",
    "desc": "Менеджер загрузок",
    "url": "https://jdownloader.org/",
    "tags": [
      "клиенты"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "KrakenFiles",
    "desc": "Файлообменник",
    "url": "https://krakenfiles.com/",
    "tags": [
      "файлообменники"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "MediaFire",
    "desc": "Файлообменник",
    "url": "https://www.mediafire.com/",
    "tags": [
      "файлообменники"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "Mega",
    "desc": "Облако с шифрованием",
    "url": "https://mega.nz/",
    "tags": [
      "файлообменники"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "Motrix",
    "desc": "GUI-загрузчик на базе aria2",
    "url": "https://motrix.app/",
    "tags": [
      "клиенты"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "Pixeldrain",
    "desc": "Быстрый файлообменник",
    "url": "https://pixeldrain.com/",
    "tags": [
      "файлообменники"
    ],
    "os": [
      "any"
    ],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "wget",
    "desc": "Консольная загрузка файлов",
    "url": "https://www.gnu.org/software/wget/",
    "tags": [
      "клиенты",
      "системные"
    ],
    "os": [
      "w",
      "m",
      "l"
    ],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "NNM-Club",
    "desc": "Русский трекер и форум: раздачи, обсуждения, рецензии, разделы по темам.",
    "url": "https://nnm-club.me/",
    "tags": ["торренты", "трекеры", "русский"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "LimeTorrents",
    "desc": "Индекс торрентов с быстрым поиском по имени файла.",
    "url": "https://www.limetorrents.lol/",
    "tags": ["торренты", "индексы"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "Torrentz2",
    "desc": "Индекс метафайлов .torrent без рекламных переходов.",
    "url": "https://torrentz2.nz/",
    "tags": ["торренты", "индексы"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "Zooqle",
    "desc": "Индекс с хорошей индексацией редких раздач.",
    "url": "https://zooqle.com/",
    "tags": ["торренты", "индексы"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "Toorgle",
    "desc": "Поисковая надстройка: ищет сразу по нескольким индексам.",
    "url": "https://toorgle.me/",
    "tags": ["торренты", "индексы", "поиск"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "torrents",
    "name": "RARBG",
    "desc": "Индекс с подборками свежих релизов. Домены постоянно меняются — старые могут не открываться.",
    "url": "https://rarbg.to/",
    "tags": ["торренты", "индексы"],
    "os": ["any"],
    "ru": "ok",
    "note": "Домены меняются регулярно: если ссылка не открывается, поищите актуальный адрес через rutor или rutracker."
  },
  {
    "cat": "torrents",
    "name": "Torlock",
    "desc": "Индекс magnet-ссылок без рекламы на страницах.",
    "url": "https://torlock.com/",
    "tags": ["торренты", "индексы"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "Sukebei.Nyaa.si",
    "desc": "Ветка Nyaa для взрослого аниме и редких раздач.",
    "url": "https://sukebei.nyaa.si/",
    "tags": ["торренты", "аниме"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "AniDex",
    "desc": "Трекер аниме с двойными озвучками и субтитрами, есть рейтинги.",
    "url": "https://anidex.info/",
    "tags": ["торренты", "аниме"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "LibGen: gen.lib.rus.ec",
    "desc": "Русское зеркало LibGen — часто доступно без обхода.",
    "url": "https://gen.lib.rus.ec/",
    "tags": ["книги", "зеркала"],
    "os": ["any"],
    "ru": "mirror",
    "note": "Зеркало живёт дольше основного домена, но тоже периодически отключается."
  },
  {
    "cat": "books",
    "name": "Б-ОК / Bookzz",
    "desc": "Библиотека книг на нескольких языках, есть поиск по автору.",
    "url": "https://b-ok.org/",
    "tags": ["книги"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Mobilism",
    "desc": "Форум о книгах с разделом запросов и обсуждениями новинок.",
    "url": "https://mobilism.org/",
    "tags": ["книги", "форум"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Booksc",
    "desc": "Поиск по сотням миллионов книг и научных статей.",
    "url": "https://booksc.org/",
    "tags": ["книги", "наука"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "FreeBookSpot",
    "desc": "Бесплатные книги в epub, mobi и pdf.",
    "url": "https://freebookspot.es/",
    "tags": ["книги", "бесплатно"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "Ebookee",
    "desc": "Каталог книг по авторам и жанрам.",
    "url": "https://ebookee.org/",
    "tags": ["книги", "бесплатно"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "books",
    "name": "AudiobookBay",
    "desc": "Аудиокниги и раздачи, много общего с трекером MAM.",
    "url": "https://audiobookbay.is/",
    "tags": ["аудиокниги", "книги"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "CS.RIN.RU",
    "desc": "Форум по играм: обсуждения, патчи, раздачи, просьбы о поиске игр.",
    "url": "https://cs.rin.ru/forum/",
    "tags": ["игры", "форум", "русский"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "DODI Repacks",
    "desc": "Репаки с акцентом на чистоту установки и малый размер.",
    "url": "https://dodi-repacks.com/",
    "tags": ["игры", "репаки", "скачивание"],
    "os": ["w"],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "The Eye",
    "desc": "Крупная архив ROM: консоли, аркадные автоматы, handheld.",
    "url": "https://the-eye.eu/",
    "tags": ["ROM", "эмуляторы"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "ROMULATION",
    "desc": "ROM для Switch, PS Vita, PSP, Game Boy и других платформ.",
    "url": "https://romulation.net/",
    "tags": ["ROM", "эмуляторы"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "games",
    "name": "EmuParadise",
    "desc": "Архив ROM: NDS, PSP, PSX, NES, SNES, Wii.",
    "url": "https://www.emuparadise.me/",
    "tags": ["ROM", "эмуляторы"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "Wotaku",
    "desc": "Агрегатор аниме: ссылки на стриминг, торренты и загрузки в одном месте.",
    "url": "https://wotaku.moe/",
    "tags": ["аниме", "стриминг", "бесплатно"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "The Index",
    "desc": "Каталог аниме с торрентами, magnet-ссылками и прямыми загрузками.",
    "url": "https://theindex.moe/",
    "tags": ["аниме", "бесплатно"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "EverythingMoe",
    "desc": "Список аниме-ресурсов и обновлений озвучек.",
    "url": "https://everythingmoe.com/",
    "tags": ["аниме", "бесплатно"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "AnimePahe",
    "desc": "Зеркало AnimePahe: сериалы с субтитрами, есть расписание выхода.",
    "url": "https://animepahe.com/",
    "tags": ["аниме", "стриминг"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "media",
    "name": "Subslikescript",
    "desc": "База субтитров к сериалам с готовыми таймкодами.",
    "url": "https://subslikescript.com/",
    "tags": ["сериалы", "субтитры", "бесплатно"],
    "os": ["any"],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "4K Video Downloader",
    "desc": "Загрузка видео и аудиодорожек с YouTube и других сервисов.",
    "url": "https://www.4kdownload.com/",
    "tags": ["утилиты", "бесплатно", "видео"],
    "os": ["w", "m", "l"],
    "ru": "ok"
  },
  {
    "cat": "software",
    "name": "MediaInfo",
    "desc": "Показывает метаданные файлов: кодек, битрейт, дорожки, субтитры.",
    "url": "https://mediaarea.net/en/MediaInfo",
    "tags": ["утилиты", "бесплатно", "системные"],
    "os": ["w", "m", "l"],
    "ru": "ok"
  },
  {
    "cat": "downloads",
    "name": "1fichier",
    "desc": "Файлообменник с большими лимитами и защитой от спама.",
    "url": "https://1fichier.com/",
    "tags": ["файлообменники", "бесплатно"],
    "os": ["any"],
    "ru": "ok"
  },
];

export const CAT_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));
