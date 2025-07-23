export function generateMCQPrompt(maxCount: string, level: string): string {
  return `
    Generate ${maxCount} ${level} technical MCQ questions based on this PDF.
    Output MUST be a valid JSON array like:
    [
      {
        "number": 1,
        "question": "Question text",
        "options": ["A", "B", "C", "D"],
        "answer_index": 0
      }
    ]
    DO NOT include anything outside the array.
    `.trim();
}


export async function extractJSONFromLLMResponse(text: string): Promise<any[]> {
  // Try to find a code block with ``````
  const codeBlockMatch = text.match(/``````/i);
  let inner = codeBlockMatch ? codeBlockMatch[1] : text;

  // Remove leading/trailing whitespace and newlines
  inner = inner.trim();

  // Find the first [ and the last ]
  const startIdx = inner.indexOf('[');
  const endIdx = inner.lastIndexOf(']');
  if (startIdx === -1 || endIdx === -1 || endIdx <= startIdx) return null;

  let jsonString = inner.substring(startIdx, endIdx + 1);

  // Remove any escaped newlines/tabs (optional, for safety)
  jsonString = jsonString.replace(/\\n/g, '').replace(/\\t/g, '');

  // Optional: Remove trailing commas (can cause parse errors)
  jsonString = jsonString.replace(/,\s*([\]}])/g, '$1');

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Failed to parse JSON:', e, jsonString);
    return null;
  }
}


export async function  displayImageErrorMessage(error :any){
    let displayMessage = 'An unknown error occurred.';
    if (
      error?.response?.data?.error?.message?.toLowerCase().includes('provided image is not valid') ||
      error?.message?.toLowerCase().includes('provided image is not valid')
    ) {
      displayMessage =
        'The image you uploaded is not valid or supported. Please upload a clear PNG or JPEG image and try again.';
    } else if (error?.message) {
      // You can add more handlers for other known errors here
      displayMessage = error.message;
    }

    return displayMessage;
      // Respond (example for Express/NestJS)
}

export async function  displayPdfErrorMessage(error :any){
    let displayMessage = 'An unexpected error occurred.';
    if (error.message && error.message.toLowerCase().includes('invalid pdf')) {
      displayMessage =
        'The uploaded file is not a valid or readable PDF. Please check the file and try again.';
    } else if (error.message && error.message.toLowerCase().includes('password')) {
      displayMessage =
        'The PDF is password-protected and cannot be processed.';
    } else {
      displayMessage =
        'Failed to process the PDF. Please make sure it is a valid, unencrypted PDF, and try again.';
    }
    return displayMessage;
}