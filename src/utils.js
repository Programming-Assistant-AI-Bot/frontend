import { EventSourceParserStream } from 'eventsource-parser/stream';

export async function* parseSSEStream(stream) {
  const sseStream = stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
  
  for await (const chunk of sseStream) {
    if (chunk.event === 'message' || chunk.type === 'message') {
      try {
        // Parse the JSON data
        const jsonData = JSON.parse(chunk.data);
        yield jsonData.content || chunk.data;
      } catch (e) {
        // Fallback to raw data if not JSON
        yield chunk.data;
      }
    }
  }
}

/**
 * Processes raw text to properly handle newlines and markdown formatting
 */
export function processMarkdown(content) {
  if (!content) return '';
  
  // Normalize newlines consistently
  let processed = content
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r');
  
  // Handle code block formatting
  processed = processed.replace(/```(\w+)([^```]*?)```/g, (match, lang, code) => {
    // Ensure there's a newline after the language identifier if missing
    if (!code.startsWith('\n')) {
      return `\`\`\`${lang}\n${code}\`\`\``;
    }
    return match;
  });
  
  return processed;
}

// Add this new function to track code block state
export function trackCodeBlockState(content, prevState = { inBlock: false, lang: '' }) {
  const codeBlockMatches = content.match(/```(\w*)/g) || [];
  
  // Toggle state for each code block marker
  for (const match of codeBlockMatches) {
    prevState.inBlock = !prevState.inBlock;
    if (prevState.inBlock) {
      // Extract language if this is opening a code block
      const lang = match.slice(3).trim();
      prevState.lang = lang;
    }
  }
  
  return prevState;
}

/**
 * Detects if we're in the middle of a markdown token that might be split across chunks
 */
export function hasIncompleteMarkdownTokens(content) {
  // Check for incomplete markdown tokens that might be split across chunks
  const incompletePatterns = [
    // Bold/italic markers
    { start: /\*\*(?:[^*]*)$/, end: /\*\*/ },  // Incomplete **bold**
    { start: /\*(?:[^*]*)$/, end: /\*/ },      // Incomplete *italic*
    // Code blocks
    { start: /```[^`]*$/, end: /```/ },       // Incomplete code block
  ];
  
  return incompletePatterns.some(pattern => 
    pattern.start.test(content) && !isBalanced(content, pattern.start, pattern.end)
  );
}

// Helper to check if markdown tokens are balanced
function isBalanced(content, startPattern, endPattern) {
  const startMatches = (content.match(new RegExp(startPattern.source, 'g')) || []).length;
  const endMatches = (content.match(new RegExp(endPattern.source, 'g')) || []).length;
  return startMatches === endMatches;
}