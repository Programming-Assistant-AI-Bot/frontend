const BASE_URL = "http://localhost:8000";

async function getChatHistory(sessionId) {
  const res = await fetch(BASE_URL + `/chatHistory/${sessionId}`, {
    method: 'GET',  // Changed from POST to GET to match backend endpoint
    headers: { 'Content-Type': 'application/json' }
  });
  const data = await res.json();
  if (!res.ok) {
    return Promise.reject({ status: res.status, data });
  }
  return data;
}

async function sendChatMessage(sessionId, message) {
  const res = await fetch(BASE_URL + `/chats/${sessionId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({message})
  });
  if (!res.ok) {
    return Promise.reject({ status: res.status, data: await res.json() });
  }
  return res.body;
}

export default {
  getChatHistory, sendChatMessage
};