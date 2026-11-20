# Pre-App Authentication Gate & MongoDB User Storage

Adds a luxury Velvet & Keepsake login and registration gate before entering Maggie's Birthday web application, persisting user emails and securely hashed passwords in MongoDB (with seamless local store fallback).

## User Review & Critical Decisions

> [!IMPORTANT] The following product and design decisions were confirmed in Phase 1 and govern this implementation:

- **Open Registration & Login**: Anyone can create a new account using their name, email, and password or sign in with an existing account before accessing the birthday experience.
- **Separate Visitor & Admin Access**: Visitor email/password authentication gates entry to the birthday website, while the existing Admin Suite keeps its dedicated administrator authentication flow.
- **Velvet & Keepsake Editorial Card**: The authentication screen uses a centered luxury parchment card set over the velvet-and-candlelight hero backdrop, matching the existing typography and color palette.

---

### 1. Overview & Core Concept

- **What It Does**: Presents an editorial login and sign-up screen when a visitor opens the application without an active session. Once authenticated, the visitor enters the full Maggie's Birthday celebration, keeps their session across page reloads, and can sign out at any time.
- **Target Audience**: Maggie, close friends, and invited guests signing in to view the keepsake archive, flip through the VOGUE Special Edition, and leave wishes in the guestbook.
- **Key Value**: Protects the personal birthday experience behind an authenticated entrance while recording registered guest accounts in MongoDB with salted password hashing.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Initial Arrival (Unauthenticated)**: The app verifies any saved visitor session token. If none is active, the user lands on the Velvet & Keepsake login screen instead of the celebration sections.
  2. **Sign Up (Create Account)**: Switching to the Sign Up tab reveals fields for Full Name, Email Address, Password (with show/hide toggle and minimum length validation), and Confirm Password. Submitting registers the user in MongoDB, starts an authenticated session, and smoothly transitions into the birthday experience.
  3. **Sign In (Returning Visitor)**: Submitting a valid email and password verifies the credentials against the stored hash in MongoDB and unlocks the full birthday website. Invalid credentials or duplicate email sign-ups show inline error banners without clearing typed fields.
  4. **Authenticated Session & Sign Out**: Inside the celebration app, the top navigation bar reflects the signed-in visitor and offers a clean Sign Out action that clears the session token and returns to the login gate. The Admin Suite modal remains independently accessible via its own credentials.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Editorial Tactile / Romantic Keepsake—matching the museum-grade print aesthetic of Maggie's Archive.
  - *Color Palette & Mood*: Warm antique parchment card (`#FAF6F0`) framed with bullion gold borders (`#D4AF37`), deep theatre crimson primary actions (`#871321`), and dark velvet vignette backdrop (`#111111` / `#590A14`).
  - *Typography & Hierarchy*: `Bodoni Moda` for the cover title, `Playfair Display` italic for welcoming subcopy, `Space Mono` for uppercase form labels and mode switchers, and `Plus Jakarta Sans` for crisp input readability.
  - *Component Styling & Layout*: Single-column centered card (`max-width: 440px`) with subtle paper grain, gold hairline accents, segmented Sign In / Sign Up tabs, and clear focus rings (`focus-visible`) on all interactive controls.

- **Interactive Feedback & Motion**:
  - Smooth loading spinner and disabled button state during network verification.
  - Inline validation messages for malformed emails, short passwords, mismatched confirmation passwords, and server rejections.
  - Subtle reveal transition when unlocking the celebration canvas after authentication.

---

### 3. Key Product Decisions & Trade-Offs

- **Password Security via Built-in `scrypt` Salted Hashing**:
  - *Chosen Approach*: Hash every password server-side with a unique per-user random salt using Node's native `crypto.scryptSync` and verify with `crypto.timingSafeEqual`.
  - *Why*: Eliminates native C++ build fragility (`bcrypt` compilation issues across environments) while delivering strong memory-hard cryptographic protection, and never stores or returns plaintext passwords.
  - *Alternatives Considered*: Installing `bcrypt` native bindings or storing plain/unsalted hashes (rejected for build fragility and weak security).

- **Dual Persistence Sync (MongoDB User Collection + Local Fallback Store)**:
  - *Chosen Approach*: Define a dedicated `User` Mongoose schema (`name`, `email`, `passwordHash`, `lastLogin`, timestamps) in MongoDB while mirroring user records into the existing persistent local store when MongoDB Atlas is unreachable.
  - *Why*: Guarantees registration and login work reliably both when connected to a live MongoDB Atlas cluster and in sandboxed environments without Atlas IP whitelisting.
  - *Alternatives Considered*: Failing all logins if MongoDB Atlas times out (rejected because it would lock users out in fallback mode).

- **Separate Visitor Session Tokens vs. Admin Session Tokens**:
  - *Chosen Approach*: Maintain separate visitor session verification and header display from the Admin Suite bearer token.
  - *Why*: Directly honors the user's choice to keep guest access and editorial administration cleanly separated so visitors never accidentally gain admin editing privileges.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             Browser Client                              │
│                                                                         │
│  ┌──────────────────────┐       Authenticated       ┌────────────────┐  │
│  │  AuthGate (Login /   │ ─────────────────────────▶│ Celebration    │  │
│  │  Sign Up Card)       │   visitor token stored    │ Experience +   │  │
│  └──────────┬───────────┘                           │ HeaderNav +    │  │
│             │                                       │ AdminModal     │  │
│             │ POST /api/user-auth/{register,login}  └───────┬────────┘  │
└─────────────┼───────────────────────────────────────────────┼───────────┘
              │                                               │
              ▼                                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Express API Server                              │
│                                                                         │
│  ┌───────────────────────────────────┐   ┌───────────────────────────┐  │
│  │ Visitor Auth Routes               │   │ Existing Content & Admin  │  │
│  │ • POST /api/user-auth/register    │   │ Routes                    │  │
│  │ • POST /api/user-auth/login       │   │ • /api/photos, /content,  │  │
│  │ • GET  /api/user-auth/me          │   │   /settings, /wishes      │  │
│  │ • POST /api/user-auth/logout      │   │ • /api/auth/* (Admin)     │  │
│  └─────────────────┬─────────────────┘   └─────────────┬─────────────┘  │
│                    │                                   │                │
│                    ▼                                   ▼                │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │              Database Store Service (scrypt + sync)               │  │
│  │     MongoDB Mongoose (`User`, `Photo`, `BirthdayMessage`, ...)    │  │
│  │               + Persistent Local Store Fallback                   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - **User Entity (MongoDB `User` Collection)**: Stores `name` (trimmed display name), `email` (lowercased, unique index), `passwordHash` (`salt:derivedKey` format), `lastLogin`, and `createdAt` / `updatedAt` timestamps.
  - **Client Auth State**: Tracks `checkingSession`, `currentUser` (`id`, `name`, `email`), and `visitorToken` synced with `localStorage`, rendering a loading state during startup verification, the `AuthGate` when unauthenticated, or the full website when signed in.

- **Interactive Component & State Mapping**:
  - **Mode Switcher (`Sign In` / `Create Account`)**: Resets transient form errors and toggles confirmation password and name fields cleanly.
  - **Form Submission Handler**: Validates email format, password length ($\ge 6$ characters), and password confirmation match client-side before sending credentials to `/api/user-auth/login` or `/api/user-auth/register`.
  - **Session Restoration on Load**: Calls `/api/user-auth/me` with the stored Bearer token on app boot; clears stale tokens automatically if rejected.
  - **Header Sign Out Action**: Calls `/api/user-auth/logout`, clears client session state, and returns immediately to the `AuthGate`.
