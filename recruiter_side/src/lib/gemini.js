
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function checkContent(text) {
    if (!text || !process.env.GEMINI_API_KEY) return true; // Fail open if no key or no text

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `
            Analyze the following text for explicit, offensive, pornographic, or illegal content. 
            Text: "${text}"
            
            Respond with ONLY "SAFE" if it is safe, or "UNSAFE" if it contains explicit/offensive/illegal content.
            Do not provide any other explanation.
        `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const analysis = response.text().trim().toUpperCase();

        return analysis === "SAFE";
    } catch (error) {
        console.error("Gemini Content Moderation Error:", error);
        return true; // Fail open on error to avoid blocking valid users if API fails
    }
}
