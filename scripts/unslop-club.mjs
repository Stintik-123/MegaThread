/* Герой с аватаркой сообщества + тихие статусы вместо белой плашки. */
import fs from 'node:fs';

const p = 'css/style.css';
let s = fs.readFileSync(p, 'utf8');

const club = `
/* --- hero: аватарка сообщества --- */
.hero__visual--club {
  display: flex;
  align-items: center;
  gap: var(--s5);
  padding: var(--s6);
  background: var(--surface);
  border: var(--border) solid var(--line);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-2);
}

.hero__avatar {
  width: 112px;
  height: 112px;
  flex: none;
  border-radius: var(--radius-ctl);
  border: var(--border) solid var(--line);
  object-fit: cover;
  background: var(--surface-2);
}

.hero__club { min-width: 0; }

.hero__club b {
  display: block;
  font-size: var(--fs-h3);
  font-weight: 500;
  letter-spacing: -.01em;
}

.hero__club span {
  display: block;
  margin-top: var(--s1);
  font-size: var(--fs-body);
  color: var(--fg-muted);
}

.hero__club .hero__club-meta {
  margin-top: var(--s3);
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--fg-faint);
}
`;

if (!s.includes('.hero__visual--club')) s += club;

// статусы доступности: одинаковые тихие плашки, без заливки белым по чёрному
s = s.replace(
  /\.ru--ok \{[^}]*\}/,
  `.ru--ok { color: var(--st-limited-fg); background: var(--st-limited-bg); }`
);

fs.writeFileSync(p, s, 'utf8');
console.log('герой и статусы обновлены');
