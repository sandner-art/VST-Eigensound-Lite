
import { GoogleGenAI, Type } from "@google/genai";
import { AIStyle, SonificationPatch } from '../types';
import { PresetKey } from "../constants";

const getApiKey = (): string | null => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY environment variable not found. AI features will be disabled.");
    return null;
  }
  return apiKey;
};

let ai: GoogleGenAI | null = null;
const apiKey = getApiKey();
if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI:", e);
    }
}

const getSonifiableValuesForPreset = (presetKey: PresetKey): string[] => {
    switch(presetKey) {
        case 'euclid_I_47': return ['a', 'b', 'c'];
        case 'euclid_I_1': return ['side', 'height'];
        case 'euclid_II_5': return ['g', 'h', 'a'];
        case 'circle_ratios': return ['radius', 'circumference', 'area'];
        case 'euclid_I_5': return ['side', 'base'];
        case 'thales_theorem': return ['a', 'b', 'diameter'];
        case 'fibonacci_spiral': return ['length', ...Array.from({length: 11}, (_, i) => `step${i+1}`)];
        case 'fibonacci_circles': return Array.from({length: 11}, (_, i) => `radius${i+1}`);
        case 'golden_ratio_from_square': return ['size', 'segment_b', 'total'];
        case 'silver_ratio': return ['a', 'b', 'total'];
        case 'eye_of_horus': return ['fraction'];
        case 'flower_of_life': return ['circles', 'vesicaPiscis'];
        case 'lituus_spiral': return ['radius', 'angle'];
        default: return [];
    }
};

const getGeometryParamsForPreset = (presetKey: PresetKey): string[] => {
    switch (presetKey) {
        case 'euclid_I_47': return ['a', 'b'];
        case 'euclid_I_1': return ['size'];
        case 'euclid_II_5': return ['ab', 'c'];
        case 'circle_ratios': return ['radius'];
        case 'euclid_I_5': return ['ab'];
        case 'thales_theorem': return ['angle'];
        case 'fibonacci_spiral': return ['count', 'size'];
        case 'fibonacci_circles': return ['count'];
        case 'golden_ratio_from_square': return ['size'];
        case 'silver_ratio': return ['size'];
        case 'eye_of_horus': return ['fraction'];
        case 'flower_of_life': return ['steps'];
        case 'lituus_spiral': return ['a', 'rotations'];
        default: return [];
    }
};

