# StartupForge Client

Frontend application for StartupForge — a platform that connects startup founders with talented collaborators such as developers, designers, marketers, and product specialists.

## Live Demo

**Website:** https://startup-forge-wbdi.vercel.app

---

## Overview

StartupForge helps founders build their teams by posting startup opportunities and enables collaborators to discover, apply for, and track startup positions. The platform also includes an admin panel for managing users, startups, and transactions.

---

## Tech Stack

### Frontend

* Next.js 16 (App Router)
* React 19
* Tailwind CSS v4
* HeroUI v3

### Authentication

* Better Auth
* Google OAuth
* Email & Password Authentication

### Integrations

* Stripe Checkout
* ImgBB Image Upload

### UI & Visualization

* Framer Motion
* Recharts
* Lucide React
* React Icons

---

## Features

### Founder Features

* Create and manage startup profiles
* Upload startup logos
* Post and manage opportunities
* Free users can create up to 3 opportunities
* Premium users can create unlimited opportunities
* Review applicant profiles
* Accept or reject applications
* View application analytics and statistics

### Collaborator Features

* Browse startups and opportunities
* Search and filter listings
* Apply with portfolio and motivation
* Track application status
* Bookmark favorite startups
* Manage profile, skills, bio, and avatar

### Admin Features

* Dashboard overview with statistics
* User management (block/unblock users)
* Startup moderation
* Transaction monitoring
* Platform analytics and charts

---

## Project Structure

```text
src/
├── app/
│   ├── api/auth/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── opportunities/
│   ├── startups/
│   └── ...
│
├── components/
│   ├── home/
│   ├── layout/
│   └── shared/
│
└── lib/
```

---

## Author

Developed as a startup collaboration platform to connect founders with skilled team members and streamline startup team building.
