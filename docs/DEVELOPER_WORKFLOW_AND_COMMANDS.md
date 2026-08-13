# Developer Workflow & AI Coding Agent Operating Guide

This document defines the standard development commands, git workflows, and step-by-step operating procedure for developers working on **Celebritee.in**.

---

## 💻 1. Standard Development Commands

```bash
# 1. Install Dependencies
npm install

# 2. Start Development Server (http://localhost:3000)
npm run dev

# 3. TypeScript Compilation Check
npx tsc --noEmit

# 4. ESLint Check
npm run lint

# 5. Run Integration Test Suite
npm test

# 6. Synchronize Prisma Database Schema
npm run db:push

# 7. Seed Database with Initial Catalog & Admin
npm run db:seed

# 8. Generate Prisma TypeScript Client
npx prisma generate

# 9. Launch Visual Database Inspector (http://localhost:5555)
npx prisma studio

# 10. Production Build & Bundle Verification
npm run build
```

---

## 🤖 2. The 12-Step AI Agent Execution Workflow

When Meta Muse Code or any AI coding agent receives a development task, it must follow this 12-step execution pipeline:

```
[1. Inspect Repo] ──► [2. Understand Architecture] ──► [3. Identify Files]
        │
        ▼
[4. Create Plan] ──► [5. Request Approval] ──► [6. Implement Feature]
        │
        ▼
[7. TS Check] ──► [8. Lint Check] ──► [9. Run Tests] ──► [10. Run Build]
        │
        ▼
[11. Review Git Diff] ──► [12. Summarize Work]
```

1. **Step 1: Inspect Repository**: View existing code structure, types, and database models.
2. **Step 2: Understand Architecture**: Review core modules and dependencies before editing.
3. **Step 3: Identify Target Files**: Map out exact file paths requiring modification.
4. **Step 4: Create Implementation Plan**: Document proposed changes in `implementation_plan.md`.
5. **Step 5: Obtain Approval**: Wait for user review before high-risk changes or migrations.
6. **Step 6: Implement Feature**: Write clean, modular, typed TypeScript code.
7. **Step 7: TypeScript Validation**: Run `npx tsc --noEmit`.
8. **Step 8: Lint Validation**: Run `npm run lint`.
9. **Step 9: Test Validation**: Run `npm test`.
10. **Step 10: Build Validation**: Run `npm run build`.
11. **Step 11: Review Git Diff**: Run `git diff` to ensure no secrets or unwanted edits exist.
12. **Step 12: Summarize Changes**: Present clean summary of files updated and commands executed.

---

## 🚫 3. Non-Production Tool Rule (Meta Muse Code)

* **Do NOT** run `npm install muse-code`.
* **Do NOT** add `muse-code` or AI agent packages to `package.json`.
* **Do NOT** import AI tool classes into React components or Next.js route handlers.
* **Do NOT** expose AI tool keys to browser clients.
* Muse Code operates strictly as an external developer CLI/editor agent.

---

## 🛡️ 4. Git Safety Checkpoints

Before committing changes:
```bash
# Check branch status
git status

# Inspect exact code diff
git diff

# Verify no secrets, passwords, or .env entries are staged
```
