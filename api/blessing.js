// Serverless Function: api/blessing.js
// Securely calls Gemini API from the backend using Vercel Environment Variables

export default async function handler(req, res) {
    // Set CORS headers for safe origin calls
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { mood } = req.query;
    if (!mood) {
        return res.status(400).json({ error: 'Mood query parameter is required' });
    }

    // Securely pull the key from environment variables, otherwise fall back to the provided temp key
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCYjvj1tnhqGJnTbySQB-2-lj8FahRmSLQ";
    
    const prompt = `You are a comforting, inspiring Christian AI pastor. You are generating a highly personalized birthday blessing and scripture encouragement for a girl named Jerslin Silviya who is turning 19 today. Her current heart focus is: ${mood}. Generate: 1. A fitting Bible verse (with text and reference). 2. A beautiful, personalized 3-sentence birthday prayer focusing on her seeking ${mood}. 3. A short, encouraging 3-sentence summary of a Bible character who exemplified or overcame struggles related to ${mood} (e.g., David for courage, Esther for strength, Joseph for patience). Do not use markdown headers, list markers, or bullet points. Format the output in three clear, separate paragraphs.`;

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API returned status ${response.status}: ${errText}`);
        }

        const data = await response.json();
        
        if (!data.candidates || data.candidates.length === 0) {
            throw new Error("No response candidates returned by Gemini");
        }
        
        const textResponse = data.candidates[0].content.parts[0].text;
        
        return res.status(200).json({ text: textResponse });
    } catch (error) {
        console.error("Backend API Error: ", error);
        return res.status(500).json({ error: error.message });
    }
}
