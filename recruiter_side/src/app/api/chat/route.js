/**
 * @file route.js (api/chat)
 * @description AI chatbot API using Gemini for recruitment assistance
 * @keywords chatbot, ai, gemini, intern-saathi, assistant, chat, help, query
 * 
 * Search tags:
 * - chat: chatbot endpoint, messaging
 * - ai: Gemini AI integration, LLM
 * - assistant: recruitment assistant, Q&A bot
 * - gemini: Google Gemini API
 * - fallback: error handling, backup responses
 */
import { NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

let question = '';
export async function POST(request) {
    try {
        const body = await request.json();
        question = body.question;

        // 1. Check for API Key with detailed logging (masking key)
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn("GEMINI_API_KEY is missing in environment variables.");
            return NextResponse.json({ answer: getFallbackAnswer(question, "missing_key") });
        }

        // 2. Call Gemini AI using new SDK
        const ai = new GoogleGenAI({ apiKey });

        // 3. Massive Context Injection
        const systemPrompt = `You are the "Intern Saathi" AI, the official Recruitment Assistant for the Government of India's PM Internship Scheme.
        
        YOUR KNOWLEDGE BASE:
        --------------------
        1. **Allocation Engine**: We use a multi-agentic system with a specific **GNN-GESA Algorithm** (Graph Neural Networks) to match candidates. It prioritizes fairness across rural/aspirational districts, gender, PwD, and EWS categories. It supports "Explainable AI" to justify every match.
        
        2. **Meeting Assistant Bot**: An AI agent that joins interviews. It provides multilingual transcription, real-time scoring, and summarizes candidate responses.
        
        3. **Telephonic Bot**: Automated agents that call candidates for pre-screening (language check, behavioral basics). Recruiters get a "Perception Summary".
        
        4. **Authenticity Guard**: A security feature integrated with **API Setu** and **Digilocker**. It verifies Aadhar, Education Certificates, and Income status. It detects fake documents with high precision.
        
        5. **Accessibility**: The platform is fully multilingual (Hindi, Tamil, Telugu, etc.) and features a Dynamic Screen Reader for visually impaired users.
        
        6. **Automated Mailing**: System sends auto-emails for shortlisting, offers, and schedule updates.
        
        7. **Withdrawal Handling**: If a candidate withdraws, the "Smart Seat Reallocation" engine instantly offers the seat to the next waitlisted match.
        
        8. **Dashboard**: Recruiters see "High Match Score (>90%)", "Location Match", and "Conversion Rate" analytics.
        
        YOUR ROLE:
        - Answer questions about these features confidently.
        - If asked about a candidate named "Devansh Kedia" (from the demo), say he has a 92% Match Score, is from Bangalore, and is verified.
        - Be professional, encouraging, and precise.
        
        USER QUESTION:
        ${question}
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: systemPrompt,
        });

        const answer = response.text;

        return NextResponse.json({ answer });

    } catch (error) {
        console.error('Chatbot API Detailed Error:', error);
        return NextResponse.json({ answer: getFallbackAnswer(question, "error") });
    }
}

function getFallbackAnswer(question, reason) {
    const lowerQ = question.toLowerCase();

    // Fallback Logic mimicking the "AI"
    if (lowerQ.includes('allocation') || lowerQ.includes('match')) {
        return "Our Intelligent Allocation Engine uses the GNN-GESA Algorithm (Graph Neural Networks) to ensure fair and precise candidate matching.";
    }
    if (lowerQ.includes('verify') || lowerQ.includes('auth')) {
        return "The Authenticity Guard uses API Setu and Digilocker to cross-verify Aadhar and Education certificates instantly.";
    }
    if (lowerQ.includes('interview')) {
        return "You can use our AI Meeting Assistant to transcribe and score interviews automatically.";
    }

    if (reason === 'missing_key') {
        return "I am operating in Limited Mode. Please configure the GEMINI_API_KEY in the server settings to unlock full AI capabilities.";
    }
    return "I am currently experiencing high traffic. Please try asking again in a moment.";
}
