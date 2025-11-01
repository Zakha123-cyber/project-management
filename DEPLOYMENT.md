# 🚀 Deployment Guide - PPK ORMAWA Task Management

Panduan lengkap untuk deploy aplikasi ke Vercel.

## 📋 Pre-Deployment Checklist

### ✅ Yang Sudah Siap:

- [x] Next.js 14 project structure
- [x] Prisma schema & migrations
- [x] Clerk authentication setup
- [x] Environment variables documented
- [x] Git repository
- [x] `.gitignore` configured
- [x] `postinstall` script untuk Prisma

### ⚠️ Yang Perlu Disiapkan:

1. **Database Production (Neon)**

   - [ ] Buat akun di https://neon.tech
   - [ ] Buat database PostgreSQL baru
   - [ ] Copy connection string

2. **Clerk Production Keys**

   - [ ] Setup production application di Clerk
   - [ ] Copy production keys
   - [ ] Setup webhooks

3. **Vercel Account**
   - [ ] Buat akun di https://vercel.com
   - [ ] Connect dengan GitHub

---

## 🗄️ Step 1: Setup Database (Neon)

### 1.1 Create Neon Database

1. Login ke [Neon Console](https://console.neon.tech)
2. Click **"New Project"**
3. Pilih region terdekat (Singapore recommended)
4. Project name: `ppk-ormawa-production`
5. Click **"Create Project"**

### 1.2 Get Connection String

```
Format URL:
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

Copy dan simpan connection string ini untuk environment variables.

### 1.3 Setup Tables

Setelah deploy, jalankan:

```bash
npx prisma db push
```

---

## 🔐 Step 2: Setup Clerk Production

### 2.1 Create Production Application

1. Login ke [Clerk Dashboard](https://dashboard.clerk.com)
2. Create new application atau use existing
3. **Application Name**: PPK ORMAWA Production
4. Enable **Email** dan **Google** authentication (optional)

### 2.2 Copy Production Keys

Di Clerk Dashboard > API Keys:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_live_`)
- `CLERK_SECRET_KEY` (starts with `sk_live_`)

### 2.3 Setup Webhooks

1. Di Clerk Dashboard > Webhooks
2. Click **"Add Endpoint"**
3. **Endpoint URL**: `https://YOUR-DOMAIN.vercel.app/api/webhook/clerk`
4. **Subscribe to events**:
   - ✅ `organization.created`
   - ✅ `organization.updated`
   - ✅ `organization.deleted`
5. Copy **Signing Secret** (starts with `whsec_`)

### 2.4 Configure URLs

Di Clerk Dashboard > Paths:

```
Sign-in: /sign-in
Sign-up: /sign-up
Home URL: /
After sign-in: /
After sign-up: /
```

---

## 🚢 Step 3: Deploy ke Vercel

### 3.1 Push ke GitHub

Pastikan semua changes sudah di-commit:

```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

### 3.2 Import Project ke Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New Project"**
3. **Import Git Repository**
4. Pilih repository: `Zakha123-cyber/project-management`
5. Configure Project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)

### 3.3 Setup Environment Variables

Di Vercel Project Settings > Environment Variables, tambahkan:

#### Database

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

#### Clerk Keys

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

#### Clerk URLs

```env
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

#### App URL (akan di-update setelah deploy)

```env
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Important**: Set semua variables untuk **Production**, **Preview**, dan **Development**

### 3.4 Deploy!

1. Click **"Deploy"**
2. Tunggu proses build selesai (~2-5 menit)
3. Copy production URL yang diberikan Vercel

---

## ⚙️ Step 4: Post-Deployment Configuration

### 4.1 Update Clerk Webhook URL

1. Kembali ke Clerk Dashboard > Webhooks
2. Edit webhook endpoint
3. Update URL dengan: `https://YOUR-VERCEL-URL.vercel.app/api/webhook/clerk`
4. Save changes

### 4.2 Update Environment Variables

1. Di Vercel Dashboard > Settings > Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` dengan URL production Anda
3. Redeploy untuk apply changes

### 4.3 Test Webhook

1. Di Clerk Dashboard > Webhooks > Testing
2. Send test event
3. Check logs di Vercel untuk memastikan webhook berfungsi

### 4.4 Setup Database (First Time Only)

Jika ini deployment pertama kali:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema ke database
npx prisma db push

# (Optional) Seed initial data
npm run db:seed
```

**Atau gunakan Vercel CLI:**

```bash
vercel env pull .env.production
npx prisma generate
npx prisma db push
```

---

## 🔍 Step 5: Verification & Testing

### 5.1 Test Landing Page

- [ ] Buka `https://your-domain.vercel.app`
- [ ] Cek tampilan landing page
- [ ] Test responsive design

### 5.2 Test Authentication

- [ ] Click "Mulai Sekarang" / "Masuk"
- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Test organization creation

### 5.3 Test Database Connection

- [ ] Create organization
- [ ] Create board
- [ ] Add members
- [ ] Create tasks
- [ ] Submit assessment

### 5.4 Test Webhooks

- [ ] Create organization di Clerk
- [ ] Check if created in database
- [ ] Monitor Vercel logs

---

## 🔧 Troubleshooting

### Build Errors

**Error: Prisma Client not generated**

```bash
# Solution: pastikan postinstall script ada di package.json
"postinstall": "prisma generate"
```

**Error: DATABASE_URL not found**

```
# Solution: Check environment variables di Vercel dashboard
# Pastikan semua env vars ter-set untuk Production
```

### Runtime Errors

**Error: Webhook verification failed**

```
# Solution:
1. Check CLERK_WEBHOOK_SECRET di environment variables
2. Pastikan URL webhook di Clerk sesuai
3. Check Vercel function logs
```

**Error: Database connection failed**

```
# Solution:
1. Verify DATABASE_URL format
2. Pastikan ada ?sslmode=require di akhir URL
3. Check Neon database status
```

---

## 📊 Monitoring

### Vercel Analytics

- Real-time traffic monitoring
- Performance metrics
- Error tracking

### Vercel Logs

- Function logs
- Build logs
- Runtime errors

### Database Monitoring (Neon)

- Connection pooling
- Query performance
- Storage usage

---

## 🔄 Continuous Deployment

Setelah setup selesai, setiap push ke branch `main` akan otomatis trigger deployment:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel akan otomatis:

1. Run build
2. Run tests (jika ada)
3. Deploy ke production
4. Update URL

---

## 🎯 Production Best Practices

### Security

- ✅ Jangan commit `.env` files
- ✅ Use environment variables untuk semua secrets
- ✅ Enable Vercel Firewall (Pro plan)
- ✅ Monitor error logs regularly

### Performance

- ✅ Enable caching
- ✅ Optimize images
- ✅ Monitor Core Web Vitals
- ✅ Use Vercel Analytics

### Database

- ✅ Regular backups (Neon auto-backup)
- ✅ Monitor connection pool
- ✅ Optimize queries
- ✅ Use indexes properly

---

## 🆘 Support & Help

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Clerk Production Checklist](https://clerk.com/docs/deployments/production-checklist)
- [Neon Documentation](https://neon.tech/docs)

### Common Issues

- Check Vercel function logs
- Verify environment variables
- Test webhook endpoints
- Monitor database connections

---

## ✅ Deployment Complete!

Selamat! Aplikasi Anda sekarang live di production. 🎉

**Next Steps:**

1. Share URL dengan tim
2. Setup monitoring & alerts
3. Configure custom domain (optional)
4. Enable analytics
5. Regular maintenance & updates

---

**Deployed with ❤️ to Vercel**
