import { GoogleGenAI, Modality, Part, GenerateContentResponse, Chat } from "@google/genai";
import { AspectRatio } from "../types";

// Fix: Per coding guidelines, initialize with process.env.API_KEY directly and remove explicit check.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// Helper function to convert a File to a Base64 string and its mimeType
const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,"), remove it.
        resolve(reader.result.split(',')[1]);
      }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      mimeType: file.type,
      data,
    },
  };
};

export const generateOutfit = async (
  userImage: File,
  outfitImage: File | null,
  outfitDescription: string,
  aspectRatio: AspectRatio,
  negativePrompt: string,
  fineDetails: string,
  backgroundPreset: string,
  customBackground: string,
): Promise<string> => {
  
  let prompt = `As Tryify, an AI outfit visualization model, your task is to realistically apply a new outfit to the human subject in the provided image while maintaining their original face, hair, and body shape.

**Instructions:**
1.  **Preserve Identity:** The person’s identity, face, and hairstyle must be preserved exactly as in the original image. Do not alter facial features.
2.  **Realistic Outfit Application:** The new outfit should be applied realistically, aligning perfectly with the person's body and pose. Pay close attention to fabric drape, shadows, and fit.
3.  **High-Resolution Output:** Generate a single, high-resolution, photorealistic image.
4.  **Framing and Composition:** Adjust the framing and composition to best fit the target aspect ratio of ${aspectRatio}, without cropping the subject unnaturally.
5.  **Avoid Artifacts:** Ensure the final image is clean, without any visual artifacts, blurring, or distortions, especially on the face and hands.
`;

  if (backgroundPreset === 'Original') {
    prompt += `\n6.  **Maintain Scene Integrity:** The background, lighting, and shadows of the original image must be maintained to ensure a natural look.`;
  } else {
    prompt += `\n6.  **Background Replacement:** The original background must be COMPLETELY REPLACED. The new background should be photorealistic and integrate seamlessly with the subject's lighting.`;
  }


  if (outfitImage && outfitDescription) {
    prompt += `\n\n**Outfit Source:** The primary reference is the attached outfit image. Replicate its style, color, and texture. Use the following description to add or modify details: "${outfitDescription}".`;
  } else if (outfitImage) {
    prompt += `\n\n**Outfit Source:** Replicate the style, color, and texture from the attached outfit reference image.`;
  } else if (outfitDescription) {
    prompt += `\n\n**Outfit Source:** Generate a new outfit based *only* on the following text description: "${outfitDescription}".`;
  }

  if (backgroundPreset !== 'Original') {
    if (backgroundPreset === 'Custom' && customBackground) {
        prompt += `\n\n**New Background:** Generate a new background based on this description: "${customBackground}".`;
    } else {
        prompt += `\n\n**New Background:** Generate a "${backgroundPreset}" background.`;
    }
  }
  
  if (fineDetails) {
    prompt += `\n\n**Fine Details:** Pay close attention to these specific details: "${fineDetails}".`;
  }

  if (negativePrompt) {
    prompt += `\n\n**Things to Avoid (Negative Prompt):** Absolutely do not include any of the following elements or styles: "${negativePrompt}".`;
  }
  
  const userImagePart = await fileToGenerativePart(userImage);
  
  const parts: Part[] = [userImagePart];

  if (outfitImage) {
      const outfitImagePart = await fileToGenerativePart(outfitImage);
      parts.push(outfitImagePart);
  }
  
  parts.push({ text: prompt });

  try {
    const result: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: parts },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    const generatedPart = result.candidates?.[0]?.content?.parts?.[0];

    if (generatedPart && generatedPart.inlineData) {
      const base64ImageBytes: string = generatedPart.inlineData.data;
      const mimeType = generatedPart.inlineData.mimeType;
      return `data:${mimeType};base64,${base64ImageBytes}`;
    }
    
    // Handle cases where the API returns a response but no image data.
    const finishReason = result.candidates?.[0]?.finishReason;
    if (finishReason === 'SAFETY' || finishReason === 'RECITATION') {
        throw new Error('Generation failed due to safety or policy reasons. Please try a different outfit or description.');
    }

    throw new Error("Generation failed. The model did not return an image. Please try again with a different outfit or description.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Check for network-like errors
    if (error.message.includes('fetch')) {
        throw new Error('A network error occurred. Please check your connection and try again.');
    }
    // Re-throw our specific, user-friendly errors
    if (error.message.startsWith('Generation failed') || error.message.startsWith('A network error')) {
        throw error;
    }
    // Generic fallback for other API errors
    throw new Error('The generation failed. The AI model may be overloaded or the request was invalid. Please try again later.');
  }
};

export const startChatSession = (): Chat => {
  const chat: Chat = ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    config: {
      systemInstruction: 'You are a friendly and helpful assistant for the Tryify app. Users can ask you for fashion advice, tips on how to use the app, or general questions. Keep your answers concise and cheerful.',
    },
  });
  return chat;
};