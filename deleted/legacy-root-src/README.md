This folder contains files moved during a codebase cleanup to remove duplicates and unused code.

What was moved here:
- All files from the legacy root `src/` directory that duplicated functionality now provided by:
  - apps/web (Next.js app)
  - packages/ui (shared UI library consumed by apps/web)
  - packages/shared (shared utilities/types)
  - packages/database (database schema & code)

Why were they moved?
- The workspace TypeScript config maps the app to use packages/* and apps/* only. The root `src/` wasn’t referenced by the active app and created duplication (e.g., UI components existed both in packages/ui and src/components/ui).
- The Next.js app imports from `@swiss-car-rental/ui` rather than `@/components/*`, so the root UI/layout code is effectively unused.

How to restore anything:
- If you need a file back, move it out of this folder to the appropriate package/app and update imports accordingly.

Next steps suggested:
- Consolidate any remaining utility/types into packages/shared if needed.
- Keep all app-facing UI in packages/ui so apps consume a single source of truth.

