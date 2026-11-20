import mongoose, { Schema } from 'mongoose';

// Admin Schema
export const AdminSchema = new Schema({
  username: { type: String, required: true, unique: true, default: 'admin' },
  passwordHash: { type: String, required: true },
  email: { type: String, default: 'admin@maggiesbirthday.com' },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

// Photo Schema
export const PhotoSchema = new Schema({
  url: { type: String, required: true },
  title: { type: String, default: '' },
  caption: { type: String, default: '' },
  category: { type: String, enum: ['vogue', 'polaroid', 'ribbon', 'scrapbook'], default: 'polaroid' },
  date: { type: String, default: '' },
  location: { type: String, default: '' },
  rotationDeg: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// BirthdayMessage Schema
export const BirthdayMessageSchema = new Schema({
  heroGreeting: { type: String, default: 'Happy Birthday, Maggie' },
  heroSubtitle: { type: String, default: 'A curated celebration of elegance, laughter, and an unforgettable journey.' },
  heroAge: { type: String, default: '24' },
  vogueHeadline: { type: String, default: 'MAGGIE: THE ART OF RADIANCE' },
  vogueSubheadline: { type: String, default: 'An exclusive retrospective on twenty-four years of unmatched style, warmth, and grace.' },
  vogueIssueNumber: { type: String, default: 'No. 24' },
  vogueDateText: { type: String, default: 'SPECIAL ANNIVERSARY EDITION' },
  letterRecipient: { type: String, default: 'Dearest Maggie,' },
  letterBody: { type: String, default: '' },
  letterSignOff: { type: String, default: 'With all my love and deepest admiration,' },
  letterSender: { type: String, default: 'Your Best Friend Forever' },
  surpriseHeadline: { type: String, default: 'A Final Golden Wish' },
  surpriseMessage: { type: String, default: 'May this year unfold with the grandest adventures, quiet moments of pure happiness, and everything your beautiful heart desires.' },
  quoteText: { type: String, default: 'Some people make the world brighter just by being in it.' },
  quoteAuthor: { type: String, default: 'For Maggie, with love' }
}, { timestamps: true });

// WebsiteSettings Schema
export const WebsiteSettingsSchema = new Schema({
  birthdayDate: { type: String, default: '2026-11-20T00:00:00.000Z' },
  siteTitle: { type: String, default: "Maggie's Birthday – Velvet & Keepsake" },
  musicTitle: { type: String, default: "L'Amour & La Nuit (Vintage Waltz)" },
  musicArtist: { type: String, default: "Acoustic Keepsake Ensemble" },
  musicUrl: { type: String, default: '' },
  theme: { type: String, default: 'velvet' },
  allowGuestWishes: { type: Boolean, default: true },
  guestWishes: [{
    id: String,
    name: String,
    message: String,
    date: String,
    stampIcon: String
  }]
}, { timestamps: true });

// Visitor User Schema (Email & Password)
export const UserSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: Date.now }
}, { timestamps: true });

export const AdminModel = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const PhotoModel = mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);
export const BirthdayMessageModel = mongoose.models.BirthdayMessage || mongoose.model('BirthdayMessage', BirthdayMessageSchema);
export const WebsiteSettingsModel = mongoose.models.WebsiteSettings || mongoose.model('WebsiteSettings', WebsiteSettingsSchema);

