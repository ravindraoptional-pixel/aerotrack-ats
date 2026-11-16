# AeroTrack ATS — shared workspace update

This update keeps the existing AeroTrack interface and adds:
- Supabase email/password login and sign-out.
- Shared candidates and jobs using the existing `candidates`, `jobs`, and `team_members` tables.
- A CV Library inside AeroTrack for PDF, DOC, and DOCX uploads.
- Private CV storage in the `candidate-cvs` Supabase bucket.
- Created-by / updated-by attribution in candidate and job JSON data.
- Realtime refresh for candidate and job changes across team members.

## Before deployment

1. Keep your existing Vercel environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY` (the Supabase publishable key)
2. In Supabase SQL Editor, review and run `SUPABASE_SETUP.sql` once. It creates a private CV bucket, team-scoped storage policies, and enables realtime for candidates/jobs.
3. Confirm each team member has a row in `public.team_members` with their Auth user UUID in `user_id` and the shared team UUID in `team_id`.
4. Upload/replace the project files in your GitHub repository, keeping the root-level layout. Vercel should redeploy from `main`.

## Notes

- Recruiters upload and open CVs only inside AeroTrack. Supabase is the backend and is not part of their daily workflow.
- CVs are private. The app creates short-lived signed URLs for viewing.
- The browser app uses only the Supabase publishable key. Never put a Supabase `service_role` or secret key in Vercel frontend variables.
- This project uses the existing `data` JSONB columns in `candidates` and `jobs`; it does not require changing those table schemas.
- Existing database RLS policies must remain enabled and team-scoped.
