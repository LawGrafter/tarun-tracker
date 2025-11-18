import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET topics (optionally filtered by subject_id)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const subjectId = searchParams.get('subject_id')

    let query = supabase
      .from('topics')
      .select('*')
      .order('created_at', { ascending: false })

    if (subjectId) {
      query = query.eq('subject_id', subjectId)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json({ error: 'Failed to fetch topics' }, { status: 500 })
  }
}

// POST create new topic
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      subject_id,
      topic_name,
      is_completed = false,
      progress_percentage = 0,
      source,
      date_studied,
      comment,
      youtube_links = [],
      attachments = [],
      revision_target = 0,
      revision_current = 0,
      confidence_percentage = 0,
    } = body

    if (!subject_id || !topic_name) {
      return NextResponse.json(
        { error: 'Subject ID and topic name are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('topics')
      .insert([
        {
          subject_id,
          topic_name,
          is_completed,
          progress_percentage,
          source,
          date_studied,
          comment,
          youtube_links,
          attachments,
          revision_target,
          revision_current,
          confidence_percentage,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating topic:', error)
    return NextResponse.json({ error: 'Failed to create topic' }, { status: 500 })
  }
}