export const generateSonificationPatch = async (
    presetKey: PresetKey,
    presetName: string,
    presetDescription: string,
    musicalStyle: AIStyle,
    userNotes: string
): Promise<SonificationPatch> => {
    if (!ai) {
        throw new Error("Gemini AI service is not available. Please ensure the API_KEY is configured correctly.");
    }
    
    const sonifiableValues = getSonifiableValuesForPreset(presetKey);
    const geometryParams = getGeometryParamsForPreset(presetKey);

    const schemaProperties: any = {
        presetKey: { type: Type.STRING },
        sonificationRules: {
            type: Type.OBJECT,
            properties: {
                baseFrequency: { type: Type.NUMBER },
                waveform: { type: Type.STRING, enum: ['sine', 'square', 'sawtooth', 'triangle', 'pulse', 'fm'] },
                scale: { type: Type.STRING, enum: ['chromatic', 'major', 'minor_pentatonic', 'dorian', 'phrygian', 'lydian', 'mixolydian', 'blues']},
                mode: { type: Type.STRING, enum: ['pitch', 'volume', 'filter'] },
                normalization: { type: Type.STRING, enum: ['none', 'global'] },
                maxPolyphony: { type: Type.NUMBER },
                granularModulationTarget: { type: Type.STRING, enum: ['pitch', 'rate', 'duration']},
                lfo: {
                    type: Type.OBJECT,
                    properties: {
                        target: { type: Type.STRING, enum: ['none', 'pitch', 'volume', 'filter'] },
                        waveform: { type: Type.STRING, enum: ['sine', 'square', 'sawtooth', 'triangle'] },
                        rate: { type: Type.NUMBER },
                        depth: { type: Type.NUMBER },
                    },
                    required: ['target', 'waveform', 'rate', 'depth']
                },
                lfoModulationTarget: { type: Type.STRING, enum: ['rate', 'depth'] },
            },
            required: ['baseFrequency', 'waveform', 'scale', 'mode', 'normalization', 'granularModulationTarget', 'lfo', 'lfoModulationTarget', 'maxPolyphony']
        },
        explanation: { type: Type.STRING, description: "Your creative rationale for the patch." }
    };
    
    const geometryProperties = geometryParams.reduce((acc, key) => {
        acc[key] = { type: Type.NUMBER };
        return acc;
    }, {} as any);

    if (Object.keys(geometryProperties).length > 0) {
        schemaProperties.geometryData = {
            type: Type.OBJECT,
            properties: geometryProperties,
            required: geometryParams
        };
    }

    const selectionProperties = sonifiableValues.reduce((acc, key) => {
        acc[key] = { type: Type.BOOLEAN };
        return acc;
    }, {} as any);

    if (Object.keys(selectionProperties).length > 0) {
        schemaProperties.sonificationSelection = {
            type: Type.OBJECT,
            properties: selectionProperties,
        };
    }
    
    const sourceAssignmentProperties = sonifiableValues.reduce((acc, key) => {
        acc[key] = { type: Type.STRING, enum: ['oscillator', 'white_noise', 'pink_noise', 'brown_noise', 'granular'] };
        return acc;
    }, {} as any);
    
    if (Object.keys(sourceAssignmentProperties).length > 0) {
        schemaProperties.sourceAssignments = {
            type: Type.OBJECT,
            properties: sourceAssignmentProperties,
        };
    }

    const fxAssignmentProperties = sonifiableValues.reduce((acc, key) => {
        acc[key] = { type: Type.STRING, enum: ['none', 'distortion', 'delay', 'reverb'] };
        return acc;
    }, {} as any);

    if (Object.keys(fxAssignmentProperties).length > 0) {
         schemaProperties.fxAssignments = {
            type: Type.OBJECT,
            properties: fxAssignmentProperties,
        };
    }

    const requiredFields = ["presetKey", "sonificationRules", "explanation"];
    if (Object.keys(geometryProperties).length > 0) requiredFields.push("geometryData");
    if (Object.keys(selectionProperties).length > 0) {
        requiredFields.push("sonificationSelection", "sourceAssignments", "fxAssignments");
    }

    const schema = {
        type: Type.OBJECT,
        properties: schemaProperties,
        required: requiredFields,
    };

    const prompt = `
        You are an expert sound designer creating a sonification patch for an interactive web app.
        Your task is to creatively interpret a mathematical concept as a complete sound design patch.

        1.  **Analyze the Concept:**
            - Name: "${presetName}"
            - Description: "${presetDescription}"
            - Sonifiable Values (keys for selection/assignment): [${sonifiableValues.join(', ')}]
            - Controllable Parameters (keys for geometryData): [${geometryParams.join(', ')}]

        2.  **Follow Creative Direction:**
            - Style: ${musicalStyle}
            - User Notes: ${userNotes || 'None'}

        3.  **Your Task & Rules:**
            - Generate a complete JSON patch strictly conforming to the provided schema.
            - Be creative. Map mathematical properties to sound parameters meaningfully. Use stable bass drones for fundamental values and dynamic, higher-pitched sounds for dependent values.
            - Set initial slider values in \`geometryData\` (typically between 10-150).
            - All keys in \`sonificationSelection\`, \`sourceAssignments\`, and \`fxAssignments\` MUST be from the 'Sonifiable Values' list.
            - \`sourceAssignments\` can be 'oscillator', 'white_noise', 'pink_noise', 'brown_noise', or 'granular'.
            - \`fxAssignments\` can be 'none', 'distortion', 'delay', 'reverb'.
            - **IMPORTANT: DO NOT include the "sourceParameters" key in your response. It is optional and handled by the app.**
            - Write a brief, 2-4 sentence \`explanation\` describing your creative choices and how they relate to the math.

        Generate the JSON patch now.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const jsonText = response.text.trim();
        
        try {
            const patch = JSON.parse(jsonText) as SonificationPatch;
            patch.presetKey = presetKey; // Ensure the correct preset key is set
            return patch;
        } catch (parseError) {
            console.error("Failed to parse JSON response from Gemini:", parseError);
            console.error("Received text:", jsonText);
            throw new Error("The AI returned a response that was not valid JSON.");
        }

    } catch (error) {
        console.error("Error fetching or parsing patch from Gemini:", error);
        let message = "Sorry, I couldn't generate a patch. The API returned an unexpected response.";
        if (error instanceof Error) {
            if (error.message.includes('API_KEY')) {
                message = "The Gemini API key is invalid or missing. Please check your configuration."
            } else if (error.message.includes('not valid JSON')) {
                message = error.message;
            } else if (error.message.toLowerCase().includes('invalid')) { 
                message = "The request to the AI was invalid, possibly due to a content safety policy or a schema mismatch. Please try a different prompt.";
            }
        }
        throw new Error(message);
    }
};
