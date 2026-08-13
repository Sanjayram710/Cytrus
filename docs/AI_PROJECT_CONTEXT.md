# AI Project Context for Celebritee.in

This document provides a comprehensive technical overview of the **Celebritee.in** repository architecture, data models, module relationships, and technology stack.

---

## 📌 Project Overview

* **Project Name**: Celebritee.in
* **Application Type**: Luxury Streetwear & Heavyweight Apparel E-Commerce Platform
* **Architecture**: Serverless Next.js App Router (Fullstack React + API Routes)
* **Target Audience**: High-end fashion consumers and administrative e-commerce managers

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) | React 18, Server Components, Client Components |
| **Language** | TypeScript (v5.6+) | Strict type checking (`npx tsc --noEmit`) |
| **Styling** | Vanilla CSS + Tailwind CSS | Tailwind v3, Framer Motion animations, Lucide React icons |
| **State Management** | Zustand & React Hooks | Client-side cart, wishlist, and modal states |
| **Database** | PostgreSQL | Hosted on **Supabase PostgreSQL** |
| **ORM** | Prisma ORM (`@prisma/client`) | Declarative schema in `prisma/schema.prisma` |
| **Authentication** | JWT & Bcrypt | `jsonwebtoken`, `bcryptjs` for admin & customer auth |
| **Payments** | Razorpay SDK | Mock verification fallback + server signature validation |
| **Notifications** | SMTP, Fast2SMS, UltraMsg | Nodemailer, Indian SMS Gateway, WhatsApp API |
| **Document Generation** | PDFKit | Automated PDF Invoice creation for orders |

---

## 🧩 Core Architecture & Module Relationships

The application is structured into interconnected business modules:

```
[ User / Customer ]
       │
       ▼
 [ Cart & Wishlist ] ──► [ Coupon System ]
       │                      │
       ▼                      ▼
 [ Checkout / Payment ] ──► [ Order & OrderItems ]
                                  │
                                  ├─► [ Inventory Deduction ]
                                  ├─► [ OrderStatusHistory ]
                                  ├─► [ SMS / WhatsApp / Email Dispatch ]
                                  └─► [ PDF Invoice Generation ]
```

### Module Breakdown:

1. **Authentication & User Management**:
   - `User` model stores customers and administrators (`role: 'USER' | 'ADMIN'`).
   - `Address` model stores customer delivery addresses with `isDefault` flags.
2. **Product Catalog & Merchandising**:
   - `Product` links to `Category` and optional `Collection`.
   - `ProductVariant` handles size (XS, S, M, L, XL, XXL) and color combinations.
   - `ProductImage` handles primary and secondary hover thumbnail images.
   - `HeroSlide` and `Offer` manage promotional banners and marketing campaigns.
3. **Inventory & Price Tracking**:
   - `Inventory` tracks stock levels per product variant with `lowStockThreshold`.
   - `ProductPriceHistory` records price changes for auditing (`ADMIN_UPDATE`, `PROMOTION`, `SALE`).
   - `AuditLog` records admin price overrides and offer approvals.
4. **Cart, Wishlist & Coupons**:
   - `Cart` & `CartItem` support authenticated users (`userId`) and guest visitors (`sessionKey`).
   - Server-side price recalculation in `src/lib/cart-server.ts` prevents frontend price tampering.
   - `Coupon` & `CouponUsage` handle fixed/percentage discounts with spend requirements.
5. **Orders, Payments & Notifications**:
   - `Order` & `OrderItem` snapshot customer purchases and address details at order time.
   - `Payment` records Razorpay transaction IDs and COD status.
   - Dispatch utilities send automated emails (`Nodemailer`), SMS (`Fast2SMS`), and WhatsApp messages (`UltraMsg`).

---

## 💻 Development Environment

* **Operating System**: Windows / Linux / macOS
* **Node.js**: v20+
* **Package Manager**: `npm`
* **Development Server**: `npm run dev` (Port 3000)
* **Database Management**: Prisma Studio (`npx prisma studio` on Port 5555)
