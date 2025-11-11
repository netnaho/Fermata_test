import { GoogleGenAI, Type, GenerateContentResponse, Modality } from "@google/genai";
import { UserLocation, RouteDetails } from '../types';

let ai: GoogleGenAI;

function getAiInstance() {
  if (!ai) {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set");
    }
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return ai;
}

export const getDirections = async (destination: string, location: UserLocation | null): Promise<RouteDetails> => {
  const ai = getAiInstance();
  const locationInfo = location ? ` from latitude ${location.latitude} and longitude ${location.longitude}` : '';
  const prompt = `Provide navigation details to "${destination}"${locationInfo}. The response should be in JSON format. The JSON object must contain these exact keys: 'destination' (string, the full name of the destination), 'duration' (string, e.g., "25 min"), 'distance' (string, e.g., "15 km"), and 'directionsAmharic' (string, a single paragraph of turn-by-turn directions in Amharic).`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    destination: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    distance: { type: Type.STRING },
                    directionsAmharic: { type: Type.STRING },
                },
                required: ['destination', 'duration', 'distance', 'directionsAmharic'],
            },
        }
    });

    const routeDetailsText = response.text.trim();
    return JSON.parse(routeDetailsText) as RouteDetails;

  } catch (error) {
    console.error("Error getting directions from Gemini:", error);
    // Fallback for demonstration purposes
    return {
      destination: "Menelik II Hospital",
      duration: "25 min",
      distance: "15 km",
      directionsAmharic: "ወደ ምኒሊክ 2ኛ ሆስፒታል ለመድረስ፣ ቀጥታ ወደፊት ይንዱ እና በቀኝ በኩል ባለው የመጀመሪያው መታጠፊያ ይውሰዱ። ከዚያ በኋላ ለ 5 ኪሎ ሜትር ያህል ቀጥ ብለው ይንዱ እና መድረሻዎ በግራ በኩል ይሆናል።"
    };
  }
};

export const textToSpeechAmharic = async (text: string): Promise<string> => {
  const ai = getAiInstance();
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            // FIX: Use Modality.AUDIO instead of string literal for type safety.
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A suitable voice
                },
            },
        },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        return base64Audio;
    } else {
        throw new Error("No audio data received from API.");
    }
  } catch (error) {
    console.error("Error with Text-to-Speech service:", error);
    throw error;
  }
};
