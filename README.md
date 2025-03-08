# Tuition Rider - Educational Platform

Tuition Rider is a comprehensive educational platform designed to connect qualified tutors with students, provide educational resources, and manage tutoring services efficiently.

## 🌟 Features

### For Students & Parents
- **Find Qualified Tutors**: Search and connect with experienced tutors for various subjects
- **Download Resources**: Access educational materials organized by subject and grade level
- **Request Tutoring**: Submit tutoring requests with detailed requirements
- **Track Progress**: Monitor learning progress and session history

### For Tutors
- **Professional Profile**: Create and manage your teaching profile
- **Subject Management**: Specify subjects and grade levels you teach
- **Resource Access**: Download and utilize teaching resources
- **Application Process**: Simple application workflow to join the platform

### For Administrators
- **Resources Management**: Upload, categorize, and manage educational resources
- **User Management**: Approve and manage tutor and student accounts
- **Message Center**: Process and respond to inquiries and applications
- **Analytics Dashboard**: Track platform usage and performance

## 🛠️ Technology Stack

- **Frontend**: Next.js 15.2.1, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js, Supabase Auth
- **Storage**: Supabase Storage
- **Analytics**: Vercel Analytics, Google Analytics
- **Error Tracking**: Sentry
- **Progressive Web App**: PWA enabled with offline capabilities
- **Email**: Brevo API for email communications

## 📂 Project Structure

- `/app` - Next.js application routes and API endpoints
- `/components` - Reusable UI components
- `/lib` - Utility functions and library code
- `/public` - Static assets (images, icons, etc.)
- `/types` - TypeScript type definitions
- `/hooks` - React custom hooks
- `/prisma` - Database schema and migrations

## 🚀 Deployment

### Prerequisites
- Node.js 18.x or higher
- NPM or Yarn
- Supabase account with project setup
- Hostinger account with Node.js hosting

### Deployment Steps
1. Upload all files to Hostinger hosting directory
2. Install dependencies with `node install.js`
3. Configure Node.js application in Hostinger panel:
   - Application URL: Your domain (e.g., tuitionrider.com)
   - Root Directory: Path to uploaded files
   - Application Startup File: `server.js`
   - Node.js Version: 18.x or higher
4. Ensure environment variables are set correctly in `.env.production`
5. Start the application from Hostinger control panel

## 🔧 Environment Variables

Essential variables needed for operation:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `NEXT_PUBLIC_APP_URL` - Website URL
- `DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Authentication secret key
- `EMAIL_FROM` - Sender email address
- `BREVO_API_KEY` - Brevo API key for emails

## 👥 User Roles

- **Admin**: Full access to all features and management capabilities
- **Tutor**: Access to teaching resources and profile management
- **Student/Parent**: Access to learning resources and tutor requests

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- Desktop computers (1200px+)
- Tablets (768px-1199px)
- Mobile devices (320px-767px)

## 📈 SEO Optimization

- Dynamic metadata for all pages
- Structured data for rich search results
- Sitemap generation
- robots.txt configuration
- Performance optimization for Core Web Vitals

## 🔒 Security Features

- Content Security Policy implementation
- HTTPS enforcement
- XSS protection headers
- Input validation and sanitization
- Rate limiting for authentication attempts
- Secure authentication with JWT

## 🌐 Progressive Web App

- Installable on mobile devices
- Offline capability for essential features
- Push notification readiness
- App-like experience with smooth navigation

## 📞 Support Contact

For technical support or inquiries:
- Email: tuitionrider1@gmail.com
- WhatsApp: +91 94651 72269

## 📄 License

All rights reserved. This project is proprietary and confidential.