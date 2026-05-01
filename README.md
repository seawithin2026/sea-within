# 🌊 Sea Within — Come Home to Yourself

A cinematic, immersive wellness sanctuary built with Next.js 14, TailwindCSS, and Supabase.

---

## ✨ What's Inside

### Pages
- **Homepage** — Cinematic scroll journey: Ocean Surface → The Descent → Elemental Journey (Earth, Air, Fire, Water, Universe) → Interwoven → Humanity → Glowing Door Portal → The Invitation
- **Join** — Beautiful sign up / login page
- **Sanctuary** — Private member portal with rituals, practices, and pathways
- **Wisdom Board** — Community reflection board with positive-vibe moderation
- **Community Chat** — Real-time chat with positive-vibe filtering
- **Profile** — Member profile management
- **Admin Dashboard** — Revenue stats, member counts, payment history, charts
- **Tax Tracking** — Tax-season reports, CSV export for your accountant

### Systems
- **Authentication** — Email/password sign up, login, password reset (Supabase Auth)
- **Automated Emails** — Welcome, membership confirmation, payment receipt, renewal reminder (Resend)
- **Positive-Vibe Moderation** — AI-powered content filter that blocks negativity and keeps the community safe
- **Revenue Tracking** — Track all payments, view by month/year/category
- **Tax Reports** — Generate tax-ready summaries, export CSV for your accountant
- **Database** — Full schema with profiles, wisdom posts, chat messages, payments, tax records

---

## 🚀 Getting Started

### Step 1: Install Dependencies

Open your terminal, navigate to the project folder, and run:

```bash
npm install
```

### Step 2: Set Up Supabase 

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a region close to you — US East or Canada)
3. Once your project is ready, go to **Settings → API**
4. Copy your **Project URL** and **anon/public key**
5. Go to **SQL Editor** and paste the contents of `supabase/migrations/001_initial_schema.sql`
6. Click **Run** to create all your database tables

### Step 3: Set Up Resend (Automated Emails)

1. Go to [resend.com](https://resend.com) and create a free account
2. Add your domain (seawithinyourself.com) and verify it
3. Create an API key
4. Copy the API key

### Step 4: Set Up Stripe (Payments — Optional for now)

1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your publishable key and secret key from the dashboard
3. You can skip this step and add payments later

### Step 5: Configure Environment Variables

1. Copy the example file:
```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=hello@seawithinyourself.com
NEXT_PUBLIC_SITE_URL=https://seawithinyourself.com
```

### Step 6: Add Your Videos

Place your cinematic video files in the `/public/videos/` folder:

```
/public/videos/
  ocean-surface.mp4        (Homepage hero — ocean surface footage)
  element-earth.mp4        (Earth element section)
  element-air.mp4          (Air element section)
  element-fire.mp4         (Fire element section)
  element-water.mp4        (Water element section)
  element-universe.mp4     (Universe/cosmos section)
  interwoven-humanity.mp4  (Nature + humanity blended)
  humanity-joy.mp4         (Raw human joy and freedom)
```

**Video tips:**
- Format: MP4 with H.264 codec
- Resolution: 1920x1080 or 4K
- Keep file sizes under 20MB each for fast loading
- Use short loops (10-30 seconds)

### Step 7: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to the World

### Option A: Vercel (Recommended — Free)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Connect your GitHub repository
3. Add your environment variables in the Vercel dashboard
4. Click Deploy
5. Point your domain (seawithinyourself.com) to Vercel

### Option B: Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Connect your repository
3. Add environment variables
4. Deploy

---

## 📁 Project Structure

```
sea-within/
├── app/                          # Pages and API routes
│   ├── page.tsx                  # Cinematic homepage
│   ├── join/page.tsx             # Sign up / login
│   ├── sanctuary/page.tsx        # Member portal
│   ├── wisdom-board/page.tsx     # Wisdom board
│   ├── community/page.tsx        # Community chat
│   ├── profile/page.tsx          # Member profile
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   └── tracking/page.tsx     # Tax tracking
│   └── api/
│       ├── auth/route.ts         # Authentication
│       ├── messages/route.ts     # Wisdom + chat (with moderation)
│       ├── emails/route.ts       # Automated emails
│       └── tracking/             # Revenue + tax tracking
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── videos/                   # Cinematic video sections
│   └── layout/                   # Navigation, footer
├── lib/
│   ├── supabase.ts               # Database client + types
│   ├── auth.ts                   # Authentication helpers
│   ├── moderation.ts             # Positive-vibe content filter
│   ├── tracking.ts               # Revenue + tax tracking
│   └── emails.ts                 # Email templates + sending
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Full database schema
├── public/
│   ├── videos/                   # Your cinematic video files
│   └── images/                   # Your images
├── package.json
├── tailwind.config.js
├── next.config.js
├── tsconfig.json
└── .env.local.example
```

---

## 🔒 Positive-Vibe Moderation

Every message in the Wisdom Board and Community Chat passes through the moderation system before being saved. The system:

- **Blocks** profanity, hate speech, aggression, bullying, spam
- **Blocks** all-caps shouting and excessive punctuation
- **Allows** uplifting, reflective, supportive, and kind messages
- **Shows gentle feedback** when a message is blocked:
  *"This space is for uplifting, reflective, and supportive communication."*

The moderation is built into `/lib/moderation.ts` and can be customized.

---

## 💰 Tax Tracking

Your admin dashboard includes:

- **Total revenue** (all time)
- **Monthly revenue** (current month)
- **Yearly revenue** (selected year)
- **Revenue by category** (membership, product, donation)
- **Revenue by month** (bar chart)
- **Recent payments** (table with details)
- **CSV export** — one-click download for your accountant
- **Tax summary** — gross revenue, refunds, net revenue, transaction counts

Access it at `/admin` and `/admin/tracking`.

---

## 📧 Automated Emails

The following emails are sent automatically:

1. **Welcome Email** — When a new user signs up
2. **Membership Confirmation** — When a membership is activated
3. **Payment Receipt** — After every successful payment
4. **Renewal Reminder** — Before a membership renews
5. **Password Reset** — When a user requests a password reset

All emails use the Sea Within brand template (deep ocean blue background, golden accents).

---

## 🩵 Built with Love

Sea Within is a movement for the ones who are ready to feel again —
to breathe deeper, to live truer, to come home to the part of themselves they left behind.

Created by Marilyn, with love from New Brunswick, Canada.

🩵🍵✨
