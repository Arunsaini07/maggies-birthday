export interface PhotoItem {
  id: string;
  url: string;
  title: string;
  caption: string;
  category: 'vogue' | 'polaroid' | 'ribbon' | 'scrapbook';
  date?: string;
  location?: string;
  rotationDeg?: number;
  isFeatured?: boolean;
  order: number;
}

export interface BirthdayContent {
  heroGreeting: string;
  heroSubtitle: string;
  heroAge: string;
  vogueHeadline: string;
  vogueSubheadline: string;
  vogueIssueNumber: string;
  vogueDateText: string;
  letterRecipient: string;
  letterBody: string;
  letterSignOff: string;
  letterSender: string;
  surpriseHeadline: string;
  surpriseMessage: string;
  quoteText: string;
  quoteAuthor: string;
}

export interface GuestWish {
  id: string;
  name: string;
  message: string;
  date: string;
  stampIcon?: string;
}

export interface WebsiteSettingsData {
  birthdayDate: string; // ISO date string
  siteTitle: string;
  musicTitle: string;
  musicArtist: string;
  musicUrl?: string;
  theme: 'velvet' | 'parchment' | 'gold';
  allowGuestWishes: boolean;
  guestWishes: GuestWish[];
}

export interface AdminUser {
  username: string;
  email: string;
  lastLogin?: string;
}

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt?: string;
  lastLogin?: string;
}

export interface VisitorAuthPayload {
  token: string;
  user: RegisteredUser;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
