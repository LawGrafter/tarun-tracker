# AI-Powered Study Tracker App – Windsurf Prompt

## Overview
This prompt will generate a complete full‑stack AI-powered study tracker app using **Next.js**, **Supabase**, **Lexend font**, a **light AI-themed UI**, and deep integration of subject/topic progress tracking for exam preparation.

---

## 🎯 APP PURPOSE
The app helps students track their exam preparation with:
- Subjects  
- Topics  
- Progress %  
- Sources  
- Pages done / planned  
- Timeline with dates  
- Comments/notes  
- AI-powered study help (MCQs, summaries, explanations, revision plan, doubts)

---

## 🗂️ DATABASE (Supabase Schema)

### **1. subjects**
| Column | Type | Notes |
|-------|------|-------|
| id | uuid | PK |
| name | text | subject name |
| total_topics | int | total topics planned |
| created_at | timestamp | default now |

### **2. topics**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| subject_id | uuid | FK → subjects.id |
| topic_name | text | |
| is_completed | boolean | default false |
| pages_done | int | optional |
| pages_target | int | optional |
| source | text | |
| date_studied | date | |
| comment | text | |
| created_at | timestamp | |

### **3. ai_logs**
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| topic_id | uuid | FK → topics.id |
| query | text | user question |
| response | text | AI output |
| created_at | timestamp |

---

## 🎨 UI REQUIREMENTS

### **Theme**
- Font: **Lexend** (Google Font)
- Light background: `#f7f8fa`
- Card background: white with subtle shadows
- Smooth transitions & micro animations
- Tailwind CSS + Shadcn UI
- Responsive layout

### Components Needed
- Navbar  
- Dashboard cards  
- Subject cards  
- Topic tables  
- Progress charts  
- Add/Edit modals  
- AI Assistant drawer  

---

## 📊 FEATURES

### **1. Dashboard**
- Total subjects  
- Total topics  
- Combined completion %  
- Today’s study timeline  
- Quick add buttons  
- Chart visualizations  

### **2. Subject List Page**
Each card shows:
- Subject name  
- Total topics  
- Completed topics  
- Progress bar  
- CTA: “View Topics”  

### **3. Topics Page**
Columns include:
- Topic  
- Source  
- Pages done  
- Total pages  
- Completed toggle  
- Date studied  
- Comment  
- AI icon for study help  

### **4. AI Assistant**
Sliding drawer that supports:
- Topic explanation  
- 10 MCQ generation  
- Revision summary  
- Doubt solving  
- PYQ-style practice  
- Formula breakdown  

### **AI Query Example**
```
Help me study this topic:
- Subject: {{subject}}
- Topic: {{topic_name}}
- Source used: {{source}}
- My notes: {{comment}}
```

Responses stored in **ai_logs**.

---

## 🛠️ TECH STACK
- Next.js 14 (App Router)  
- Supabase Auth + Database  
- Tailwind CSS  
- Shadcn UI  
- React Charts (Recharts / Chart.js)  
- Zustand or Context API  
- API routes for CRUD  
- AI handler route (`/api/ai`)  

---

## 📡 API ROUTES

### Subjects
- POST `/api/subjects`
- GET `/api/subjects`
- PUT `/api/subjects/:id`
- DELETE `/api/subjects/:id`

### Topics
- POST `/api/topics`
- GET `/api/topics?subject_id=`
- PUT `/api/topics/:id`
- DELETE `/api/topics/:id`

### AI
- POST `/api/ai`

---

## 📦 DELIVERABLES BY WINDSURF

- Complete Next.js project  
- Frontend + backend integrations  
- All pages + UI components  
- Supabase schema  
- CRUD APIs  
- AI assistant drawer  
- Dashboard visualizations  
- Deployment guide (Vercel + Supabase)

---

## END OF PROMPT
Copy-paste this into Windsurf to generate the full app.
