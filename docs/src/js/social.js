import { LS, unlock } from './main.js';
const TAGS=['без VPN','быстрый','много рекламы','есть RU'];

export function bindSocial(){
  document.querySelectorAll('.res').forEach(r=>{
    const id=r.dataset.id, ex=r.querySelector('.res-extra');
    const my=LS('vote_'+id)||0, myStar=LS('star_'+id)||0, myTags=LS('tags_'+id)||[], cms=LS('cm_'+id)||[];
    ex.innerHTML =
      `<div class="x-row"><span class="x-lbl">Голос</span><div class="vote"><button class="vb up${my===1?' on':''}">▲</button><button class="vb dn${my===-1?' on':''}">▼</button></div><span class="local-note">твой голос хранится у тебя</span></div>`+
      `<div class="x-row"><span class="x-lbl">Оценка</span><div class="stars">${[1,2,3,4,5].map(i=>`<button class="st${i<=myStar?' on':''}" data-i="${i}">★</button>`).join('')}</div></div>`+
      `<div class="x-row"><span class="x-lbl">Метки</span><div class="tagchk">${TAGS.map(t=>`<button class="tc${myTags.includes(t)?' on':''}" data-t="${t}">${t}</button>`).join('')}</div></div>`+
      `<div class="x-row" style="align-items:flex-start"><span class="x-lbl">Заметки</span><div class="comments" style="flex:1"><div class="cm-list">${cms.map(c=>`<div class="cm">${c}</div>`).join('')||'<span class="local-note">Пока пусто.</span>'}</div><div class="cm-add"><input placeholder="Твоя заметка…"><button>→</button></div><span class="local-note">голоса, оценки и заметки хранятся только на этом устройстве — без аккаунтов и слежки</span></div></div>`;
    r.querySelector('.more').addEventListener('click',()=>r.classList.toggle('open-extra'));
    ex.querySelector('.vb.up').addEventListener('click',()=>{ setVote(r,1); unlock('critic'); });
    ex.querySelector('.vb.dn').addEventListener('click',()=>{ setVote(r,-1); unlock('critic'); });
    const st=ex.querySelectorAll('.st');
    st.forEach(s=>s.addEventListener('click',()=>{ LS('star_'+id,+s.dataset.i); st.forEach(x=>x.classList.toggle('on',+x.dataset.i<=+s.dataset.i)); unlock('star'); }));
    ex.querySelectorAll('.tc').forEach(t=>t.addEventListener('click',()=>{ let a=LS('tags_'+id)||[]; a=a.includes(t.dataset.t)?a.filter(x=>x!==t.dataset.t):[...a,t.dataset.t]; LS('tags_'+id,a); t.classList.toggle('on'); }));
    const add=ex.querySelector('.cm-add button'), inp=ex.querySelector('.cm-add input');
    const send=()=>{ const v=inp.value.trim(); if(!v) return; const a=LS('cm_'+id)||[]; a.push(v); LS('cm_'+id,a); ex.querySelector('.cm-list').innerHTML=a.map(c=>`<div class="cm">${c}</div>`).join(''); inp.value=''; unlock('voice'); };
    add.addEventListener('click',send); inp.addEventListener('keydown',e=>{ if(e.key==='Enter') send(); });
  });
}
function setVote(r,v){ const id=r.dataset.id; const cur=LS('vote_'+id)||0; const nv=cur===v?0:v; LS('vote_'+id,nv);
  r.querySelector('.vb.up').classList.toggle('on',nv===1); r.querySelector('.vb.dn').classList.toggle('on',nv===-1); }
