import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const { image } = req.body;

        const prompt = `You are an elite copywriter for small businesses in Northern Nigeria. Analyze this image. Write TWO highly engaging Facebook post captions designed to convert readers into buyers:
        1. ENGLISH: A warm, engaging caption highlighting the product's value. End with a strong CTA to DM or WhatsApp.
        2. HAUSA: The same storytelling style in standard Northern Nigerian Hausa. End with a strong Hausa sales CTA.
        Use emojis and relevant hashtags for both.`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: image, mimeType: "image/jpeg" } }
        ]);

        res.status(200).json({ caption: result.response.text() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate caption' });
    }
}