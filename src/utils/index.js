// src/utils/index.js
export async function* parseSSEStream(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n\n');

    for (let i = 0; i < lines.length - 1; i++) {
      const event = lines[i];
      if (!event) continue;

      const dataMatch = event.match(/^data: (.*)$/m);
      if (dataMatch) {
        yield dataMatch[1]; // Yield the JSON string (e.g., {"content": "Hello", "formatted": true})
      }
    }

    buffer = lines[lines.length - 1]; // Keep the last incomplete chunk
  }

  if (buffer) {
    const dataMatch = buffer.match(/^data: (.*)$/m);
    if (dataMatch) {
      yield dataMatch[1];
    }
  }
}

// Reintroduce Markdown processing if needed
export function processMarkdown(text) {
  // Implement Markdown processing (e.g., using marked or a similar library)
  return text; // Placeholder: replace with actual Markdown parsing if needed
}

export function trackCodeBlockState(chunk, state) {
  // Implement code block state tracking (e.g., for ``` blocks)
  return state; // Placeholder: update based on your original implementation
}