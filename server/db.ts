import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import mongoose from 'mongoose';
import { PhotoItem, BirthdayContent, WebsiteSettingsData, GuestWish, RegisteredUser } from '../src/types/index.ts';
import { PhotoModel, BirthdayMessageModel, WebsiteSettingsModel, UserModel } from './models/schemas.ts';

// Initial Seed Data referencing the high-fidelity generated images
export const DEFAULT_PHOTOS: PhotoItem[] = [
  {
    id: 'photo-1',
    url: '/src/assets/images/maggie_vogue_cover_1794012861093.jpg',
    title: 'Vogue Special Edition',
    caption: 'Cover star of our hearts: Velvet blazer, gold tones, and effortless confidence.',
    category: 'vogue',
    date: 'Autumn Issue',
    location: 'Studio Milano',
    rotationDeg: -2,
    isFeatured: true,
    order: 1
  },
  {
    id: 'photo-2',
    url: '/src/assets/images/maggie_candid_smile_1794012862220.jpg',
    title: 'Morning in Saint-Germain',
    caption: 'Coffee, fresh croissants, and laughter that made the whole terrace turn heads.',
    category: 'polaroid',
    date: 'October 14',
    location: 'Paris, France',
    rotationDeg: -3,
    isFeatured: true,
    order: 2
  },
  {
    id: 'photo-3',
    url: '/src/assets/images/maggie_polaroid_travel_1794012862363.jpg',
    title: 'Amalfi Coast Memories',
    caption: 'Sun-drenched cliffs, sea breeze, and that golden sunset we promised never to forget.',
    category: 'polaroid',
    date: 'August 28',
    location: 'Positano, Italy',
    rotationDeg: 4,
    isFeatured: true,
    order: 3
  },
  {
    id: 'photo-4',
    url: '/src/assets/images/maggie_vip_portrait_1794012861926.jpg',
    title: 'Rembrandt Noir Portrait',
    caption: 'The warmth in your eyes and the genuine heart behind every smile.',
    category: 'scrapbook',
    date: 'November Keepsake',
    location: 'Atelier Portrait',
    rotationDeg: 2,
    isFeatured: true,
    order: 4
  },
  {
    id: 'photo-5',
    url: '/src/assets/images/maggie_hero_celebration_1794012861156.jpg',
    title: 'The Royal Banquet Call',
    caption: 'Velvet drapery, sparkling crystal, and toasts raised high for our best friend.',
    category: 'ribbon',
    date: 'Midnight Gala',
    location: 'Grand Ballroom',
    rotationDeg: -1,
    isFeatured: true,
    order: 5
  }
];

export const DEFAULT_CONTENT: BirthdayContent = {
  heroGreeting: 'Happy 24th Birthday, Maggie',
  heroSubtitle: 'A curated keepsake of high-fashion memories, late-night laughter, and an extraordinary friendship.',
  heroAge: '24',
  vogueHeadline: 'MAGGIE: THE ART OF RADIANCE',
  vogueSubheadline: 'An exclusive retrospective on twenty-four years of unmatched style, warmth, intellect, and grace.',
  vogueIssueNumber: 'SPECIAL NO. 24',
  vogueDateText: 'NOVEMBER SPECIAL ISSUE',
  letterRecipient: 'Dearest Maggie,',
  letterBody: `To know you is to understand what true elegance, warmth, and loyalty feel like.

Over the past year, through every spontaneous late-night coffee run, every museum afternoon, every whispered secret, and every uncontrollable fit of laughter, you have been an anchor of pure joy. You carry yourself with such effortless grace—turning ordinary moments into cinematic memories that belong in the pages of Vogue.

Today we celebrate everything you are: your kindness that never wavers, your infectious energy that lights up every room before you even speak, and your fearless spirit that inspires everyone around you.

As you step into 24, I hope this year wraps you in gold, brings you breathtaking adventures, and rewards your beautiful heart with all the happiness and peace you give so freely to others.

Thank you for being my constant, my confidante, and my best friend.`,
  letterSignOff: 'Forever and always with boundless love,',
  letterSender: 'Your Best Friend',
  surpriseHeadline: 'A Golden Wish for Your 24th Year',
  surpriseMessage: 'May every sunrise bring you fresh inspiration, may every road lead you to places you dream of, and may you always remember how deeply cherished you are.',
  quoteText: 'True glamour is not about what you wear; it is the glow of kindness you leave in every room you enter.',
  quoteAuthor: 'Vogue Birthday Editorial Edition'
};

