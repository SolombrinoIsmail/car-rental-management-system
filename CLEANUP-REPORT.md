# Codebase Cleanup Report

Date: 2025-08-09

Summary
- Consolidated UI and app code around the active monorepo layout (apps/*, packages/*).
- Moved legacy, duplicate, or unused root-level source files to `deleted/legacy-root-src` to avoid conflicts and ambiguity.
- No code was permanently deleted; everything is preserved under `deleted/` for review.

What changed
1) Root src/ directory moved to deleted/legacy-root-src/
   - Reason: apps/web imports UI from `@swiss-car-rental/ui` (packages/ui) and not from `src/components/*`.
   - Root `src/` contained duplicate UI components (button, card, dropdown-menu, etc.), layout components, utility hooks, and raw SQL migrations that overlap with functionality in packages.
   - Keeping both caused duplication and risk of drift.

2) No changes made to:
   - apps/web (active Next.js app)
   - packages/ui (the shared UI library used by apps/web)
   - packages/shared (shared types/utilities)
   - packages/database (Prisma schema, tests, and scripts)
   - tests/ (E2E and unit scaffolding) — these did not import from the legacy root src.

Rationale
- pnpm-workspace.yaml is scoped to `apps/*` and `packages/*`.
- apps/web imports UI exclusively from `@swiss-car-rental/ui`.
- TypeScript root config maps workspace packages (no alias to the legacy root `src/`).
- Searches showed no references in apps/web to `@/components/*` from the legacy root.

Potential duplicates previously present
- UI components: src/components/ui/* vs packages/ui/src/components/*
- Theme toggle and language selector existed under src/components/ui, while the app uses ThemeToggle exported by packages/ui.
- Layout components (MainLayout, PageContainer, etc.) existed only in root src, but aren’t consumed by apps/web.
- SQL migrations under src/database/migrations overlapped with packages/database owning schema/migrations.

Risk assessment
- Low. The active app imports from workspace packages, not from root src. Moving the legacy src tree should not affect builds.
- If anything breaks, restore individual files from deleted/legacy-root-src and wire them into a relevant package/app.

Suggested next steps (optional)
- If the layout primitives from legacy src are valuable, consider productizing them in packages/ui (as layout primitives) or a new packages/layout package.
- If any swiss localization constants are still useful, centralize them under packages/shared and expose typed helpers.
- Consider archiving tooling folders like `.bmad-core`, `.claude`, and `.roo` if they’re not part of day-to-day development, or document their purpose in README.
- Run a CI typecheck/lint to confirm no residual references exist.

How to revert
- Move selected files from `deleted/legacy-root-src` back to an appropriate location (likely under packages/*), and update imports accordingly.


