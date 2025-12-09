# PM Internship Platform - Codebase Map

This document is the **Master Knowledge Base** for the project. It maps architecture, features, configuration, and critical logic to ensure instant context retrieval for any stakeholder question.

## 🏗️ System Architecture

The ecosystem consists of **3 main processes** + **1 external AI service**:

1.  **Central Socket Hub (Port 4000)**
    *   **File**: `server.js` (Root)
    *   **Role**: Real-time event bridge (Recruiter ↔ Student).
2.  **Recruiter Portal (Port 3000)**
    *   **Path**: `recruiter_side/`
    *   **Stack**: Next.js App Router (Custom Server).
3.  **Student Portal (Port 3001)**
    *   **Path**: `student_side/`
    *   **Stack**: Next.js Pages Router.
4.  **Gemini AI Integration**
    *   **Path**: `recruiter_side/src/app/api/chat/route.js`
    *   **Role**: Chatbot & Recruitment Assistant.

---

## 💼 "Boss Questions" FAQ (Critical Context)

### Q1: "How does the AI/Chatbot work?"
It uses **Google Gemini (genai)**. The logic is in a single API route that injects a massive "System Prompt" defining the "Intern Saathi" persona.
*   **Code**: `recruiter_side/src/app/api/chat/route.js`
*   **API Key**: `process.env.GEMINI_API_KEY` in `render.yaml`.

### Q2: "Where is the Matching Algorithm?"
The "Match Score" is calculated using a utility function that compares candidate skills vs. job requirements.
*   **Logic**: `calculateMatchScore` in `common/utils/utils.js`
*   **Usage**: Used in `recruiter_side/src/app/candidates/page.js` for filtering.

### Q3: "How do we change the Theme/Colors?"
The project uses a custom **Tailwind Configuration** with Government of India specific colors (Saffron Primary, Green Secondary).
*   **Config**: `tailwind.config.js` (and `student_side/tailwind.config.js`)
*   **Colors**: `primary: #FF9933` (Saffron), `secondary: #138808` (India Green).

### Q4: "How is the app secured?"
Authentication is handled by **NextAuth.js** with a custom middleware to protect routes.
*   **Middleware**: `recruiter_side/src/middleware.js` (Protects `/dashboard`, `/candidates`, etc.)
*   **Auth Config**: `recruiter_side/src/app/api/auth/[...nextauth]/route.js`

### Q5: "How do we deploy this?"
The project is set up for **Render.com** as a multi-service monorepo.
*   **Config**: `render.yaml` (Defines `recruit-db`, `recruiter-portal`, `student-portal`).
*   **Startup**: The root `package.json` uses `concurrently` to run all 3 local servers at once.

---

## 🚀 Feature Index "Instant Teleport"

| Domain | Feature | File Path | Key Logic |
| :--- | :--- | :--- | :--- |
| **Auth** | Security Middleware | `recruiter_side/src/middleware.js` | `withAuth` + protected routes. |
| **Auth** | Login Page | `recruiter_side/src/app/login/page.js` | Credentials provider. |
| **AI** | Chatbot API | `recruiter_side/src/app/api/chat/route.js` | Gemini SDK + System Prompt. |
| **AI** | Match Algorithm | `common/utils/utils.js` | `calculateMatchScore`. |
| **Data** | DB Schema | `common/database/migrations/schema.sql` | Users, Jobs, Candidates tables. |
| **Data** | DB Connection | `common/database/index.js` | `pg` Pool configuration. |
| **student** | Sign Up | `student_side/pages/signup.tsx` | Student Registration Form. |
| **Recruiter** | Dashboard | `recruiter_side/src/app/dashboard/page.js` | Analytics, Charts. |
| **Recruiter** | Post Job | `recruiter_side/src/app/jobs/page.js` | Job Creation Flow. |
| **Recruiter** | Candidates | `recruiter_side/src/app/candidates/page.js` | Filtering & Search. |
| **Communication**| Email Logic | `recruiter_side/src/app/api/email/send/route.js` | Nodemailer Transport. |
| **Communication**| Email Templates | `recruiter_side/src/data/emailTemplates.json` | JSON Content. |

---

## 🗄️ SQL Migrations (Database Evolution)

| Migration File | Changes Applied | Key Tables Affected |
| :--- | :--- | :--- |
| `schema.sql` | **Base Schema**. Creates the initial `users`, `jobs`, `candidates`, `interviews` tables. | All Tables |
| `migrations.sql` | **Seed Data & Modifications**. Adds initial jobs/candidates and modifies table constraints. | `jobs`, `candidates`, `users` |
| `migrations_automation.sql` | **New Automation Features**. Adds `years_of_experience`, `waitlist_order`, `auto_top_count` columns. | `candidates`, `jobs` |
| `migrations_fix_candidates.sql` | **Fixes**. Adds `job_id` foreign key link and randomizes match scores for testing. | `candidates` |
| `migrations_job_details.sql` | **Rich Job Descriptions**. Adds `description` (text) and `responsibilities` (array) columns. | `jobs` |
| `migrations_onboarding.sql` | **Recruiter Onboarding**. Adds `onboarding_completed`, `company_name`, `phone` to users. | `users` |
| `migrations_student_profile.sql` | **Student Profile Table**. Creates the `student_profiles` table with JSONB fields for resume/projects. | `student_profiles` |
| `migrations_student_profile_expanded.sql` | **Profile Expansion**. Adds `transcript_url`, `other_docs_url`, `education_level` to student profiles. | `student_profiles` |
| `migrations_image.sql` | **User Avatar**. Adds `image` column to `users` table. | `users` |

---

## 🗺️ Directory Structure

| Path | Description |
| :--- | :--- |
| `common/database/` | **The Brain**. Migrations, Queries, and Connection Pool. |
| `common/utils/` | **The Logic**. Reusable functions (`formatDate`, `calculateMatch`). |
| `recruiter_side/` | **Recruiter Portal**. Next.js App Router project for government officials. |
| `student_side/` | **Student Portal**. Next.js Pages Router project for internship seekers. |
| `scripts/` | **Ops**. Database migration (`run_migration.js`) and seeding scripts. |
| `packages/` | **Dependencies**. Internal shared packages or monorepo workspace configs. |
| `.git/` | **Version Control**. Git repository metadata. |
| `server.js` | **Socket Hub**. The root processing server for real-time events. |
| `render.yaml` | **Deployment**. Configuration for deploying the entire stack on Render.com. |
| `tailwind.config.js` | **Theme Config**. Global styling configuration (colors, fonts). |

---

## 🛠️ Development Cheat Sheet

1.  **Start All Services**: `npm run dev` (Runs Recruiter, Student, and Socket Hub).
2.  **Run Migrations**: `npm run db:migrate`.
3.  **Database Access**: Use `common/database/index.js` for all queries.
4.  **Formatting**: Use `formatIndianNumber` from `common/utils` for currency/counts.
