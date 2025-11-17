import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Subject = {
  id: string
  name: string
  total_topics: number
  created_at: string
}

export interface Attachment {
  name: string
  url: string
  type: string
  size: number
}

export type Topic = {
  id: string
  subject_id: string
  topic_name: string
  is_completed: boolean
  progress_percentage: number
  source?: string
  date_studied?: string
  comment?: string
  youtube_links?: string[]
  attachments?: Attachment[]
  created_at?: string
}

export type AILog = {
  id: string
  topic_id: string
  query: string
  response: string
  created_at: string
}
