'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, Image, Video, FileText, Shield, AlertTriangle, CheckCircle, Loader2, Sparkles } from 'lucide-react'

type InputType = 'url' | 'image' | 'video' | 'text'
type AnalysisResult = {
  credibilityScore: number
  verdict: 'real' | 'fake' | 'uncertain'
  analysis: string
  keyPoints: string[]
  sources: string[]
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<InputType>('text')
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const tabs = [
    { id: 'text' as InputType, label: 'Headline', icon: FileText },
    { id: 'url' as InputType, label: 'URL', icon: Link },
    { id: 'image' as InputType, label: 'Image', icon: Image },
    { id: 'video' as InputType, label: 'Video', icon: Video },
  ]

  const handleAnalyze = async () => {
    setLoading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('type', activeTab)
      
      if (activeTab === 'text' || activeTab === 'url') {
        formData.append('input', input)
      } else if (file) {
        formData.append('file', file)
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'real': return 'text-green-500'
      case 'fake': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'real': return CheckCircle
      case 'fake': return AlertTriangle
      default: return Shield
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl md:text-6xl font-bold gradient-text">
              AI Fake News Detector
            </h1>
          </div>
          <p className="text-xl text-gray-300">
            Powered by Advanced AI • Multi-Format Analysis • Real-Time Verification
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-effect rounded-3xl p-8 shadow-2xl"
        >
          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Input Area */}
          <div className="mb-6">
            {(activeTab === 'text' || activeTab === 'url') ? (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  activeTab === 'text'
                    ? 'Enter a news headline or article text...'
                    : 'Enter a news article URL...'
                }
                className="w-full h-40 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            ) : (
              <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : 'video/*'}
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {file ? (
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      <span className="text-lg">{file.name}</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-center mb-4">
                        {activeTab === 'image' ? (
                          <Image className="w-16 h-16 text-purple-400" />
                        ) : (
                          <Video className="w-16 h-16 text-purple-400" />
                        )}
                      </div>
                      <p className="text-xl text-gray-300">
                        Click to upload {activeTab}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        or drag and drop
                      </p>
                    </div>
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Analyze Button */}
          <button
            onClick={handleAnalyze}
            disabled={loading || (!input && !file)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Analyze with AI
              </>
            )}
          </button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 glass-effect rounded-3xl p-8 shadow-2xl"
            >
              {/* Verdict Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="inline-block"
                >
                  {(() => {
                    const Icon = getVerdictIcon(result.verdict)
                    return <Icon className={`w-20 h-20 ${getVerdictColor(result.verdict)} mb-4`} />
                  })()}
                </motion.div>
                <h2 className={`text-4xl font-bold ${getVerdictColor(result.verdict)} mb-2`}>
                  {result.verdict.toUpperCase()}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-gray-300">Credibility Score:</span>
                  <span className="text-3xl font-bold">{result.credibilityScore}%</span>
                </div>
              </div>

              {/* Credibility Bar */}
              <div className="mb-8">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.credibilityScore}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full ${
                      result.credibilityScore >= 70
                        ? 'bg-green-500'
                        : result.credibilityScore >= 40
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>

              {/* Analysis */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  AI Analysis
                </h3>
                <p className="text-gray-300 leading-relaxed">{result.analysis}</p>
              </div>

              {/* Key Points */}
              {result.keyPoints.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-3">Key Points</h3>
                  <ul className="space-y-2">
                    {result.keyPoints.map((point, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <CheckCircle className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                        <span className="text-gray-300">{point}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sources */}
              {result.sources.length > 0 && (
                <div>
                  <h3 className="text-2xl font-bold mb-3">Verified Sources</h3>
                  <div className="space-y-2">
                    {result.sources.map((source, index) => (
                      <motion.a
                        key={index}
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="block bg-white/10 hover:bg-white/20 rounded-lg p-3 transition-colors"
                      >
                        <span className="text-purple-400 break-all">{source}</span>
                      </motion.a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-gray-400"
        >
          <p>Powered by Google Gemini AI • Built with Next.js & Tailwind CSS</p>
        </motion.div>
      </div>
    </main>
  )
}