// Calculate birthday target date: 5 days from now as a default countdown date
const defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 5);
defaultDate.setHours(20, 0, 0, 0);

export const DEFAULT_SETTINGS: WebsiteSettingsData = {
  birthdayDate: defaultDate.toISOString(),
  siteTitle: "Maggie's Birthday – Velvet & Keepsake",
  musicTitle: "L'Amour & La Nuit (Vintage Waltz)",
  musicArtist: "Acoustic Keepsake Ensemble",
  musicUrl: '',
  theme: 'velvet',
  allowGuestWishes: true,
  guestWishes: [
    {
      id: 'wish-1',
      name: 'Elena & Lucas',
      message: 'Happy Birthday Maggie! Keep shining like the brilliant queen you are! Love you endlessly! ✨',
      date: 'Today at 14:20',
      stampIcon: 'heart'
    },
    {
      id: 'wish-2',
      name: 'Sofia V.',
      message: 'To the most stylish, kind-hearted soul. Here is to 24 and endless champagne toasts! 🥂',
      date: 'Today at 16:05',
      stampIcon: 'star'
    }
  ]
};

const DATA_DIR = path.resolve(process.cwd(), 'server', 'data');
const STORE_FILE = path.join(DATA_DIR, 'keepsake-store.json');

export interface StoredUserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  passwordHash?: string;
  createdAt: string;
  lastLogin: string;
}

interface PersistedLocalStore {
  photos: PhotoItem[];
  content: BirthdayContent;
  settings: WebsiteSettingsData;
  users: StoredUserRecord[];
}

function verifyLegacyPasswordHash(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 2) return false;
  const [salt, keyHex] = parts;
  if (!salt || !keyHex) return false;
  const keyBuffer = Buffer.from(keyHex, 'hex');
  const derivedBuffer = crypto.scryptSync(password, salt, 64);
  if (keyBuffer.length !== derivedBuffer.length) return false;
  return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
}

function sanitizeUser(u: StoredUserRecord, includePassword = false): RegisteredUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    ...(includePassword ? { password: u.password || '' } : {}),
    createdAt: u.createdAt,
    lastLogin: u.lastLogin,
  };
}

function sanitizeDiagnosticsText(text: string): string {
  if (!text) return '';
  return text.replace(/mongodb(\+srv)?:\/\/[^@\s]+@/gi, 'mongodb$1://[REDACTED]@');
}

function formatMongoError(rawMessage: string, outboundIp?: string | null): string {
  const safe = sanitizeDiagnosticsText(rawMessage);
  if (safe.toLowerCase().includes('bad auth') || safe.toLowerCase().includes('authentication failed')) {
    return 'TLS connected to MongoDB Atlas, but authentication failed (bad auth). Check your database username/password in MongoDB Atlas → Database Access (ensure any <db_password> placeholder is replaced and special characters are URL-encoded), then update MONGODB_URI in Secrets or paste the updated URI below.';
  }
  if (
    safe.includes('whitelist') ||
    safe.includes('Server selection timed out') ||
    safe.includes('SSL alert') ||
    safe.includes('tlsv1 alert')
  ) {
    const ipHint = outboundIp ? ` (server outbound IP: ${outboundIp})` : '';
    return `MongoDB Atlas rejected the TLS handshake${ipHint}. If you clicked "Add Current IP Address" in Atlas from your browser, that added your local IP instead of this cloud server's outbound IP. Add ${outboundIp ? `${outboundIp}/32 or ` : ''}0.0.0.0/0 in Atlas → Network Access → IP Access List, then retry.`;
  }
  return safe;
}

function extractTopologyErrors(err: any): Array<{ host: string; error: string }> {
  const results: Array<{ host: string; error: string }> = [];
  const servers = err?.reason?.servers;
  if (servers && typeof servers.forEach === 'function') {
    servers.forEach((desc: any, host: string) => {
      const msg = desc?.error?.message || desc?.error?.reason?.message || '';
      if (msg) {
        results.push({ host, error: sanitizeDiagnosticsText(msg) });
      }
    });
  }
  return results;
}

async function detectOutboundIp(): Promise<string> {
  return new Promise((resolve) => {
    const req = https.get('https://api.ipify.org?format=json', { timeout: 3500 }, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve(typeof parsed?.ip === 'string' ? parsed.ip : '');
        } catch {
          resolve('');
        }
      });
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => {
      req.destroy();
      resolve('');
    });
  });
}

