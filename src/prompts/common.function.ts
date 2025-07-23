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