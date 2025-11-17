# 🚀 Quick Setup Guide

## Step 1: Install Dependencies

Open terminal in this directory and run:

```bash
npm install
```

This will install all required packages (Next.js, React, Supabase, Gemini AI, Tailwind, etc.)

## Step 2: Set Up Supabase Database

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Wait for the database to initialize (2-3 minutes)
4. Go to **SQL Editor** (left sidebar)
5. Copy the contents of `supabase-schema.sql` file and paste it in the editor
6. Click "Run" to create the tables
7. Go to **Settings** → **API** to get your credentials:
   - Copy **Project URL**
   - Copy **anon public** key

## Step 3: Update Environment Variables

Open the `.env` file and update these values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
```

**Note:** Your Gemini API key is already configured! ✅

## Step 4: Run the Development Server

```bash
npm run dev
```

**Important:** If you update the `.env` file after starting the server, you must restart it for changes to take effect. Press `Ctrl+C` to stop and run `npm run dev` again.

Open [http://localhost:3000](http://localhost:3000) to see your app! 🎉

## Features to Try

1. **Dashboard** - See your study statistics with charts
2. **Add Subject** - Click "Subjects" → "+ Add Subject"
3. **Add Topics** - Click "View Topics" on a subject → "+ Add Topic"
   - Use the **progress slider** to track completion (0-100% in 5% steps)
4. **AI Assistant** - Click the ✨ icon on any topic to:
   - Get explanations
   - Generate 10 MCQs
   - Create revision summaries
   - Clear doubts
   - Practice PYQs
   - Break down formulas

## Troubleshooting

### "Cannot find module" errors
Run: `npm install`

### Database connection errors
- Check your Supabase URL and key in `.env`
- Verify tables were created in Supabase SQL Editor

### AI not working
- Your Gemini API key is already set in `.env`
- **Restart the server** after any `.env` changes: Stop with `Ctrl+C`, then run `npm run dev` again
- Verify the key starts with `AIza`
- Check browser console (F12) for detailed errors
- Check if you have quota remaining at [Google AI Studio](https://makersuite.google.com/)

### Already have data with pages?
If you previously created topics with pages_done/pages_target, run the migration:
1. Go to Supabase SQL Editor
2. Run the SQL from `supabase-migration.sql` file
3. This will convert your pages data to percentage automatically

## Need Help?

Check the detailed `README.md` file for more information!

---

**Happy studying! 📚**