// State Store (Persistent Local JSON Store + Synced with Mongoose if connected)
class StoreService {
  public photos: PhotoItem[] = [...DEFAULT_PHOTOS];
  public content: BirthdayContent = { ...DEFAULT_CONTENT };
  public settings: WebsiteSettingsData = {
    ...DEFAULT_SETTINGS,
    guestWishes: [...DEFAULT_SETTINGS.guestWishes],
  };
  public users: StoredUserRecord[] = [];
  public isMongoConnected = false;
  public mongoError = '';
  public rawMongoError = '';
  public mongoErrorStack = '';
  public topologyErrors: Array<{ host: string; error: string }> = [];
  public atlasHost = '';
  public dbName = '';
  public outboundIp = '';
  public runtimeEnvironment = process.env.K_SERVICE ? 'Google Cloud Run (Remote Cloud)' : 'Local / Standard Node.js';
  private listenerAttached = false;
  private lastReconnectAttempt = 0;

  constructor() {
    this.loadLocalStore();
  }

  private loadLocalStore() {
    try {
      if (fs.existsSync(STORE_FILE)) {
        const raw = fs.readFileSync(STORE_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as Partial<PersistedLocalStore>;
        if (Array.isArray(parsed.photos) && parsed.photos.length > 0) {
          this.photos = parsed.photos;
        }
        if (parsed.content) {
          this.content = { ...DEFAULT_CONTENT, ...parsed.content };
        }
        if (parsed.settings) {
          this.settings = {
            ...DEFAULT_SETTINGS,
            ...parsed.settings,
            guestWishes: Array.isArray(parsed.settings.guestWishes)
              ? parsed.settings.guestWishes
              : [...DEFAULT_SETTINGS.guestWishes],
          };
        }
        if (Array.isArray(parsed.users)) {
          this.users = parsed.users;
        }
      } else {
        this.saveLocalStore();
      }
    } catch {
      // Fallback safely to in-memory defaults if local JSON cannot be read
    }
  }

  private saveLocalStore() {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      const payload: PersistedLocalStore = {
        photos: this.photos,
        content: this.content,
        settings: this.settings,
        users: this.users,
      };
      fs.writeFileSync(STORE_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch {
      // Ignore write failures in read-only filesystems
    }
  }

  private attachMongoListeners() {
    if (this.listenerAttached) return;
    this.listenerAttached = true;

    mongoose.connection.on('error', (err: Error) => {
      this.isMongoConnected = false;
      const safeRaw = sanitizeDiagnosticsText(err?.message || 'MongoDB connection error');
      this.rawMongoError = safeRaw;
      this.mongoErrorStack = sanitizeDiagnosticsText(err?.stack || '');
      this.mongoError = formatMongoError(safeRaw, this.outboundIp);
    });

    mongoose.connection.on('disconnected', () => {
      this.isMongoConnected = false;
    });
  }

  async initDatabase(customUri?: string) {
    const rawUri = (customUri ?? process.env.MONGODB_URI ?? '').trim();
    const mongoUri = rawUri.replace(/^['"]|['"]$/g, '').trim();
    this.attachMongoListeners();
    this.lastReconnectAttempt = Date.now();

    if (!this.outboundIp) {
      this.outboundIp = await detectOutboundIp();
    }

    const hostMatch = mongoUri.match(/@([^/?]+)/);
    this.atlasHost = hostMatch ? hostMatch[1] : '';

    if (!mongoUri) {
      this.isMongoConnected = false;
      this.mongoError = '';
      this.rawMongoError = '';
      this.mongoErrorStack = '';
      this.topologyErrors = [];
      this.dbName = '';
      console.log('Operating in persistent local keepsake store mode (instant local readiness).');
      return;
    }

    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect().catch(() => {});
      }

      const hasExplicitDbName = /^mongodb(\+srv)?:\/\/[^/]+\/[^?]+/.test(mongoUri);
      const isAtlasUri = mongoUri.startsWith('mongodb+srv://') || mongoUri.includes('.mongodb.net');
      console.log(`Connecting to MongoDB Atlas (${this.atlasHost || 'cluster'}) from ${this.runtimeEnvironment}${this.outboundIp ? ` [IP: ${this.outboundIp}]` : ''}...`);
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
        family: 4,
        ...(isAtlasUri ? { tls: true } : {}),
        ...(hasExplicitDbName ? {} : { dbName: 'maggies_birthday' }),
      });

      this.isMongoConnected = true;
      this.mongoError = '';
      this.rawMongoError = '';
      this.mongoErrorStack = '';
      this.topologyErrors = [];
      this.dbName = mongoose.connection.name || 'maggies_birthday';
      console.log(`MongoDB Atlas connected successfully! (db: ${this.dbName})`);
      await this.hydrateFromMongo();
    } catch (err: any) {
      this.isMongoConnected = false;
      this.dbName = '';
      const safeRaw = sanitizeDiagnosticsText(err?.message || 'Failed to connect to MongoDB Atlas');
      const safeStack = sanitizeDiagnosticsText(err?.stack || '');
      const topo = extractTopologyErrors(err);
      this.rawMongoError = safeRaw;
      this.mongoErrorStack = safeStack;
      this.topologyErrors = topo;
      this.mongoError = formatMongoError(safeRaw, this.outboundIp);

      console.error('MongoDB Atlas connection diagnostic:', {
        cluster: this.atlasHost,
        runtime: this.runtimeEnvironment,
        outboundIp: this.outboundIp || 'unknown',
        rawError: safeRaw,
        topologyErrors: topo,
      });

      await mongoose.disconnect().catch(() => {});
      console.log('MongoDB Atlas unavailable; operating seamlessly with persistent local keepsake store.');
    }
  }

