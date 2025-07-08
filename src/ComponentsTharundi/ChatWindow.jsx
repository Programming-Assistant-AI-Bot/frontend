




// import React, { useState, useEffect } from "react";
// import ChatMessage from "./ChatMessage.jsx";
// import ChatInput from "./ChatInput.jsx";
// import ChatbotName from "./ChatbotName.jsx";
// import AttachmentPopup from "./AttachmentPopup.jsx";
// import WeburlPopup from "./WeburlPopup.jsx";
// import RepositoryPopup from "./RepositoryPopup.jsx";
// import { toast } from "sonner";
// import axios from "axios";
// import { parseSSEStream, processMarkdown, trackCodeBlockState } from "@/utils";
// import { useImmer } from "use-immer";
// import api from "@/api/index.js";

// const ChatWindow = ({ sessionId }) => {
//   const [messages, setMessages] = useImmer([]);
//   const [showAttachmentPopup, setShowAttachmentPopup] = useState(false);
//   const [showRepositoryPopup, setShowRepositoryPopup] = useState(false);
//   const [showUrlPopup, setShowUrlPopup] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [inputText, setInputText] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (sessionId) {
//         try {
//           setIsLoading(true);
//           const res = await api.getChatHistory(sessionId);
//           const transformedMessages = res.map(msg => ({
//             sender: msg.role === "assistant" ? "bot" : "user",
//             text: msg.content,
//           }));
//           setMessages(transformedMessages);
//           console.log("Fetched Messages:", transformedMessages);
//         } catch (error) {
//           toast.error("Failed to load chat history");
//           console.error("Error fetching messages:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         setMessages([]);
//       }
//     };
//     fetchMessages();
//   }, [sessionId, setMessages]);

//   const handleSend = async (newMessage) => {
//     if (!newMessage.trim() && !selectedFile) return;

//     // Add user message to UI
//     const userMessage = {
//       sender: "user",
//       text: newMessage,
//       ...(selectedFile && {
//         attachment: {
//           type: "pdf",
//           name: selectedFile.name,
//           status: "uploading",
//         },
//       }),
//     };
//     setMessages(draft => [...draft, userMessage]);

//     // Handle file upload
//     if (selectedFile) {
//       try {
//         const formData = new FormData();
//         formData.append("file", selectedFile);
//         formData.append("doc_name", selectedFile.name);

//         const response = await axios.post(
//           "http://localhost:8000/session/addFile",
//           formData,
//           { headers: { "Content-Type": "multipart/form-data" } }
//         );

//         const data = response.data;
//         toast.success("Document uploaded successfully!");
//         setMessages(draft =>
//           draft.map(msg =>
//             msg === userMessage
//               ? {
//                   ...msg,
//                   attachment: {
//                     ...msg.attachment,
//                     status: "success",
//                     link: data.fileLocationLink,
//                   },
//                 }
//               : msg
//           )
//         );
//       } catch (error) {
//         const errorMessage = error.response?.data?.detail || error.message;
//         toast.error(`Upload failed: ${errorMessage}`);
//         setMessages(draft =>
//           draft.map(msg =>
//             msg === userMessage
//               ? {
//                   ...msg,
//                   attachment: {
//                     ...msg.attachment,
//                     status: "error",
//                   },
//                 }
//               : msg
//           )
//         );
//       } finally {
//         setSelectedFile(null);
//       }
//     }

//     // Send message to streaming endpoint
//     if (newMessage.trim()) {
//       try {
//         setMessages(draft => [
//           ...draft,
//           { sender: "bot", text: "", loading: true },
//         ]);

//         const stream = await api.sendChatMessage(sessionId, newMessage);
//         let rawAccumulatedResponse = "";
//         let codeBlockState = { inBlock: false, lang: "" };

//         for await (const chunk of parseSSEStream(stream)) {
//           try {
//             const parsedChunk = JSON.parse(chunk);
//             if (parsedChunk.error) {
//               throw new Error(parsedChunk.error);
//             }
//             const token = parsedChunk.content || "";
//             if (token) {
//               console.log("Received token:", token);
//               rawAccumulatedResponse += token;
//               codeBlockState = trackCodeBlockState(token, codeBlockState);
//               const processedResponse = processMarkdown(rawAccumulatedResponse);
//               setMessages(draft => {
//                 draft[draft.length - 1].text = processedResponse;
//               });
//             }
//           } catch (parseError) {
//             console.error("Error parsing SSE chunk:", parseError, chunk);
//           }
//         }

