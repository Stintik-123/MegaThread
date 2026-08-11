import { LS, toast } from './main.js';
const ACH={step:'Первый шаг — открыл раздел',critic:'Критик — проголосовал',star:'Звезда — поставил оценку',scribe:'Писатель — сохранил черновик',inspector:'Инспектор — проверил ссылки',sage:'Мудрец — спросил у AI',voice:'Голос — оставил заметку',finder:'Искатель — предложил ресурс через Issue'};
export function unlock(id){ const s=LS('ach')||{}; if(s[id]) return; s[id]=1; LS('ach',s); toast('Достижение: '+ACH[id]); if(document.getElementById('achieve').classList.contains('active')) render(); }
function render(){ const s=LS('ach')||{}; document.getElementById('achv').innerHTML=Object.entries(ACH).map(([k,v])=>{ const p=v.split(' — '); return `<div class="ach ${s[k]?'on':''}"><div class="ach-ico">${s[k]?'✓':'·'}</div><div><b>${p[0]}</b><span>${p[1]}</span></div></div>`; }).join(''); }
export function initAchieve(){ render(); }
