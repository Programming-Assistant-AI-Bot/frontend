// import React, { useState } from "react";
// import { Send, Sparkles, X } from "lucide-react";
// import axios from "axios";
// import { toast } from "sonner";

// const NewChatWindow = ({ onSessionCreated, onCancel }) => {
//   const [query, setQuery] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const userId = "tharundi_lavanya"; // Replace with actual user ID (e.g., from auth context)

//   const handleCreateSession = async () => {
//     if (!query.trim()) {
//       toast.error("Please enter a query to start a new session");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await axios.post("http://localhost:8000/session/createSession", {
//         query: query.trim(),
//       });
//       toast.success("New session created!");
//       setQuery(""); // Clear input
//       console.log("New Session Data:", response.data);
//       onSessionCreated(response.data.sessionId); // Notify parent to select new session
//     } catch (error) {
//       toast.error("Failed to create session");
//       console.error("Error creating session:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleCreateSession();
//     }
//   };

//   return (
//     <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
//       <div className="text-xl mb-4 flex items-center gap-2 text-white">
//         <Sparkles size={24} className="text-blue-500" />
//         Welcome to Archelon AI
//       </div>
//       <div className="text-gray-400 mb-6">
//         Start a new session by entering your first query below
//       </div>
//       <div className="w-full max-w-2xl relative">
//         <textarea
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Ask Archelon anything..."
//           className="w-full p-3 pr-12 bg-slate-800/50 backdrop-blur-sm rounded-xl
//                      text-white placeholder-gray-400 text-sm
//                      focus:ring-2 focus:ring-blue-500/50 border border-slate-700/50
//                      resize-none h-24"
//           disabled={isLoading}
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
//           <button
//             onClick={handleCreateSession}
//             className={`p-2 rounded-lg ${
//               isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700/50"
//             } transition-all duration-200`}
//             disabled={isLoading}
//           >
//             <Send size={18} className="text-blue-500 hover:text-blue-300" />
//           </button>
         
//         </div>
//       </div>
//       {isLoading && (
//         <div className="mt-4 flex items-center gap-2 text-gray-400">
//           <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
//           Creating session...
//         </div>
//       )}
//     </div>
//   );
// };

// export default NewChatWindow;



// Updated NewChatWindow.jsx
import React, { useState, useContext } from "react";
import { Send, Sparkles } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { AuthContext } from "../contexts/AuthContext";

const NewChatWindow = ({ onSessionCreated, onCancel }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleCreateSession = async () => {
    if (!query.trim()) {
      toast.error("Please enter a query to start a new session");
      return;
    }

    setIsLoading(true);
    try {
      // Create axios instance with auth headers
      const axiosAuth = axios.create({
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const response = await axiosAuth.post("http://localhost:8000/session/createSession", {
        query: query.trim(),
        user_id: user?.id || user?.username  // Use authenticated user ID
      });
      
      toast.success("New session created!");
      console.log("New Session Data:", response.data);
      
      // Pass both sessionId and the initial query to parent
      onSessionCreated(response.data.sessionId, query.trim());
      setQuery(""); // Clear input
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
    <div className="flex flex-col justify-center items-center h-full w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4">
      <div className="text-xl mb-4 flex items-center gap-2 text-white">
        <Sparkles size={24} className="text-blue-500" />
        Welcome to Archelon AI
      </div>
      <div className="text-gray-400 mb-6">
        Start a new session by entering your first query below
      </div>
      <div className="w-full max-w-2xl relative">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask Archelon anything..."
          className="w-full p-3 pr-12 bg-slate-800/50 backdrop-blur-sm rounded-xl
                     text-white placeholder-gray-400 text-sm
                     focus:ring-2 focus:ring-blue-500/50 border border-slate-700/50
                     resize-none h-24"
          disabled={isLoading}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
          <button
            onClick={handleCreateSession}
            className={`p-2 rounded-lg ${
              isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-slate-700/50"
            } transition-all duration-200`}
            disabled={isLoading}
          >
            <Send size={18} className="text-blue-500 hover:text-blue-300" />
          </button>
        </div>
      </div>
      {isLoading && (
        <div className="mt-4 flex items-center gap-2 text-gray-400">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
          Creating session...
        </div>
      )}
    </div>
  );
};

export default NewChatWindow;