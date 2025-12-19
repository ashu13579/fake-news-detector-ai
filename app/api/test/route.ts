import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'GEMINI_API_KEY environment variable is not set',
        hasKey: false
      })
    }

    if (apiKey.length < 20) {
      return NextResponse.json({
        status: 'error',
        message: 'API key seems too short',
        hasKey: true,
        keyLength: apiKey.length
      })
    }

    // Try to initialize and make a simple call
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const result = await model.generateContent('Say "API key is working" in JSON format: {"status": "working"}')
    const response = await result.response
    const text = response.text()

    return NextResponse.json({
      status: 'success',
      message: 'API key is valid and working',
      hasKey: true,
      keyLength: apiKey.length,
      testResponse: text
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message || 'Unknown error',
      errorDetails: error.toString()
    }, { status: 500 })
  }
}