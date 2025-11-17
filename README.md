# 🎓 AI-Powered Study Tracker

A comprehensive full-stack study tracking application built with **Next.js 14**, **Supabase**, **Gemini AI**, and **Tailwind CSS**. Perfect for students preparing for exams with AI-powered study assistance.

## ✨ Features

- 📚 **Subject Management** - Organize subjects with progress tracking
- 📝 **Topic Tracking** - Track individual topics with completion status, pages, sources, and notes
- 📊 **Dashboard Analytics** - Visualize your study progress with charts
- 🤖 **AI Assistant** - Integrated Gemini AI for:
  - Topic explanations
  - MCQ generation (10 questions)
  - Revision summaries
  - Doubt clearing
  - PYQ-style practice questions
  - Formula breakdowns
- 🎨 **Modern UI** - Clean, responsive design with smooth animations
- 💾 **Persistent Data** - All data stored in Supabase database

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI components
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini AI (gemini-pro)
- **Charts**: Recharts
- **State Management**: React Hooks
- **Font**: Lexend (Google Fonts)

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A Supabase account ([Create one free](https://supabase.com))
- A Google Gemini API key ([Get it free](https://makersuite.google.com/app/apikey))

## 🚀 Installation

### 1. Clone or Download the Project

```bash
cd "Tarun Notes App"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. Go to **SQL Editor** and run the schema from `supabase-schema.sql`:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

3. Get your Supabase credentials:
   - Go to **Settings** → **API**
   - Copy the **Project URL**
   - Copy the **anon/public** key

### 4. Configure Environment Variables

Update your `.env` file with the following (you mentioned GEMINI_API_KEY is already added):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini AI API Key (already added by you)
GEMINI_API_KEY=your_gemini_api_key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage Guide

### Dashboard
- View overall statistics (subjects, topics, completion rate)
- See subject-wise progress chart
- Quick access to subjects

### Managing Subjects
1. Click "Subjects" in the navbar
2. Click "+ Add Subject" to create a new subject
3. Each subject card shows:
   - Completion progress
   - Number of topics
   - Edit/Delete options

### Managing Topics
1. Click "View Topics" on any subject card
2. Click "+ Add Topic" to create a new topic
3. Fill in topic details:
   - **Topic Name** (required)
   - Source (e.g., textbook, chapter)
   - **Progress slider** (0-100% in 5% increments)
   - Date studied
   - Notes/comments
   - Completion status

### Using AI Assistant
1. In the Topics page, click the ✨ sparkle icon on any topic
2. Choose from AI features:
   - **Explain Topic**: Get a clear explanation
   - **Generate 10 MCQs**: Practice questions with answers
   - **Revision Summary**: Quick revision notes
   - **Clear Doubts**: Ask specific questions
   - **PYQ Practice**: Previous year question style problems
   - **Formula Breakdown**: Detailed formula explanations

## 📁 Project Structure

```
Tarun Notes App/
├── app/
│   ├── api/
│   │   ├── subjects/       # Subject CRUD endpoints
│   │   ├── topics/         # Topic CRUD endpoints
│   │   └── ai/             # AI assistant endpoint
│   ├── subjects/
│   │   └── [id]/           # Individual subject topics page
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── Navbar.tsx          # Navigation bar
│   └── AIAssistant.tsx     # AI dialog component
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── supabase.ts         # Supabase client
│   └── gemini.ts           # Gemini AI client
├── supabase-schema.sql     # Database schema
└── package.json            # Dependencies
```

## 🗄️ Database Schema

### Tables

1. **subjects**
   - `id` (UUID, PK)
   - `name` (text)
   - `total_topics` (int)
   - `created_at` (timestamp)

2. **topics**
   - `id` (UUID, PK)
   - `subject_id` (UUID, FK → subjects)
   - `topic_name` (text)
   - `is_completed` (boolean)
   - `progress_percentage` (int, 0-100)
   - `source` (text, optional)
   - `date_studied` (date, optional)
   - `comment` (text, optional)
   - `created_at` (timestamp)

3. **ai_logs**
   - `id` (UUID, PK)
   - `topic_id` (UUID, FK → topics)
   - `query` (text)
   - `response` (text)
   - `created_at` (timestamp)

## 🔧 API Routes

### Subjects
- `GET /api/subjects` - Get all subjects with progress
- `POST /api/subjects` - Create new subject
- `PUT /api/subjects/:id` - Update subject
- `DELETE /api/subjects/:id` - Delete subject

### Topics
- `GET /api/topics?subject_id=xxx` - Get topics by subject
- `POST /api/topics` - Create new topic
- `PUT /api/topics/:id` - Update topic
- `DELETE /api/topics/:id` - Delete topic

### AI
- `POST /api/ai` - Generate AI response with query type

## 🎨 Customization

### Colors
Edit `app/globals.css` to change the color scheme:
```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --background: 0 0% 100%;
  /* ... */
}
```

### Font
The app uses Lexend font. To change, update `app/globals.css`.

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to add these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Verify your Supabase URL and API key in `.env`
- Check if the database tables are created

### "AI Assistant not working"
- Verify your Gemini API key in `.env` file
- Make sure the key starts with `AIza`
- Check API quota limits at [Google AI Studio](https://makersuite.google.com/app/apikey)
- Restart the development server after updating `.env`: `npm run dev`
- Check the browser console and terminal for detailed error messages

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `.next` folder and rebuild: `npm run build`

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and customize it for your needs!

## 📧 Support

If you encounter any issues, please check:
1. Environment variables are correctly set
2. Supabase tables are created
3. All dependencies are installed
4. Node.js version is 18+

---

**Happy Studying! 📚🎓**
