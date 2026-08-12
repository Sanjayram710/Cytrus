# Payment, SMS, and Secret Handling Safety Guidelines

This document outlines the security rules for handling third-party integrations in **Cytrus**, including **Razorpay**, **Fast2SMS**, **UltraMsg WhatsApp**, and **Nodemailer SMTP**.

---

## 💳 1. Payment Safety (Razorpay Integration)

### Core Rules:
1. **Never Expose `RAZORPAY_KEY_SECRET` to the Frontend**:
   - `RAZORPAY_KEY_SECRET` must only be loaded in server-side API routes (`src/app/api/...`).
   - Only `RAZORPAY_KEY_ID` (public key) may be sent to the browser for rendering the Razorpay checkout widget.
2. **Never Trust Client-Side Financial Values**:
   - The frontend must **NEVER** calculate or dictate product prices, discounts, subtotal, tax, or order total.
   - All financial totals must be recalculated server-side in `src/lib/cart-server.ts` or `src/app/api/orders/route.ts` by querying product prices directly from the database.
3. **Mandatory Server-Side Signature Verification**:
   - Payment completion must be verified on the backend by generating an HMAC-SHA256 signature using `RAZORPAY_KEY_SECRET` and comparing it with `razorpay_signature`.

---

## 📱 2. SMS & WhatsApp API Safety (Fast2SMS & UltraMsg)

### Core Rules:
1. **Server-Side Dispatch Only**:
   - `FAST2SMS_API_KEY`, `WHATSAPP_ULTRAMSG_TOKEN`, and `SMTP_PASS` must only be accessed inside backend API routes or server utility functions (`src/lib/notifications.ts`).
   - Never import notification dispatch utilities into client components (`'use client'`).
2. **Never Expose API Tokens**:
   - Do not include API tokens in JSON responses, query parameters, or console log outputs.

---

## 🔐 3. Environment Variable Security Summary

| Variable Name | Exposure | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | Server Only | Supabase PostgreSQL Connection String |
| `DIRECT_URL` | Server Only | Direct PostgreSQL Migration Connection |
| `JWT_SECRET` | Server Only | Authentication Token Signing Key |
| `RAZORPAY_KEY_ID` | Public / Frontend | Public Razorpay Client ID |
| `RAZORPAY_KEY_SECRET` | Server Only | Private Payment Signature Secret |
| `FAST2SMS_API_KEY` | Server Only | Indian SMS Gateway Credentials |
| `WHATSAPP_ULTRAMSG_TOKEN` | Server Only | WhatsApp Notification Token |
| `SMTP_PASS` | Server Only | Nodemailer Mailer Credentials |
