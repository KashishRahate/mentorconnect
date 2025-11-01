# MentorConnect Setup Guide

## Prerequisites
- Python 3.8+
- Node.js 16+
- Supabase account
- Git

## Backend Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repo-url>
   cd backend
   \`\`\`

2. **Create virtual environment**
   \`\`\`bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   \`\`\`

3. **Install dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Set up environment variables**
   Create a `.env` file in the backend directory:
   \`\`\`
   FLASK_ENV=development
   SECRET_KEY=your-secret-key
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   JWT_SECRET=your-jwt-secret
   CORS_ORIGINS=http://localhost:3000
   \`\`\`

5. **Initialize database**
   - Go to your Supabase dashboard
   - Run the SQL from `scripts/01-init-database.sql` in the SQL editor

6. **Run the backend**
   \`\`\`bash
   python app.py
   \`\`\`
   The backend will run on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`
   The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/<user_id>` - Get user by ID

### Mentors
- `GET /api/mentors/profile` - Get mentor profile
- `PUT /api/mentors/profile` - Update mentor profile
- `GET /api/mentors/search` - Search mentors
- `GET /api/mentors/<mentor_id>` - Get mentor details

### Bookings
- `POST /api/bookings/` - Create booking
- `GET /api/bookings/<booking_id>` - Get booking
- `PUT /api/bookings/<booking_id>` - Update booking
- `GET /api/bookings/mentee/<mentee_id>` - Get mentee bookings
- `GET /api/bookings/mentor/<mentor_id>` - Get mentor bookings

### Sessions
- `POST /api/sessions/` - Start session
- `PUT /api/sessions/<session_id>/end` - End session

### Reviews
- `POST /api/reviews/` - Create review
- `GET /api/reviews/mentor/<mentor_id>` - Get mentor reviews

## Deployment

### Backend (Flask)
- Deploy to Heroku, Railway, or any Python hosting
- Set environment variables in production
- Update CORS_ORIGINS for production domain

### Frontend (React)
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update API endpoint in code for production

## Features Implemented

✅ User authentication (signup/login)
✅ Mentor and mentee profiles
✅ Mentor search and discovery
✅ Booking system
✅ Jitsi video integration
✅ Review and rating system
✅ Dashboard for both roles
✅ Session management

## Next Steps

- [ ] LinkedIn OAuth integration
- [ ] Google Calendar integration
- [ ] Email notifications
- [ ] Payment integration (Stripe)
- [ ] Admin dashboard
- [ ] Video recording storage
- [ ] Advanced search filters
- [ ] Messaging system
