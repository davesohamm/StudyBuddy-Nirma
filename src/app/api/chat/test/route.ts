import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}
const genAI = new GoogleGenerativeAI(geminiApiKey);

export async function GET() {
  try {
    console.log('🧪 Testing Gemini API connection...');
    console.log('🔑 API Key available:', !!process.env.GEMINI_API_KEY);
    
    const modelNames = [
      "gemini-2.0-flash",
      "gemini-1.5-pro", 
      "gemini-1.5-flash", 
      "gemini-pro", 
      "gemini-1.0-pro",
      "models/gemini-2.0-flash",
      "models/gemini-1.5-pro",
      "models/gemini-1.5-flash",
      "models/gemini-pro"
    ];
    
    const results = [];
    
    for (const modelName of modelNames) {
      try {
        console.log(`🔄 Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Test with a simple prompt
        const result = await model.generateContent("Hello, can you respond with just 'Working'?");
        const response = await result.response;
        const text = response.text();
        
        results.push({
          model: modelName,
          status: 'working',
          response: text,
          success: true
        });
        
        console.log(`✅ Model ${modelName} works!`);
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({
          model: modelName,
          status: 'failed',
          error: errorMessage,
          success: false
        });
        
        console.log(`❌ Model ${modelName} failed:`, errorMessage);
      }
    }
    
    const workingModels = results.filter(r => r.success);
    
    return NextResponse.json({
      success: true,
      apiKeyPresent: !!process.env.GEMINI_API_KEY,
      workingModels: workingModels.length,
      preferredModel: workingModels.length > 0 ? workingModels[0].model : null,
      allResults: results,
      message: workingModels.length > 0 
        ? `Found ${workingModels.length} working models. Recommended: ${workingModels[0].model}`
        : 'No working models found. Please check your API key and account.'
    });
    
  } catch (error) {
    console.error('❌ Test API error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyPresent: !!process.env.GEMINI_API_KEY,
      message: 'Failed to test Gemini API connection'
    }, { status: 500 });
  }
} 