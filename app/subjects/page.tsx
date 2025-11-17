'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Plus, BookOpen, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'

interface Subject {
  id: string
  name: string
  completed_topics: number
  total_topics: number
  actual_topics?: number
  progress: number
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [subjectName, setSubjectName] = useState('')
  const [totalTopics, setTotalTopics] = useState<number>(0)

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      const res = await fetch('/api/subjects')
      const data = await res.json()
      setSubjects(data)
    } catch (error) {
      console.error('Failed to fetch subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSubject = async () => {
    if (!subjectName.trim()) return

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: subjectName,
          total_topics: totalTopics || 0
        }),
      })

      if (res.ok) {
        setSubjectName('')
        setTotalTopics(0)
        setDialogOpen(false)
        fetchSubjects()
      }
    } catch (error) {
      console.error('Failed to create subject:', error)
    }
  }

  const handleUpdateSubject = async () => {
    if (!editingSubject || !subjectName.trim()) return

    try {
      const res = await fetch(`/api/subjects/${editingSubject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: subjectName,
          total_topics: totalTopics || 0
        }),
      })

      if (res.ok) {
        setSubjectName('')
        setTotalTopics(0)
        setEditingSubject(null)
        setDialogOpen(false)
        fetchSubjects()
      }
    } catch (error) {
      console.error('Failed to update subject:', error)
    }
  }

  const handleDeleteSubject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subject? All related topics will be deleted.')) {
      return
    }

    try {
      const res = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchSubjects()
      }
    } catch (error) {
      console.error('Failed to delete subject:', error)
    }
  }

  const openCreateDialog = () => {
    setEditingSubject(null)
    setSubjectName('')
    setTotalTopics(0)
    setDialogOpen(true)
  }

  const openEditDialog = (subject: Subject) => {
    setEditingSubject(subject)
    setSubjectName(subject.name)
    setTotalTopics(subject.total_topics || 0)
    setDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subjects</h1>
            <p className="text-muted-foreground">Manage your study subjects</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading subjects...</p>
          </div>
        ) : subjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No subjects yet</h3>
              <p className="text-muted-foreground mb-4">Create your first subject to get started</p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Subject
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <Card key={subject.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{subject.name}</CardTitle>
                      <CardDescription>
                        {subject.completed_topics} / {subject.total_topics > 0 ? subject.total_topics : subject.actual_topics || 0} topics completed
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(subject)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteSubject(subject.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{subject.progress}%</span>
                      </div>
                      <Progress value={subject.progress} />
                    </div>
                    <Link href={`/subjects/${subject.id}`}>
                      <Button className="w-full">View Topics</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSubject ? 'Edit Subject' : 'Add New Subject'}</DialogTitle>
              <DialogDescription>
                {editingSubject ? 'Update subject details' : 'Create a new subject for tracking'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject-name">Subject Name</Label>
                <Input
                  id="subject-name"
                  placeholder="e.g., Mathematics, Physics"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      editingSubject ? handleUpdateSubject() : handleCreateSubject()
                    }
                  }}
                />
              </div>
              <div>
                <Label htmlFor="total-topics">Total Topics (Expected)</Label>
                <Input
                  id="total-topics"
                  type="number"
                  min="0"
                  placeholder="How many topics in this subject?"
                  value={totalTopics || ''}
                  onChange={(e) => setTotalTopics(parseInt(e.target.value) || 0)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      editingSubject ? handleUpdateSubject() : handleCreateSubject()
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 This helps track progress (e.g., 5/10 topics completed)
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingSubject ? handleUpdateSubject : handleCreateSubject}>
                  {editingSubject ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
