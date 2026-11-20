# Maggie's Birthday – Velvet & Keepsake

A premium, luxury editorial and interactive birthday keepsake website built for Maggie's 24th birthday milestone. Inspired by high-fashion print editions (Vogue), romantic keepsakes, and tactile scrapbooks.

---

## 🌟 Key Features

1. **Welcome & Landing Page**:
   - Velvet drapery & opulent golden candlelight atmosphere.
   - Grand typography pairing (`Bodoni Moda`, `Playfair Display`, `Space Mono`).
   - Mechanical split-flap countdown timer to Maggie's celebration.
   - Interactive VIP Event Badge Pass with gold foil geometry and lanyard physics.

2. **Birthday Celebration & Interactive Cake**:
   - Personalized greeting and warm ambient glow.
   - Interactive cake with candle lighting, wishing, and blow-out mechanics.
   - Celebratory golden confetti explosions powered by `canvas-confetti`.

3. **Vogue Special Edition 3D Interactive Flipbook**:
   - Realistic digital magazine flipbook with physical page turning, paper rustle audio synthesis, and depth shadows.
   - **Page-by-page reading sequence (8-page magazine)**:
     - **Cover**: Iconic Vogue Special Edition cover featuring Maggie in velvet blazer, Bodoni Moda masthead, barcodes, and gold details.
     - **Pages 02–03 (Editorial Feature)**: Photographic plate (Fig. 1) + retrospective essay (*"The Architecture of Charisma"*).
     - **Pages 04–05 (Special Edition Spread)**: *"Happy Birthday Sweety"* with sweeping 3D polaroid photo ribbon spiral (`Screenshot_2026-11-07_at_6.55.16_AM_965dc0d0.png`).
     - **Pages 06–07 (Polaroid Memories Collage)**: *"Made with endless love for Sweety ♡"* heart-pinned polaroids (*Cutie, Dream Girl, Baddie, Queen*) (`Screenshot_2026-11-07_at_6.55.22_AM_7b4bf551.png`).
     - **Pages 08–09 (Aesthetic Memories Journal Spread)**: Spiral ring-binder journal with Gazette clipping, typewriter taped quotes, photobooth filmstrip, and disco ball (`Screenshot_2026-11-07_at_6.55.31_AM_0e6174a1.png`).
     - **Back Cover**: Archival blessing, gold seal, and barcode metadata.
   - **Navigation & Gestures**:
     - `PREV` and `NEXT` dock pill matching the exact screenshot design (`PREV  PAGE 04 / 08  NEXT`).
     - Mouse drag, touch swipe, and keyboard arrow keys (← / →).
     - Page jump thumbnail drawer, sound toggle, and high-res inspect zoom modal.

4. **Memory Scrapbook**:
   - Tactile scrapbook board with washi tape, 3D red heart pins, and deckled edges.
   - Dynamically tilted polaroids (-4° to +5°) with handwritten captions and dates.
   - Category filtering (All, Polaroids, Candid Moments, Editorial) and zoom lightbox.

5. **Photo Ribbon Gallery**:
   - Horizontally scrolling filmstrip ribbon gallery with vintage sprocket perforations.
   - Interactive lightbox with high-res zoom, next/prev navigation, and captions.

6. **Keepsake Birthday Letter**:
   - Vintage envelope sealed with a crimson lacquer wax seal initialed **"M"**.
   - Tap to break seal: smooth unfolding animation into an archival parchment letter with custom drop cap.
   - Fully editable and synced via backend database.

