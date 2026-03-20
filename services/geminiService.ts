import { GoogleGenAI } from "@google/genai";
import { GeneratedContent, Platform, DualPlatformContent, Language } from "../types";

export const validateTopic = async (topic: string): Promise<void> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });
  
  const validationPrompt = `
    Analyze the following topic for a social media SEO generator: "${topic}".
    Determine if this is a real, valid, and meaningful topic that can be used to generate SEO content for YouTube or Instagram.
    
    Invalid topics include:
    - Random gibberish (e.g., "asdfghjkl")
    - Single random characters or nonsensical strings
    - Purely offensive or harmful content that violates safety standards
    - Content that is so vague it has no context (e.g., just the word "the")

    Return a JSON object:
    {
      "isValid": boolean,
      "reason": "A short explanation if invalid, otherwise empty"
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: validationPrompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      // Fallback: try to find JSON in the text
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        throw new Error("Failed to validate topic format.");
      }
    }

    if (!result.isValid) {
      const validationError = new Error(result.reason || "This topic appears to be invalid or nonsensical. Please provide a real topic.");
      (validationError as any).isValidationError = true;
      throw validationError;
    }
  } catch (error) {
    if (error instanceof Error && (error as any).isValidationError) {
      throw error;
    }
    // If it's a generic AI error (like quota or network), we might still want to proceed 
    // to avoid blocking the user due to a validation service hiccup.
    console.warn("Topic validation service error - proceeding anyway", error);
  }
};

const generateForPlatform = async (
  topic: string,
  platform: Platform,
  language: Language = Language.ENGLISH
): Promise<GeneratedContent> => {
  // Initialize AI with the environment key
  // The API key is automatically injected into process.env.API_KEY
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY });

  const prompt = `
    Act as a world-class Social Media SEO Expert and Strategist, specializing in the latest 2026 algorithm updates. 
    I need you to generate hyper-optimized content for the platform: "${platform}" regarding the topic: "${topic}".
    The content MUST be written in the following language: "${language}".
    
    CRITICAL: You MUST use Google Search to research the absolute latest (March 2026) algorithm trends, trending keywords, and viral hooks specific to this topic, platform, AND the target language: "${language}".

    Language-Specific SEO & Cultural Nuances:
    - For Hindi/Telugu: Use a mix of formal and colloquial (Hinglish/Telinglish) where appropriate to maximize engagement and relatability. Focus on "Shareability" within regional communities.
    - For English: Focus on global SEO standards, high-clarity hooks, and universal appeal.
    - Research what's currently "Viral" in the specific linguistic region for this topic.

    Platform-Specific 2026 Algorithm Focus:
    - YouTube: Focus on "Viewer Satisfaction" and "High Retention" hooks. Optimize for the "New Viewer" vs "Returning Viewer" discovery loop. Titles should be curiosity-driven but accurate.
    - Instagram: Focus on "Originality" and "Saves/Shares" as primary ranking signals. Hooks must be visual-first and stop-the-scroll. Optimize for the "Explore Page" and "Reels" recommendation engines.

    Return the response as a valid JSON object wrapped in a code block \`\`\`json ... \`\`\`. 
    
    The JSON object must have the following structure:
    {
      "title": "A highly engaging, click-worthy title or caption hook in ${language}.",
      "description": "A complete, SEO-rich description or caption in ${language}. Include line breaks as \\n characters.",
      "tags": ["tag1", "tag2", "tag3"],
      "strategy": "A detailed explanation (in ${language}) of how this content specifically targets the LATEST 2026 algorithm updates for ${platform}.",
      "validityScore": 85
    }

    The "validityScore" should be a number between 0 and 100 representing how "real" and "algorithmically valid" this content is based on current trends, search data, and platform standards.

    Specific Instructions per Platform:
    - YouTube: Title should be under 100 chars, high CTR. Description should be detailed with keywords and timestamps placeholders. Tags should be high-volume search terms.
    - Instagram: Title is the "Hook" (first line). Description is the caption. Tags are Hashtags (start with #) - use a mix of niche and broad.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    
    // Extract sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks
      ?.map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter((s: any) => s !== null) || [];

    // Parse JSON from code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```([\s\S]*?)```/);
    
    if (jsonMatch && jsonMatch[1]) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return {
          ...parsed,
          sources
        };
      } catch (e) {
        console.error("Failed to parse JSON from code block", e);
        throw new Error(`Failed to parse ${platform} content.`);
      }
    } else {
        // Fallback: try to parse the raw text if it looks like JSON
        try {
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                const jsonStr = text.substring(start, end + 1);
                const parsed = JSON.parse(jsonStr);
                return { ...parsed, sources };
            }
        } catch(e) {
             console.error("Fallback JSON parse failed", e);
        }
        
      throw new Error(`The model did not return a valid JSON format for ${platform}. Please try again.`);
    }

  } catch (error) {
    console.error(`Gemini API Error (${platform}):`, error);
    throw error;
  }
};

export const generateDualSeoContent = async (topic: string, language: Language = Language.ENGLISH): Promise<DualPlatformContent> => {
  try {
    const [youtube, instagram] = await Promise.all([
      generateForPlatform(topic, Platform.YOUTUBE, language),
      generateForPlatform(topic, Platform.INSTAGRAM, language)
    ]);
    
    return { youtube, instagram };
  } catch (error) {
    console.error("Dual generation error", error);
    throw error;
  }
};