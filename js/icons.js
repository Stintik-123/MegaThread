// Линейные иконки (24×24, currentColor). Никаких эмодзи и внешних спрайтов.

const P = {
  film: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M8 4v16M16 4v16M3 9h5M16 9h5M3 15h5M16 15h5"/>',
  gamepad: '<rect x="2" y="7" width="20" height="11" rx="2"/><path d="M7 11v4M5 13h4M15.5 12.5h.01M18 14h.01"/>',
  app: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  shield: '<path d="M12 3 5 6v6c0 4 3 7.5 7 9 4-1.5 7-5 7-9V6l-7-3Z"/><path d="m9 12 2 2 4-4"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  music: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  book: '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Z"/><path d="M18 7h2v13H7"/>',
  download: '<path d="M12 3v11M8 11l4 4 4-4M4 19h16"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18.5h2"/>',
  tool: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 8-8 .3-3.7Z"/><path d="M7 17H3v-4l3.5-3.5"/>',
  external: '<path d="M14 4h6v6M20 4l-8 8"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  star: '<path d="m12 3 2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.8 6.1 21.2l1.3-6.6L2.5 10l6.6-.8L12 3Z"/>',
  copy: '<rect x="9" y="9" width="11" height="11" rx="1"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  link: '<path d="M10 13a4 4 0 0 0 5.7.4l2.6-2.6a4 4 0 1 0-5.7-5.7L11.2 6.5"/><path d="M14 11a4 4 0 0 0-5.7-.4L5.7 13.1a4 4 0 1 0 5.7 5.7l1.4-1.4"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M4.2 12H2M22 12h-2.2M6.1 6.1 4.5 4.5M19.5 19.5l-1.6-1.6M17.9 6.1l1.6-1.6M4.5 19.5l1.6-1.6"/>',
  moon: '<path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2Z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.6 9.3a2.5 2.5 0 1 1 3.3 2.4c-.6.2-.9.8-.9 1.4v.4"/><path d="M12 17h.01"/>',
  install: '<path d="M12 4v10M8 11l4 4 4-4M5 19h14"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  home: '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  check: '<path d="m5 13 4 4L19 7"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  download2: '<path d="M12 3v11M8 11l4 4 4-4M4 19h16"/>',
};

export function icon(name, size = 20) {
  const d = P[name];
  if (!d) return '';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

export const ICON_NAMES = Object.keys(P);
