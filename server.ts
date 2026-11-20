import 'dotenv/config';
import crypto from 'crypto';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbStore } from './server/db.ts';
import { PhotoItem, GuestWish, RegisteredUser } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database after environment variables are loaded
dbStore.initDatabase();

// Security & Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Separate Admin and Visitor Session Management
const revokedAdminTokens = new Set<string>();
const revokedVisitorTokens = new Set<string>();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'maggie2026';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const TOKEN_SECRET = process.env.SESSION_SECRET || 'maggies-velvet-keepsake-2026-auth-key';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createAdminToken(username: string): string {
  const payloadObj = { role: 'admin', username, iat: Date.now() };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(`admin:${payload}`)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyAdminToken(token: string): { username: string } | null {
  if (!token || revokedAdminTokens.has(token)) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  if (!payload || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(`admin:${payload}`)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (decoded?.role !== 'admin' || !decoded?.username) return null;
    return { username: decoded.username };
  } catch {
    return null;
  }
}

function createVisitorToken(user: RegisteredUser): string {
  const payloadObj = {
    id: user.id,
    email: user.email,
    name: user.name,
    iat: Date.now(),
  };
  const payload = Buffer.from(JSON.stringify(payloadObj)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payload)
    .digest('base64url');
  return `${payload}.${signature}`;
}

function verifyVisitorToken(token: string): { id: string; email: string; name: string } | null {
  if (!token || revokedVisitorTokens.has(token)) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  if (!payload || !sig) return null;

  const expectedSig = crypto
    .createHmac('sha256', TOKEN_SECRET)
    .update(payload)
    .digest('base64url');

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return null;
  }

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (!decoded?.email || !decoded?.id) return null;
    return { id: decoded.id, email: decoded.email, name: decoded.name || 'Guest' };
  } catch {
    return null;
  }
}

// Admin Auth middleware (separate from visitor login)
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication required' });
  }
  const token = authHeader.split(' ')[1];
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session token' });
  }
  next();
};

// --- API ROUTES ---

// Health & Status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Database status & info
app.get('/api/db-status', (req, res) => {
  res.json({
    success: true,
    data: {
      connected: dbStore.isMongoConnected,
      mode: dbStore.isMongoConnected ? 'MongoDB Atlas (Persistent Cloud)' : 'Persistent Local Keepsake Store (Active)',
      error: dbStore.mongoError || null,
      rawError: dbStore.rawMongoError || null,
      errorStack: dbStore.mongoErrorStack || null,
      topologyErrors: dbStore.topologyErrors,
      atlasHost: dbStore.atlasHost || null,
      dbName: dbStore.dbName || null,
      outboundIp: dbStore.outboundIp || null,
      runtimeEnvironment: dbStore.runtimeEnvironment,
      photoCount: dbStore.photos.length,
      wishesCount: dbStore.settings.guestWishes.length,
      usersCount: dbStore.getRegisteredUsers().length,
      hasAtlasConfigured: !!process.env.MONGODB_URI
    }
  });
});

// Dynamic MongoDB Connect / Reconnect
app.post('/api/connect-db', requireAuth, async (req, res) => {
  const { uri } = req.body;
  if (!uri || typeof uri !== 'string') {
    return res.status(400).json({ success: false, error: 'MongoDB connection URI is required' });
  }

  process.env.MONGODB_URI = uri.trim();
  try {
    await dbStore.initDatabase(uri.trim());
    if (!dbStore.isMongoConnected) {
      return res.status(400).json({
        success: false,
        error: dbStore.mongoError || 'Could not connect to MongoDB Atlas cluster.',
        data: {
          connected: false,
          error: dbStore.mongoError,
          rawError: dbStore.rawMongoError || null,
          outboundIp: dbStore.outboundIp || null,
          topologyErrors: dbStore.topologyErrors
        }
      });
    }

    res.json({
      success: true,
      data: {
        connected: true,
        error: null,
        outboundIp: dbStore.outboundIp || null
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Connection attempt failed' });
  }
});

// Retry connecting using configured environment MONGODB_URI
app.post('/api/reconnect-db', requireAuth, async (req, res) => {
  const uri = (process.env.MONGODB_URI ?? '').trim();
  if (!uri) {
    return res.status(400).json({ success: false, error: 'MONGODB_URI is not configured in environment secrets.' });
  }
  await dbStore.initDatabase(uri);
  if (!dbStore.isMongoConnected) {
    return res.status(400).json({
      success: false,
      error: dbStore.mongoError || 'Could not connect to MongoDB Atlas cluster.',
      data: {
        connected: false,
        error: dbStore.mongoError,
        rawError: dbStore.rawMongoError || null,
        outboundIp: dbStore.outboundIp || null,
        topologyErrors: dbStore.topologyErrors
      }
    });
  }
  return res.json({
    success: true,
    data: { connected: true, usersCount: dbStore.getRegisteredUsers().length }
  });
});

// Real MongoDB Atlas Ping & Test Document Write Verification
app.post('/api/db-verify', requireAuth, async (req, res) => {
  const result = await dbStore.verifyMongoPingAndWrite();
  if (!result.connected || !result.pingOk || !result.writeVerified) {
    return res.status(400).json({
      success: false,
      error: result.error || 'MongoDB Atlas ping/write verification failed.',
      data: result
    });
  }
  return res.json({ success: true, data: result });
});

// --- VISITOR AUTHENTICATION ROUTES (Pre-App Gate) ---

app.post('/api/user-auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Please enter your full name (at least 2 characters).' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long.' });
  }

  const result = await dbStore.registerUser(name, email, password);
  if (result.error || !result.user) {
    return res.status(409).json({ success: false, error: result.error || 'Unable to register account.' });
  }

  const token = createVisitorToken(result.user);
  return res.status(201).json({
    success: true,
    data: {
      token,
      user: result.user
    }
  });
});

app.post('/api/user-auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Password is required.' });
  }

  const result = await dbStore.authenticateUser(email, password);
  if (result.error || !result.user) {
    return res.status(401).json({ success: false, error: result.error || 'Invalid email or password.' });
  }

  const token = createVisitorToken(result.user);
  return res.json({
    success: true,
    data: {
      token,
      user: result.user
    }
  });
});

