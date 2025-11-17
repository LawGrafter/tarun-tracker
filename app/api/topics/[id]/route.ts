import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT update topic
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()

    const { data, error } = await supabase
      .from('topics')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating topic:', error)
    return NextResponse.json({ error: 'Failed to update topic' }, { status: 500 })
  }
}

// DELETE topic
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Topic deleted successfully' })
  } catch (error) {
    console.error('Error deleting topic:', error)
    return NextResponse.json({ error: 'Failed to delete topic' }, { status: 500 })
  }
}
