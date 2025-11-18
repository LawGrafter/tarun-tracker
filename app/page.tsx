'use client'

import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BookOpen, Target, TrendingUp, Calendar, Plus, ArrowRight, Youtube, Paperclip, FileText, AlertTriangle, Award, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface DashboardStats {
  totalSubjects: number
  totalTopics: number
  completedTopics: number
  overallProgress: number
}

interface Subject {
  id: string
  name: string
  completed_topics: number
  total_topics: number
  actual_topics?: number
  progress: number
}

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
  date_studied?: string
  youtube_links?: string[]
  attachments?: Attachment[]
  confidence_percentage?: number
  revision_current?: number
  revision_target?: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSubjects: 0,
    totalTopics: 0,
    completedTopics: 0,
    overallProgress: 0,
  })
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [recentTopics, setRecentTopics] = useState<Topic[]>([])
  const [weakTopics, setWeakTopics] = useState<Topic[]>([])
  const [strongTopics, setStrongTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [subjectsRes, topicsRes] = await Promise.all([
        fetch('/api/subjects'),
        fetch('/api/topics')
      ])
      const data = await subjectsRes.json()
      const topicsData = await topicsRes.json()
      setSubjects(data)

      const totalSubjects = data.length
      const totalTopics = data.reduce((acc: number, subj: Subject) => acc + subj.total_topics, 0)
      const completedTopics = data.reduce((acc: number, subj: Subject) => acc + subj.completed_topics, 0)
      const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

      setStats({
        totalSubjects,
        totalTopics,
        completedTopics,
        overallProgress,
      })
      
      // Get recent topics (last 5, sorted by date)
      const sortedTopics = topicsData
        .sort((a: Topic, b: Topic) => {
          const dateA = a.date_studied ? new Date(a.date_studied).getTime() : 0
          const dateB = b.date_studied ? new Date(b.date_studied).getTime() : 0
          return dateB - dateA
        })
        .slice(0, 5)
      setRecentTopics(sortedTopics)

      // Get weak topics (lowest confidence, only topics with confidence set)
      const topicsWithConfidence = topicsData.filter((t: Topic) => 
        t.confidence_percentage !== undefined && t.confidence_percentage !== null
      )
      const sortedWeakTopics = [...topicsWithConfidence]
        .sort((a: Topic, b: Topic) => 
          (a.confidence_percentage || 0) - (b.confidence_percentage || 0)
        )
        .slice(0, 5)
      setWeakTopics(sortedWeakTopics)

      // Get strong topics (highest confidence, only 50% or above)
      const topicsWithMeaningfulConfidence = topicsWithConfidence.filter((t: Topic) => 
        (t.confidence_percentage || 0) >= 50
      )
      const sortedStrongTopics = [...topicsWithMeaningfulConfidence]
        .sort((a: Topic, b: Topic) => 
          (b.confidence_percentage || 0) - (a.confidence_percentage || 0)
        )
        .slice(0, 5)
      setStrongTopics(sortedStrongTopics)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = subjects.map((subj) => {
    const totalTopics = subj.total_topics > 0 ? subj.total_topics : (subj.actual_topics || 0)
    const remaining = Math.max(0, totalTopics - subj.completed_topics)
    return {
      name: subj.name.length > 15 ? subj.name.substring(0, 15) + '...' : subj.name,
      completed: subj.completed_topics,
      remaining: remaining,
    }
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg">Track your exam preparation progress</p>
        </motion.div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="card-hover border-l-4 border-l-purple-500 bg-gradient-to-br from-white to-purple-50/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium text-gray-700">Total Subjects</CardTitle>
                  <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.totalSubjects}</div>
                  <p className="text-xs text-gray-500 mt-1">Active subjects</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="card-hover border-l-4 border-l-pink-500 bg-gradient-to-br from-white to-pink-50/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Topics</CardTitle>
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Target className="h-5 w-5 text-pink-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.totalTopics}</div>
                  <p className="text-xs text-gray-500 mt-1">Topics to study</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="card-hover border-l-4 border-l-cyan-500 bg-gradient-to-br from-white to-cyan-50/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Completed</CardTitle>
                  <div className="p-2 bg-cyan-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-cyan-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.completedTopics}</div>
                  <p className="text-xs text-gray-500 mt-1">Topics done</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="card-hover border-l-4 border-l-violet-500 bg-gradient-to-br from-white to-violet-50/30">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Overall Progress</CardTitle>
                  <div className="p-2 bg-violet-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-violet-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">{stats.overallProgress}%</div>
                  <p className="text-xs text-gray-500 mt-1">Completion rate</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Chart */}
        {!loading && subjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="mb-8 card-hover bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Subject-wise Progress</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Topics completed vs remaining</p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Bar dataKey="completed" fill="#10b981" radius={[8, 8, 0, 0]} name="Topics Covered" />
                    <Bar dataKey="remaining" fill="#f59e0b" radius={[8, 8, 0, 0]} name="Topics Remaining" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-600">Topics Covered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-amber-500 rounded"></div>
                    <span className="text-sm text-gray-600">Topics Remaining</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Topics */}
        {!loading && recentTopics.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-8"
          >
            <Card className="card-hover bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Recent Topics</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Your recently studied topics</p>
                  </div>
                  <Link href="/topics">
                    <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary">
                      View All
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTopics.map((topic, index) => {
                    const subject = subjects.find(s => s.id === topic.subject_id)
                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {topic.is_completed ? (
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Target className="h-4 w-4 text-green-600" />
                            </div>
                          ) : (
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BookOpen className="h-4 w-4 text-purple-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{topic.topic_name}</h4>
                            <p className="text-sm text-gray-500">{subject?.name || 'Unknown Subject'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-semibold text-purple-600">
                              {topic.progress_percentage}%
                            </div>
                            {topic.date_studied && (
                              <div className="text-xs text-gray-500">
                                {new Date(topic.date_studied).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </div>
                            )}
                          </div>
                          <div className="w-16">
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                style={{ width: `${topic.progress_percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Confidence Analysis */}
        {!loading && (weakTopics.length > 0 || strongTopics.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mb-8"
          >
            <Card className="card-hover bg-gradient-to-br from-orange-50 via-white to-green-50 border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                      Confidence Analysis
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Focus areas and strengths based on your confidence levels</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Weak Topics - Need Focus */}
                  {weakTopics.length > 0 && (
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-red-900">Need More Focus</h3>
                          <p className="text-xs text-red-600">Topics with lowest confidence</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {weakTopics.map((topic, index) => {
                          const subject = subjects.find(s => s.id === topic.subject_id)
                          return (
                            <motion.div
                              key={topic.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="bg-white rounded-lg p-3 border border-red-200 hover:border-red-400 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-sm truncate">{topic.topic_name}</h4>
                                  <p className="text-xs text-gray-500 truncate">{subject?.name || 'Unknown Subject'}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="text-right">
                                    <div className="flex items-center gap-1">
                                      <TrendingDown className="h-3 w-3 text-red-600" />
                                      <span className="text-sm font-bold text-red-600">
                                        {topic.confidence_percentage}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500">confidence</p>
                                  </div>
                                  <Link href={`/subjects/${topic.subject_id}`}>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-red-100">
                                      <ArrowRight className="h-4 w-4 text-red-600" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                              {/* Mini progress bar */}
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-red-500"
                                    style={{ width: `${topic.confidence_percentage || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{topic.progress_percentage}% done</span>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Strong Topics - Keep It Up */}
                  {strongTopics.length > 0 && (
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-900">Your Strengths</h3>
                          <p className="text-xs text-green-600">Topics with highest confidence</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {strongTopics.map((topic, index) => {
                          const subject = subjects.find(s => s.id === topic.subject_id)
                          return (
                            <motion.div
                              key={topic.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="bg-white rounded-lg p-3 border border-green-200 hover:border-green-400 hover:shadow-md transition-all"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-sm truncate">{topic.topic_name}</h4>
                                  <p className="text-xs text-gray-500 truncate">{subject?.name || 'Unknown Subject'}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="text-right">
                                    <div className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3 text-green-600" />
                                      <span className="text-sm font-bold text-green-600">
                                        {topic.confidence_percentage}%
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500">confidence</p>
                                  </div>
                                  <Link href={`/subjects/${topic.subject_id}`}>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-green-100">
                                      <ArrowRight className="h-4 w-4 text-green-600" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                              {/* Mini progress bar */}
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-green-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-green-500"
                                    style={{ width: `${topic.confidence_percentage || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{topic.progress_percentage}% done</span>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Summary Stats */}
                {weakTopics.length > 0 && strongTopics.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-orange-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-orange-600 font-medium mb-1">Avg. Weak Confidence</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {Math.round(weakTopics.reduce((sum, t) => sum + (t.confidence_percentage || 0), 0) / weakTopics.length)}%
                        </p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-yellow-600 font-medium mb-1">Topics Tracked</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {weakTopics.length + strongTopics.length}
                        </p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-xs text-green-600 font-medium mb-1">Avg. Strong Confidence</p>
                        <p className="text-2xl font-bold text-green-700">
                          {Math.round(strongTopics.reduce((sum, t) => sum + (t.confidence_percentage || 0), 0) / strongTopics.length)}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Resources */}
        {!loading && (() => {
          const totalYouTube = recentTopics.reduce((sum, t) => sum + (t.youtube_links?.length || 0), 0)
          const totalFiles = recentTopics.reduce((sum, t) => sum + (t.attachments?.length || 0), 0)
          return totalYouTube + totalFiles > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mb-8"
            >
              <Card className="card-hover bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Study Resources</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">Your uploaded materials and videos</p>
                    </div>
                    <Link href="/resources">
                      <Button variant="outline" size="sm" className="hover:border-primary hover:text-primary">
                        View All
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                      <div className="p-3 bg-red-100 rounded-lg">
                        <Youtube className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{totalYouTube}</p>
                        <p className="text-sm text-gray-600">YouTube Videos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Paperclip className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{totalFiles}</p>
                        <p className="text-sm text-gray-600">Files Uploaded</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <FileText className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{totalYouTube + totalFiles}</p>
                        <p className="text-sm text-gray-600">Total Resources</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })()}

        {/* Quick Actions */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="card-hover bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Get started with your study tracking</p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Link href="/subjects">
                    <Button className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group">
                      <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                      Add New Subject
                    </Button>
                  </Link>
                  <Link href="/topics">
                    <Button variant="outline" className="border-2 hover:border-primary hover:text-primary transition-all duration-300 group">
                      View All Topics
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!loading && subjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="mt-8 border-2 border-dashed border-gray-300 bg-gradient-to-br from-white to-gray-50">
              <CardContent className="py-16 text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary opacity-50" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900">No subjects yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Get started by creating your first subject and begin tracking your study progress
                </p>
                <Link href="/subjects">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Subject
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
