'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, ArrowLeft, Youtube, Paperclip, X, ExternalLink, FileText, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'

interface Attachment {
  name: string
  url: string
  type: string
  size: number
}

interface Topic {
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
  revision_target?: number
  revision_current?: number
  confidence_percentage?: number
}

interface Subject {
  id: string
  name: string
}

export default function TopicsPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.id as string

  const [subject, setSubject] = useState<Subject | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)

  const [formData, setFormData] = useState({
    topic_name: '',
    is_completed: false,
    progress_percentage: 0,
    source: '',
    date_studied: '',
    comment: '',
    youtube_links: [] as string[],
    attachments: [] as Attachment[],
    revision_target: 0,
    revision_current: 0,
    confidence_percentage: 0,
  })
  
  const [newYoutubeLink, setNewYoutubeLink] = useState('')
  const [uploadingFile, setUploadingFile] = useState(false)

  useEffect(() => {
    if (subjectId) {
      fetchSubject()
      fetchTopics()
    }
  }, [subjectId])

  const fetchSubject = async () => {
    try {
      const res = await fetch('/api/subjects')
      const data = await res.json()
      const foundSubject = data.find((s: Subject) => s.id === subjectId)
      setSubject(foundSubject || null)
    } catch (error) {
      console.error('Failed to fetch subject:', error)
    }
  }

  const fetchTopics = async () => {
    try {
      const res = await fetch(`/api/topics?subject_id=${subjectId}`)
      const data = await res.json()
      setTopics(data)
    } catch (error) {
      console.error('Failed to fetch topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      topic_name: '',
      is_completed: false,
      progress_percentage: 0,
      source: '',
      date_studied: '',
      comment: '',
      youtube_links: [],
      attachments: [],
      revision_target: 0,
      revision_current: 0,
      confidence_percentage: 0,
    })
    setNewYoutubeLink('')
  }

  const handleCreateTopic = async () => {
    if (!formData.topic_name.trim()) return

    try {
      const res = await fetch('/api/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject_id: subjectId,
          topic_name: formData.topic_name,
          is_completed: formData.is_completed,
          progress_percentage: formData.progress_percentage,
          source: formData.source || null,
          date_studied: formData.date_studied || null,
          comment: formData.comment || null,
          youtube_links: formData.youtube_links,
          attachments: formData.attachments,
          revision_target: formData.revision_target,
          revision_current: formData.revision_current,
          confidence_percentage: formData.confidence_percentage,
        }),
      })

      if (res.ok) {
        resetForm()
        setDialogOpen(false)
        fetchTopics()
      }
    } catch (error) {
      console.error('Failed to create topic:', error)
    }
  }

  const handleUpdateTopic = async () => {
    if (!editingTopic || !formData.topic_name.trim()) return

    try {
      const res = await fetch(`/api/topics/${editingTopic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_name: formData.topic_name,
          is_completed: formData.is_completed,
          progress_percentage: formData.progress_percentage,
          source: formData.source || null,
          date_studied: formData.date_studied || null,
          comment: formData.comment || null,
          youtube_links: formData.youtube_links,
          attachments: formData.attachments,
          revision_target: formData.revision_target,
          revision_current: formData.revision_current,
          confidence_percentage: formData.confidence_percentage,
        }),
      })

      if (res.ok) {
        resetForm()
        setEditingTopic(null)
        setDialogOpen(false)
        fetchTopics()
      }
    } catch (error) {
      console.error('Failed to update topic:', error)
    }
  }

  const handleDeleteTopic = async (id: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return

    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchTopics()
      }
    } catch (error) {
      console.error('Failed to delete topic:', error)
    }
  }

  const toggleTopicComplete = async (topic: Topic) => {
    try {
      await fetch(`/api/topics/${topic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !topic.is_completed }),
      })
      fetchTopics()
    } catch (error) {
      console.error('Failed to toggle topic:', error)
    }
  }

  const openCreateDialog = () => {
    setEditingTopic(null)
    resetForm()
    setDialogOpen(true)
  }

  const openEditDialog = (topic: Topic) => {
    setEditingTopic(topic)
    setFormData({
      topic_name: topic.topic_name,
      is_completed: topic.is_completed,
      progress_percentage: topic.progress_percentage || 0,
      source: topic.source || '',
      date_studied: topic.date_studied || '',
      comment: topic.comment || '',
      youtube_links: topic.youtube_links || [],
      attachments: topic.attachments || [],
      revision_target: topic.revision_target || 0,
      revision_current: topic.revision_current || 0,
      confidence_percentage: topic.confidence_percentage || 0,
    })
    setDialogOpen(true)
  }

  const addYoutubeLink = () => {
    if (!newYoutubeLink.trim()) return
    setFormData(prev => ({
      ...prev,
      youtube_links: [...prev.youtube_links, newYoutubeLink.trim()]
    }))
    setNewYoutubeLink('')
  }

  const removeYoutubeLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      youtube_links: prev.youtube_links.filter((_, i) => i !== index)
    }))
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setUploadingFile(true)
    try {
      // For now, we'll store file metadata without actual upload
      // In production, you would upload to Supabase Storage or another service
      const newAttachments: Attachment[] = Array.from(files).map(file => ({
        name: file.name,
        url: `#${file.name}`, // Placeholder - replace with actual upload URL
        type: file.type,
        size: file.size
      }))

      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newAttachments]
      }))
    } catch (error) {
      console.error('File upload error:', error)
    } finally {
      setUploadingFile(false)
    }
  }

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-4 w-4" />
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />
    return <Paperclip className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/subjects">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Subjects
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {subject?.name || 'Loading...'}
            </h1>
            <p className="text-muted-foreground">
              {topics.filter(t => t.is_completed).length} / {topics.length} topics completed
            </p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" />
            Add Topic
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading topics...</p>
          </div>
        ) : topics.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <h3 className="text-lg font-semibold mb-2">No topics yet</h3>
              <p className="text-muted-foreground mb-4">Add your first topic to start tracking</p>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Topic
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {topics.map((topic) => (
              <Card key={topic.id} className={topic.is_completed ? 'bg-green-50' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={topic.is_completed}
                          onCheckedChange={() => toggleTopicComplete(topic)}
                        />
                        <CardTitle className={topic.is_completed ? 'line-through text-muted-foreground' : ''}>
                          {topic.topic_name}
                        </CardTitle>
                      </div>
                      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {topic.source && (
                          <div>
                            <span className="font-medium">Source:</span> {topic.source}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Progress:</span> {topic.progress_percentage}%
                        </div>
                        {topic.date_studied && (
                          <div>
                            <span className="font-medium">Date:</span> {new Date(topic.date_studied).toLocaleDateString()}
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Revisions:</span> {topic.revision_current || 0}/{topic.revision_target || 0}
                          {topic.revision_target && topic.revision_current !== undefined && topic.revision_current < topic.revision_target && (
                            <span className="text-blue-600 ml-1">({topic.revision_target - topic.revision_current} left)</span>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Confidence:</span> {topic.confidence_percentage || 0}%
                        </div>
                        {topic.comment && (
                          <div className="col-span-2 md:col-span-4">
                            <span className="font-medium">Notes:</span> {topic.comment}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-1 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(topic)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTopic(topic.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingTopic ? 'Edit Topic' : 'Add New Topic'}</DialogTitle>
              <DialogDescription>
                {editingTopic ? 'Update topic details' : 'Add a new topic to track'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="topic-name">Topic Name *</Label>
                <Input
                  id="topic-name"
                  placeholder="e.g., Calculus, Newton's Laws"
                  value={formData.topic_name}
                  onChange={(e) => setFormData({ ...formData, topic_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Source</Label>
                  <Input
                    id="source"
                    placeholder="e.g., Textbook Chapter 5"
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="date-studied">Date Studied</Label>
                  <Input
                    id="date-studied"
                    type="date"
                    value={formData.date_studied}
                    onChange={(e) => setFormData({ ...formData, date_studied: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="progress">Progress: {formData.progress_percentage}%</Label>
                <Slider
                  id="progress"
                  min={0}
                  max={100}
                  step={5}
                  value={[formData.progress_percentage]}
                  onValueChange={(value) => setFormData({ ...formData, progress_percentage: value[0] })}
                  className="mt-2"
                />
              </div>

              {/* Revision Counter Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="revision-target">Revision Target</Label>
                  <Input
                    id="revision-target"
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    value={formData.revision_target}
                    onChange={(e) => setFormData({ ...formData, revision_target: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Label htmlFor="revision-current">Current Revisions</Label>
                  <Input
                    id="revision-current"
                    type="number"
                    min="0"
                    placeholder="e.g., 2"
                    value={formData.revision_current}
                    onChange={(e) => setFormData({ ...formData, revision_current: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              {/* Confidence Percentage Section */}
              <div>
                <Label htmlFor="confidence">Confidence: {formData.confidence_percentage}%</Label>
                <Slider
                  id="confidence"
                  min={0}
                  max={100}
                  step={5}
                  value={[formData.confidence_percentage]}
                  onValueChange={(value) => setFormData({ ...formData, confidence_percentage: value[0] })}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">How confident are you in this topic?</p>
              </div>

              <div>
                <Label htmlFor="comment">Notes/Comments</Label>
                <Textarea
                  id="comment"
                  placeholder="Add any additional notes or comments..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={3}
                />
              </div>

              {/* YouTube Links Section */}
              <div className="border-t pt-4">
                <Label className="flex items-center gap-2 mb-2">
                  <Youtube className="h-4 w-4 text-red-600" />
                  YouTube Links
                </Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Paste YouTube link here..."
                    value={newYoutubeLink}
                    onChange={(e) => setNewYoutubeLink(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addYoutubeLink()}
                  />
                  <Button type="button" onClick={addYoutubeLink} variant="outline" size="sm">
                    Add
                  </Button>
                </div>
                {formData.youtube_links.length > 0 && (
                  <div className="space-y-2">
                    {formData.youtube_links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Youtube className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate flex-1"
                        >
                          {link}
                        </a>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={() => removeYoutubeLink(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* File Attachments Section */}
              <div className="border-t pt-4">
                <Label className="flex items-center gap-2 mb-2">
                  <Paperclip className="h-4 w-4" />
                  Attachments (Images, PDFs, etc.)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    disabled={uploadingFile}
                    className="cursor-pointer"
                  />
                  {uploadingFile && <span className="text-sm text-gray-500">Uploading...</span>}
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        {getFileIcon(file.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 flex-shrink-0"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Note: Files are stored for reference. For production, set up Supabase Storage.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="completed"
                  checked={formData.is_completed}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_completed: checked })}
                />
                <Label htmlFor="completed">Mark as completed</Label>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={editingTopic ? handleUpdateTopic : handleCreateTopic}>
                  {editingTopic ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
