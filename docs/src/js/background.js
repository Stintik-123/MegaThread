export function initBackground(){
  const MOBILE=matchMedia('(max-width:860px)').matches;
  const c=document.getElementById('stars'), x=c.getContext('2d'); let W,H,S;
  const rs=()=>{ W=c.width=innerWidth; H=c.height=innerHeight; const N=MOBILE?35:70; S=Array.from({length:N},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,s:Math.random()*.35+.08,t:Math.random()*6.28})); };
  rs(); addEventListener('resize',rs);
  (function loop(){ x.clearRect(0,0,W,H); for(const st of S){ st.y-=st.s; st.t+=.02; if(st.y<-4){ st.y=H+4; st.x=Math.random()*W; } const a=.2+Math.abs(Math.sin(st.t))*.45; x.beginPath(); x.arc(st.x,st.y,st.r,0,7); x.fillStyle=`rgba(160,220,255,${a})`; x.fill(); } requestAnimationFrame(loop); })();
}
