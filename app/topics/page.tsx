'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { Filter, Search, CheckCircle2, Circle, Calendar, Edit, Trash2, ExternalLink, Youtube, Paperclip, FolderOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
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
}

interface Subject {
  id: string
  name: string
}

export default function AllTopicsPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [filterCompleted, setFilterCompleted] = useState<string>('all')

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

  const toggleTopicComplete = async (topic: Topic) => {
    try {
      await fetch(`/api/topics/${topic.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_completed: !topic.is_completed }),
      })
      fetchData()
    } catch (error) {
      console.error('Failed to toggle topic:', error)
    }
  }

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm('Are you sure you want to delete this topic?')) return

    try {
      const res = await fetch(`/api/topics/${topicId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Failed to delete topic:', error)
    }
  }

  const getSubjectName = (subjectId: string) => {
    return subjects.find((s) => s.id === subjectId)?.name || 'Unknown'
  }

  // Filter topics
  const filteredTopics = topics.filter((topic) => {
    const matchesSearch = topic.topic_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === 'all' || topic.subject_id === selectedSubject
    const matchesCompleted =
      filterCompleted === 'all' ||
      (filterCompleted === 'completed' && topic.is_completed) ||
      (filterCompleted === 'pending' && !topic.is_completed)

    return matchesSearch && matchesSubject && matchesCompleted
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            All Topics
          </h1>
          <p className="text-gray-600 text-lg">
            View and manage all your study topics across subjects
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="mr-2 h-5 w-5 text-purple-600" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Search Topics
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by topic name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Subject Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Subject
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="all">All Subjects</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Status
                  </label>
                  <select
                    value={filterCompleted}
                    onChange={(e) => setFilterCompleted(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="all">All Topics</option>
                    <option value="completed">Completed</option>
                    <option value="pending">In Progress</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing <span className="font-semibold text-purple-600">{filteredTopics.length}</span> of{' '}
                <span className="font-semibold">{topics.length}</span> topics
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Topics List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredTopics.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="py-16 text-center">
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No topics found</h3>
                <p className="text-gray-500">
                  {searchQuery || selectedSubject !== 'all' || filterCompleted !== 'all'
                    ? 'Try adjusting your filters'
                    : 'Create your first topic to get started'}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className={`card-hover ${topic.is_completed ? 'bg-gradient-to-br from-green-50 to-white' : 'bg-white'}`}>
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                      {/* Completion Toggle */}
                      <button
                        onClick={() => toggleTopicComplete(topic)}
                        className="transition-transform hover:scale-110 touch-manipulation min-touch-target flex-shrink-0"
                      >
                        {topic.is_completed ? (
                          <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                        )}
                      </button>

                      {/* Topic Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3
                                className={`text-base sm:text-lg font-semibold ${
                                  topic.is_completed ? 'line-through text-gray-500' : 'text-gray-900'
                                }`}
                              >
                                {topic.topic_name}
                              </h3>
                            </div>

                            <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-600 mb-3">
                              <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-purple-100 text-purple-700 font-medium text-xs sm:text-sm">
                                {getSubjectName(topic.subject_id)}
                              </span>
                              {topic.source && (
                                <span className="inline-flex items-center text-xs sm:text-sm">
                                  📚 <span className="truncate max-w-[150px] sm:max-w-none">{topic.source}</span>
                                </span>
                              )}
                              {topic.date_studied && (
                                <span className="inline-flex items-center text-xs sm:text-sm">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                                  <span className="whitespace-nowrap">{format(new Date(topic.date_studied), 'MMM dd, yyyy')}</span>
                                </span>
                              )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                <span className="text-sm font-semibold text-purple-600">
                                  {topic.progress_percentage}%
                                </span>
                              </div>
                              <Progress value={topic.progress_percentage} className="h-2" />
                            </div>

                            {topic.comment && (
                              <p className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg">
                                💡 {topic.comment}
                              </p>
                            )}

                            {/* Resources Section */}
                            {((topic.youtube_links && topic.youtube_links.length > 0) || 
                              (topic.attachments && topic.attachments.length > 0)) && (
                              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200 w-full">
                                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                  {topic.youtube_links && topic.youtube_links.map((link, idx) => (
                                    <a
                                      key={idx}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium hover:bg-red-100 transition-colors touch-manipulation"
                                    >
                                      <Youtube className="h-3 w-3 flex-shrink-0" />
                                      <span className="hidden xs:inline">YouTube</span>
                                      <span className="xs:hidden">YT</span>
                                    </a>
                                  ))}
                                  {topic.attachments && topic.attachments.map((file, idx) => (
                                    <span
                                      key={idx}
                                      className="inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium max-w-[120px] sm:max-w-none"
                                    >
                                      <Paperclip className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{file.name}</span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-3 sm:mt-0">
                            <Link href={`/resources?topic=${topic.id}`} className="flex-1 sm:flex-none">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-purple-50 w-full text-xs sm:text-sm touch-manipulation"
                              >
                                <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 flex-shrink-0" />
                                <span className="hidden sm:inline">View Resources</span>
                                <span className="sm:hidden">Resources</span>
                              </Button>
                            </Link>
                            <Link href={`/subjects/${topic.subject_id}`} className="flex-1 sm:flex-none">
                              <Button
                                variant="outline"
                                size="sm"
                                className="hover:bg-blue-50 w-full text-xs sm:text-sm touch-manipulation"
                              >
                                <Edit className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 flex-shrink-0" />
                                <span className="hidden sm:inline">Edit Topic</span>
                                <span className="sm:hidden">Edit</span>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteTopic(topic.id)}
                              className="hover:bg-red-50 hover:text-red-600 flex-1 sm:flex-none sm:w-full text-xs sm:text-sm touch-manipulation"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2 flex-shrink-0" />
                              <span className="hidden sm:inline">Delete</span>
                              <span className="sm:hidden">Del</span>
                            </Button>
                          </div>
                        </div>
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
