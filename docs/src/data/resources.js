// ВЕСЬ каталог живёт здесь. Добавить ресурс = добавить одну строку.
// r(категория, id, название, описание, ссылка, теги, ОС, градиент)
// теги: free, ru, os | ОС: w m l a i | градиент: g1..g5
const r = (cat,id,name,desc,url,tags,os,grad)=>({cat,id,name,desc,url,tags,os,grad});

export const CATS = {
  soft:  { title:'Софт и программы', desc:'Бесплатные и открытые программы для работы и творчества' },
  games: { title:'Игры', desc:'Free-to-play и open-source игры, плюс халява Epic' },
  movies:{ title:'Кино и сериалы', desc:'Легальные кинотеатры с бесплатными разделами и архивы' },
  ai:    { title:'Нейросети и AI', desc:'Бесплатные нейросети для текста, картинок и музыки' },
};

export const RESOURCES = [
  r('soft','davinci','DaVinci Resolve','Профессиональный монтаж и цветокоррекция, бесплатная версия','https://www.blackmagicdesign.com/products/davinciresolve',['free','ru'],['w','m','l'],'g1'),
  r('soft','blender','Blender','3D-моделирование, анимация и рендер — стандарт индустрии','https://www.blender.org',['free','os','ru'],['w','m','l'],'g5'),
  r('soft','krita','Krita','Рисование и цифровая живопись для художников','https://krita.org',['free','os','ru'],['w','m','l'],'g2'),
  r('soft','gimp','GIMP','Редактор изображений, свободная альтернатива Photoshop','https://www.gimp.org',['free','os','ru'],['w','m','l'],'g3'),
  r('soft','audacity','Audacity','Запись и монтаж звука, от подкаста до трека','https://www.audacityteam.org',['free','os','ru'],['w','m','l'],'g4'),
  r('soft','libreoffice','LibreOffice','Полноценный офисный пакет вместо MS Office','https://ru.libreoffice.org',['free','os','ru'],['w','m','l'],'g1'),
  r('soft','obs','OBS Studio','Запись экрана и стриминг, выбор стримеров','https://obsproject.com',['free','os','ru'],['w','m','l'],'g5'),
  r('soft','vlc','VLC','Проигрывает любой формат видео и аудио','https://www.videolan.org',['free','os','ru'],['w','m','l','a','i'],'g2'),
  r('soft','7zip','7-Zip','Архиватор, бесплатный навсегда','https://www.7-zip.org',['free','os','ru'],['w'],'g3'),
  r('soft','vscode','VS Code','Редактор кода, стандарт для разработчиков','https://code.visualstudio.com',['free','ru'],['w','m','l'],'g4'),
  r('games','epic','Epic Games — халява недели','Каждую неделю Epic раздаёт платные игры бесплатно','https://store.epicgames.com/free-games',['free'],['w','m'],'g2'),
  r('games','cs2','Counter-Strike 2','Легендарный шутер, бесплатно в Steam','https://store.steampowered.com/app/730/CounterStrike_2/',['free','ru'],['w','m','l'],'g1'),
  r('games','dota2','Dota 2','Главная MOBA, бесплатна навсегда','https://store.steampowered.com/app/570/Dota_2/',['free','ru'],['w','m','l'],'g2'),
  r('games','warframe','Warframe','Кооперативный шутер про космических ниндзя','https://www.warframe.com',['free','ru'],['w'],'g5'),
  r('games','poe','Path of Exile','Тёмная ARPG с честной бесплатной моделью','https://www.pathofexile.com',['free','ru'],['w','m'],'g4'),
  r('games','tf2','Team Fortress 2','Классика Valve, жива и любима','https://store.steampowered.com/app/440/Team_Fortress_2/',['free'],['w','m','l'],'g3'),
  r('games','unturned','Unturned','Бесплатное выживание в кубическом стиле','https://store.steampowered.com/app/304930/Unturned/',['free'],['w'],'g2'),
  r('games','brawlhalla','Brawlhalla','Бесплатный файтинг-платформер с друзьями','https://www.brawlhalla.com',['free'],['w','m'],'g1'),
  r('games','0ad','0 A.D.','Открытая стратегия в духе Age of Empires','https://play0ad.com',['free','os'],['w','m','l'],'g4'),
  r('games','minetest','Minetest','Открытый «майнкрафт», расширяется модами','https://www.minetest.net',['free','os','ru'],['w','m','l','a'],'g3'),
  r('games','supertuxkart','SuperTuxKart','Аркадные гонки с открытым кодом','https://supertuxkart.net',['free','os','ru'],['w','m','l','a'],'g5'),
  r('movies','kinopoisk','Кинопоиск','Бесплатный раздел с рекламой — легально','https://www.kinopoisk.ru',['free','ru'],['w','m','l','a','i'],'g2'),
  r('movies','smotrim','Смотрим','Онлайн-кинотеатр ВГТРК: фильмы и сериалы бесплатно','https://smotrim.ru',['free','ru'],['w','m','l','a','i'],'g1'),
  r('movies','moretv','MORE.TV','Бесплатные фильмы и сериалы с рекламой','https://more.tv',['free','ru'],['w','m','l','a','i'],'g3'),
  r('movies','rutube','RuTube','Российская видеоплатформа: фильмы, шоу, блоги','https://rutube.ru',['free','ru'],['w','m','l','a','i'],'g4'),
  r('movies','youtube','YouTube','Тысячи легальных фильмов на официальных каналах','https://www.youtube.com',['free'],['w','m','l','a','i'],'g2'),
  r('movies','archive','Internet Archive','Огромный архив фильмов в общественном достоянии','https://archive.org/details/movies',['free'],['w','m','l','a','i'],'g5'),
  r('ai','deepseek','DeepSeek','Мощный бесплатный ИИ-чат, отлично пишет код','https://chat.deepseek.com',['free'],['w','m','l','a','i'],'g1'),
  r('ai','chatgpt','ChatGPT','Самый известный ИИ-чат, есть бесплатный тариф','https://chatgpt.com',['free'],['w','m','l','a','i'],'g4'),
  r('ai','gigachat','GigaChat','ИИ-чат Сбера, понимает русский как родной','https://giga.chat',['free','ru'],['w','m','l','a','i'],'g2'),
  r('ai','alice','Алиса с YandexGPT','Яндексовский ИИ-чат в браузере','https://alice.yandex.ru',['free','ru'],['w','m','l','a','i'],'g3'),
  r('ai','kandinsky','Kandinsky','Генерация картинок по-русски, бесплатно','https://fusionbrain.ai',['free','ru'],['w','m','l','a','i'],'g5'),
  r('ai','suno','Suno','Песни и музыка по текстовому описанию','https://suno.com',['free'],['w','m','l','a','i'],'g2'),
  r('ai','stablediffusion','Stable Diffusion','Открытая генерация изображений, ставится локально','https://stability.ai',['free','os'],['w','m','l'],'g4'),
  r('ai','fooocus','Fooocus','Качество Midjourney, но локально и с открытым кодом','https://github.com/lllyasviel/Fooocus',['free','os'],['w','m','l'],'g1'),
];
