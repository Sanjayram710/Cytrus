# AI Development Guidelines for Celebritee.in

This document establishes the safety rules, operating principles, and development protocols for AI coding agents operating on the **Celebritee.in** codebase.

---

## 🛑 Fundamental Directives for AI Coding Agents

1. **Developer-Side Only**: AI agents operate as developer-side coding assistants. **NEVER** install AI agent packages into `package.json` as runtime dependencies. **NEVER** import AI tools into production Next.js React components or API routes.
2. **Read Before Editing**: Always inspect the existing files, architecture, and type signatures before modifying code.
3. **No Destructive Database Actions**: Never run `prisma migrate reset`, `prisma db push --force-reset`, `DROP TABLE`, or `DROP DATABASE`.

---

## 📜 The 18 Mandatory Rules for AI Agents

1. **Inspect the Repository First**: Always view existing code structure, types, and database models before writing or modifying any code.
2. **Preserve Existing Functionality**: Never delete or replace existing features, endpoints, or UI components without explicit user request and approval.
3. **Never Modify Production Secrets**: Never touch or commit real production credentials in `.env` or production deployment environments.
4. **Never Expose `.env` Contents**: Do not print, output, or expose secret keys (JWT secrets, database passwords, API keys) in chat, logs, or commit messages.
5. **Never Hardcode API Keys**: All secrets must be loaded via `process.env.VARIABLE_NAME`.
6. **Check Prisma Models Before Schema Changes**: Inspect [prisma/schema.prisma](file:///c:/Cytrus/prisma/schema.prisma) to avoid creating duplicate or conflicting models.
7. **Never Create Duplicate Models**: Use existing models (`User`, `Product`, `Category`, `Collection`, `Order`, `Inventory`, etc.) rather than introducing redundant abstractions.
8. **Never Create a Second Database**: Celebritee.in relies on a single relational database instance (Supabase PostgreSQL via Prisma). Do not instantiate secondary databases or sqlite fallbacks in production logic.
9. **Review Payment & Order Architecture**: Never modify payment verifications or price calculations without reviewing existing server-side price calculation and Razorpay signature handlers.
10. **Run TypeScript Check**: Always execute `npx tsc --noEmit` after making code changes.
11. **Run Lint Check**: Always execute `npm run lint` after making UI or API changes.
12. **Run Test Suite**: Always execute `npm test` after modifying core features.
13. **Run Production Build**: Always execute `npm run build` after major feature additions to ensure zero build breakages.
14. **Explain Database Migrations**: Present schema changes clearly in an implementation plan before executing `npx prisma db push`.
15. **No Destructive Database Commands**: Do not run commands that wipe database tables unless explicitly requested.
16. **Never Commit Secrets**: Check `git status` and `git diff` before committing to ensure no secret values are staged.
17. **Keep Changes Scope-Focused**: Limit edits strictly to the requested feature or bug fix. Avoid unintended refactorings.
18. **Review Git Diff Before Committing**: Perform a final audit of all modified lines before staging and committing.

---

## 🌿 Git Branching Strategy for AI Agents

Do NOT work directly on `main`. Follow this git hierarchy:

```
main (Production)
  └── development (Integration)
        └── feature/muse-code-development (Agent Working Branch)
              └── sanjay (User Developer Branch)
```

### Branch Creation Workflow:
Before starting work on a new feature:
```bash
# Fetch latest commits
git fetch origin

# Check current branch
git status

# Create a dedicated feature branch
git checkout -b feature/<feature-name>
```
