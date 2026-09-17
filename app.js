(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Entrance
  if(!prefersReduced && document.documentElement.classList.contains('js-enter')){
    const t = window.innerWidth <= 648 ? 0.85 : 1;
    const d = window.innerWidth <= 648 ? 0.62 : 1;
    const EXPO = 'cubic-bezier(.16,1,.3,1)';
    const SOFT = 'cubic-bezier(.22,.65,.28,1)';
    const SETTLE='cubic-bezier(.33,1,.68,1)';
    const qs = s => document.querySelector(s);
    const qsa = s => Array.from(document.querySelectorAll(s));
    const anims = [];
    function rise(el, delay, dur, y, ease){
      if(!el) return;
      const a = el.animate([{transform:`translate3d(0,${y*d}px,0)`, opacity:0},{transform:'translate3d(0,0,0)', opacity:1}],{duration:dur*t, delay:delay*t, easing:ease, fill:'both'});
      anims.push(a);
      return a;
    }
    // eyebrow
    rise(qs('.eyebrow'), 60, 560, 12, SOFT);
    // headline via mask clip + headline translate
    const hm = qs('.headline-mask');
    const hl = qs('.headline');
    if(hm && hl){
      hm.animate([{clipPath:'inset(0 0 100% 0)'},{clipPath:'inset(-45% -8% -6px -3%)'}],{duration:950*t, delay:170*t, easing:EXPO, fill:'both'});
      // Wait then animate headline
      const a = hl.animate([{transform:'translate3d(0,118%,0)'},{transform:'translate3d(0,0,0)'}],{duration:950, delay:170*t, easing:EXPO, fill:'both'});
      anims.push(a);
    }
    rise(qs('.lede'), 430, 660, 14, SOFT);
    // cta
    const cta = qs('.cta');
    const cta2 = qs('.cta-secondary');
    if(cta){ cta.animate([{opacity:0, transform:'translateY(12px) scale(.985)'},{opacity:1, transform:'none'}],{duration:580*t, delay:620*t, easing:SETTLE, fill:'both'});}
    if(cta2){ cta2.animate([{opacity:0, transform:'translateY(12px) scale(.985)'},{opacity:1, transform:'none'}],{duration:580*t, delay:680*t, easing:SETTLE, fill:'both'});}
    // brand
    rise(qs('.brand'), 600, 540, 10, SOFT);
    rise(qs('.nav'), 520, 540, 10, SOFT);
    rise(qs('.header-cta'), 620, 540, 10, SOFT);
    rise(qs('.tagline'), 670, 540, 10, SOFT);
    qsa('.col').forEach((el,i)=> rise(el, 720+i*70, 580, 14, SOFT));
    qsa('.demo-card').forEach(el=> el.animate([{opacity:0, transform:'translateY(14px) scale(.968)'},{opacity:1, transform:'none'}],{duration:580*t, delay:740*t, easing:SOFT, fill:'both'}));
    const rule = qs('.rule');
    if(rule){ rule.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:720*t, delay:980*t, easing:EXPO, fill:'both'});}
    rise(qs('.legal'), 1120, 500, 8, SOFT);
    qsa('.socials a').forEach((el,i)=> rise(el, 1170+i*60, 500, 8, SOFT));
    // cleanup
    let done=false;
    function finish(){ if(done) return; done=true; document.documentElement.classList.remove('js-enter'); anims.forEach(a=>{try{a.cancel()}catch(e){}}); if(hm) hm.style.clipPath=''; if(hl) hl.style.transform=''; }
    setTimeout(finish, 2200*t);
    // fallback
    const fallback = setTimeout(finish, 3500);
    // also on last anim end
    if(anims.length){ const last = anims[anims.length-1]; last.onfinish = ()=>{ clearTimeout(fallback); finish(); } }
  } else {
    document.documentElement.classList.remove('js-enter');
  }

  // Artify data — curated sample works for presentation
  const artworks = [
    {title:"Neon Horizon", artist:"Elena Voss", cat:"Digital Art", img:"https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=700&auto=format&fit=crop&q=60", love:"2.4k"},
    {title:"Midnight Bloom", artist:"Kenji Arai", cat:"Illustration", img:"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=700&auto=format&fit=crop&q=60", love:"1.8k"},
    {title:"Alpine Silence", artist:"Sofia Marin", cat:"Photography", img:"https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=700&auto=format&fit=crop&q=60", love:"3.1k"},
    {title:"Chrome Dreams", artist:"Milo R.", cat:"3D Art", img:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&auto=format&fit=crop&q=60", love:"892"},
    {title:"Wanderer’s Map", artist:"Ava Chen", cat:"Concept Art", img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=700&auto=format&fit=crop&q=60", love:"1.2k"},
    {title:"Paper City", artist:"Jonah Lee", cat:"Illustration", img:"https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=700&auto=format&fit=crop&q=60", love:"2.0k"},
  ];
  const artists = [
    {name:"Elena Voss", role:"Digital Art • Berlin", bio:"Neon palettes & futuristic cityscapes. Featured in Wired.", img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60"},
    {name:"Kenji Arai", role:"Illustration • Kyoto", bio:"Ink + watercolor stories about midnight trains.", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60"},
    {name:"Sofia Marin", role:"Photography • Lisbon", bio:"Alpine light and human scale. 12k followers.", img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60"},
    {name:"Milo Reinhardt", role:"3D Art • London", bio:"Chrome, glass and speculative objects.", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60"},
  ];

  function renderArt(filterCat="All", q=""){
    const grid=document.getElementById('artGrid');
    if(!grid) return;
    const terms=q.trim().toLowerCase();
    const list = artworks.filter(a=>{
      const catOk = filterCat==="All" || a.cat===filterCat;
      const qOk = !terms || (a.title.toLowerCase().includes(terms) || a.artist.toLowerCase().includes(terms) || a.cat.toLowerCase().includes(terms));
      return catOk && qOk;
    });
    grid.innerHTML = list.map(a=>{
      const hasImg = (a.img || '').trim();
      const visual = hasImg
        ? `<img src="${a.img}" alt="${a.title} by ${a.artist} — ${a.cat} artwork" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none';this.insertAdjacentHTML('afterend','<div style=&quot;width:100%;aspect-ratio:4/3;display:grid;place-items:center;background:#0a0f14;color:rgba(255,255,255,.38);font-size:11px;letter-spacing:.07em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.06)'>Image unavailable</div>')">`
        : `<div style="width:100%;aspect-ratio:4/3;display:grid;place-items:center;background:#0a0f14;color:rgba(255,255,255,.35);font-size:11px;letter-spacing:.07em;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,.06)">No image</div>`;
      return `
      <div class="art">
        ${visual}
        <div class="art-body">
          <div class="art-title">${a.title}</div>
          <div class="art-by">by ${a.artist} • ${a.love} loves</div>
          <span class="art-cat">${a.cat}</span>
        </div>
      </div>`;
    }).join('') || '<p style="color:rgba(255,255,255,.6)">No results. Try another search.</p>';
  }
  function renderArtists(){
    const grid=document.getElementById('artistGrid');
    if(!grid) return;
    grid.innerHTML = artists.map(a=>`
      <div class="artist">
        <img src="${a.img}" alt="${a.name} — ${a.role}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60'">
        <h4>${a.name}</h4>
        <p>${a.role}<br>${a.bio}</p>
        <a href="#" data-artist="${a.name}">View Portfolio</a>
      </div>
    `).join('');
    grid.querySelectorAll('[data-artist]').forEach(btn=>{
      btn.addEventListener('click', e=>{
        e.preventDefault();
        const name = btn.getAttribute('data-artist');
        open('explore');
        const si=document.getElementById('searchInput');
        if(si) si.value = name;
        document.querySelectorAll('.filter').forEach(b=> b.classList.toggle('active', b.dataset.cat==='All'));
        activeCat='All';
        renderArt('All', name);
      });
    });
  }
  renderArt();
  renderArtists();

  // ── Backend sync: when USE_BACKEND=true, pull real data from SQLite so other users' portfolios are visible ──
  async function syncFromBackend(){
    if(!PORTFOLIO_CONFIG.USE_BACKEND) return;
    if(location.protocol === 'file:') { console.warn('[Artify] file:// cannot fetch /api — open via http://localhost:4000'); return; }
    try{
      const artRes = await fetch('/api/artworks').then(r=> r.ok ? r.json() : null).catch(()=>null);
      if(Array.isArray(artRes)){
        if(artRes.length){
          artworks.length = 0;
          artRes.forEach(a=>{
            artworks.push({ title: a.title, artist: a.artist, cat: a.cat, img: (a.img||'').trim(), love: a.love || '— new' });
          });
          renderArt(activeCat, document.getElementById('searchInput')?.value || '');
        } else {
          document.getElementById('artGrid').innerHTML = '<p style="color:rgba(255,255,255,.6);grid-column:1/-1">No artworks to display yet.</p>';
        }
      }
      const artistRes = await fetch('/api/artists').then(r=> r.ok ? r.json() : null).catch(()=>null);
      if(Array.isArray(artistRes)){
        if(artistRes.length){
          const existing = new Set(artists.map(a=>a.name.toLowerCase()));
          artistRes.forEach(a=>{
            if(!existing.has((a.name||'').toLowerCase())){
              artists.push({ name: a.name, role: a.role || (a.cat ? a.cat+' • '+(a.handle||'') : 'Community'), bio: a.bio || '', img: (a.img||'').trim() });
            }
          });
          renderArtists();
        } else {
          document.getElementById('artistGrid').innerHTML = '<p style="color:rgba(255,255,255,.6);grid-column:1/-1">No artists to display yet.</p>';
        }
      }
    }catch(e){
      console.warn('[syncFromBackend] failed', e);
      const ag = document.getElementById('artGrid');
      if(ag && !ag.querySelector('.art')) ag.innerHTML = '<p style="color:rgba(255,255,255,.6);grid-column:1/-1">We couldn’t load this content right now. Please try again.</p>';
      const arg = document.getElementById('artistGrid');
      if(arg && !arg.querySelector('.artist')) arg.innerHTML = '<p style="color:rgba(255,255,255,.6);grid-column:1/-1">We couldn’t load this content right now. Please try again.</p>';
    }
  }
  syncFromBackend();
  // re-sync when portfolio is created (also after hash navigation)
  window.addEventListener('focus', syncFromBackend);

  // Filters
  let activeCat="All";
  document.querySelectorAll('.filter').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeCat = btn.dataset.cat;
      renderArt(activeCat, document.getElementById('searchInput').value);
    });
  });
  document.getElementById('searchBtn').addEventListener('click',()=> renderArt(activeCat, document.getElementById('searchInput').value));
  document.getElementById('searchInput').addEventListener('input', e=> renderArt(activeCat, e.target.value));
  document.getElementById('searchInput').addEventListener('keydown', e=>{ if(e.key==='Enter') renderArt(activeCat, e.target.value); });

  // Overlays
  const overlays = {
    home: null,
    explore: document.getElementById('overlay-explore'),
    artists: document.getElementById('overlay-artists'),
    about: document.getElementById('overlay-about'),
    contact: document.getElementById('overlay-contact'),
    portfolio: document.getElementById('overlay-portfolio'),
    auth: document.getElementById('overlay-auth'),
  };
  function open(name){
    if(name==='home'){ closeAll(); window.scrollTo({top:0, behavior:'smooth'}); return; }
    const el = overlays[name];
    if(!el) return;
    closeAll();
    el.classList.add('open');
    document.body.style.overflow='hidden';
    // focus first
    const closeBtn = el.querySelector('.close');
    if(closeBtn) closeBtn.focus();
  }
  function closeAll(){
    Object.values(overlays).forEach(el=> el && el.classList.remove('open'));
    document.body.style.overflow='';
  }
  document.querySelectorAll('[data-open]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const key = a.getAttribute('data-open') || a.dataset.open;
      open(key);
    });
  });
  document.querySelectorAll('[data-filter]').forEach(a=>{
    a.addEventListener('click', e=>{
      e.preventDefault();
      const cat=a.getAttribute('data-filter');
      open('explore');
      // set filter
      document.querySelectorAll('.filter').forEach(b=>{ b.classList.toggle('active', b.dataset.cat===cat); });
      activeCat=cat;
      renderArt(cat, "");
    });
  });
  document.querySelectorAll('[data-close]').forEach(b=>{
    b.addEventListener('click', (e)=>{ e.preventDefault(); closeAll(); });
  });
  document.querySelectorAll('.overlay').forEach(ov=>{
    ov.addEventListener('click', (e)=>{ if(e.target===ov) closeAll(); });
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeAll(); });

  // Contact form
  const form=document.getElementById('contactForm');
  const msg=document.getElementById('formMsg');
  if(form){
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const fd=new FormData(form);
      const name=fd.get('name')?.toString().trim();
      const email=fd.get('email')?.toString().trim();
      const message=fd.get('message')?.toString().trim();
      if(!name || !email || !message){ alert('Please fill Name, Email and Message.'); return; }
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ alert('Please enter a valid email.'); return; }
      msg.classList.add('show');
      form.reset();
      setTimeout(()=> msg.classList.remove('show'), 4000);
    });
  }

  // ── Portfolio — HYBRID store: localStorage now, backend-ready ──
  // HOW TO SWITCH: set PORTFOLIO_CONFIG.USE_BACKEND = true and implement these endpoints:
  //   POST   /api/portfolio      body: {name,handle,cat,bio,artTitle,artImg} -> 201 {id,...}
  //   GET    /api/portfolio/me   -> 200 {name,handle,...} or 404
  //   DELETE /api/portfolio/me   -> 204
  // Frontend code below works in BOTH modes without changing UI logic.
  const PORTFOLIO_CONFIG = {
    USE_BACKEND: true, // now true — backend is live at /api/portfolio (port 4000). Set false to force local-only.
    API_BASE: '/api/portfolio',
    STORAGE_KEY: 'artify_my_portfolio_v1'
  };
  const Auth = {
    tokenKey: 'artify_token',
    userKey: 'artify_user',
    getToken(){ return localStorage.getItem(this.tokenKey); },
    getUser(){ try{ return JSON.parse(localStorage.getItem(this.userKey)||'null'); }catch(e){ return null; } },
    isLogged(){ return !!this.getToken(); },
    logout(){ localStorage.removeItem(this.tokenKey); localStorage.removeItem(this.userKey); },
    setSession(token, user){ localStorage.setItem(this.tokenKey, token); localStorage.setItem(this.userKey, JSON.stringify(user)); },
    authHeader(){ const t=this.getToken(); return t ? { 'Authorization':'Bearer '+t } : {}; }
  };
  const PortfolioStore = {
    _myHandle(){
      try{
        const raw = localStorage.getItem(PORTFOLIO_CONFIG.STORAGE_KEY);
        if(!raw) return null;
        const j = JSON.parse(raw);
        return (j && j.handle) ? j.handle : null;
      }catch(e){ return null; }
    },
    async save(data){
      // always cache locally for instant preview
      try{ localStorage.setItem(PORTFOLIO_CONFIG.STORAGE_KEY, JSON.stringify(data)); }catch(e){}
      if(PORTFOLIO_CONFIG.USE_BACKEND){
        if(!Auth.isLogged()){
          alert('Please login/signup first to create a credentials-protected portfolio. Your data was cached locally only.');
          return data;
        }
        try{
          const res = await fetch(PORTFOLIO_CONFIG.API_BASE, {
            method: 'POST',
            headers: {'Content-Type':'application/json', ...Auth.authHeader()},
            body: JSON.stringify(data)
          });
          if(!res.ok){
            const j = await res.json().catch(()=>({}));
            throw new Error(j.error || 'API save failed '+res.status);
          }
          const saved = await res.json().catch(()=> data);
          try{ localStorage.setItem(PORTFOLIO_CONFIG.STORAGE_KEY, JSON.stringify(saved)); }catch(e){}
          return saved;
        }catch(err){
          console.warn('[PortfolioStore] backend save failed', err);
          alert(err.message || 'Save failed');
          return data;
        }
      } else {
        return data;
      }
    },
    async load(){
      if(PORTFOLIO_CONFIG.USE_BACKEND){
        // if logged in, fetch own via token (credentials)
        if(Auth.isLogged()){
          try{
            const res = await fetch(PORTFOLIO_CONFIG.API_BASE + '/me', {method:'GET', headers: {...Auth.authHeader()}});
            if(res.status===404) return null;
            if(!res.ok) throw new Error('API load '+res.status);
            const data = await res.json();
            try{ localStorage.setItem(PORTFOLIO_CONFIG.STORAGE_KEY, JSON.stringify(data)); }catch(e){}
            return data;
          }catch(err){
            console.warn('[PortfolioStore] auth load failed', err);
            // fall back to handle query if token expired
          }
        }
        const myHandle = this._myHandle();
        if(!myHandle) return null;
        try{
          const res = await fetch(PORTFOLIO_CONFIG.API_BASE + '/me?handle=' + encodeURIComponent(myHandle), {method:'GET'});
          if(res.status===404) return null;
          if(!res.ok) throw new Error('API load '+res.status);
          const data = await res.json();
          try{ localStorage.setItem(PORTFOLIO_CONFIG.STORAGE_KEY, JSON.stringify(data)); }catch(e){}
          return data;
        }catch(err){
          console.warn('[PortfolioStore] backend load failed, using localStorage cache', err);
          const raw = localStorage.getItem(PORTFOLIO_CONFIG.STORAGE_KEY);
          return raw ? JSON.parse(raw) : null;
        }
      } else {
        const raw = localStorage.getItem(PORTFOLIO_CONFIG.STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      }
    },
    async clear(){
      if(PORTFOLIO_CONFIG.USE_BACKEND && Auth.isLogged()){
        try{ await fetch(PORTFOLIO_CONFIG.API_BASE + '/me', {method:'DELETE', headers:{...Auth.authHeader()}}); }catch(e){ console.warn(e); }
      } else if(PORTFOLIO_CONFIG.USE_BACKEND){
        const myHandle = this._myHandle();
        if(myHandle){
          try{ await fetch(PORTFOLIO_CONFIG.API_BASE + '/me?handle=' + encodeURIComponent(myHandle), {method:'DELETE'}); }catch(e){ console.warn(e); }
          try{ await fetch(PORTFOLIO_CONFIG.API_BASE + '/' + encodeURIComponent(myHandle), {method:'DELETE'}); }catch(e){}
        }
      }
      localStorage.removeItem(PORTFOLIO_CONFIG.STORAGE_KEY);
    }
  };

  const pForm=document.getElementById('portfolioForm');
  const pMsg=document.getElementById('portfolioMsg');
  const pPreview=document.getElementById('portfolioPreview');
  const pViewBtn=document.getElementById('portfolioViewBtn');
  const pClearBtn=document.getElementById('portfolioClearBtn');

  async function renderPortfolioPreview(){
    if(!pPreview) return;
    try{
      const data = await PortfolioStore.load();
      if(!data){
        if(!Auth.isLogged()){
          pPreview.innerHTML = '<div style="color:rgba(255,255,255,.68);line-height:1.5"><strong style="color:#fff">Please login to create your portfolio.</strong><br>Your profile is linked to your account and will appear in Explore once published.</div><div style="margin-top:12px"><a href="#" data-open="auth" style="display:inline-flex;padding:8px 14px;border-radius:999px;background:#fff;color:#111;text-decoration:none;font-weight:700;font-size:13px">Login or create account →</a></div>';
          // re-bind open handler for injected link
          pPreview.querySelectorAll('[data-open]').forEach(a=> a.addEventListener('click', e=>{ e.preventDefault(); open(a.dataset.open); }));
        } else {
          pPreview.innerHTML = 'No portfolio yet — create one on the right.';
        }
        if(pViewBtn) pViewBtn.style.display='none';
        if(pClearBtn) pClearBtn.style.display='none';
        return;
      }
      const rawImg = (data.artImg || '').trim();
      const handle = data.handle || data.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      const badge = '';
      const avatarHtml = rawImg
        ? `<img src="${rawImg}" alt="" style="width:56px;height:56px;border-radius:10px;object-fit:cover;border:1px solid rgba(255,255,255,.14)">`
        : `<div style="width:56px;height:56px;border-radius:10px;background:#000;border:1px solid rgba(255,255,255,.14);display:grid;place-items:center;color:rgba(255,255,255,.35);font-size:9px;letter-spacing:.07em;text-transform:uppercase">No img</div>`;
      const artThumbHtml = rawImg
        ? `<img src="${rawImg}" style="width:42px;height:42px;border-radius:8px;object-fit:cover;border:1px solid rgba(255,255,255,.10)">`
        : `<div style="width:42px;height:42px;border-radius:8px;background:#000;border:1px solid rgba(255,255,255,.10);display:grid;place-items:center;color:rgba(255,255,255,.30);font-size:8px">—</div>`;
      pPreview.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center">
          ${avatarHtml}
          <div>
            <div style="font-weight:700;color:#fff;font-size:15px">${data.name} ${badge}</div>
            <div style="font-size:12px;color:rgba(255,255,255,.66)">${data.cat} • artify.studio/${handle}</div>
          </div>
        </div>
        <div style="margin-top:10px;color:rgba(255,255,255,.72);font-size:13px;line-height:1.5">${data.bio || 'No bio yet.'}</div>
        ${data.artTitle ? `<div style="margin-top:10px;padding:10px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);display:flex;gap:10px;align-items:center">${artThumbHtml}<div><div style="font-weight:600;color:#fff;font-size:13px">${data.artTitle}</div><div style="font-size:11px;color:rgba(255,255,255,.58)">${data.cat}</div></div></div>` : ''}
      `;
      if(pViewBtn) pViewBtn.style.display='inline-flex';
      if(pClearBtn) pClearBtn.style.display='inline-flex';
      const hInput=document.getElementById('p-handle');
      if(hInput && !hInput.value) hInput.placeholder=`artify.studio/${handle}`;
    }catch(e){ console.error(e); pPreview.textContent='Error loading preview.'; }
  }
  renderPortfolioPreview();
  const pNameInput=document.getElementById('p-name');
  if(pNameInput){
    pNameInput.addEventListener('input', ()=>{
      const h=document.getElementById('p-handle');
      if(!h) return;
      if(h.value) return;
      const handle = pNameInput.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      h.placeholder = handle ? `artify.studio/${handle}` : 'artify.studio/your-name (auto from name)';
    });
  }
  if(pForm){
    pForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      if(!Auth.isLogged()){
        if(pMsg){ pMsg.textContent='Please login to publish your portfolio.'; pMsg.style.color='#ffd27a'; pMsg.classList.add('show'); }
        open('auth'); return;
      }
      const submitBtn = document.getElementById('portfolioSubmit');
      const fd=new FormData(pForm);
      const name=fd.get('pname')?.toString().trim();
      const cat=fd.get('pcat')?.toString().trim() || 'Digital Art';
      const bio=fd.get('pbio')?.toString().trim();
      const artTitle=fd.get('partTitle')?.toString().trim();
      let artImg=fd.get('partImg')?.toString().trim();
      // validation
      if(!name){
        if(pMsg){ pMsg.textContent='Please enter your display name.'; pMsg.style.color='#ff9a9a'; pMsg.classList.add('show'); }
        document.getElementById('p-name')?.focus(); return;
      }
      if(artImg && !/^https?:\/\/.+/i.test(artImg)){
        if(pMsg){ pMsg.textContent='Please enter a valid image URL starting with https://'; pMsg.style.color='#ff9a9a'; pMsg.classList.add('show'); }
        document.getElementById('p-art-img')?.focus(); return;
      }
      if(!artImg){ artImg = ''; }
      const user = Auth.getUser();
      const handle = user ? user.handle : name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      const data={name, handle, cat, bio, artTitle, artImg, createdAt: new Date().toISOString()};
      // loading state
      if(submitBtn){ submitBtn.disabled=true; submitBtn.textContent='Publishing…'; submitBtn.style.opacity='.7'; }
      if(pMsg){ pMsg.textContent=''; pMsg.classList.remove('show'); }
      try{
        await PortfolioStore.save(data);
        if(artTitle){
          const exists = artworks.some(a=> a.title===artTitle && a.artist===name);
          if(!exists){ artworks.unshift({title: artTitle, artist: name, cat: cat, img: artImg, love: '— new'}); renderArt(activeCat, document.getElementById('searchInput')?.value || ""); syncFromBackend(); }
        }
        await renderPortfolioPreview();
        if(pMsg){ pMsg.textContent='Portfolio published — your profile is now live in Explore.'; pMsg.style.color='#a8f0c6'; pMsg.classList.add('show'); setTimeout(()=> pMsg.classList.remove('show'), 5000); }
        // keep handle/display name, clear only artwork fields
        document.getElementById('p-art-title').value=''; document.getElementById('p-art-img').value=''; document.getElementById('p-bio').value='';
        if(pPreview) pPreview.scrollIntoView({behavior:'smooth', block:'nearest'});
      }catch(err){
        if(pMsg){ pMsg.textContent= err.message || 'Could not publish. Please try again.'; pMsg.style.color='#ff9a9a'; pMsg.classList.add('show'); }
      }finally{
        if(submitBtn){ submitBtn.disabled=false; submitBtn.textContent='Publish Portfolio →'; submitBtn.style.opacity='1'; }
      }
    });
  }
  if(pViewBtn){
    pViewBtn.addEventListener('click', ()=>{
      pPreview.scrollIntoView({behavior:'smooth'});
      pPreview.animate([{transform:'scale(1.00)'},{transform:'scale(1.02)'},{transform:'scale(1.00)'}],{duration:520, easing:'cubic-bezier(.22,.65,.28,1)'});
    });
  }
  if(pClearBtn){
    pClearBtn.addEventListener('click', async ()=>{
      if(!confirm('Clear your portfolio?'+(PORTFOLIO_CONFIG.USE_BACKEND?' This will also DELETE on server.':''))) return;
      await PortfolioStore.clear();
      await renderPortfolioPreview();
      syncFromBackend();
    });
  }

  // ── Auth: credentials to open personal portfolio ──
  const authBtn = document.getElementById('authBtn');
  const tabLogin = document.getElementById('tabLogin');
  const tabSignup = document.getElementById('tabSignup');
  const authForm = document.getElementById('authForm');
  const authMsg = document.getElementById('authMsg');
  const authOk = document.getElementById('authOk');
  const authLogged = document.getElementById('authLogged');
  const authUserEl = document.getElementById('authUser');
  const authHandleEl = document.getElementById('authHandle');
  const authHasPortfolioEl = document.getElementById('authHasPortfolio');
  const openMyPortfolioBtn = document.getElementById('openMyPortfolioBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  let authMode = 'login';
  function setAuthMode(mode){
    authMode = mode;
    const isLogin = mode==='login';
    tabLogin.style.background = isLogin ? '#fff' : 'rgba(255,255,255,.08)';
    tabLogin.style.color = isLogin ? '#111' : '#fff';
    tabLogin.style.borderColor = isLogin ? '#fff' : 'rgba(255,255,255,.18)';
    tabSignup.style.background = isLogin ? 'rgba(255,255,255,.08)' : '#fff';
    tabSignup.style.color = isLogin ? '#fff' : '#111';
    tabSignup.style.borderColor = isLogin ? 'rgba(255,255,255,.18)' : '#fff';
    document.getElementById('fieldName').style.display = isLogin ? 'none' : 'grid';
    document.getElementById('fieldHandle').style.display = isLogin ? 'none' : 'grid';
    document.getElementById('authTitle').textContent = isLogin ? 'Login to Artify' : 'Join Artify';
    document.getElementById('authSubmit').textContent = isLogin ? 'Login →' : 'Create account →';
    authMsg.textContent=''; authMsg.classList.remove('show');
    authOk.textContent=''; authOk.classList.remove('show');
  }
  if(tabLogin) tabLogin.addEventListener('click', ()=> setAuthMode('login'));
  if(tabSignup) tabSignup.addEventListener('click', ()=> setAuthMode('signup'));
  setAuthMode('login');

  function updateAuthUI(){
    const logged = Auth.isLogged();
    const user = Auth.getUser();
    // sync portfolio form with account
    const pNameEl = document.getElementById('p-name');
    const pHandleEl = document.getElementById('p-handle');
    if(logged && user){
      if(pNameEl && !pNameEl.value) pNameEl.value = user.name;
      if(pHandleEl){ pHandleEl.value = 'artify.studio/' + user.handle; pHandleEl.readOnly = true; }
    } else {
      if(pHandleEl){ pHandleEl.value = ''; pHandleEl.readOnly = true; pHandleEl.placeholder = 'artify.studio/your-name — login to claim'; }
    }
    if(authBtn){
      if(logged && user){
        authBtn.textContent = user.handle + ' ▾';
        authBtn.dataset.open = 'auth';
        authBtn.style.background = 'rgba(57,255,120,.14)';
        authBtn.style.borderColor = 'rgba(57,255,120,.28)';
        authBtn.style.color = '#a8f0c6';
      }else{
        authBtn.textContent = 'Login';
        authBtn.dataset.open = 'auth';
        authBtn.style.background = '';
        authBtn.style.borderColor = '';
        authBtn.style.color = '';
      }
    }
    if(authLogged){
      if(logged && user){
        authLogged.style.display='block';
        authForm.style.display='none';
        tabLogin.style.display='none';
        tabSignup.style.display='none';
        authUserEl.textContent = user.name + ' (' + user.email + ')';
        authHandleEl.textContent = 'artify.studio/' + user.handle;
        // check portfolio
        fetch('/api/portfolio/me', { headers:{...Auth.authHeader()} }).then(r=> r.ok ? r.json() : null).then(data=>{
          authHasPortfolioEl.textContent = data ? 'Portfolio exists — ' + (data.artTitle||'no artwork yet') : 'No portfolio yet — create one';
        }).catch(()=>{ authHasPortfolioEl.textContent=''; });
      }else{
        authLogged.style.display='none';
        authForm.style.display='grid';
        tabLogin.style.display='block';
        tabSignup.style.display='block';
      }
    }
  }
  updateAuthUI();

  // intercept Create Portfolio to require login
  function requireAuthForPortfolio(e){
    if(!Auth.isLogged()){
      if(e) e.preventDefault();
      open('auth');
      authMsg.textContent = 'Please login or signup to create/open your personal portfolio (credentials required).';
      authMsg.classList.add('show');
      setAuthMode('signup');
      return false;
    }
    return true;
  }
  // attach to all portfolio triggers
  document.querySelectorAll('[data-open="portfolio"]').forEach(el=>{
    // keep original open but check auth first
    el.addEventListener('click', (e)=>{
      if(!Auth.isLogged()){
        e.preventDefault();
        e.stopImmediatePropagation();
        requireAuthForPortfolio(e);
      }
    }, true);
  });

  if(authForm){
    authForm.addEventListener('submit', async (e)=>{
      e.preventDefault();
      authMsg.textContent=''; authOk.textContent='';
      const fd = new FormData(authForm);
      const email = (fd.get('aemail')||'').toString().trim().toLowerCase();
      const password = (fd.get('apassword')||'').toString();
      const name = (fd.get('aname')||'').toString().trim();
      const handle = (fd.get('ahandle')||'').toString().trim();
      if(!email || !password){ authMsg.textContent='Email and password required'; authMsg.classList.add('show'); return; }
      if(authMode==='signup' && !name){ authMsg.textContent='Display name required for signup'; authMsg.classList.add('show'); return; }
      const url = authMode==='signup' ? '/api/auth/signup' : '/api/auth/login';
      const body = authMode==='signup' ? { name, email, password, handle } : { email, password };
      try{
        const res = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
        const j = await res.json().catch(()=>({}));
        if(!res.ok){ throw new Error(j.error || 'Failed'); }
        Auth.setSession(j.token, j.user);
        authOk.textContent = authMode==='signup' ? 'Account created! Opening your portfolio…' : 'Logged in! Opening your portfolio…';
        authOk.classList.add('show');
        updateAuthUI();
        await renderPortfolioPreview();
        setTimeout(()=>{ closeAll(); open('portfolio'); }, 700);
      }catch(err){
        authMsg.textContent = err.message;
        authMsg.classList.add('show');
      }
    });
  }
  if(logoutBtn){
    logoutBtn.addEventListener('click', ()=>{
      Auth.logout();
      localStorage.removeItem(PORTFOLIO_CONFIG.STORAGE_KEY);
      updateAuthUI();
      renderPortfolioPreview();
      authMsg.textContent='Logged out';
      authMsg.classList.add('show');
      setAuthMode('login');
    });
  }
  if(openMyPortfolioBtn){
    openMyPortfolioBtn.addEventListener('click', ()=>{
      closeAll();
      open('portfolio');
      renderPortfolioPreview();
    });
  }
  // keep auth UI in sync when overlay opens
  if(overlays.auth){
    const obs = new MutationObserver(()=>{ if(overlays.auth.classList.contains('open')) updateAuthUI(); });
    obs.observe(overlays.auth, { attributes:true, attributeFilter:['class'] });
  }

  // Video fallback
  const video=document.querySelector('.bg video');
  if(video){
    video.addEventListener('error', ()=>{ video.style.display='none'; });
    // iOS autoplay fix
    video.play().catch(()=>{});
  }
})();
