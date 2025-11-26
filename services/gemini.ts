/// <reference types="vite/client" />
import { GoogleGenAI, Type } from "@google/genai";

// Helper to check if API key exists without crashing
const getApiKey = () => {
  return import.meta.env.VITE_API_KEY;
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

export const generateInterventions = async (outcome: string, causes: string[]): Promise<{ label: string, targets: string[] }[]> => {
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
    return JSON.parse(text) as { label: string, targets: string[] }[];
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const validateDrivers = async (outcome: string, drivers: { id: string, label: string }[]): Promise<{ isValid: boolean; warnings: any[]; suggestions: string[] }> => {
  const key = getApiKey();
  if (!key) return { isValid: true, warnings: [], suggestions: ["(API key required for validation)"] };

  if (drivers.length < 2) {
    return { isValid: true, warnings: [], suggestions: [] };
  }

  const ai = new GoogleGenAI({ apiKey: key });

  const prompt = `
Analyze the following strategic drivers for the outcome "${outcome}":

Drivers:
${drivers.map((d, i) => `${i + 1}. ${d.label}`).join('\n')}

Evaluate whether these drivers are appropriately independent for an OCI (Outcome-Cause-Intervention) framework. 

Identify:
1. **Hierarchical relationships**: Drivers that are different levels of the same dimension (e.g., "Bachelors Degree" and "Masters Degree" are levels of educational attainment)
2. **Causal dependencies**: One driver directly causes another (e.g., "Education Access" causes "Literacy Rate")
3. **Redundancy/Overlap**: Drivers that measure essentially the same thing with different wording
4. **Correlation**: Drivers that are strongly correlated but not independent factors

For each issue found, provide:
- The type of issue
- Which driver indices are involved (0-indexed)
- A clear message explaining the problem
- Severity: "warning" or "error"

Also provide 1-3 concrete suggestions for restructuring if issues are found.

If all drivers appear independent and well-structured, return empty warnings and suggestions arrays.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert in causal modeling and strategic planning. Analyze drivers for OCI framework compliance.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: {
              type: Type.BOOLEAN,
              description: "True if no significant issues found"
            },
            warnings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    enum: ["hierarchical", "causal", "redundant", "overlap"]
                  },
                  driverIndices: {
                    type: Type.ARRAY,
                    items: { type: Type.NUMBER },
                    description: "0-indexed array positions"
                  },
                  message: { type: Type.STRING },
                  severity: {
                    type: Type.STRING,
                    enum: ["warning", "error"]
                  }
                },
                required: ["type", "driverIndices", "message", "severity"]
              }
            },
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Concrete suggestions for restructuring"
            }
          },
          required: ["isValid", "warnings", "suggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) return { isValid: true, warnings: [], suggestions: [] };

    const result = JSON.parse(text);

    // Map driver indices to IDs
    const warningsWithIds = result.warnings.map((w: any) => ({
      ...w,
      driverIds: w.driverIndices.map((idx: number) => drivers[idx]?.id).filter(Boolean)
    }));

    return {
      isValid: result.isValid,
      warnings: warningsWithIds,
      suggestions: result.suggestions
    };
  } catch (error) {
    console.error("Gemini Validation Error:", error);
    return { isValid: true, warnings: [], suggestions: [] };
  }
};