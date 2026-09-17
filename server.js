const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@libsql/client');

const PORT = process.env.PORT || 4000;

// ── DB client: Turso if env set, else local file ──
// Set TURSO_DATABASE_URL=libsql://your-db-...turso.io and TURSO_AUTH_TOKEN=eyJ...
// Local fallback: file:data/artify.db (persisted to disk, works offline)
const dbUrl = process.env.TURSO_DATABASE_URL || 'file:' + path.join(__dirname, 'data', 'artify.db').replace(/\\/g,'/');
const dbAuth = process.env.TURSO_AUTH_TOKEN || undefined;
if (!process.env.TURSO_DATABASE_URL) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}
const db = createClient({ url: dbUrl, authToken: dbAuth });
console.log(`[db] using ${process.env.TURSO_DATABASE_URL ? 'Turso cloud' : 'local file'} → ${dbUrl.replace(/\/\/.*@/,'//***@')}`);

function slugify(s) {
  return (s || '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,60) || 'untitled';
}

async function initDb(){
  // schema
  await db.execute(`
    CREATE TABLE IF NOT EXISTS portfolios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      handle TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      cat TEXT NOT NULL,
      bio TEXT,
      artTitle TEXT,
      artImg TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS artworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      cat TEXT NOT NULL,
      img TEXT,
      love TEXT DEFAULT '— new',
      handle TEXT,
      createdAt TEXT NOT NULL,
      UNIQUE(title, artist)
    );
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS artists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      role TEXT,
      bio TEXT,
      img TEXT
    );
  `);

  // seed if empty
  const artCount = (await db.execute('SELECT COUNT(*) as c FROM artworks')).rows[0].c;
  if (artCount === 0) {
    const artworks = [
      {title:"Neon Horizon", artist:"Elena Voss", cat:"Digital Art", img:"https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&auto=format&fit=crop&q=60", love:"2.4k"},
      {title:"Midnight Bloom", artist:"Kenji Arai", cat:"Illustration", img:"https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&auto=format&fit=crop&q=60", love:"1.8k"},
      {title:"Alpine Silence", artist:"Sofia Marin", cat:"Photography", img:"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60", love:"3.1k"},
      {title:"Chrome Dreams", artist:"Milo R.", cat:"3D Art", img:"https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=60", love:"892"},
      {title:"Wanderer’s Map", artist:"Ava Chen", cat:"Concept Art", img:"https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&auto=format&fit=crop&q=60", love:"1.2k"},
      {title:"Paper City", artist:"Jonah Lee", cat:"Illustration", img:"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&auto=format&fit=crop&q=60", love:"2.0k"},
    ];
    for (const a of artworks) {
      await db.execute({ sql: 'INSERT INTO artworks (title, artist, cat, img, love, createdAt) VALUES (?, ?, ?, ?, ?, ?)', args: [a.title, a.artist, a.cat, a.img, a.love, new Date().toISOString()] });
    }
    console.log('[seed] artworks seeded:', artworks.length);
  }
  const artistCount = (await db.execute('SELECT COUNT(*) as c FROM artists')).rows[0].c;
  if (artistCount === 0) {
    const artists = [
      {name:"Elena Voss", role:"Digital Art • Berlin", bio:"Neon palettes & futuristic cityscapes. Featured in Wired.", img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&auto=format&fit=crop&q=60"},
      {name:"Kenji Arai", role:"Illustration • Kyoto", bio:"Ink + watercolor stories about midnight trains.", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=60"},
      {name:"Sofia Marin", role:"Photography • Lisbon", bio:"Alpine light and human scale. 12k followers.", img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=60"},
      {name:"Milo Reinhardt", role:"3D Art • London", bio:"Chrome, glass and speculative objects.", img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=60"},
    ];
    for (const a of artists) {
      await db.execute({ sql: 'INSERT INTO artists (name, role, bio, img) VALUES (?, ?, ?, ?)', args: [a.name, a.role, a.bio, a.img] });
    }
    console.log('[seed] artists seeded:', artists.length);
  }
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── API: health ──
app.get('/api/health', async (req, res) => {
  try{
    await db.execute('SELECT 1');
    res.json({ ok: true, time: new Date().toISOString(), db: dbUrl.replace(/\/\/.*@/,'//***@'), turso: !!process.env.TURSO_DATABASE_URL });
  }catch(e){ res.status(500).json({ ok:false, error:e.message }); }
});

// ── API: artworks ──
app.get('/api/artworks', async (req, res) => {
  const cat = (req.query.cat || 'All').trim();
  const q = (req.query.q || '').trim().toLowerCase();
  let rows;
  if (cat !== 'All') {
    rows = (await db.execute({ sql: 'SELECT * FROM artworks WHERE cat = ? ORDER BY id DESC', args: [cat] })).rows;
  } else {
    rows = (await db.execute('SELECT * FROM artworks ORDER BY id DESC')).rows;
  }
  if (q) {
    rows = rows.filter(a =>
      (a.title || '').toLowerCase().includes(q) ||
      (a.artist || '').toLowerCase().includes(q) ||
      (a.cat || '').toLowerCase().includes(q)
    );
  }
  res.json(rows);
});

app.post('/api/artworks', async (req, res) => {
  const { title, artist, cat, img } = req.body || {};
  if (!title || !artist || !cat) return res.status(400).json({ error: 'title, artist, cat required' });
  const love = req.body.love || '— new';
  const handle = req.body.handle || slugify(artist);
  try {
    await db.execute({
      sql: 'INSERT INTO artworks (title, artist, cat, img, love, handle, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(title, artist) DO UPDATE SET cat=excluded.cat, img=excluded.img',
      args: [title.trim(), artist.trim(), cat.trim(), (img || '').trim(), love, handle, new Date().toISOString()]
    });
    const row = (await db.execute({ sql: 'SELECT * FROM artworks WHERE title=? AND artist=?', args: [title.trim(), artist.trim()] })).rows[0];
    res.status(201).json(row);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

// ── API: artists ──
app.get('/api/artists', async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  let artists = (await db.execute('SELECT * FROM artists ORDER BY id ASC')).rows;
  const portfolios = (await db.execute('SELECT * FROM portfolios ORDER BY updatedAt DESC')).rows;
  const portfolioArtists = portfolios.map(p => ({
    id: 'p-'+p.id,
    name: p.name,
    role: `${p.cat} • ${p.handle}`,
    bio: p.bio || `Portfolio: artify.studio/${p.handle}`,
    img: p.artImg || '',
    handle: p.handle,
    isPortfolio: true
  }));
  let all = [...artists, ...portfolioArtists];
  if (q) {
    all = all.filter(a => (a.name||'').toLowerCase().includes(q) || (a.role||'').toLowerCase().includes(q));
  }
  res.json(all);
});

// ── API: portfolios list ──
app.get('/api/portfolios', async (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  let rows = (await db.execute('SELECT * FROM portfolios ORDER BY updatedAt DESC')).rows;
  if (q) {
    rows = rows.filter(p =>
      (p.name||'').toLowerCase().includes(q) ||
      (p.handle||'').toLowerCase().includes(q) ||
      (p.cat||'').toLowerCase().includes(q) ||
      (p.artTitle||'').toLowerCase().includes(q)
    );
  }
  res.json(rows);
});

// ── API: get single portfolio ──
app.get('/api/portfolio/me', async (req, res) => {
  const handle = (req.query.handle || '').trim().toLowerCase();
  if (!handle) return res.status(400).json({ error: 'handle query required, e.g. /api/portfolio/me?handle=elena-voss' });
  const rows = (await db.execute({ sql: 'SELECT * FROM portfolios WHERE handle = ? COLLATE NOCASE', args: [handle] })).rows;
  if (!rows.length) return res.status(404).json({ error: 'Portfolio not found' });
  res.json(rows[0]);
});

app.get('/api/portfolio/:handle', async (req, res) => {
  const handle = req.params.handle.trim();
  const rows = (await db.execute({ sql: 'SELECT * FROM portfolios WHERE handle = ? COLLATE NOCASE', args: [handle] })).rows;
  if (!rows.length) return res.status(404).json({ error: 'Portfolio not found' });
  res.json(rows[0]);
});

// ── API: create/update portfolio ──
app.post('/api/portfolio', async (req, res) => {
  let { name, handle, cat, category, bio, artTitle, artImg, createdAt } = req.body || {};
  cat = cat || category;
  if (!name || !cat) return res.status(400).json({ error: 'name and cat/category required' });
  name = name.trim();
  cat = cat.trim();
  handle = (handle || slugify(name)).toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/^-|-$/g,'');
  if (!handle) handle = slugify(name);
  bio = (bio || '').trim();
  artTitle = (artTitle || '').trim();
  artImg = (artImg || '').trim();
  const now = new Date().toISOString();
  try {
    await db.execute({
      sql: `INSERT INTO portfolios (handle, name, cat, bio, artTitle, artImg, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(handle) DO UPDATE SET
              name=excluded.name, cat=excluded.cat, bio=excluded.bio,
              artTitle=excluded.artTitle, artImg=excluded.artImg, updatedAt=excluded.updatedAt`,
      args: [handle, name, cat, bio, artTitle, artImg, createdAt || now, now]
    });
    if (artTitle) {
      await db.execute({
        sql: `INSERT INTO artworks (title, artist, cat, img, love, handle, createdAt)
              VALUES (?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(title, artist) DO UPDATE SET cat=excluded.cat, img=excluded.img, handle=excluded.handle`,
        args: [artTitle, name, cat, artImg, '— new', handle, now]
      });
    }
    const row = (await db.execute({ sql: 'SELECT * FROM portfolios WHERE handle = ?', args: [handle] })).rows[0];
    res.status(201).json(row);
  } catch (e) {
    console.error('[POST /api/portfolio] error', e);
    res.status(500).json({ error: e.message });
  }
});

// ── API: delete portfolio ──
app.delete('/api/portfolio/me', async (req, res) => {
  const handle = (req.query.handle || '').trim();
  if (!handle) return res.status(400).json({ error: 'handle query required' });
  const info = await db.execute({ sql: 'DELETE FROM portfolios WHERE handle = ? COLLATE NOCASE', args: [handle] });
  if (info.rowsAffected === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, deleted: handle });
});

app.delete('/api/portfolio/:handle', async (req, res) => {
  const handle = req.params.handle.trim();
  const info = await db.execute({ sql: 'DELETE FROM portfolios WHERE handle = ? COLLATE NOCASE', args: [handle] });
  if (info.rowsAffected === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ ok: true, deleted: handle });
});

// ── Static frontend ──
app.use(express.static(__dirname, { extensions: ['html'] }));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'index.html'));
});

initDb().then(()=>{
  app.listen(PORT, () => {
    console.log(`Artify backend running at http://localhost:${PORT}`);
    console.log(`  DB: ${dbUrl.replace(/\/\/.*@/,'//***@')} (${process.env.TURSO_DATABASE_URL ? 'Turso cloud' : 'local file'})`);
    console.log(`  Health: http://localhost:${PORT}/api/health`);
  });
}).catch(e=>{ console.error('DB init failed', e); process.exit(1); });
