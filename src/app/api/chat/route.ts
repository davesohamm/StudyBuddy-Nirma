import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { verifyToken } from '@/lib/auth-real';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyBoEQtSeyM3Q2MdKsw8NdXkEhEq6nmtPn4');

// System prompt for study-focused chatbot
const STUDY_SYSTEM_PROMPT = `You are an AI study assistant for MTech Data Science students at Nirma University. Your role is to help students with their academic studies in the following areas:

**Your Expertise:**
- Data Science & Analytics
- Machine Learning & Deep Learning
- Statistics & Probability
- Programming (Python, R, SQL)
- Big Data Technologies
- Research Methodology
- Academic Writing & Projects
- Study Tips & Time Management
- Career Guidance in Data Science

**Guidelines:**
- Always provide accurate, educational content
- Explain concepts in a clear, student-friendly manner
- Provide practical examples and code snippets when relevant
- Suggest study resources, books, or online materials
- Help with assignment guidance (but don't do the work for them)
- Encourage critical thinking and learning
- Be supportive and motivational
- If asked about non-academic topics, politely redirect to studies

**Your Communication Style:**
- Friendly but professional
- Clear and concise explanations
- Use examples from real-world data science applications
- Break down complex topics into digestible parts
- Always encourage further learning

Remember: You're here to guide and teach, not to provide direct assignment solutions. Focus on helping students understand concepts and develop their problem-solving skills.`;

export async function POST(request: NextRequest) {
  try {
    console.log('🤖 Chat API - Starting request processing...');
    
    // Verify authentication
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ Chat API - No token provided');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.log('❌ Chat API - Invalid token');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log('✅ Chat API - User authenticated:', payload.userId);

    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      console.log('❌ Chat API - No message provided');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    console.log('📝 Chat API - Processing message:', message.substring(0, 50) + '...');
    console.log('🔑 Chat API - API Key available:', !!process.env.GEMINI_API_KEY);

    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    console.log('🤖 Chat API - Model initialized: gemini-1.5-pro');

    // Build conversation context
    let conversationContext = STUDY_SYSTEM_PROMPT + "\n\n";
    
    // Add conversation history (last 5 exchanges to keep context manageable)
    const recentHistory = conversationHistory.slice(-10);
    recentHistory.forEach((exchange: any) => {
      conversationContext += `Student: ${exchange.user}\nAI Assistant: ${exchange.assistant}\n\n`;
    });

    // Add current message
    conversationContext += `Student: ${message}\nAI Assistant:`;

    // Generate response with fallback models
    console.log('🔄 Chat API - Generating response...');
    let result, response, aiResponse;
    
    // Try different models in order of preference - updated with newer models
    const modelNames = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    let lastError;
    
    for (const modelName of modelNames) {
      try {
        console.log(`🔄 Trying model: ${modelName}`);
        const currentModel = genAI.getGenerativeModel({ model: modelName });
        result = await currentModel.generateContent(conversationContext);
        response = await result.response;
        aiResponse = response.text();
        
        console.log('✅ Chat API - Response generated successfully with', modelName);
        console.log('📤 Chat API - Response length:', aiResponse.length);
        break; // Success, exit the loop
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.log(`❌ Model ${modelName} failed:`, errorMessage);
        lastError = error;
        
        // Log specific error types for debugging
        if (errorMessage.includes('429') || errorMessage.includes('quota')) {
          console.log(`⏳ ${modelName} quota exceeded, trying next model...`);
        } else if (errorMessage.includes('503') || errorMessage.includes('overloaded')) {
          console.log(`🔄 ${modelName} overloaded, trying next model...`);
        } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          console.log(`❌ ${modelName} not available, trying next model...`);
        }
        
        // If this is the last model, we'll throw the error
        if (modelName === modelNames[modelNames.length - 1]) {
          throw error;
        }
        // Otherwise, continue to the next model
      }
    }

    return NextResponse.json({
      success: true,
      message: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Chat API error:', error);
    
    // Handle specific GoogleGenerativeAI errors
    if (error instanceof Error) {
      console.log('🔍 Error details:', error.message);
      
      if (error.message.includes('API_KEY') || error.message.includes('api key')) {
        console.log('🔑 API Key error detected');
        return NextResponse.json(
          { error: 'AI service configuration error. Please check your API key.' },
          { status: 500 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('rate limit')) {
        console.log('📊 Quota/Rate limit error detected');
        return NextResponse.json(
          { error: 'AI service temporarily unavailable. Please try again later.' },
          { status: 503 }
        );
      }

      if (error.message.includes('not found') || error.message.includes('404')) {
        console.log('🤖 Model not found error detected');
        return NextResponse.json(
          { error: 'AI model is currently unavailable. Please try again later.' },
          { status: 503 }
        );
      }

      if (error.message.includes('SAFETY')) {
        console.log('🛡️ Safety filter triggered');
        return NextResponse.json(
          { error: 'Your message was blocked for safety reasons. Please rephrase your question.' },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to process your message. Please try again.' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if chat service is available
export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDAFVwbQ7fSgDEqq3m_EcS2Xz92optLH-Y';
    
    return NextResponse.json({
      available: !!apiKey,
      message: 'Study Assistant AI is ready to help with your academic questions!'
    });
  } catch (error) {
    return NextResponse.json({
      available: false,
      message: 'Study Assistant AI is currently unavailable'
    });
  }
} 