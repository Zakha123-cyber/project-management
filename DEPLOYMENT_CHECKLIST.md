# ⚡ Quick Deployment Checklist

## 📝 Before Deploy

- [ ] Push all changes to GitHub
- [ ] Verify `.gitignore` excludes `.env` files
- [ ] Check `package.json` has `postinstall` script
- [ ] Test build locally: `npm run build`

## 🗄️ Database Setup (Neon)

- [ ] Create Neon account: https://neon.tech
- [ ] Create new PostgreSQL database
- [ ] Copy connection string (with `?sslmode=require`)
- [ ] Save for later

## 🔐 Clerk Setup

- [ ] Create production app: https://dashboard.clerk.com
- [ ] Copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (pk_live_xxx)
- [ ] Copy `CLERK_SECRET_KEY` (sk_live_xxx)
- [ ] Setup webhook endpoint (will update after deploy)
- [ ] Enable organization feature
- [ ] Configure redirect URLs

## 🚀 Vercel Deployment

- [ ] Create Vercel account: https://vercel.com
- [ ] Import GitHub repository
- [ ] Add environment variables:
  ```
  DATABASE_URL=postgresql://...?sslmode=require
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
  CLERK_SECRET_KEY=sk_live_xxx
  CLERK_WEBHOOK_SECRET=whsec_xxx (update later)
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
  NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
  ```
- [ ] Click Deploy
- [ ] Wait for deployment (~3-5 minutes)
- [ ] Copy production URL

## ⚙️ Post-Deployment

- [ ] Update Clerk webhook URL with Vercel URL
- [ ] Copy webhook signing secret to Vercel env vars
- [ ] Redeploy to apply webhook secret
- [ ] Run `npx prisma db push` (via Vercel CLI or terminal)
- [ ] Test sign up & login
- [ ] Test organization creation
- [ ] Verify webhook works

## ✅ Verification

- [ ] Landing page loads correctly
- [ ] Sign up/in works
- [ ] Create organization works
- [ ] Dashboard accessible
- [ ] Database saves data
- [ ] Webhooks trigger correctly

## 🎉 Done!

Your app is now live at: `https://your-domain.vercel.app`

---

**Need detailed steps?** See `DEPLOYMENT.md`

**Issues?** Check Vercel logs: Project > Deployments > [Latest] > Logs
