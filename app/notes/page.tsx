'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Filter, Search, BookOpen, Tag, Calendar, StickyNote } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import Link from 'next/link'

interface Topic {
  id: string
  subject_id: string
  topic_name: string
  comment?: string
  source?: string
  date_studied?: string
  progress_percentage: number
  revision_current?: number
  revision_target?: number
  confidence_percentage?: number
  is_completed: boolean
}

interface Subject {
  id: string
  name: string
}

interface NoteWithDetails extends Topic {
  subject_name: string
}

export default function NotesPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [topicsRes, subjectsRes] = await Promise.all([
        fetch('/api/topics'),
        fetch('/api/subjects'),
      ])
      const topicsData = await topicsRes.json()
      const subjectsData = await subjectsRes.json()
      setTopics(topicsData)
      setSubjects(subjectsData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSubjectName = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.name || 'Unknown Subject'
  }

  // Filter topics that have notes/comments
  const topicsWithNotes: NoteWithDetails[] = topics
    .filter((topic) => topic.comment && topic.comment.trim() !== '')
    .map((topic) => ({
      ...topic,
      subject_name: getSubjectName(topic.subject_id),
    }))

  // Apply filters
  const filteredNotes = topicsWithNotes.filter((note) => {
    const matchesSearch =
      note.topic_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === 'all' || note.subject_id === selectedSubject

    return matchesSearch && matchesSubject
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
              <StickyNote className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Study Notes
              </h1>
              <p className="text-gray-600 text-lg">
                All your notes and comments in one place
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="mr-2 h-5 w-5 text-purple-600" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Search Notes
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by topic, notes, or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Filter by Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing <span className="font-semibold text-purple-600">{filteredNotes.length}</span> of{' '}
                <span className="font-semibold">{topicsWithNotes.length}</span> notes
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notes List */}
        {loading ? (
          <LoadingSpinner />
        ) : topicsWithNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-dashed border-gray-300 bg-white/50">
              <CardContent className="py-16 text-center">
                <StickyNote className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No notes yet</h3>
                <p className="text-gray-500">
                  Start adding notes to your topics to see them here
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-dashed border-gray-300 bg-white/50">
              <CardContent className="py-16 text-center">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No notes found</h3>
                <p className="text-gray-500">Try adjusting your filters</p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          <CardTitle className="text-xl font-bold text-gray-900">
                            {note.topic_name}
                          </CardTitle>
                        </div>
                        <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                            <Tag className="h-3 w-3 mr-1" />
                            {note.subject_name}
                          </span>
                          {note.source && (
                            <span className="inline-flex items-center text-gray-600">
                              📚 {note.source}
                            </span>
                          )}
                          {note.date_studied && (
                            <span className="inline-flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(note.date_studied), 'MMM dd, yyyy')}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/subjects/${note.subject_id}`}>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium shadow-md">
                          View Topic
                        </button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <StickyNote className="h-5 w-5 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {note.comment}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Topic Stats */}
                    <div className="mt-4 grid grid-cols-3 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-blue-600 font-medium mb-1">Progress</p>
                        <p className="text-lg font-bold text-blue-700">{note.progress_percentage}%</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-green-600 font-medium mb-1">Revisions</p>
                        <p className="text-lg font-bold text-green-700">
                          {note.revision_current || 0}/{note.revision_target || 0}
                        </p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-orange-600 font-medium mb-1">Confidence</p>
                        <p className="text-lg font-bold text-orange-700">{note.confidence_percentage || 0}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
