import { RESOURCES } from '../data/resources.js';
import { renderCategoryPages, renderHomeCards, renderDaily, renderRecs } from './render.js';
import { bindSocial } from './social.js';
import { initSearch } from './search.js';
import { initLinkCheck } from './linkcheck.js';
import { initEditor } from './editor.js';
import { initAchieve, unlock } from './achieve.js';
import { initBackground } from './background.js';

export const LS = (k,v)=>{ try{ if(v===undefined) return JSON.parse(localStorage.getItem('mt_'+k)||'null'); localStorage.setItem('mt_'+k, JSON.stringify(v)); }catch(e){ return null } };
export const toast = t=>{ const el=document.getElementById('toast'); el.textContent=t; el.classList.add('show'); clearTimeout(el._t); el._t=setTimeout(()=>el.classList.remove('show'),2600); };
export { unlock };

export function showTab(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const p=document.getElementById(id); if(p) p.classList.add('active');
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===id));
  document.getElementById('results').classList.remove('open');
  if(['soft','games','movies','ai'].includes(id)){ LS('lastcat',id); renderRecs(); unlock('step'); }
  window.scrollTo({top:0});
}

function init(){
  renderCategoryPages(); renderHomeCards(); renderDaily(); renderRecs();
  bindSocial(); initSearch(); initEditor(); initAchieve(); initBackground();
  window.addEventListener('load', initLinkCheck);

  // единый делегированный обработчик навигации
  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-tab]'); if(t) showTab(t.dataset.tab);
    if(e.target.closest('.issue-cta a')) unlock('finder');
  });
  document.addEventListener('keydown',e=>{
    if(e.key==='/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)){ e.preventDefault(); document.getElementById('q').focus(); }
    if(e.key==='Escape') document.getElementById('results').classList.remove('open');
  });
  document.getElementById('shareBtn').addEventListener('click',e=>{
    navigator.clipboard.writeText('megathread — открытый каталог бесплатного софта, игр, кино и нейросетей. 0 ₽ навсегда, без сервера и слежки.');
    e.target.textContent='Текст скопирован';
  });
  document.getElementById('statTotal').textContent=RESOURCES.length;
}
init();
