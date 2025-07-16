import React, { useState, useContext, useRef } from "react";
import { Send, Sparkles, Paperclip } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { AuthContext } from "../contexts/AuthContext";
import ChatbotName from "./ChatbotName";
import AttachmentPopup from "./AttachmentPopup";
import RepositoryPopup from "./RepositoryPopup";
import WeburlPopup from "./WeburlPopup";
import { nanoid } from "nanoid";
import { parseSSEStream, trackCodeBlockState } from "@/utils";
import { useImmer } from "use-immer";
import api from "@/api";
import axiosWithAuth, { axiosWithAuthFormData } from "@/utils/axiosWithAuth";

const NewChatWindow = ({ onSessionCreated, onCancel }) => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachmentPopup, setShowAttachmentPopup] = useState(false);
  const [showRepositoryPopup, setShowRepositoryPopup] = useState(false);
  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const { user } = useContext(AuthContext);

  const handleCreateSession = async () => {
    if (!query.trim() && !selectedFile && !repositoryUrl && !websiteUrl) {
      toast.error("Please enter a query or attach content to start a new session");
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
      
      // Set appropriate query text based on attachment type
      let queryText = query.trim();
      let Text = queryText;
      
      if(selectedFile){
        Text = `[Attachment] ${selectedFile.name}`;
      }
      // Create the session
      const response = await axiosAuth.post("http://localhost:8000/session/createSession", {
        query: Text
      });
      
      const sessionId = response.data.sessionId;

      // Pass the file directly to Homepage instead of uploading it here
      if (selectedFile) {
        onSessionCreated(sessionId, queryText, selectedFile);
      } else {
        onSessionCreated(sessionId, queryText);
      }
      
      // Reset inputs
      setSelectedFile(null);
      setRepositoryUrl("");
      setWebsiteUrl("");
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

  const handleAttachType = (type) => {
    setShowAttachmentPopup(false);
    
    switch (type) {
      case "pdf":
        document.getElementById("pdf-upload")?.click();
        break;
      case "repository":
        setShowRepositoryPopup(true);
        break;
      case "website":
        setShowUrlPopup(true);
        break;
      default:
        console.warn(`Unknown attachment type: ${type}`);
        break;
    }
  };
  
  const handleRepositorySubmit = (url, newSessionId) => {
    // If a new session was created during validation
    if (newSessionId) {
      // We already have a session with the repository validated, so notify parent
      onSessionCreated(newSessionId, `[Repository Link] ${url}`);
      toast.success("Session created with validated repository!");
      
      // Reset state
      setRepositoryUrl("");
      setSelectedFile(null);
      setWebsiteUrl("");
      setQuery("");
      return;
    }
    
    // Standard flow when no session was created (fallback)
    setRepositoryUrl(url);
    setSelectedFile(null);
    setWebsiteUrl("");
    toast.success("Repository link added successfully!");
  };
  
  const handleUrlSubmit = (url, newSessionId) => {
    // If a new session was created during validation
    if (newSessionId) {
      // We already have a session with the URL validated, so notify parent
      onSessionCreated(newSessionId, `[Website URL] ${url}`);
      toast.success("Session created with validated URL!");
      
      // Reset state
      setWebsiteUrl("");
      setSelectedFile(null);
      setRepositoryUrl("");
      setQuery("");
      return;
    }
    
    // Standard flow when no session was created (fallback)
    setWebsiteUrl(url);
    setSelectedFile(null);
    setRepositoryUrl("");
    toast.success("Website URL added successfully!");
  };

  // Determine which attachment is selected
  const selectedAttachment = selectedFile 
    ? { type: "pdf", name: selectedFile.name } 
    : repositoryUrl 
      ? { type: "repository", name: repositoryUrl }
      : websiteUrl 
        ? { type: "website", name: websiteUrl }
        : null;

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 relative">
      {/* Add ChatbotName component for the logo */}
      <ChatbotName />

      <div className="flex flex-col justify-center items-center h-full">
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
          
          {/* Display selected attachment if any */}
          {selectedAttachment && (
            <div className="mt-2 p-2 bg-slate-700/50 rounded-lg flex items-center justify-between">
              <div className="text-sm text-slate-300 truncate">
                {selectedAttachment.type === "pdf" && "PDF: "}
                {selectedAttachment.type === "repository" && "Repository: "}
                {selectedAttachment.type === "website" && "Website: "}
                {selectedAttachment.name}
              </div>
              <button 
                onClick={() => {
                  if (selectedAttachment.type === "pdf") setSelectedFile(null);
                  else if (selectedAttachment.type === "repository") setRepositoryUrl("");
                  else if (selectedAttachment.type === "website") setWebsiteUrl("");
                }}
                className="text-slate-400 hover:text-red-400 ml-2"
              >
                ✕
              </button>
            </div>
          )}
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex space-x-2">
            {/* Attachment button */}
            <button
              onClick={() => setShowAttachmentPopup(true)}
              className="text-slate-400 hover:text-blue-400 transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
              disabled={isLoading}
            >
              <Paperclip size={18} />
            </button>
            
            {/* Send button */}
            <button
              onClick={handleCreateSession}
              className={`text-slate-400 hover:text-blue-400 transition-colors p-2 hover:bg-slate-700/50 rounded-lg ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading || (!query.trim() && !selectedAttachment)}
            >
              <Send size={18} className="text-blue-500" />
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

      {/* Hidden file input for PDF uploads */}
      <input
        type="file"
        id="pdf-upload"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          setSelectedFile(e.target.files?.[0]);
          setRepositoryUrl(""); // Clear other attachment types
          setWebsiteUrl("");
        }}
      />

      {/* Attachment popup */}
      <AttachmentPopup
        isOpen={showAttachmentPopup}
        onClose={() => setShowAttachmentPopup(false)}
        onAttachTypeSelect={handleAttachType}
      />
      
      {/* Repository popup */}
      <RepositoryPopup
        isOpen={showRepositoryPopup}
        onClose={() => setShowRepositoryPopup(false)}
        onSubmit={handleRepositorySubmit}
      />
      
      {/* Website URL popup */}
      <WeburlPopup
        isOpen={showUrlPopup}
        onClose={() => setShowUrlPopup(false)}
        onSubmit={handleUrlSubmit}
      />
    </div>
  );
};

export default NewChatWindow;