app.get('/api/user-auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ success: true, data: { authenticated: false, user: null } });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyVisitorToken(token);
  if (!decoded) {
    return res.json({ success: true, data: { authenticated: false, user: null } });
  }

  const storedUser = await dbStore.getUserByEmail(decoded.email);
  if (!storedUser) {
    return res.json({ success: true, data: { authenticated: false, user: null } });
  }

  return res.json({
    success: true,
    data: {
      authenticated: true,
      user: storedUser
    }
  });
});

app.post('/api/user-auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    revokedVisitorTokens.add(token);
  }
  return res.json({ success: true, message: 'Signed out successfully' });
});

// --- ADMIN AUTH ROUTES ---

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = createAdminToken(ADMIN_USERNAME);
    return res.json({
      success: true,
      data: {
        token,
        user: { username: ADMIN_USERNAME, email: 'admin@maggiesbirthday.com', lastLogin: new Date().toISOString() }
      }
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid credentials.' });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const verified = verifyAdminToken(token);
    if (verified) {
      return res.json({
        success: true,
        data: { authenticated: true, username: verified.username }
      });
    }
  }
  res.json({ success: true, data: { authenticated: false } });
});

app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    revokedAdminTokens.add(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

app.get('/api/admin/users', requireAuth, (req, res) => {
  res.json({
    success: true,
    data: dbStore.getRegisteredUsers(true)
  });
});

// Photo APIs
app.get('/api/photos', (req, res) => {
  res.json({ success: true, data: dbStore.photos });
});

app.post('/api/photos', requireAuth, async (req, res) => {
  const { url, title, caption, category, date, location, rotationDeg, isFeatured } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: 'Photo URL is required' });
  }

  const newPhoto: PhotoItem = {
    id: 'photo-' + Date.now(),
    url,
    title: title || 'Keepsake Memory',
    caption: caption || '',
    category: category || 'polaroid',
    date: date || 'Birthday Keepsake',
    location: location || '',
    rotationDeg: typeof rotationDeg === 'number' ? rotationDeg : (Math.floor(Math.random() * 9) - 4),
    isFeatured: !!isFeatured,
    order: dbStore.photos.length + 1
  };

  const saved = await dbStore.savePhoto(newPhoto);
  res.json({ success: true, data: saved });
});

app.put('/api/photos/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const existing = dbStore.photos.find(p => p.id === id);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Photo not found' });
  }

  const updated: PhotoItem = {
    ...existing,
    ...req.body,
    id: existing.id
  };

  const saved = await dbStore.savePhoto(updated);
  res.json({ success: true, data: saved });
});

app.delete('/api/photos/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  await dbStore.deletePhoto(id);
  res.json({ success: true, message: 'Photo deleted successfully' });
});

// Content APIs
app.get('/api/content', (req, res) => {
  res.json({ success: true, data: dbStore.content });
});

app.put('/api/content', requireAuth, async (req, res) => {
  const updated = await dbStore.updateContent(req.body);
  res.json({ success: true, data: updated });
});

// Settings APIs
app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: dbStore.settings });
});

app.put('/api/settings', requireAuth, async (req, res) => {
  const updated = await dbStore.updateSettings(req.body);
  res.json({ success: true, data: updated });
});

// Guest Book Wishes
app.post('/api/wishes', async (req, res) => {
  const { name, message, stampIcon } = req.body;
  if (!name || !message) {
    return res.status(400).json({ success: false, error: 'Name and heartfelt message are required' });
  }

  const now = new Date();
  const timeStr = `Today at ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const newWish: GuestWish = {
    id: 'wish-' + Date.now(),
    name: name.trim().slice(0, 50),
    message: message.trim().slice(0, 300),
    date: timeStr,
    stampIcon: stampIcon || 'heart'
  };

  await dbStore.addWish(newWish);
  res.json({ success: true, data: newWish });
});

// Reset to default seed data (useful for demonstration)
app.post('/api/admin/reset-defaults', requireAuth, async (req, res) => {
  await dbStore.resetDefaults();
  res.json({ success: true, message: 'Keepsake reset to curated editorial defaults' });
});

// Serve frontend in dev (Vite middleware) or production (static build)
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`✨ Maggie's Birthday server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
