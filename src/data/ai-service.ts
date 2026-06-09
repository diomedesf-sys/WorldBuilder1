import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

// We define the schema that we expect the AI to return
const emotionalSchema: any = {
    type: Type.OBJECT,
    properties: {
        tension: {
            type: Type.NUMBER,
            description: "A value between 0.0 and 1.0 representing physical or emotional tension. 0 is fully relaxed/slumped, 1 is fully aggressive/rigid."
        },
        energy: {
            type: Type.NUMBER,
            description: "A value between 0.0 and 1.0 representing activity level. 0 is totally still/calm/slow, 1 is vibrating/chaotic/explosive."
        },
        palette: {
            type: Type.STRING,
            description: "A color hex code that matches the mood of the text. E.g. '#2e1065' for solemn/void, '#7c2d12' for angry/ember, '#3b82f6' for calm dawn."
        }
    },
    required: ["tension", "energy", "palette"]
};

export interface SemanticAnalysis {
    tension: number;
    energy: number;
    palette: string;
}

export const analyzeTextSemantics = async (text: string): Promise<SemanticAnalysis> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this stanza of poetry and provide the emotional parameters:\n"${text}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: emotionalSchema,
                temperature: 0.2, // Keep it relatively deterministic
            }
        });

        if (response.text) {
            const data = JSON.parse(response.text) as SemanticAnalysis;
            // Ensure bounds
            return {
                tension: Math.max(0, Math.min(1, data.tension)),
                energy: Math.max(0, Math.min(1, data.energy)),
                palette: data.palette || '#334155'
            };
        }
        throw new Error("No text returned from Gemini");
    } catch (error) {
        console.error("Gemini API Error:", error);
        // Fallback or default
        return {
            tension: 0.2,
            energy: 0.2,
            palette: '#334155'
        };
    }
};