  private async ensureMongoConnected() {
    if (this.isMongoConnected) return;
    const mongoUri = (process.env.MONGODB_URI ?? '').trim();
    if (!mongoUri) return;
    const now = Date.now();
    if (now - this.lastReconnectAttempt < 20000) return;
    await this.initDatabase(mongoUri);
  }

  async verifyMongoPingAndWrite(): Promise<{
    connected: boolean;
    pingOk: boolean;
    pingLatencyMs?: number;
    writeVerified: boolean;
    testDocId?: string;
    dbName?: string;
    error?: string;
    rawError?: string;
    topologyErrors?: Array<{ host: string; error: string }>;
  }> {
    if (!this.isMongoConnected || mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
      return {
        connected: false,
        pingOk: false,
        writeVerified: false,
        error: this.mongoError || 'Not connected to MongoDB Atlas.',
        rawError: this.rawMongoError || undefined,
        topologyErrors: this.topologyErrors,
      };
    }

    try {
      const started = Date.now();
      const pingResult = await mongoose.connection.db.admin().command({ ping: 1 });
      const pingLatencyMs = Date.now() - started;
      const pingOk = pingResult?.ok === 1;

      const coll = mongoose.connection.db.collection('_connection_diagnostics');
      const testDoc = {
        type: 'atlas_tls_verification',
        cluster: this.atlasHost,
        outboundIp: this.outboundIp || 'unknown',
        verifiedAt: new Date().toISOString(),
      };
      const insertRes = await coll.insertOne(testDoc);
      const readBack = await coll.findOne({ _id: insertRes.insertedId });
      await coll.deleteOne({ _id: insertRes.insertedId });

      return {
        connected: true,
        pingOk,
        pingLatencyMs,
        writeVerified: !!readBack,
        testDocId: insertRes.insertedId.toString(),
        dbName: this.dbName || mongoose.connection.name,
      };
    } catch (err: any) {
      const safeRaw = sanitizeDiagnosticsText(err?.message || 'Ping/write verification failed');
      return {
        connected: this.isMongoConnected,
        pingOk: false,
        writeVerified: false,
        error: formatMongoError(safeRaw, this.outboundIp),
        rawError: safeRaw,
      };
    }
  }

