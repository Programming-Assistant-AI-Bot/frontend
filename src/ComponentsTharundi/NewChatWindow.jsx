import React, { useState } from "react";
import { Send, Sparkles, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const NewChatWindow = ({ onSessionCreated, onCancel }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userId = "tharundi_lavanya"; // Replace with actual user ID (e.g., from auth context)

  const handleCreateSession = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query to start a new session");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/session/createSession", {
        user_id: userId,
        query: query.trim(),
      });
      toast.success("New session created!");
      setQuery(""); // Clear input
      console.log("New Session Data:", response.data);
      onSessionCreated(response.data.sessionId); // Notify parent to select new session
    } catch (error) {
      toast.error("Failed to create session");
      console.error("Error creating session:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCreateSession();
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-full text-[white] bg-[#25003E] p-4">
      <div className="text-xl mb-4 flex items-center gap-2">
        <Sparkles size={24} className="text-purple-400" />
        Welcome to Archelon AI
      </div>
      <div className="text-gray-300 mb-6">
        Start a new session by entering your first query below
      </div>
      <div className="w-full max-w-2xl relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Archelon anything..."
          className="w-full p-3 pr-12 bg-purple-900/30 backdrop-blur-sm rounded-xl
                     text-white placeholder-purple-300/80 text-sm
                     focus:ring-2 focus:ring-purple-500/50 border border-purple-800/50
                     resize-none h-24"
          disabled={isLoading}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-900/30"
            } transition-all duration-200`}
            disabled={isLoading}
          >
            <X size={18} className="text-purple-300 hover:text-purple-100" />
          </button>
          <button
            onClick={handleCreateSession}
            className={`p-2 rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-900/30"
            } transition-all duration-200`}
            disabled={isLoading}
          >
            <Send size={18} className="text-purple-300 hover:text-purple-100" />
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-purple-300">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-purple-500"></div>
          Creating session...
        </div>
      )}
    </div>
  );
};

export default NewChatWindow;