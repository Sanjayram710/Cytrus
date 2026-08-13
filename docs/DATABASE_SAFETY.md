# Database Safety & Schema Guidelines

This document details the database safety protocols, Prisma ORM practices, and migration guidelines for **Celebritee.in**.

---

## 🗄️ Database Environment

* **Database Engine**: PostgreSQL
* **Hosting Service**: Supabase PostgreSQL
* **ORM Engine**: Prisma ORM (`@prisma/client`)
* **Primary Schema File**: [prisma/schema.prisma](file:///c:/Cytrus/prisma/schema.prisma)
* **Seed Script**: [prisma/seed.ts](file:///c:/Cytrus/prisma/seed.ts)

---

## 🛑 Prohibited Destructive Commands

AI agents (including Meta Muse Code) must **NEVER** execute the following destructive commands without explicit user instruction and manual confirmation:

```bash
# PROHIBITED
npx prisma migrate reset
npx prisma db push --force-reset
DROP DATABASE ...
DROP TABLE ...
```

---

## 🛠️ Approved Database Commands

| Command | Purpose |
| :--- | :--- |
| `npx prisma generate` | Generates type-safe TypeScript Prisma Client (`@prisma/client`) |
| `npm run db:push` | Synchronizes `prisma/schema.prisma` with Supabase PostgreSQL without dropping data |
| `npm run db:seed` | Populates initial data (Categories, Collections, Products, Variants, Users, Admin) |
| `npx prisma studio` | Launches visual web browser database inspector at `http://localhost:5555` |

---

## 📋 Schema Change Safety Protocol

If a feature requires modifying the database schema in `prisma/schema.prisma`:

1. **Inspect Existing Schema**: Read [prisma/schema.prisma](file:///c:/Cytrus/prisma/schema.prisma) to understand existing models and foreign key relations.
2. **Explain Proposed Change**: Describe the fields, models, or relations to be added or modified in the technical plan.
3. **Update Schema**: Edit `prisma/schema.prisma` using non-destructive field definitions (use `@default(...)` or optional `?` for new fields on existing models).
4. **Generate Prisma Client**: Run `npx prisma generate`.
5. **Push Schema Safely**: Run `npm run db:push` (or `npx prisma db push`).
6. **Verify Data Integrity**: Run `npm test` to verify existing application features continue operating without errors.