//         setMessages(draft => {
//           draft[draft.length - 1].text = processMarkdown(rawAccumulatedResponse);
//           draft[draft.length - 1].loading = false;
//         });
//       } catch (err) {
//         console.error("Error during chat:", err);
//         toast.error(`Chat error: ${err.message}`);
//         setMessages(draft => {
//           draft[draft.length - 1].text = `Error: ${err.message}`;
//           draft[draft.length - 1].loading = false;
//           draft[draft.length - 1].error = true;
//         });
//       }
//     }

//     setInputText("");
//   };

//   const handleAttachType = (type) => {
//     switch (type) {
//       case "repository":
//         setShowRepositoryPopup(true);
//         break;
//       case "website":
//         setShowUrlPopup(true);
//         break;
//       case "pdf":
//         document.getElementById("pdf-upload").click();
//         break;
//       default:
//         break;
//     }
//   };

//   const handleFileUpload = (file) => {
//     if (file) {
//       if (file.size > 25 * 1024 * 1024) {
//         toast.error("File size exceeds 25MB limit");
//         return;
//       }
//       setSelectedFile(file);
//     }
//   };

//   const handleRepositorySubmit = (url) => {
//     setMessages(draft => [
//       ...draft,
//       {
//         sender: "user",
//         text: `[Repository Link] ${url}`,
//         attachment: {
//           type: "repository",
//           url: url,
//         },
//       },
//     ]);
//     setShowRepositoryPopup(false);
//   };

//   const handleUrlSubmit = (url) => {
//     setMessages(draft => [
//       ...draft,
//       {
//         sender: "user",
//         text: `[Website URL] ${url}`,
//         attachment: {
//           type: "website",
//           url: url,
//         },
//       },
//     ]);
//     setShowUrlPopup(false);
//   };

//   return (
//     <div className="flex flex-col h-full w-full bg-[#25003E] p-4 relative">
//       <div className="h-full flex flex-col pb-20">
//         <ChatbotName />
//         <div className="flex-1 overflow-y-auto space-y-6 py-4 mt-24">
//           {isLoading ? (
//             <div className="flex justify-center items-center h-full">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//             </div>
//           ) : messages.length > 0 ? (
//             messages.map((msg, index) => (
//               <ChatMessage key={index} message={msg} />
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center h-full text-gray-400">
//               <div className="text-lg mb-2">No messages yet</div>
//               <div className="text-sm">Start a conversation with Archelon</div>
//             </div>
//           )}
//         </div>

//         <div className="mt-auto">
//           <ChatInput
//             onSend={handleSend}
//             onAttachClick={() => setShowAttachmentPopup(true)}
//             selectedFile={selectedFile}
//             onRemoveFile={() => setSelectedFile(null)}
//             inputText={inputText}
//             setInputText={setInputText}
//           />
//         </div>

//         <input
//           type="file"
//           id="pdf-upload"
//           accept=".pdf"
//           className="hidden"
//           onChange={(e) => handleFileUpload(e.target.files[0])}
//         />

//         <AttachmentPopup
//           isOpen={showAttachmentPopup}
//           onClose={() => setShowAttachmentPopup(false)}
//           onAttachTypeSelect={handleAttachType}
//         />

//         <RepositoryPopup
//           isOpen={showRepositoryPopup}
//           onClose={() => setShowRepositoryPopup(false)}
//           onSubmit={handleRepositorySubmit}
//         />

//         <WeburlPopup
//           isOpen={showUrlPopup}
//           onClose={() => setShowUrlPopup(false)}
//           onSubmit={handleUrlSubmit}
//         />
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;














import React, { useState, useEffect } from "react";
import ChatMessages from "./ChatMessage";
import ChatInput from "./ChatInput.jsx";
import ChatbotName from "./ChatbotName.jsx";
import AttachmentPopup from "./AttachmentPopup.jsx";
import WeburlPopup from "./WeburlPopup.jsx";
import RepositoryPopup from "./RepositoryPopup.jsx";
import { toast } from "sonner";
import axios from "axios";
import { parseSSEStream, processMarkdown, trackCodeBlockState } from "@/utils";
import { useImmer } from "use-immer";
import api from "@/api/index.js";

