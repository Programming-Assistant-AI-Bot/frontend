// src/utils.js
import { marked } from "marked";

export async function* parseSSEStream(response) {
  console.log("Starting SSE stream processing");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      console.log("SSE stream ended");
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    console.log("Raw buffer:", buffer);
    const lines = buffer.split("\n\n");

    for (let i = 0; i < lines.length - 1; i++) {
      const event = lines[i];
      if (!event) continue;

      console.log("Processing event:", event);
      const dataMatch = event.match(/^data: (.*)$/m);
      if (dataMatch) {
        console.log("Yielding data:", dataMatch[1]);
        yield dataMatch[1];
      }
    }

    buffer = lines[lines.length - 1];
  }

  if (buffer) {
    console.log("Processing final buffer:", buffer);
    const dataMatch = buffer.match(/^data: (.*)$/m);
    if (dataMatch) {
      console.log("Yielding final data:", dataMatch[1]);
      yield dataMatch[1];
    }
  }
}

export function processMarkdown(text) {
  return marked.parse(text, { breaks: true });
}

export function trackCodeBlockState(chunk, state) {
  const newState = { ...state };
  if (chunk.includes("```") && !state.inBlock) {
    newState.inBlock = true;
    newState.lang = chunk.match(/```(\w+)?/)?.[1] || "";
  } else if (chunk.includes("```") && state.inBlock) {
    newState.inBlock = false;
    newState.lang = "";
  }
  return newState;
}