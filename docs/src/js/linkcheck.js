import { LS, unlock } from './main.js';
export function initLinkCheck(){
  try{
    const cache=LS('lc')||{}, now=Date.now();
    const items=[...document.querySelectorAll('.res')]; let idx=0;
    const apply=(r,s)=>{ const lk=r.querySelector('.lk'); if(!lk) return;
      if(s==='ok'){ lk.textContent='жива'; lk.className='rb lk ok'; }
      else if(s==='dead'){ lk.textContent='мертва'; lk.className='rb lk dead'; r.classList.add('dead'); }
      else { lk.textContent='не проверено'; lk.className='rb lk err'; } };
    const next=()=>{ if(idx>=items.length) return; const r=items[idx++]; const id=r.dataset.id; const c=cache[id];
      if(c && now-c.t<86400000){ apply(r,c.s); next(); return; }
      fetch('https://api.allorigins.win/get?url='+encodeURIComponent(id)).then(x=>x.json()).then(j=>{
        const code=j&&j.status?j.status.http_code:0; const s=code>=200&&code<400?'ok':'dead';
        cache[id]={s,t:now}; apply(r,s); LS('lc',cache); next();
      }).catch(()=>{ cache[id]={s:'err',t:now}; apply(r,'err'); LS('lc',cache); next(); });
    };
    next(); unlock('inspector');
  }catch(e){}
}