const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useImmer([]);
  const [showAttachmentPopup, setShowAttachmentPopup] = useState(false);
  const [showRepositoryPopup, setShowRepositoryPopup] = useState(false);
  const [showUrlPopup, setShowUrlPopup] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (sessionId) {
        try {
          setIsLoading(true);
          const res = await api.getChatHistory(sessionId);
          const transformedMessages = res.map(msg => ({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
          }));
          setMessages(transformedMessages);
          console.log("Fetched Messages:", transformedMessages);
        } catch (error) {
          toast.error("Failed to load chat history");
          console.error("Error fetching messages:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [sessionId, setMessages]);

  const handleSend = async (newMessage) => {
    if (!newMessage.trim() && !selectedFile) return;

    // Add user message to UI
    let userMessageContent = newMessage;
    let attachment = null;

    if (selectedFile) {
      attachment = {
        type: "pdf",
        name: selectedFile.name,
        status: "uploading",
      };
      userMessageContent = `${newMessage}\n[Attachment: ${selectedFile.name}]`;
    }

    const userMessage = {
      role: "user",
      content: userMessageContent,
      attachment,
    };
    setMessages(draft => [...draft, userMessage]);

    // Handle file upload
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("doc_name", selectedFile.name);

        const response = await axios.post(
          "http://localhost:8000/session/addFile",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        const data = response.data;
        toast.success("Document uploaded successfully!");
        setMessages(draft =>
          draft.map(msg =>
            msg === userMessage
              ? {
                  ...msg,
                  content: `${msg.content}\n[Attachment: ${selectedFile.name} (Uploaded)]`,
                  attachment: {
                    ...msg.attachment,
                    status: "success",
                    link: data.fileLocationLink,
                  },
                }
              : msg
          )
        );
      } catch (error) {
        const errorMessage = error.response?.data?.detail || error.message;
        toast.error(`Upload failed: ${errorMessage}`);
        setMessages(draft =>
          draft.map(msg =>
            msg === userMessage
              ? {
                  ...msg,
                  content: `${msg.content}\n[Attachment: ${selectedFile.name} (Failed)]`,
                  attachment: {
                    ...msg.attachment,
                    status: "error",
                  },
                }
              : msg
          )
        );
      } finally {
        setSelectedFile(null);
      }
    }

    // Send message to streaming endpoint
    if (newMessage.trim()) {
      try {
        setMessages(draft => [
          ...draft,
          { role: "assistant", content: "", loading: true },
        ]);

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
              const processedResponse = processMarkdown(rawAccumulatedResponse);
              setMessages(draft => {
                draft[draft.length - 1].content = processedResponse;
              });
            }
          } catch (parseError) {
            console.error("Error parsing SSE chunk:", parseError, { chunk });
          }
        }

        setMessages((draft) => {
          draft[draft.length - 1].content = processMarkdown(rawAccumulatedResponse);
          draft[draft.length - 1].loading = false;
        });
      } catch (err) {
        console.error("Error during chat:", err);
        toast.error(`Chat error: ${err.message}`);
        setMessages(draft => {
          draft[draft.length - 1].content = `Error: ${err.message}`;
          draft[draft.length - 1].loading = false;
          draft[draft.length - 1].error = true;
        });
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
        document.getElementById("pdf-upload").click();
        break;
      default:
        break;
    }
  };

  const handleFileUpload = (file) => {
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        toast.error("File size exceeds 25MB limit");
        return;
      }
      setSelectedFile(file);
    }
  };

 const handleRepositorySubmit = (url) => {
    const userMessageContent = `[Repository Link] ${url}`;
    setMessages(draft => [
      ...draft,
      {
        role: "user",
        content: userMessageContent,
        attachment: {
          type: "repository",
          url: url,
        },
      },
    ]);
    setShowRepositoryPopup(false);
  };

  const handleUrlSubmit = (url) => {
    const userMessageContent = `[Website URL] ${url}`;
    setMessages(draft => [
      ...draft,
      {
        role: "user",
        content: userMessageContent,
        attachment: {
          type: "website",
          url: url,
        },
      },
    ]);
    setShowUrlPopup(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#25003E] p-4 relative">
      <div className="h-full flex flex-col pb-20">
        <ChatbotName />
        <div className="flex-1 overflow-y-auto space-y-4 py-4 mt-24">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
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
          onChange={(e) => handleFileUpload(e.target.files[0])}
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
        />

        <WeburlPopup
          isOpen={showUrlPopup}
          onClose={() => setShowUrlPopup(false)}
          onSubmit={handleUrlSubmit}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
