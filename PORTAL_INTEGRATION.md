# Client Portal Integration Documentation

This document outlines the features and integration details of the SCA Client Portal within the main `stackconsultingai-com` repository.

## Features

### 1. Authentication & Registration
- **Login Page**: Located at `/login`.
- **Registration Page**: Located at `/register` (Public registration for new clients).
- **Session Management**: Powered by NextAuth.js v5 (beta) with JWT strategy.
- **Password Hashing**: Uses `bcryptjs`.

### 2. Client Portal (`/dashboard`, `/projects`, `/invoices`, `/messages`)
- **Dashboard**: Overview of active projects, pending invoices, and unread messages.
- **Project Management**: View project status, progress, and milestones.
- **Invoice Tracking**: View and track invoices and their payment status.
- **Messaging System**: Real-time communication between clients and admins per project.

### 3. Admin Panel (`/admin`)
- **Admin Dashboard**: Global overview of all clients and projects.
- **Client Management**: Create and manage client accounts.
- **Project Management**: Create new engagements and update status/progress.
- **Unified Messaging**: Admin view to respond to all client messages.

## Integration Details

- **Route Groups**: The portal is integrated using Next.js route groups `(portal)`, `(admin)`, and `(auth)` under `app/`.
- **Shared Components**: Centralized UI components in `components/` (`Sidebar`, `StatusBadge`, `ProgressBar`).
- **Database**: Prisma 6 with SQLite (for development). Database files are located in `prisma/`.
- **Layout Visibility**: The main site `Navbar` and `Footer` are automatically hidden on portal/admin routes.

## Configuration & Setup

### Environment Variables (.env.local)
- `AUTH_SECRET`: Used for session encryption.
- `DATABASE_URL`: Must be an **absolute path** for SQLite to work correctly at runtime (e.g., `file:/home/runninja/stackconsultingai-com/prisma/dev.db`).

### Database Commands
- **Generate Client**: `npx prisma generate`
- **Apply Migrations**: `npx prisma migrate dev`
- **Seed Data**: `DATABASE_URL="file:/path/to/dev.db" npx prisma db seed`

## Troubleshooting

### "Unable to open database file"
- Ensure `DATABASE_URL` in `.env.local` uses an absolute path.
- Restart the dev server (`npm run dev`) after changing environment variables.

### "Only plain objects can be passed to Client Components"
- When passing data from Server to Client components (e.g., `Sidebar`), ensure Lucide icons are passed as string names and mapped internally.

## Admin Access
- **Email**: `chad@stackconsultingai.com`
- **Initial Password**: `admin123`
