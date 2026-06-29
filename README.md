# Acceding Titans - Professional Marketplace & Networking Platform

> **Africa's Premier Marketplace for Entrepreneurs**
> Connect, collaborate, and grow your business with Acceding Titans

## 🎯 Overview

Acceding Titans is a comprehensive, production-ready **frontend marketplace platform** designed specifically for African entrepreneurs, professionals, and small to medium businesses. It's built with Next.js and connects to a Laravel backend API.

### Key Features

- **Membership-Based System**: Regular, VIP, and VVIP tiers with flexible subscription plans
- **Business Marketplace**: Showcase products/services with direct WhatsApp integration
- **Advanced Advertising**: Post text, image, and video advertisements with moderation
- **Job Marketplace**: Post and find opportunities with proposal management
- **Community Networking**: Direct messaging, collaboration requests, and networking
- **Birthday Rewards System**: Celebrate members and promote their businesses
- **Referral System**: Earn commissions by bringing new members
- **Admin Dashboard**: Complete moderation and analytics tools
- **Payment Integration**: Integrated with your backend payment processing

## 🛠️ Tech Stack

### Frontend (This Project)
- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **HTTP Client**: [Axios](https://axios-http.com/)

### Backend (Laravel - Separate Project)
- Handles authentication, database, business logic, and API endpoints
- See [NEXT_STEPS.md](NEXT_STEPS.md) for required API endpoints

## 📋 Prerequisites

- **Node.js**: v18.17 or higher
- **npm**: v9 or higher
- **Laravel Backend**: Running on your local machine or server
- **Git**: For version control

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Laravel backend URL:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:8000"  # Your Laravel backend
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NODE_ENV="development"
```

### 3. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Key Directories

- **app/** - Next.js App Router pages and layouts
- **src/components/** - React UI and layout components
- **src/hooks/** - Custom React hooks
- **src/store/** - Zustand state management
- **src/types/** - TypeScript interfaces
- **src/lib/** - Validation schemas and utilities
- **src/utils/** - Helper functions
- **src/config/** - Application constants
- **src/services/** - API client and service layer

## 🎨 Design System

Professional, clean design without gradients:
- **Primary (Gold)**: `#D4AF37`
- **Secondary (Black)**: `#0A0A0A`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

## 💳 Membership Tiers

| Tier | Price | Ad Limit |
|------|-------|----------|
| Regular | ₦2,000/mo | 5/month |
| VIP | ₦3,500/mo | 20/month |
| VVIP | ₦5,000/mo | Unlimited |

## 📊 Available Pages

**Public**: `/`, `/features`, `/pricing`, `/about`, `/contact`, `/terms`, `/privacy`

**Auth**: `/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`

**Dashboard**: `/dashboard`, `/dashboard/profile`, `/dashboard/catalogues`, `/dashboard/settings`

**Admin**: `/admin`, `/admin/users`, `/admin/content`

## 🔗 Backend Integration

This frontend connects to your Laravel backend API. See [NEXT_STEPS.md](NEXT_STEPS.md) for:

- API client configuration (Axios)
- Required backend endpoints
- Service layer implementation
- Authentication flow

### Expected API Base URL

By default, the app looks for your backend at:
```
http://localhost:8000
```

Configure via `NEXT_PUBLIC_API_URL` environment variable.

## 🚀 Build & Deploy

```bash
# Build
npm run build

# Start production
npm start
```

## 📚 Documentation

- [NEXT_STEPS.md](NEXT_STEPS.md) - Setup API services and integration guide
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Project structure and architecture

**Built with ❤️ for African Entrepreneurs**
