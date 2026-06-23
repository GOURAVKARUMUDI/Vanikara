# VANIKARA Intelligence

<p align="center">
  <img src="./public/logo.png" alt="VANIKARA Intelligence" width="180"/>
</p>

<p align="center">
  <strong>Building the Future of Intelligent Digital Experiences.</strong>
</p>

<p align="center">
A production-grade Next.js platform integrating AI, enterprise management, secure authentication, real-time collaboration, and immersive 3D experiences into a unified ecosystem.
</p>

---

# Overview

VANIKARA Intelligence is the flagship digital platform developed by **VANIKARA Intelligence Private Limited**.

The platform combines modern web technologies with intelligent automation to provide:

- AI-powered experiences
- Student & client management
- Project and product management
- Real-time administration
- Secure authentication
- Interactive 3D visualization
- Responsive mobile-first experience
- Enterprise-grade backend infrastructure

---

# Core Features

## Intelligent Landing Experience

- Cinematic Three.js landing page
- Dynamic Neural Network visualization
- Premium glassmorphism UI
- Responsive animations
- Adaptive graphics engine
- Intelligent loading system
- Dynamic camera controller

---

## CYGMA AI

Integrated AI workspace featuring:

- Conversational AI
- Document upload
- Streaming responses
- Context-aware interactions
- AI grounding support
- Secure API architecture

---

## Authentication

- Email & Password Authentication
- Google OAuth
- Secure session management
- Protected routes
- Role-Based Access Control (RBAC)
- Server-side authentication
- JWT session validation

---

## Admin Dashboard

Production-ready administration panel featuring:

- User Management
- Lead Management
- Client Management
- Career Applications
- Project Management
- Product Management
- Analytics Dashboard
- Audit Logs
- Realtime synchronization

---

## Contact & Careers

Integrated systems for:

- Contact Requests
- Career Applications
- Resume Upload
- Google Forms Integration
- Email Notifications
- Admin Review Pipeline

---

## Mobile Experience

Designed independently from desktop.

Includes:

- Mobile-first layouts
- Native application feel
- Optimized spacing
- Touch-friendly interactions
- Safe-area support
- Capacitor Android packaging

---

# Technology Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

---

## Graphics

- Three.js
- React Three Fiber
- Custom GLSL Shaders
- Instanced Rendering
- Dynamic Lighting
- GPU Optimizations

---

## Backend

- Next.js App Router
- Server Actions
- Route Handlers
- REST APIs

---

## Database

- Supabase PostgreSQL
- Row Level Security (RLS)
- Realtime Database
- Supabase Storage
- Database Triggers

---

## Authentication

- Supabase Auth
- Google OAuth
- JWT Sessions
- Secure Cookies

---

## Infrastructure

- Vercel
- Upstash Redis
- Nodemailer
- Google Forms
- Capacitor Android

---

# Project Structure

```
src/
│
├── app/
├── components/
├── contexts/
├── hooks/
├── lib/
├── sections/
├── three/
├── utils/
└── types/

public/

supabase/

android/

scripts/
```

---

# Architecture

```
                    Client
                       │
                Next.js App Router
                       │
      ┌────────────────┼────────────────┐
      │                │                │
 Authentication      APIs          Three.js
      │                │                │
      │         Supabase DB       Graphics Engine
      │                │                │
      └───────────────┼────────────────┘
                      │
                Admin Dashboard
                      │
               Realtime Updates
```

---

# Security

The platform follows modern security practices.

## Authentication

- JWT Authentication
- Secure Sessions
- Protected Routes
- Google OAuth

---

## Authorization

- Role-Based Access Control
- Admin-only APIs
- Route Protection
- Server-side Validation

---

## Database

- Row Level Security
- Foreign Keys
- Secure Policies
- Cascading Relations

---

## API Security

- Rate Limiting
- Zod Validation
- DOMPurify Sanitization
- Magic Bytes File Validation
- Secure Upload Pipeline

---

## HTTP Security

- CSP Headers
- Secure Cookies
- HTTPS
- CORS Protection

---

# Performance

Optimizations include:

- Dynamic Imports
- Code Splitting
- Lazy Loading
- GPU Resource Disposal
- Shader Pre-compilation
- Adaptive Rendering
- Optimized Bundle Size
- Image Optimization
- Responsive Graphics

---

# Responsive Design

Optimized independently for:

- Desktop
- Laptop
- Tablet
- Foldables
- Mobile
- Dynamic Aspect Ratios

Each platform has its own layout strategy while maintaining the same visual identity.

---

# Android Application

The project includes native Android packaging using Capacitor.

Features:

- Native Splash Screen
- Safe Area Support
- Keyboard Handling
- Native Navigation
- Android App Bundle (AAB)

---

# Development

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Build production

```bash
npm run build
```

Lint

```bash
npm run lint
```

Type Check

```bash
npx tsc --noEmit
```

---

# Environment Variables

Create a `.env.local`

Required variables include:

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=

SMTP_HOST=

SMTP_PORT=

SMTP_USER=

SMTP_PASS=

UPSTASH_REDIS_REST_URL=

UPSTASH_REDIS_REST_TOKEN=
```

---

# Quality Assurance

Before every deployment:

```bash
npm run lint

npx tsc --noEmit

npm run build
```

Recommended:

- Lighthouse Desktop
- Lighthouse Mobile
- Playwright E2E
- Manual Mobile Testing

---

# Deployment

Production deployment is hosted on:

- Vercel
- Supabase
- Upstash Redis

Deployment workflow:

```
GitHub

↓

Vercel

↓

Build

↓

Deploy

↓

Production
```

---

# Current Status

Current Version:

**Version 1.0**

Status:

**Production Ready**

---

# Roadmap

Future enhancements include:

- AI Memory Engine
- AI Agents
- Workflow Automation
- Advanced Analytics
- Team Collaboration
- Multi-Tenant Organizations
- AI Document Intelligence
- Native Desktop Application

---

# License

Copyright © 2026

**VANIKARA Intelligence Private Limited**

All Rights Reserved.

---

# Developed By

**VANIKARA Intelligence Private Limited**

Building Intelligent Digital Experiences.