  async hydrateFromMongo() {
    if (!this.isMongoConnected) return;
    try {
      const photosFromDb = await PhotoModel.find().sort({ order: 1 });
      if (photosFromDb.length > 0) {
        this.photos = photosFromDb.map(p => ({
          id: p._id.toString(),
          url: p.url,
          title: p.title,
          caption: p.caption,
          category: p.category as PhotoItem['category'],
          date: p.date,
          location: p.location,
          rotationDeg: p.rotationDeg,
          isFeatured: p.isFeatured,
          order: p.order
        }));
      } else {
        const seedDocs = DEFAULT_PHOTOS.map(({ id: _id, ...rest }) => rest);
        const inserted = await PhotoModel.insertMany(seedDocs);
        this.photos = inserted.map(p => ({
          id: p._id.toString(),
          url: p.url,
          title: p.title,
          caption: p.caption,
          category: p.category as PhotoItem['category'],
          date: p.date,
          location: p.location,
          rotationDeg: p.rotationDeg,
          isFeatured: p.isFeatured,
          order: p.order
        }));
      }

      const contentDb = await BirthdayMessageModel.findOne();
      if (contentDb) {
        this.content = {
          heroGreeting: contentDb.heroGreeting,
          heroSubtitle: contentDb.heroSubtitle,
          heroAge: contentDb.heroAge,
          vogueHeadline: contentDb.vogueHeadline,
          vogueSubheadline: contentDb.vogueSubheadline,
          vogueIssueNumber: contentDb.vogueIssueNumber,
          vogueDateText: contentDb.vogueDateText,
          letterRecipient: contentDb.letterRecipient,
          letterBody: contentDb.letterBody,
          letterSignOff: contentDb.letterSignOff,
          letterSender: contentDb.letterSender,
          surpriseHeadline: contentDb.surpriseHeadline,
          surpriseMessage: contentDb.surpriseMessage,
          quoteText: contentDb.quoteText,
          quoteAuthor: contentDb.quoteAuthor
        };
      } else {
        await BirthdayMessageModel.create(this.content);
      }

      const settingsDb = await WebsiteSettingsModel.findOne();
      if (settingsDb) {
        this.settings = {
          birthdayDate: settingsDb.birthdayDate,
          siteTitle: settingsDb.siteTitle,
          musicTitle: settingsDb.musicTitle,
          musicArtist: settingsDb.musicArtist,
          musicUrl: settingsDb.musicUrl,
          theme: settingsDb.theme as WebsiteSettingsData['theme'],
          allowGuestWishes: settingsDb.allowGuestWishes,
          guestWishes: settingsDb.guestWishes || []
        };
      } else {
        await WebsiteSettingsModel.create(this.settings);
      }

      // Sync registered users between MongoDB and local store
      const usersFromDb = await UserModel.find().sort({ createdAt: -1 });
      if (usersFromDb.length > 0) {
        const merged = new Map<string, StoredUserRecord>();
        for (const u of usersFromDb) {
          const docPassword = (u as any).password || '';
          const docLegacyHash = (u as any).passwordHash || undefined;
          merged.set(u.email.toLowerCase(), {
            id: u._id.toString(),
            name: u.name,
            email: u.email.toLowerCase(),
            password: docPassword,
            ...(docLegacyHash && !docPassword ? { passwordHash: docLegacyHash } : {}),
            createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
            lastLogin: u.lastLogin ? new Date(u.lastLogin).toISOString() : new Date().toISOString(),
          });
        }
        // Push any local-only users or plain passwords to MongoDB
        for (const localUser of this.users) {
          const emailKey = localUser.email.toLowerCase();
          const existingMerged = merged.get(emailKey);
          const passwordToStore = localUser.password || localUser.passwordHash || '';
          if (!existingMerged) {
            const created = await UserModel.create({
              name: localUser.name,
              email: emailKey,
              password: passwordToStore,
              lastLogin: localUser.lastLogin ? new Date(localUser.lastLogin) : new Date(),
            });
            merged.set(emailKey, {
              id: created._id.toString(),
              name: created.name,
              email: created.email,
              password: (created as any).password || passwordToStore,
              createdAt: created.createdAt ? new Date(created.createdAt).toISOString() : new Date().toISOString(),
              lastLogin: created.lastLogin ? new Date(created.lastLogin).toISOString() : new Date().toISOString(),
            });
          } else if (!existingMerged.password && localUser.password) {
            await UserModel.findByIdAndUpdate(existingMerged.id, { password: localUser.password });
            existingMerged.password = localUser.password;
          }
        }
        this.users = Array.from(merged.values());
      } else if (this.users.length > 0) {
        for (const localUser of this.users) {
          const passwordToStore = localUser.password || localUser.passwordHash || '';
          const created = await UserModel.create({
            name: localUser.name,
            email: localUser.email.toLowerCase(),
            password: passwordToStore,
            lastLogin: localUser.lastLogin ? new Date(localUser.lastLogin) : new Date(),
          });
          localUser.id = created._id.toString();
        }
      }

      this.saveLocalStore();
    } catch (err: any) {
      this.mongoError = formatMongoError(err?.message || 'Error syncing with MongoDB Atlas');
    }
  }

