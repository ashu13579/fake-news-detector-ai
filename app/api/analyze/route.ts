import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          credibilityScore: 50,
          verdict: 'uncertain',
          analysis: 'API key not configured. Please add GEMINI_API_KEY environment variable in Vercel settings.',
          keyPoints: ['Missing API key configuration'],
          sources: [],
        },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const formData = await request.formData()
    const type = formData.get('type') as string
    const input = formData.get('input') as string
    const file = formData.get('file') as File | null

    let prompt = ''
    let contentToAnalyze = ''

    // Build prompt based on input type
    if (type === 'text') {
      contentToAnalyze = input
      prompt = `Analyze the following news headline/text for credibility and potential misinformation:\n\n"${contentToAnalyze}"\n\n`
    } else if (type === 'url') {
      contentToAnalyze = input
      prompt = `Analyze the news article from this URL for credibility: ${contentToAnalyze}\n\nNote: Since I cannot directly access URLs, please analyze based on the URL structure, domain reputation, and provide general guidance on verification.\n\n`
    } else if (type === 'image' && file) {
      prompt = `Analyze this image for potential misinformation, manipulated content, or fake news. Look for signs of photo manipulation, misleading captions, or out-of-context usage.\n\n`
    } else if (type === 'video' && file) {
      prompt = `Analyze this video thumbnail/frame for potential misinformation or fake news. Look for signs of deepfakes, manipulated footage, or misleading content.\n\n`
    }

    prompt += `Provide a detailed analysis in the following JSON format:
{
  "credibilityScore": <number 0-100>,
  "verdict": "<real|fake|uncertain>",
  "analysis": "<detailed explanation>",
  "keyPoints": ["<point1>", "<point2>", ...],
  "sources": ["<source1>", "<source2>", ...]
}

Consider:
1. Source credibility and reputation
2. Factual accuracy and verifiable claims
3. Emotional manipulation or sensationalism
4. Logical consistency
5. Cross-reference with known facts
6. Signs of manipulation or fabrication

Respond ONLY with valid JSON, no additional text.`

    // Use gemini-pro for text and gemini-pro-vision for images/videos
    let model
    if (file && (type === 'image' || type === 'video')) {
      model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' })
    } else {
      model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    }

    let result
    if (file && (type === 'image' || type === 'video')) {
      // Handle image/video analysis
      const bytes = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString('base64')
      
      result = await model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64,
            mimeType: file.type,
          },
        },
      ])
    } else {
      // Handle text/URL analysis
      result = await model.generateContent(prompt)
    }

    const response = await result.response
    const text = response.text()
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Invalid response format from AI')
    }

    const analysis = JSON.parse(jsonMatch[0])

    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error('Analysis error:', error)
    
    // Provide specific error messages
    let errorMessage = 'Unable to complete analysis. Please try again.'
    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid API key. Please check your GEMINI_API_KEY in Vercel settings.'
    } else if (error.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Please check your Google AI Studio quota.'
    }
    
    return NextResponse.json(
      {
        credibilityScore: 50,
        verdict: 'uncertain',
        analysis: errorMessage,
        keyPoints: [`Error: ${error.message || 'Technical error'}`],
        sources: [],
      },
      { status: 500 }
    )
  }
}