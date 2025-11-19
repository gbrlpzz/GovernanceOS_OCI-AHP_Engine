import { GoogleGenAI, Type } from "@google/genai";

// Helper to check if API key exists without crashing
const getApiKey = () => {
  try {
    return process.env.API_KEY;
  } catch (e) {
    return undefined;
  }
};

export const generateCauses = async (outcome: string): Promise<string[]> => {
  const key = getApiKey();
  if (!key) return ["(Error: Missing API_KEY in environment)"];

  const ai = new GoogleGenAI({ apiKey: key });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Identify 3-5 root causes (drivers) for this public policy or strategic outcome: "${outcome}". Return short, concise labels.`,
      config: {
        systemInstruction: "You are an expert policy analyst. Provide concise, causal factors.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const generateInterventions = async (outcome: string, causes: string[]): Promise<{label: string, targets: string[]}[]> => {
    const key = getApiKey();
    if (!key) return [];
  
    const ai = new GoogleGenAI({ apiKey: key });
  
    const prompt = `
      Outcome: ${outcome}
      Causes: ${causes.join(", ")}
      
      Suggest 3-5 distinct strategic interventions/programs. 
      For each, identify which of the provided Causes it primarily addresses (targets). 
      Use ONLY the causes listed above.
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: "You are an expert solution architect. Suggest high-impact interventions.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    label: { type: Type.STRING },
                    targets: { 
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Must exactly match strings from the provided Causes list"
                    }
                },
                required: ["label", "targets"]
            }
          }
        }
      });
  
      const text = response.text;
      if (!text) return [];
      return JSON.parse(text) as {label: string, targets: string[]}[];
    } catch (error) {
      console.error("Gemini Error:", error);
      return [];
    }
  };