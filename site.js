(() => {
 const toggle=document.querySelector('.menu-toggle'), nav=document.querySelector('#nav');
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';toggle.setAttribute('aria-expanded',String(open));nav.classList.toggle('is-open',open)});
 nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{toggle.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}));
 const titles=['Edificio y exteriores','Instalaciones y entorno','Construcción y accesos','Espacios de obra','Exterior de edificio','Edificación y acabados','Trabajos de construcción','Edificio y zonas exteriores'];
 const items=titles.map((title,i)=>({title,src:`fotos/construcciones-${105+i}.jpg`,thumb:`fotos/construcciones-${105+i}-mini.jpg`}));
 const gallery=document.querySelector('#gallery'),dialog=document.querySelector('#photo-dialog'),full=document.querySelector('#photo-full'),caption=document.querySelector('#photo-caption');
 let active=0;
 function render(){full.src=items[active].src;full.alt=items[active].title;caption.textContent=`${active+1} / ${items.length} · ${items[active].title}`;}
 items.forEach((item,i)=>{const button=document.createElement('button');button.type='button';button.setAttribute('aria-label','Ampliar '+item.title);const img=document.createElement('img');img.src=item.thumb;img.alt=item.title;img.loading='lazy';img.width=640;img.height=480;const label=document.createElement('span');label.textContent=item.title;button.append(img,label);button.addEventListener('click',()=>{active=i;render();dialog.showModal()});gallery.append(button)});
 document.querySelector('#photo-close').addEventListener('click',()=>dialog.close());
 document.querySelector('#photo-prev').addEventListener('click',()=>{active=(active-1+items.length)%items.length;render()});
 document.querySelector('#photo-next').addEventListener('click',()=>{active=(active+1)%items.length;render()});
 dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close()}});
 dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){active=(active+1)%items.length;render()}if(e.key==='ArrowLeft'){active=(active-1+items.length)%items.length;render()}});
})();
