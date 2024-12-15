const TOGETHER_API_KEY = "d31ba578fd24844d849e0d50947b48d1c6faf1a8f8e07e0effb4d106236ef974";
const API_URL = "https://api.together.xyz/v1/images/generations";

export interface GenerateImageParams {
  prompt: string;
  width?: number;
  height?: number;
  steps?: number;
  n?: number;
}

export const generateImage = async (params: GenerateImageParams) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOGETHER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "black-forest-labs/FLUX.1-schnell-Free",
        prompt: params.prompt,
        width: params.width || 512,
        height: params.height || 512,
        steps: params.steps || 1,
        n: params.n || 1,
        response_format: "b64_json"
      })
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generando imagen:', error);
    throw error;
  }
};