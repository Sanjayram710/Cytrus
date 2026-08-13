# CELEBRITEE.IN — Premium Fashion E-Commerce Platform

CELEBRITEE.IN is an editorial, production-ready haute couture fashion e-commerce web application featuring a customer storefront and a protected admin dashboard.

---

## 🌟 Core Product Vision & Features

### 🛍️ Customer Storefront
- **5-Slide Hero Showcase**: 100% Database-driven hero slider featuring auto-play, touch swipe on mobile, pause on hover, slide indicators, and Framer Motion text/image reveal animations.
- **New Arrivals & Bestsellers**: Product cards with secondary hover image reveal, discount badges, quick view preview modal, wishlist toggle, and instant cart additions.
- **Editorial Collections & Silhouette Categories**: Dedicated landing pages for oversized tees, vintage wash drops, graphic tees, and bespoke customizer.
- **Rich Product Experience**: Multi-image thumbnail gallery, main image hover zoom, fullscreen lightbox modal, interactive Size Guide modal, color swatches, stock count warnings, and client reviews.
- **Cart & Persistent Wishlist**: Persisted in `localStorage` with server database sync. Includes coupon applier and automatic 12% GST tax calculation.
- **Multi-Step Checkout**: Contact info -> Shipping address -> Payment method selection (Razorpay online or Cash on Delivery).
- **Live Order Tracking**: Visual progress tracker (Confirmed -> Processing -> Packed -> Shipped -> Delivered) with courier tracking AWB details.

### 🛡️ Admin Dashboard (`/admin`)
- **Dashboard Overview**: KPI cards for Total Revenue, Total Orders, Total Customers, Active Products, and Low Stock Alerts.
- **Product Management**: Full CRUD modal for creating and editing products, image URLs, sizes, colors, price, sale price, SKU, stock count, and status flags.
- **Hero Slide Management**: Full CRUD for all 5 homepage slides (title, subtitle, desktop/mobile images, button text, button URL, display order, active toggle).
- **Orders Management**: Order table, status updater dropdown, payment status updater, courier name, tracking number assignment, and internal notes.
- **Inventory Stock Control**: Real-time stock levels with quick inline updates.
- **Coupons Management**: Percentage or fixed amount discounts with minimum spend rules and redemption limits.
- **Reviews Moderation**: Approve or reject customer reviews.
- **Analytics**: Revenue, order volume, Average Order Value (AOV), and category distribution reports.

---

## 🛠️ Required Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Vanilla CSS, Custom Luxury Color Palette & Typography (`Playfair Display`, `Plus Jakarta Sans`)
- **UI & Icons**: Lucide Icons, Framer Motion
- **Database & ORM**: PostgreSQL / SQLite zero-dependency local execution via Prisma ORM
- **Authentication**: JWT Cookies & Bcrypt password hashing
- **Validation**: Zod & React Hook Form
- **State Management**: Zustand (persistent cart & wishlist)
- **Payments**: Razorpay Node SDK & Server HMAC SHA256 Signature Verification

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables (`.env`)
The repository includes pre-configured defaults in `.env`:
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="celebritee_super_secret_jwt_key_2026_production_grade"
NEXTAUTH_URL="http://localhost:3000"

RAZORPAY_KEY_ID="rzp_test_celebritee_mock_key"
RAZORPAY_KEY_SECRET="celebritee_mock_secret_key"
```

### 3. Push Database Schema & Seed Data
```bash
npm run db:push
npm run db:seed
```
*Seeds products, categories, collections, homepage slides, customer accounts, admin accounts, coupons, reviews, and orders.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Verification Tests

Execute the automated test suite verifying server cart recalculation, coupon validation rules, Razorpay signature verification, and authentication guards:
```bash
npm test
```

---

## 📄 License
© 2026 CELEBRITEE.IN. All Rights Reserved.