7. **Music Experience**:
   - Vintage spinning gold vinyl record player with tone-arm and visualizer bars.
   - Web Audio API romantic acoustic waltz synthesizer (*L'Amour & La Nuit*), starting only after user interaction.
   - Volume control, mute toggle, and expandable track info.

8. **Final Surprise & Live Guestbook**:
   - Interactive 3D gift box with ribbon untie animation revealing the golden milestone blessing.
   - Live guestbook where friends can leave personalized wishes with keepsake stamp seals (Heart, Toast, Star).

9. **Administrative Suite**:
   - Secure login (`admin` / `maggie2026`).
   - Full CRUD: Upload and manage photos, edit captions and rotations.
   - Edit hero greetings, Vogue headlines, pull quotes, and the personal letter.
   - Adjust countdown target date and background music metadata.
   - Live MongoDB Atlas cluster connection status and sync manager.

---

## 📁 Project Architecture & Folder Structure

```
maggies-birthday/
├── .env.example              # Environment variables template
├── index.html                # Entry point with Google Fonts (Bodoni Moda, Playfair Display, Space Mono)
├── metadata.json             # AI Studio applet metadata & capabilities
├── package.json              # Full-stack dependencies & scripts
├── README.md                 # Complete documentation & deployment guide
├── server.ts                 # Express full-stack backend with Vite middleware
├── server/
│   ├── db.ts                 # MongoDB Mongoose connection & in-memory fallback store
│   └── models/
│       └── schemas.ts        # Mongoose schemas: Admin, Photo, BirthdayMessage, WebsiteSettings
└── src/
    ├── App.tsx               # Main frontend coordinator & hero landing
    ├── index.css             # Tailwind CSS v4 design tokens, parchment textures & shadows
    ├── main.tsx              # React DOM mounting
    ├── assets/
    │   └── images/           # High-resolution generated editorial photography
    ├── components/
    │   ├── AdminModal.tsx         # Full administrative dashboard & MongoDB manager
    │   ├── CakeCelebration.tsx    # Interactive cake with candle blowing & confetti
    │   ├── CountdownFlipClock.tsx # Split-flap mechanical countdown timer
    │   ├── FinalSurprise.tsx      # Ribbon gift box reveal & live guestbook
    │   ├── HeaderNav.tsx          # 3-Zone top bar contract
    │   ├── MemoryScrapbook.tsx    # Tactile polaroid scrapbook with heart pins
    │   ├── PhotoRibbon.tsx        # Horizontal filmstrip photo gallery
    │   ├── VipBadgePass.tsx       # VIP event keepsake pass
    │   ├── VinylMusicPlayer.tsx   # Spinning gold vinyl player & Web Audio synth
    │   └── VogueSpread.tsx        # Vogue magazine editorial spread & reader
    ├── types/
    │   └── index.ts          # Shared TypeScript models
    └── utils/
        └── audio.ts          # Romantic acoustic birthday waltz synthesizer
```

---

## 🚀 Running Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Edit `.env` to configure your admin password and optional MongoDB Atlas connection:
```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/maggies_birthday?retryWrites=true&w=majority"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="maggie2026"
PORT=3000
```
*(Note: If `MONGODB_URI` is left blank, the platform automatically runs in high-performance local store mode, so everything works out of the box!)*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Configuring MongoDB Atlas

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new free cluster (Shared M0).
3. Under **Database Access**, create a user with read and write permissions (e.g. `admin`).
4. Under **Network Access**, add IP Address `0.0.0.0/0` (allow access from anywhere) so cloud hosts like Render can reach it.
5. Click **Connect** → **Drivers** → copy the connection string.
6. Replace `<password>` with your database user password.
7. Paste this URI into your `.env` file under `MONGODB_URI`, or enter it directly into the **MongoDB Atlas** tab in the Admin Suite on the website!

---

## 🔐 Accessing the Admin Dashboard

1. Click the **"Admin Suite"** button in the top navigation bar.
2. Enter the credentials:
   - **Username**: `admin`
   - **Password**: `maggie2026`
3. Once logged in, you can:
   - Add, edit, or delete gallery photos.
   - Modify the birthday greetings, age, and Vogue masthead text.
   - Edit Maggie's handwritten keepsake letter.
   - Adjust the birthday countdown date.
   - Monitor live MongoDB Atlas connection status.

---

## 🚢 Deploying on Render

### Step 1: Push Code to GitHub
Ensure all code is committed to your GitHub repository.

### Step 2: Create a Web Service on Render
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `maggies-birthday`
   - **Region**: Closest to your users (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm run start
     ```
   - **Plan**: Free

### Step 3: Add Environment Variables in Render
In the **Environment** tab on Render, add:
- `NODE_ENV`: `production`
- `PORT`: `3000`
- `ADMIN_USERNAME`: `admin`
- `ADMIN_PASSWORD`: `<your-secure-password>`
- `MONGODB_URI`: `<your-mongodb-atlas-connection-string>`

### Step 4: Deploy
Click **Create Web Service**. Render will build the Vite assets, start the Express server, and provide a live HTTPS URL.
