import { RESOURCES } from '../data/resources.js';
import { unlock } from './main.js';
const CATN={soft:'Софт',games:'Игры',movies:'Кино',ai:'AI'};
let aiMode=false, aiT=null;

export function initSearch(){
  const q=document.getElementById('q'), box=document.getElementById('results');
  document.getElementById('aiBtn').addEventListener('click',e=>{ aiMode=!aiMode; e.target.classList.toggle('on',aiMode); q.placeholder=aiMode?'Спроси своими словами…':'Найти софт, игру, нейросеть…'; });
  const plain=v=>RESOURCES.filter(x=>(x.name+' '+x.desc).toLowerCase().includes(v)).slice(0,8);
  const draw=(hits,ai)=>{ box.innerHTML=hits.map(h=>`<button class="r-item" data-page="${h.cat}" data-id="${h.url}"><span class="r-ico ${h.grad}">${(h.name[0]||'M').toUpperCase()}</span><span>${h.name}<small>${CATN[h.cat]}</small></span>${ai?'<span class="ai-mark">AI</span>':''}</button>`).join('')||'<button class="r-item" disabled><span style="color:var(--muted)">Ничего не нашлось</span></button>'; box.classList.add('open'); };
  q.addEventListener('input',()=>{
    const v=q.value.trim().toLowerCase(); clearTimeout(aiT);
    if(v.length<2){ box.classList.remove('open'); return; }
    if(!aiMode){ draw(plain(v),false); return; }
    box.innerHTML='<button class="r-item" disabled><span style="color:var(--muted)">AI думает…</span></button>'; box.classList.add('open');
    aiT=setTimeout(()=>{
      const list=RESOURCES.map(x=>x.name+' — '+x.desc).join('; ');
      fetch('https://text.pollinations.ai/'+encodeURIComponent('Каталог ресурсов: '+list+'. Запрос: '+v+'. Ответь списком точных названий из каталога (до 5), по одному в строке, без пояснений.'))
        .then(r=>r.text()).then(text=>{
          const hits=[]; text.split('\n').forEach(l=>{ l=l.trim().replace(/^[-•\d.]+/,''); if(!l) return; const low=l.toLowerCase();
            const f=RESOURCES.find(x=>{ const n=x.name.toLowerCase(); return n===low||low.includes(n)||n.includes(low); }); if(f&&!hits.includes(f)) hits.push(f); });
          draw(hits.length?hits.slice(0,5):plain(v).slice(0,5),true); unlock('sage');
        }).catch(()=>draw(plain(v).slice(0,5),false));
    },600);
  });
  box.addEventListener('click',e=>{
    const it=e.target.closest('.r-item'); if(!it||!it.dataset.id) return;
    import('./main.js').then(m=>{ m.showTab(it.dataset.page);
      setTimeout(()=>{ const el=document.querySelector(`#${it.dataset.page} .res[data-id="${it.dataset.id}"]`); if(el){ el.scrollIntoView({block:'center'}); el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),1200); } },50); });
  });
  document.addEventListener('click',e=>{ if(!e.target.closest('.search-wrap')) box.classList.remove('open'); });
}
