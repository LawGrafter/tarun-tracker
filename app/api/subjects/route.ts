import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET all subjects
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Get completed topics count for each subject
    const subjectsWithProgress = await Promise.all(
      (data || []).map(async (subject) => {
        const { data: topics } = await supabase
          .from('topics')
          .select('*')
          .eq('subject_id', subject.id)

        const completedTopics = topics?.filter((t) => t.is_completed).length || 0
        const actualTopics = topics?.length || 0
        
        // Use user-defined total_topics for progress calculation if set, otherwise use actual count
        const totalTopicsForProgress = subject.total_topics > 0 ? subject.total_topics : actualTopics

        return {
          ...subject,
          completed_topics: completedTopics,
          actual_topics: actualTopics,
          progress: totalTopicsForProgress > 0 ? Math.round((completedTopics / totalTopicsForProgress) * 100) : 0,
        }
      })
    )

    return NextResponse.json(subjectsWithProgress)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 })
  }
}

// POST create new subject
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, total_topics = 0 } = body

    if (!name) {
      return NextResponse.json({ error: 'Subject name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('subjects')
      .insert([{ name, total_topics }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 })
  }
}
