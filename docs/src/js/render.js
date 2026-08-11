import { RESOURCES, CATS } from '../data/resources.js';

export function rowEl(x){
  const el=document.createElement('div');
  el.className='res'; el.dataset.id=x.url; el.dataset.tags=x.tags.join(' '); el.dataset.os=x.os.join(' ');
  el.innerHTML =
    `<div class="res-ico ${x.grad}">${(x.name[0]||'M').toUpperCase()}</div>`+
    `<div class="res-info"><b>${x.name}</b><span>${x.desc}</span></div>`+
    `<div class="res-badges">${x.tags.includes('free')?'<span class="rb gr">FREE</span>':''}${x.tags.includes('os')?'<span class="rb p">OS</span>':''}${x.tags.includes('ru')?'<span class="rb b">RU</span>':''}<span class="rb lk">…</span></div>`+
    `<button class="more">⌄</button><a class="go" href="${x.url}" target="_blank" rel="noopener">→</a>`+
    `<div class="res-extra"></div>`;
  return el;
}

const OSBTN = `<div class="filters osrow"><span class="osnote">Твоя ОС:</span><span class="f os" data-os="w">Windows</span><span class="f os" data-os="m">macOS</span><span class="f os" data-os="l">Linux</span><span class="f os" data-os="a">Android</span><span class="f os" data-os="i">iOS</span></div>`;
const ISSUE = `<div class="issue-cta">Хотели найти что-то, а его тут нет? <a href="https://github.com/Stintik-123/MegaThread/issues/new" target="_blank" rel="noopener">Создайте Issue на GitHub →</a></div><footer>© 2026 megathread · MIT</footer>`;

export function renderCategoryPages(){
  for(const key in CATS){
    const page=document.getElementById(key);
    page.innerHTML =
      `<div class="cat-top"><button class="back" data-tab="home">←</button><div><p class="tag" style="margin-bottom:6px">Раздел</p><h1 class="cat-title">${CATS[key].title}</h1></div></div>`+
      `<div class="filters"><span class="f active" data-f="all">Все</span><span class="f" data-f="os">OPEN SOURCE</span><span class="f" data-f="ru">RU</span></div>`+OSBTN;
    RESOURCES.filter(r=>r.cat===key).forEach(r=>page.appendChild(rowEl(r)));
    page.insertAdjacentHTML('beforeend', ISSUE);
  }
  // фильтры по тегам
  document.querySelectorAll('.filters:not(.osrow)').forEach(f=>f.addEventListener('click',e=>{
    const b=e.target.closest('.f'); if(!b) return;
    f.querySelectorAll('.f').forEach(x=>x.classList.remove('active')); b.classList.add('active'); applyFilters(f.closest('.page'));
  }));
  // фильтры по ОС + автоопределение
  let osF=null;
  const ua=navigator.userAgent;
  const MYOS=/Android/i.test(ua)?'a':/iPhone|iPad|iPod/i.test(ua)?'i':/Mac/i.test(ua)?'m':/Linux/i.test(ua)?'l':'w';
  document.querySelectorAll('.osrow').forEach(row=>{
    const mine=row.querySelector(`.os[data-os="${MYOS}"]`);
    if(mine){ mine.classList.add('mine'); row.querySelector('.osnote').textContent=`Твоя ОС (${mine.textContent}):`; }
    row.addEventListener('click',e=>{
      const b=e.target.closest('.os'); if(!b) return;
      row.querySelectorAll('.os').forEach(x=>x.classList.remove('active'));
      osF = osF===b.dataset.os ? null : b.dataset.os; if(osF) b.classList.add('active');
      applyFilters(row.closest('.page'));
    });
  });
  function applyFilters(page){
    const tag=page.querySelector('.filters:not(.osrow) .f.active').dataset.f;
    page.querySelectorAll('.res').forEach(r=>{
      const okTag = tag==='all' || r.dataset.tags.split(' ').includes(tag);
      const okOs = !osF || (r.dataset.os||'').includes(osF);
      r.style.display = okTag&&okOs ? '' : 'none';
    });
  }
}

export function renderHomeCards(){
  const covers={ soft:'photo-1555066931-4365d14bab8c', games:'photo-1542751371-adc38448a05e', movies:'photo-1489599849927-2ee91cede3ba', ai:'photo-1677442136019-21780ecad995' };
  const box=document.getElementById('catCards'); let html='';
  for(const key in CATS){
    const n=RESOURCES.filter(r=>r.cat===key).length;
    html+=`<div class="card"><div class="media"><img class="cover" loading="lazy" decoding="async" src="https://images.unsplash.com/${covers[key]}?q=80&w=900&auto=format&fit=crop" alt=""><div class="shade"></div><span class="chip">${n} ресурсов</span></div><h3>${CATS[key].title}</h3><p>${CATS[key].desc}</p><button class="pill" data-tab="${key}">Открыть раздел →</button></div>`;
  }
  box.innerHTML=html;
}

export function renderDaily(){
  const day=Math.floor(Date.now()/86400000);
  const pick=RESOURCES[day%RESOURCES.length];
  const box=document.getElementById('daily');
  box.innerHTML=`<div class="daily-ico ${pick.grad}">${(pick.name[0]||'M').toUpperCase()}</div><div style="flex:1"><p class="tag" style="margin-bottom:6px">Ресурс дня · меняется каждые сутки</p><b>${pick.name}</b><p>${pick.desc}</p></div><button class="pill" id="dailyBtn">Открыть →</button>`;
  document.getElementById('dailyBtn').addEventListener('click',()=>{
    import('./main.js').then(m=>{
      m.showTab(pick.cat);
      setTimeout(()=>{ const el=document.querySelector(`#${pick.cat} .res[data-id="${pick.url}"]`); if(el){ el.scrollIntoView({block:'center'}); el.classList.add('flash'); } },100);
    });
  });
}

export function renderRecs(){
  const cat=(localStorage.getItem('mt_lastcat')||'').replace(/"/g,'')||'soft';
  document.getElementById('recNote').textContent = localStorage.getItem('mt_lastcat') ? 'На основе раздела, который ты открывал:' : 'Пока просто подборка дня — открывай разделы, и она станет персональной.';
  const pool=RESOURCES.filter(r=>r.cat===cat).sort(()=>Math.random()-.5).slice(0,3);
  document.getElementById('recRow').innerHTML=pool.map(r=>`<a class="rec" href="${r.url}" target="_blank" rel="noopener"><b>${r.name}</b><span>${r.desc}</span></a>`).join('');
}
