# w0lf.exe

Live site: https://w01fexe.vercel.app/

w0lf.exe is the public-facing website for the w0lf.exe community of builders, researchers, and problem-solvers. While cybersecurity remains a core strength, the team also works across engineering, software development, hackathons, tech events, experimentation, and collaborative innovation.

## Overview

The platform is designed for three primary audiences:

- Public visitors who want to explore the team’s work, accomplishments, and expertise across security, engineering, hackathons, and tech events
- Team members who can manage their own profile, projects, and achievements
- Administrators who can manage site content, team members, and platform statistics

The website blends a modern showcase experience with a lightweight internal CMS experience backed by Supabase.

## What the website includes

### Public experience
- Animated home page with a cyber-themed hero section and feature highlights
- Project showcase with project cards, tags, languages, statuses, and repository links
- Achievement gallery for CTFs, hackathons, tech events, recognitions, certifications, and engineering milestones
- Team directory with member profiles, roles, departments, skills, and social links
- Dedicated detail pages for individual projects and achievements
- SEO metadata, social sharing tags, and Vercel Speed Insights integration

### Member experience
- Secure authentication flow via Supabase Auth
- Personal dashboard for managing projects and achievements
- Profile editing with avatar support and role/department information
- Access to member-specific content tied to their account

### Admin experience
- Admin dashboard with tabs for managing members, projects, achievements, and site stats
- Ability to create, update, and delete team content
- Member onboarding support through the admin panel
- Control over featured achievements and site-wide statistics

## Core feature areas

- Cybersecurity research and engineering showcases
- Capture The Flag and competitive challenge achievements
- Hackathons, tech events, and innovation-driven collaboration
- Red team / blue team practice and security operations
- Reverse engineering, software development, and technical experimentation
- Open-source tooling, research projects, and community-driven builds
- Team member profiles and cross-linking between projects, achievements, and people

## Tech stack

- React 18 with TypeScript
- Vite for development and production builds
- React Router for client-side navigation
- Tailwind CSS for styling
- Radix UI + custom UI primitives for accessible components
- TanStack React Query for data fetching and caching
- Supabase for authentication, database, and realtime-style content management
- Vercel for hosting and deployment

## Project structure

- src/pages – public pages, auth, dashboards, and detail views
- src/components – reusable UI, layout, and cyber-themed presentation components
- src/hooks – Supabase-backed hooks for projects, achievements, profiles, auth, and stats
- src/integrations/supabase – Supabase client and generated type definitions
- supabase – database config, migrations, and server-side functions

## Prerequisites

- Node.js 18 or newer
- npm
- A Supabase project with the required environment variables configured

## Environment variables

Create a local .env file in the project root with:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

These values are required for authentication and content loading.

## Local development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

The production build is output to the dist folder.

## Deployment

The site is deployed on Vercel and can be configured with the same environment variables used locally.

Recommended deployment steps:

1. Connect the repository to Vercel
2. Set the Supabase environment variables in Vercel project settings
3. Deploy the project

## Database/content model

The app relies on Supabase tables and related content such as:

- profiles
- projects
- achievements
- site_stats
- user_roles

These drive the public pages as well as the admin and member dashboards.

## License

This is a private project for the w0lf.exe Cybersecurity Team. All rights reserved.
