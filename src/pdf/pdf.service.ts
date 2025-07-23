import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as process from "node:process";

dotenv.config();

@Injectable()
export class PdfService {

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

}
