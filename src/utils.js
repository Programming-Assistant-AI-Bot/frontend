import { EventSourceParserStream } from 'eventsource-parser/stream';

export async function* parseSSEStream(stream) {
  console.log("Starting to parse stream");
  const sseStream = stream
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new EventSourceParserStream())
  
  for await (const chunk of sseStream) {
    console.log("Raw SSE chunk:", chunk);
    console.log("Chunk structure:", JSON.stringify(chunk, null, 2));
    // Check for both "event" and "type" properties with appropriate values
    if (chunk.event === 'message' || chunk.type === 'message' || (!chunk.event && chunk.data)) {
      console.log("Yielding data:", chunk.data);
      yield chunk.data;
    }
  }
}