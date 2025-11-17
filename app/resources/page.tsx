'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Youtube, Paperclip, FileText, Image as ImageIcon, Filter, Search, ExternalLink, FolderOpen } from 'lucide-react'
import { motion } from 'framer-motion'
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
  youtube_links?: string[]
  attachments?: Attachment[]
}

interface Subject {
  id: string
  name: string
}

interface ResourceItem {
  id: string
  topicId: string
  topicName: string
  subjectId: string
  subjectName: string
  type: 'youtube' | 'file'
  data: string | Attachment
}

export default function ResourcesPage() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [resources, setResources] = useState<ResourceItem[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [resourceType, setResourceType] = useState<string>('all')

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    processResources()
  }, [topics, subjects])

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

  const processResources = () => {
    const allResources: ResourceItem[] = []

    topics.forEach(topic => {
      const subject = subjects.find(s => s.id === topic.subject_id)
      
      // Add YouTube links
      if (topic.youtube_links && topic.youtube_links.length > 0) {
        topic.youtube_links.forEach((link, index) => {
          allResources.push({
            id: `${topic.id}-yt-${index}`,
            topicId: topic.id,
            topicName: topic.topic_name,
            subjectId: topic.subject_id,
            subjectName: subject?.name || 'Unknown',
            type: 'youtube',
            data: link
          })
        })
      }

      // Add file attachments
      if (topic.attachments && topic.attachments.length > 0) {
        topic.attachments.forEach((file, index) => {
          allResources.push({
            id: `${topic.id}-file-${index}`,
            topicId: topic.id,
            topicName: topic.topic_name,
            subjectId: topic.subject_id,
            subjectName: subject?.name || 'Unknown',
            type: 'file',
            data: file
          })
        })
      }
    })

    setResources(allResources)
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon className="h-5 w-5 text-blue-600" />
    if (type === 'application/pdf') return <FileText className="h-5 w-5 text-red-600" />
    return <Paperclip className="h-5 w-5 text-gray-600" />
  }

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.topicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.type === 'file' && 
        typeof resource.data === 'object' && 
        resource.data.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSubject = selectedSubject === 'all' || resource.subjectId === selectedSubject
    const matchesTopic = selectedTopic === 'all' || resource.topicId === selectedTopic
    const matchesType = 
      resourceType === 'all' || 
      (resourceType === 'youtube' && resource.type === 'youtube') ||
      (resourceType === 'files' && resource.type === 'file')

    return matchesSearch && matchesSubject && matchesTopic && matchesType
  })

  const availableTopics = selectedSubject === 'all' 
    ? topics 
    : topics.filter(t => t.subject_id === selectedSubject)

  const stats = {
    totalYoutube: resources.filter(r => r.type === 'youtube').length,
    totalFiles: resources.filter(r => r.type === 'file').length,
    totalSubjects: new Set(resources.map(r => r.subjectId)).size,
    totalTopics: new Set(resources.map(r => r.topicId)).size,
  }

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
            Study Resources
          </h1>
          <p className="text-gray-600 text-lg">
            All your YouTube videos and study materials in one place
          </p>
        </motion.div>

        {/* Stats Cards */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <Card className="card-hover border-l-4 border-l-red-500 bg-gradient-to-br from-white to-red-50/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <Youtube className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalYoutube}</p>
                    <p className="text-xs text-gray-600">YouTube Videos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Paperclip className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
                    <p className="text-xs text-gray-600">Files</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <FolderOpen className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalSubjects}</p>
                    <p className="text-xs text-gray-600">Subjects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-hover border-l-4 border-l-pink-500 bg-gradient-to-br from-white to-pink-50/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <FileText className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalTopics}</p>
                    <p className="text-xs text-gray-600">Topics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-6 bg-gradient-to-br from-white to-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Filter className="mr-2 h-5 w-5 text-purple-600" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Search Resources
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name..."
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
                    onChange={(e) => {
                      setSelectedSubject(e.target.value)
                      setSelectedTopic('all')
                    }}
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

                {/* Topic Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Topic
                  </label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="all">All Topics</option>
                    {availableTopics.map((topic) => (
                      <option key={topic.id} value={topic.id}>
                        {topic.topic_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Resource Type Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Resource Type
                  </label>
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="all">All Types</option>
                    <option value="youtube">YouTube Videos</option>
                    <option value="files">Files & Documents</option>
                  </select>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing <span className="font-semibold text-purple-600">{filteredResources.length}</span> of{' '}
                <span className="font-semibold">{resources.length}</span> resources
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resources List */}
        {loading ? (
          <LoadingSpinner />
        ) : filteredResources.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="py-16 text-center">
                <Paperclip className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No resources found</h3>
                <p className="text-gray-500 mb-4">
                  {resources.length === 0
                    ? 'Start adding YouTube links and files to your topics'
                    : 'Try adjusting your filters'}
                </p>
                <Link href="/subjects">
                  <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600">
                    Go to Subjects
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`p-3 rounded-lg flex-shrink-0 ${
                        resource.type === 'youtube' 
                          ? 'bg-red-100' 
                          : 'bg-blue-100'
                      }`}>
                        {resource.type === 'youtube' ? (
                          <Youtube className="h-6 w-6 text-red-600" />
                        ) : (
                          typeof resource.data === 'object' && getFileIcon(resource.data.type)
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            {/* Resource Name/Title */}
                            {resource.type === 'youtube' ? (
                              <a
                                href={resource.data as string}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-semibold text-blue-600 hover:underline flex items-center gap-2 mb-2"
                              >
                                <span className="truncate">YouTube Video</span>
                                <ExternalLink className="h-4 w-4 flex-shrink-0" />
                              </a>
                            ) : (
                              <p className="text-lg font-semibold text-gray-900 mb-2">
                                {typeof resource.data === 'object' && resource.data.name}
                              </p>
                            )}

                            {/* Topic & Subject Info */}
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium">
                                {resource.subjectName}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                                {resource.topicName}
                              </span>
                            </div>

                            {/* File Details */}
                            {resource.type === 'file' && typeof resource.data === 'object' && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Size:</span> {(resource.data.size / 1024).toFixed(1)} KB
                                {' • '}
                                <span className="font-medium">Type:</span> {resource.data.type}
                              </div>
                            )}

                            {/* YouTube URL */}
                            {resource.type === 'youtube' && (
                              <p className="text-sm text-gray-500 truncate">
                                {resource.data as string}
                              </p>
                            )}
                          </div>

                          {/* Action Button */}
                          {resource.type === 'youtube' ? (
                            <a
                              href={resource.data as string}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="outline" size="sm">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Watch
                              </Button>
                            </a>
                          ) : (
                            typeof resource.data === 'object' && resource.data.url && (
                              <a
                                href={resource.data.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={resource.data.name}
                              >
                                <Button variant="outline" size="sm">
                                  <Paperclip className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </a>
                            )
                          )}
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
