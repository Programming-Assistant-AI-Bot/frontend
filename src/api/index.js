const API_BASE_URL = "http://localhost:8000";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    "Content-Type": "application/json",
    "Accept": "text/event-stream",
    "Authorization": token ? `Bearer ${token}` : "",
  };
};

async function sendChatMessage(sessionId, message) {
  console.log(`Sending request to ${API_BASE_URL}/chat/${sessionId} with message: ${message}`);
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${sessionId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error("Authentication failed");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
}

async function getChatHistory(sessionId) {
  try {
    const response = await fetch(`${API_BASE_URL}/chatHistory/${sessionId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        throw new Error("Authentication failed");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
}

export default {
  sendChatMessage,
  getChatHistory,
  getAuthHeaders
};