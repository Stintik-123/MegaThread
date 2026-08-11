import { LS, toast, unlock } from './main.js';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inline=s=>s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
function md(src){ const lines=esc(src).split('\n'); let html='',list=false,para=[];
  const flush=()=>{ if(para.length){ html+='<p>'+inline(para.join(' '))+'</p>'; para=[]; } if(list){ html+='</ul>'; list=false; } };
  for(const raw of lines){ const l=raw.trim(); if(!l){ flush(); continue; }
    if(l.startsWith('- ')){ if(!list){ flush(); html+='<ul>'; list=true; } html+='<li>'+inline(l.slice(2))+'</li>'; continue; }
    flush();
    if(l.startsWith('### ')) html+='<h3>'+inline(l.slice(4))+'</h3>';
    else if(l.startsWith('## ')) html+='<h2>'+inline(l.slice(3))+'</h2>';
    else if(l.startsWith('# ')) html+='<h1>'+inline(l.slice(2))+'</h1>';
    else para.push(l); }
  flush(); return html; }
const fullMd=()=>{ const t=document.getElementById('edTitle').value.trim(); return (t?`# ${t}\n\n`:'')+document.getElementById('edBody').value; };

export function initEditor(){
  const t=document.getElementById('edTitle'), b=document.getElementById('edBody'), p=document.getElementById('edPreview'), st=document.getElementById('edStatus');
  const prev=()=>{ const tt=t.value.trim(); p.innerHTML=(tt?'<h1>'+esc(tt)+'</h1>':'')+(md(b.value)||'<p class="ph">Здесь появится превью…</p>'); };
  const save=()=>{ LS('draft',{t:t.value,b:b.value}); st.textContent='Черновик сохранён · '+new Date().toLocaleTimeString().slice(0,5); };
  t.addEventListener('input',()=>{ prev(); save(); unlock('scribe'); });
  b.addEventListener('input',()=>{ prev(); save(); unlock('scribe'); });
  document.querySelectorAll('.ed-bar button').forEach(btn=>btn.addEventListener('click',()=>{
    const a=btn.dataset.a||'', w=btn.dataset.w||''; const s=b.selectionStart,e=b.selectionEnd,v=b.value;
    b.value=v.slice(0,s)+w+v.slice(s,e)+a+v.slice(e); b.focus(); prev(); save();
  }));
  document.getElementById('copyMd').addEventListener('click',()=>{ navigator.clipboard.writeText(fullMd()); toast('Markdown скопирован — создай PR или Issue на GitHub'); });
  document.getElementById('dlMd').addEventListener('click',()=>{
    const blob=new Blob([fullMd()],{type:'text/markdown'}); const a=document.createElement('a');
    a.href=URL.createObjectURL(blob); a.download=(t.value.trim()||'article').replace(/\s+/g,'-')+'.md'; a.click(); URL.revokeObjectURL(a.href);
    toast('Файл .md скачан');
  });
  const open=fill=>{ document.getElementById('emptyState').style.display='none'; document.getElementById('editor').classList.add('open');
    if(fill){ const d=LS('draft'); if(d){ t.value=d.t||''; b.value=d.b||''; prev(); st.textContent='Черновик восстановлен.'; } } };
  document.getElementById('openEdBtn').addEventListener('click',()=>open(false));
  document.getElementById('closeEd').addEventListener('click',()=>{ document.getElementById('editor').classList.remove('open'); document.getElementById('emptyState').style.display=''; });
  const d=LS('draft');
  if(d&&(d.t||d.b)){ document.querySelector('#emptyState b').textContent='У тебя есть черновик'; const ob=document.getElementById('openEdBtn'); ob.textContent='Продолжить черновик →'; ob.addEventListener('click',()=>open(true),{once:true}); }
}