  async registerUser(name: string, email: string, password: string): Promise<{ user?: RegisteredUser; error?: string }> {
    await this.ensureMongoConnected();
    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (this.isMongoConnected) {
      try {
        const existingInDb = await UserModel.findOne({ email: normalizedEmail });
        if (existingInDb) {
          return { error: 'An account with this email already exists. Please sign in.' };
        }
      } catch (err: any) {
        this.mongoError = err?.message || 'Mongo lookup error';
      }
    }

    if (this.users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { error: 'An account with this email already exists. Please sign in.' };
    }

    const nowIso = new Date().toISOString();
    let record: StoredUserRecord = {
      id: `user-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      name: cleanName,
      email: normalizedEmail,
      password,
      createdAt: nowIso,
      lastLogin: nowIso,
    };

    if (this.isMongoConnected) {
      try {
        const created = await UserModel.create({
          name: cleanName,
          email: normalizedEmail,
          password,
          lastLogin: new Date(nowIso),
        });
        record = {
          id: created._id.toString(),
          name: created.name,
          email: created.email,
          password: (created as any).password || password,
          createdAt: created.createdAt ? new Date(created.createdAt).toISOString() : nowIso,
          lastLogin: nowIso,
        };
      } catch (err: any) {
        if (err?.code === 11000) {
          return { error: 'An account with this email already exists. Please sign in.' };
        }
        this.mongoError = err?.message || 'Mongo user registration sync error';
      }
    }

    this.users.unshift(record);
    this.saveLocalStore();
    return { user: sanitizeUser(record) };
  }

  async authenticateUser(email: string, password: string): Promise<{ user?: RegisteredUser; error?: string }> {
    await this.ensureMongoConnected();
    const normalizedEmail = email.trim().toLowerCase();
    let matchedUser: StoredUserRecord | undefined;

    if (this.isMongoConnected) {
      try {
        const dbUser = await UserModel.findOne({ email: normalizedEmail });
        if (dbUser) {
          const docPassword = (dbUser as any).password || '';
          const docLegacyHash = (dbUser as any).passwordHash || undefined;
          matchedUser = {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email.toLowerCase(),
            password: docPassword,
            ...(docLegacyHash && !docPassword ? { passwordHash: docLegacyHash } : {}),
            createdAt: dbUser.createdAt ? new Date(dbUser.createdAt).toISOString() : new Date().toISOString(),
            lastLogin: dbUser.lastLogin ? new Date(dbUser.lastLogin).toISOString() : new Date().toISOString(),
          };
        }
      } catch (err: any) {
        this.mongoError = err?.message || 'Mongo login lookup error';
      }
    }

    if (!matchedUser) {
      matchedUser = this.users.find(u => u.email.toLowerCase() === normalizedEmail);
    }

    if (!matchedUser) {
      return { error: 'Invalid email or password.' };
    }

    const directMatch = typeof matchedUser.password === 'string' && matchedUser.password.length > 0 && matchedUser.password === password;
    const legacyMatch = !directMatch && typeof matchedUser.passwordHash === 'string' && verifyLegacyPasswordHash(password, matchedUser.passwordHash);

    if (!directMatch && !legacyMatch) {
      return { error: 'Invalid email or password.' };
    }

    const nowIso = new Date().toISOString();
    matchedUser = {
      id: matchedUser.id,
      name: matchedUser.name,
      email: matchedUser.email,
      password,
      createdAt: matchedUser.createdAt,
      lastLogin: nowIso,
    };

    // Update local store record
    const existingLocalIdx = this.users.findIndex(u => u.email.toLowerCase() === normalizedEmail);
    if (existingLocalIdx >= 0) {
      this.users[existingLocalIdx] = matchedUser;
    } else {
      this.users.unshift(matchedUser);
    }
    this.saveLocalStore();

    if (this.isMongoConnected && mongoose.Types.ObjectId.isValid(matchedUser.id)) {
      try {
        await UserModel.findByIdAndUpdate(matchedUser.id, {
          password,
          lastLogin: new Date(nowIso),
        });
      } catch {
        // Non-blocking lastLogin / password sync
      }
    }

    return { user: sanitizeUser(matchedUser) };
  }

  async getUserByEmail(email: string): Promise<RegisteredUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.isMongoConnected) {
      try {
        const dbUser = await UserModel.findOne({ email: normalizedEmail });
        if (dbUser) {
          return {
            id: dbUser._id.toString(),
            name: dbUser.name,
            email: dbUser.email.toLowerCase(),
            createdAt: dbUser.createdAt ? new Date(dbUser.createdAt).toISOString() : undefined,
            lastLogin: dbUser.lastLogin ? new Date(dbUser.lastLogin).toISOString() : undefined,
          };
        }
      } catch {
        // Fallback to local list
      }
    }

    const local = this.users.find(u => u.email.toLowerCase() === normalizedEmail);
    return local ? sanitizeUser(local) : null;
  }

  getRegisteredUsers(includePassword = false): RegisteredUser[] {
    return this.users.map(u => sanitizeUser(u, includePassword));
  }

  async savePhoto(photo: PhotoItem): Promise<PhotoItem> {
    if (this.isMongoConnected) {
      try {
        const targetId = mongoose.Types.ObjectId.isValid(photo.id)
          ? photo.id
          : new mongoose.Types.ObjectId();
        const { id: _ignored, ...photoData } = photo;
        const saved = await PhotoModel.findOneAndUpdate(
          { _id: targetId },
          photoData,
          { upsert: true, new: true }
        );
        if (saved) {
          photo = { ...photo, id: saved._id.toString() };
        }
      } catch (e: any) {
        this.mongoError = e?.message || 'Mongo photo sync error';
      }
    }

    const existingIndex = this.photos.findIndex(p => p.id === photo.id);
    if (existingIndex >= 0) {
      this.photos[existingIndex] = photo;
    } else {
      this.photos.push(photo);
    }

    this.saveLocalStore();
    return photo;
  }

  async deletePhoto(id: string): Promise<boolean> {
    this.photos = this.photos.filter(p => p.id !== id);
    this.saveLocalStore();

    if (this.isMongoConnected) {
      try {
        if (mongoose.Types.ObjectId.isValid(id)) {
          await PhotoModel.findByIdAndDelete(id);
        }
      } catch (e: any) {
        this.mongoError = e?.message || 'Mongo photo delete error';
      }
    }
    return true;
  }

  async updateContent(newContent: Partial<BirthdayContent>): Promise<BirthdayContent> {
    this.content = { ...this.content, ...newContent };
    this.saveLocalStore();

    if (this.isMongoConnected) {
      try {
        await BirthdayMessageModel.findOneAndUpdate({}, this.content, { upsert: true });
      } catch (e: any) {
        this.mongoError = e?.message || 'Mongo content update error';
      }
    }
    return this.content;
  }

  async updateSettings(newSettings: Partial<WebsiteSettingsData>): Promise<WebsiteSettingsData> {
    this.settings = { ...this.settings, ...newSettings };
    this.saveLocalStore();

    if (this.isMongoConnected) {
      try {
        await WebsiteSettingsModel.findOneAndUpdate({}, this.settings, { upsert: true });
      } catch (e: any) {
        this.mongoError = e?.message || 'Mongo settings update error';
      }
    }
    return this.settings;
  }

  async addWish(wish: GuestWish): Promise<GuestWish> {
    this.settings.guestWishes.unshift(wish);
    this.saveLocalStore();

    if (this.isMongoConnected) {
      try {
        await WebsiteSettingsModel.findOneAndUpdate(
          {},
          { $push: { guestWishes: { $each: [wish], $position: 0 } } },
          { upsert: true }
        );
      } catch (e: any) {
        this.mongoError = e?.message || 'Mongo wish sync error';
      }
    }
    return wish;
  }

  async resetDefaults(): Promise<void> {
    this.photos = [...DEFAULT_PHOTOS];
    this.content = { ...DEFAULT_CONTENT };
    this.settings = {
      ...DEFAULT_SETTINGS,
      guestWishes: [...DEFAULT_SETTINGS.guestWishes],
    };
    this.saveLocalStore();

    if (this.isMongoConnected) {
      try {
        await PhotoModel.deleteMany({});
        const seedDocs = DEFAULT_PHOTOS.map(({ id: _id, ...rest }) => rest);
        await PhotoModel.insertMany(seedDocs);
        await BirthdayMessageModel.findOneAndUpdate({}, this.content, { upsert: true });
        await WebsiteSettingsModel.findOneAndUpdate({}, this.settings, { upsert: true });
      } catch (e: any) {
        this.mongoError = e?.message || 'Mongo reset error';
      }
    }
  }
}

export const dbStore = new StoreService();
