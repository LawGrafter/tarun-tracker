import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// PUT update subject
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const { name, total_topics } = body

    const updateData: any = { name }
    if (total_topics !== undefined) {
      updateData.total_topics = total_topics
    }

    const { data, error } = await supabase
      .from('subjects')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 })
  }
}

// DELETE subject
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('subjects')
      .delete()
      .eq('id', params.id)

    if (error) throw error

    return NextResponse.json({ message: 'Subject deleted successfully' })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 })
  }
}
