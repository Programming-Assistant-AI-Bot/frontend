import React, { useState, useEffect, useRef, useContext } from "react";
import ChatMessages from "./ChatMessage";
import ChatInput from "./ChatInput.jsx";
import ChatbotName from "./ChatbotName.jsx";
import AttachmentPopup from "./AttachmentPopup.jsx";
import WeburlPopup from "./WeburlPopup.jsx";
import RepositoryPopup from "./RepositoryPopup.jsx";
import { toast } from "sonner";
import axios from "axios";
import { parseSSEStream, trackCodeBlockState } from "@/utils";
import { useImmer } from "use-immer";
import api from "@/api/index.js";
import { nanoid } from "nanoid";
import LoadingAnimation from "./LoadingAnimation";
import axiosWithAuth, { axiosWithAuthFormData } from "@/utils/axiosWithAuth"; // Import the auth utilities
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext

const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useImmer([]);
  const [showAttachmentPopup, setShowAttachmentPopup] = useState(false);
  const [showRepositoryPopup, setShowRepositoryPopup] = useState(false);
  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const { user } = useContext(AuthContext); // Get authenticated user

  // Use ref to track the current streaming message
  const streamingMessageRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!sessionId) {
        setMessages([]);
        return;
      }

      try {
        setIsLoading(true);
        const res = await api.getChatHistory(sessionId);
        const transformedMessages = res.map(msg => ({
          id: nanoid(),
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        }));

        if (!isStreaming) {
          setMessages(transformedMessages);
          console.log("Fetched Messages:", transformedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        toast.error("Failed to load chat history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [sessionId, setMessages]);

  // Simplified uploadFile function
  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("doc_name", file.name);
      formData.append("session_id", sessionId);

      // Show loading toast
      const loadingToastId = toast.loading(`Uploading ${file.name}...`);

      // Use authenticated axios instance for form data
      const response = await axiosWithAuthFormData().post(
        "/validate/Contents/addFile",  
        formData
      );

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success(`${file.name} uploaded successfully!`);

      // Add a clean message only after successful upload
      const attachmentMessage = {
        id: nanoid(),
        role: "user",
        content: `[Attachment] ${file.name}`,
        attachment: {
          type: "pdf",
          name: file.name,
          status: "success",
        },
      };

      // Add the message to the chat
      setMessages(draft => [...draft, attachmentMessage]);

      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || error.message;
      toast.error(`Upload failed: ${errorMessage}`);
      console.error("File upload error:", error);
      return false;
    }
  };

  const handleSend = async (newMessage) => {
    if (!newMessage.trim() && !selectedFile) return;

    // Handle file upload first if there's a file
    if (selectedFile) {
      const uploadSuccess = await uploadFile(selectedFile);
      setSelectedFile(null);
      
      // If no text message and upload was handled, we're done
      if (!newMessage.trim()) {
        return;
      }
    }

    // Handle text message if there is one
    if (newMessage.trim()) {
      // Add user message
      const userMessage = {
        id: nanoid(),
        role: "user",
        content: newMessage,
      };

      setMessages(draft => [...draft, userMessage]);

      // Handle AI response
      const assistantMessageId = nanoid();
      const assistantMessage = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        loading: true,
        isStreaming: true
      };

      streamingMessageRef.current = assistantMessage;
      setMessages(draft => [...draft, assistantMessage]);

      try {
        setIsStreaming(true);
        const stream = await api.sendChatMessage(sessionId, newMessage);
        let rawAccumulatedResponse = "";
        let codeBlockState = { inBlock: false, lang: "" };

        for await (const chunk of parseSSEStream(stream)) {
          try {
            const parsedChunk = JSON.parse(chunk);
            if (parsedChunk.error) {
              throw new Error(parsedChunk.error);
            }

            const token = parsedChunk.content || "";
            if (token) {
              console.log("Received token:", token);
              rawAccumulatedResponse += token;
              codeBlockState = trackCodeBlockState(token, codeBlockState);

              setMessages(draft => {
                const messageIndex = draft.findIndex(msg => msg.id === assistantMessageId);
                if (messageIndex !== -1) {
                  draft[messageIndex] = {
                    ...draft[messageIndex],
                    content: rawAccumulatedResponse,
                    loading: true,
                    isStreaming: true
                  };
                }
              });
            }
          } catch (parseError) {
            console.error("Error parsing SSE chunk:", parseError, { chunk });
          }
        }

        // Final update
        setMessages(draft => {
          const messageIndex = draft.findIndex(msg => msg.id === assistantMessageId);
          if (messageIndex !== -1) {
            draft[messageIndex] = {
              ...draft[messageIndex],
              content: rawAccumulatedResponse,
              loading: false,
              isStreaming: false
            };
          }
        });
      } catch (err) {
        console.error("Error during chat:", err);
        toast.error(`Chat error: ${err.message}`);

        setMessages(draft => {
          const messageIndex = draft.findIndex(msg => msg.id === assistantMessageId);
          if (messageIndex !== -1) {
            draft[messageIndex] = {
              ...draft[messageIndex],
              content: `Error: ${err.message}`,
              loading: false,
              error: true,
              isStreaming: false
            };
          }
        });
      } finally {
        setIsStreaming(false);
        streamingMessageRef.current = null;
      }
    }

    setInputText("");
  };

  const handleAttachType = (type) => {
    switch (type) {
      case "repository":
        setShowRepositoryPopup(true);
        break;
      case "website":
        setShowUrlPopup(true);
        break;
      case "pdf":
        document.getElementById("pdf-upload")?.click();
        break;
      default:
        console.warn(`Unknown attachment type: ${type}`);
        break;
    }
  };

  const handleFileUpload = (file) => {
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size exceeds 25MB limit");
      return;
    }

    setSelectedFile(file);
  };

  const handleRepositorySubmit = async (url) => {
    try {
      const userMessageContent = `[Repository Link] ${url}`;
      const userMessage = {
        id: nanoid(),
        role: "user",
        content: userMessageContent,
        attachment: {
          type: "repository",
          url: url,
        },
      };

      setMessages(draft => [...draft, userMessage]);
      toast.success("Repository link added successfully!");
    } catch (error) {
      console.error("Error adding repository:", error);
      toast.error("Failed to add repository link");
    }
  };

  const handleUrlSubmit = async (url) => {
    try {
      const userMessageContent = `[Website URL] ${url}`;
      const userMessage = {
        id: nanoid(),
        role: "user",
        content: userMessageContent,
        attachment: {
          type: "website",
          url: url,
        },
      };

      setMessages(draft => [...draft, userMessage]);
      toast.success("Website URL added successfully!");
    } catch (error) {
      console.error("Error adding website URL:", error);
      toast.error("Failed to add website URL");
    }
  };

  const closeAllPopups = () => {
    setShowAttachmentPopup(false);
    setShowRepositoryPopup(false);
    setShowUrlPopup(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 p-4 relative">
      <div className="h-full flex flex-col pb-20">
        <ChatbotName />

        <div className="flex-1 overflow-y-auto space-y-4 py-4 mt-24">
          {isLoading ? (
            <LoadingAnimation />
          ) : (
            <ChatMessages messages={messages} isLoading={isLoading} />
          )}
        </div>

        <div className="mt-auto">
          <ChatInput
            onSend={handleSend}
            onAttachClick={() => setShowAttachmentPopup(true)}
            selectedFile={selectedFile}
            onRemoveFile={() => setSelectedFile(null)}
            inputText={inputText}
            setInputText={setInputText}
          />
        </div>

        <input
          type="file"
          id="pdf-upload"
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files?.[0])}
        />

        <AttachmentPopup
          isOpen={showAttachmentPopup}
          onClose={() => setShowAttachmentPopup(false)}
          onAttachTypeSelect={handleAttachType}
        />

        <RepositoryPopup
          isOpen={showRepositoryPopup}
          onClose={() => setShowRepositoryPopup(false)}
          onSubmit={handleRepositorySubmit}
          sessionId={sessionId}
        />

        <WeburlPopup
          isOpen={showUrlPopup}
          onClose={() => setShowUrlPopup(false)}
          onSubmit={handleUrlSubmit}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
};

export default ChatWindow;