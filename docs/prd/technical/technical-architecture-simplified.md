# Technical Architecture (Simplified)

## Technology Stack

- **Frontend:** React (simple SPA)
- **Backend:** Node.js with PostgreSQL
- **Authentication:** Supabase Auth
- **PDF Generation:** Server-side with embedded images
- **Hosting:** Vercel or similar
- **Database:** Supabase PostgreSQL

## Key Technical Decisions

- **No offline mode** - requires internet connection
- **No PWA** - standard web application
- **Photos in PDF only** - no separate blob storage needed
- **Real-time only** - no complex sync logic
- **German language only** - no i18n complexity
