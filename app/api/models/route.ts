import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json({
        status: 'error',
        message: 'GEMINI_API_KEY not set'
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // List all available models
    const models = await genAI.listModels()
    
    return NextResponse.json({
      status: 'success',
      models: models.map(m => ({
        name: m.name,
        displayName: m.displayName,
        description: m.description,
        supportedMethods: m.supportedGenerationMethods
      }))
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: error.message,
      errorDetails: error.toString()
    }, { status: 500 })
  }
}