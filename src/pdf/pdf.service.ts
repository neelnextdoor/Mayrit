import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as process from "node:process";
import {GoogleGenAI} from "@google/genai";

dotenv.config();

@Injectable()
export class PdfService {
   private ai: GoogleGenAI;

  constructor() {
    let apikey = process.env.GEMINI_API_KEY;
    this.ai = new GoogleGenAI({ apiKey : apikey });
  }

  async processPdf(filePath: string , prompt : string): Promise<string> {
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);

    const storyText = pdfData.text.slice(0, 3000);

    const data = {
      contents: [
        {
          parts: [
            {
              text: `${prompt}
                    Story:
                    ${storyText}`,
            },
          ],
        },
      ],
    };

    const response = await axios.post(
      `${process.env.GEMINI_PDF_GENERATION_API_BASE_URL}?key=${process.env.GEMINI_API_KEY}`,
      data,
      { headers: { 'Content-Type': 'application/json' } },
    );

    return response.data.candidates[0].content.parts[0].text;
  }

  async generateFromPdfUrl(pdfUrl: string, prompt: string): Promise<any> {

    const pdfResp = await fetch(pdfUrl)
        .then((response) => response.arrayBuffer());

    const contents = [
        { text: prompt },
        {
            inlineData: {
                mimeType: 'application/pdf',
                data: Buffer.from(pdfResp).toString("base64")
            }
        }
    ];

    const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents
    });

    return response.text;
  }

}
