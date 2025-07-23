import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import * as fs from "fs";
import fetch from "node-fetch";
import * as dotenv from 'dotenv';
dotenv.config();

export class GeminiImageService {
  private ai: GoogleGenAI;

  constructor() {
    let apikey = process.env.GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey : apikey });
  }

  // 1. Upload an image file and generate content
  async generateFromUploadedFile(filePath: string, prompt: string): Promise<string> {
    console.log(filePath);
    const uploadedFile = await this.ai.files.upload({
      file: filePath,
      config: { mimeType: "image/jpeg" },
    });

    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createUserContent([
        createPartFromUri(uploadedFile.uri, uploadedFile.mimeType),
        prompt,
      ]),
    });

    return response.text;
  }

  // 2. Inline local image file (for <20MB images)
  async  generateFromInlineFile(filePath: string, prompt: string): Promise<string> {
    const imageResponse = await fetch(filePath);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64ImageData = Buffer.from(arrayBuffer).toString("base64");

    const response = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg", // or detect based on file type
            data: base64ImageData,
          },
        },
        { text: prompt },
      ],
    });

    return response.text;
  }

  // 3. Inline image from a URL
  async generateFromImageUrl(imageUrl: string, prompt: string): Promise<string> {
   
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");

    const result = await this.ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg", // Adjust based on actual image type
            data: base64Data,
          },
        },
        { text: prompt },
      ],
    });

    console.log(result);


    return result.text;
  }
}
