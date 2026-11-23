# WedPlan Client

WedPlan is a wedding-services marketplace built with Next.js. Customers can find wedding vendors and request bookings; vendors can publish services and manage requests; admins review listings and payments.

## Features

- Email/password sign-up and sign-in with Better Auth
- Customer and vendor registration, with admin roles kept out of public sign-up
- Browse, search, filter, and sort approved services
- Role-based dashboards and booking management
- Profile and image upload flows
- Stripe Checkout subscriptions for vendor Premium upgrades ($49/month; activated by verified webhooks)

## Stack

Next.js, React, TypeScript, Better Auth, MongoDB, Express API, Stripe Checkout, ImgBB, Tailwind CSS, and Shadcn UI components.

## Run locally

1. Copy `.env.example` to `.env` and fill in the MongoDB URI and strong secrets.
2. Start the Express API from the server repository with `npm run dev`.
3. Install client packages with `npm install`.
4. Start this project with `npm run dev`.
5. Open `http://localhost:3000`.

## Environment variables

| Name | Purpose |
| --- | --- |
| `BETTER_AUTH_SECRET` | Signs Better Auth sessions; keep private. |
| `BETTER_AUTH_URL` | Canonical app URL (local URL in development, Vercel URL in production). |
| `DB_URI` | MongoDB connection URI used by Better Auth. |
| `JWT_SECRET` | Shared secret for short-lived API JWTs; must match the backend. |
| `NEXT_PUBLIC_API_URL` | Public URL of the deployed Express API; never use localhost in production. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Optional Google OAuth credentials. |
| `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` | Set to `true` only when Google OAuth is configured. |

## Deploy to Vercel

Import the client repository as a Next.js project. Add the variables above in **Project Settings → Environment Variables**. Set `BETTER_AUTH_URL` to the production Vercel origin and `NEXT_PUBLIC_API_URL` to the separately deployed Express API. Add the same MongoDB URI to the backend host, plus backend `CLIENT_URL` and the matching `JWT_SECRET`. Redeploy after changing variables.

For Google sign-in, register `https://<your-domain>/api/auth/callback/google` with Google and set the OAuth credentials in Vercel. Stripe secret and webhook keys belong only on the backend host.

Admin accounts are not created through public sign-up. Create a normal account, then assign `role: "admin"` to that account's Better Auth `user` document from a trusted MongoDB admin session. Do not put admin credentials or secrets in the repository.

## Links

- Live site: not deployed yet
- Client repository: add repository URL
- Server repository: add repository URL

Replace the sample contact and social links in the footer and add the real live-site and repository URLs before submitting the project.
