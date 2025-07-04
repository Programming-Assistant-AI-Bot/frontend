// src/api/index.js
const API_BASE_URL = "http://localhost:8000";

async function sendChatMessage(sessionId, message) {
  console.log(`Sending request to ${API_BASE_URL}/${sessionId} with message: ${message}`);
  const response = await fetch(`${API_BASE_URL}/${sessionId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    console.error(`HTTP error! status: ${response.status}`);
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}

async function getChatHistory(sessionId) {
  const response = await fetch(`${API_BASE_URL}/chatHistory/${sessionId}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export default {
  sendChatMessage,
  getChatHistory,
};