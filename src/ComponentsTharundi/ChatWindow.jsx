import React, { useState, useEffect } from "react";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatbotName from "./ChatbotName.jsx";
import AttachmentPopup from "./AttachmentPopup.jsx";
import WeburlPopup from "./WeburlPopup.jsx";
import RepositoryPopup from "./RepositoryPopup.jsx";
import { toast } from "sonner";
import axios from "axios";

const ChatWindow = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
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
          const res = await axios.get(
            `http://localhost:8000/chatHistory/${sessionId}`
          );
          
          // Transform API response to match component format
          const transformedMessages = res.data.map(msg => ({
            sender: msg.role === 'assistant' ? 'bot' : 'user',
            text: msg.content
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
        // Reset messages when no session is selected
        setMessages([]);
      }
    };
    
    fetchMessages();
  }, [sessionId]);

  const handleSend = async (newMessage) => {
    if (!newMessage.trim() && !selectedFile) return;

    // Add user message to UI immediately
    const userMessage = {
      sender: "user",
      text: newMessage,
      ...(selectedFile && {
        attachment: {
          type: "pdf",
          name: selectedFile.name,
          status: "uploading",
        },
      }),
    };

    setMessages(prev => [...prev, userMessage]);

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

        // Update message status
        setMessages(prev => prev.map(msg => 
          msg === userMessage ? {
            ...msg,
            attachment: {
              ...msg.attachment,
              status: "success",
              link: data.fileLocationLink,
            }
          } : msg
        ));
      } catch (error) {
        const errorMessage = error.response?.data?.detail || error.message;
        toast.error(`Upload failed: ${errorMessage}`);

        setMessages(prev => prev.map(msg => 
          msg === userMessage ? {
            ...msg,
            attachment: {
              ...msg.attachment,
              status: "error",
            }
          } : msg
        ));
      } finally {
        setSelectedFile(null);
      }
    }

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        sender: "bot",
        text: "Processing your request...",
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 1000);

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
    setMessages([
      ...messages,
      {
        sender: "user",
        text: `[Repository Link] ${url}`,
        attachment: {
          type: "repository",
          url: url,
        },
      },
    ]);
    setShowRepositoryPopup(false);
  };

  const handleUrlSubmit = (url) => {
    setMessages([
      ...messages,
      {
        sender: "user",
        text: `[Website URL] ${url}`,
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
        
        <div className="flex-1 overflow-y-auto space-y-6 py-4 mt-24">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : messages.length > 0 ? (
            messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <div className="text-lg mb-2">No messages yet</div>
              <div className="text-sm">Start a conversation with Archelon</div>
            </div>
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













// import { useState, useEffect } from "react";
// import ChatMessage from "./ChatMessage.jsx";
// import ChatInput from "./ChatInput.jsx";
// import ChatbotName from "./ChatbotName.jsx";
// import AttachmentPopup from "./AttachmentPopup.jsx";
// import WeburlPopup from "./WeburlPopup.jsx";
// import RepositoryPopup from "./RepositoryPopup.jsx";
// import { toast } from "sonner";
// // import { PdfNamePopup } from "./PdfNamePopup.jsx";
// import axios from "axios";

// const ChatWindow = ({ sessionId }) => {
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hello! How can I assist you?" },
//   ]);
//   const [showAttachmentPopup, setShowAttachmentPopup] = useState(false);
//   const [showRepositoryPopup, setShowRepositoryPopup] = useState(false);
//   const [showUrlPopup, setShowUrlPopup] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [inputText, setInputText] = useState("");
//   const [sessionMessages, setSessionMessages] = useState([]);

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (sessionId) {
//         const res = await axios.get(
//           `http://localhost:8000/chatHistory/${sessionId}`
//         );
//         console.log(res.data);
//       }
//     };
//     const messages = fetchMessages();
//     setSessionMessages(messages);
//   }, [sessionId]);
//   // const [showPdfNamePopup, setShowPdfNamePopup] = useState(false);

//   // const handleSend = (newMessage) => {
//   //   if (!newMessage.trim()) return;
//   //   setMessages([...messages, { sender: "user", text: newMessage }]);

//   //   // Simulated bot response
//   //   setTimeout(() => {
//   //     setMessages((prev) => [
//   //       ...prev,
//   //       { sender: "bot", text: "Processing your request..." },
//   //     ]);
//   //   }, 1000);
//   // };

//   const handleSend = async (newMessage) => {
//     if (!newMessage.trim() && !selectedFile) return;

//     // Create temporary message with loading state
//     const tempMessage = {
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

//     setMessages((prev) => [...prev, tempMessage]);

//     // Handle file upload if exists
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

//         // Update message with success status
//         setMessages((prev) =>
//           prev.map((msg) => {
//             if (msg.attachment?.name === selectedFile.name) {
//               return {
//                 ...msg,
//                 attachment: {
//                   ...msg.attachment,
//                   status: "success",
//                   link: data.fileLocationLink,
//                 },
//               };
//             }
//             return msg;
//           })
//         );
//       } catch (error) {
//         const errorMessage = error.response?.data?.detail || error.message;
//         toast.error(`Upload failed: ${errorMessage}`);

//         // Update message with error status
//         setMessages((prev) =>
//           prev.map((msg) => {
//             if (msg.attachment?.name === selectedFile.name) {
//               return {
//                 ...msg,
//                 attachment: {
//                   ...msg.attachment,
//                   status: "error",
//                 },
//               };
//             }
//             return msg;
//           })
//         );
//       } finally {
//         setSelectedFile(null);
//       }
//     }

//     // Simulated bot response
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Processing your request..." },
//       ]);
//     }, 1000);

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

//   // const handleFileUpload = (file) => {
//   //   if (file) {
//   //     if (file.size > 25 * 1024 * 1024) {
//   //       alert("File size exceeds 25MB limit");
//   //       return;
//   //     }
//   //     setMessages([...messages, {
//   //       sender: "user",
//   //       text: `[PDF Attachment] ${file.name}`,
//   //       attachment: {
//   //         type: "pdf",
//   //         name: file.name,
//   //         size: file.size
//   //       }
//   //     }]);
//   //   }
//   // };

//   const handleFileUpload = (file) => {
//     if (file) {
//       if (file.size > 25 * 1024 * 1024) {
//         toast.error("File size exceeds 25MB limit");
//         return;
//       }
//       setSelectedFile(file);
//       setInputText(); // Pre-fill input with upload status
//     }
//   };

//   const handleRepositorySubmit = (url) => {
//     setMessages([
//       ...messages,
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
//     setMessages([
//       ...messages,
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

//   const handlePdfSubmit = async (docName) => {
//     if (!selectedFile) return;

//     const formData = new FormData();
//     formData.append("file", selectedFile);
//     formData.append("doc_name", selectedFile.name);

//     try {
//       setMessages((prev) => [
//         ...prev,
//         {
//           sender: "user",
//           // text: `[PDF Upload] ${selectedFile.name}`,
//           attachment: {
//             type: "pdf",
//             name: selectedFile.name,
//             status: "uploading",
//           },
//         },
//       ]);

//       // Axios version
//       const response = await axios.post(
//         "http://localhost:8000/session/addFile",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       // No need for response.ok check with axios - successful responses come here
//       const data = response.data;
//       toast.success("Document uploaded successfully!");

//       setMessages((prev) =>
//         prev.map((msg) => {
//           if (msg.attachment?.name === selectedFile.name) {
//             return {
//               ...msg,
//               attachment: {
//                 ...msg.attachment,
//                 status: "success",
//                 link: data.fileLocationLink,
//               },
//             };
//           }
//           return msg;
//         })
//       );
//     } catch (error) {
//       // Handle axios errors
//       const errorMessage = error.response?.data?.detail || error.message;
//       toast.error(`Upload failed: ${errorMessage}`);

//       setMessages((prev) =>
//         prev.map((msg) => {
//           if (msg.attachment?.name === selectedFile.name) {
//             return {
//               ...msg,
//               attachment: {
//                 ...msg.attachment,
//                 status: "error",
//               },
//             };
//           }
//           return msg;
//         })
//       );
//     } finally {
//       setSelectedFile(null);
//       setShowPdfNamePopup(false);
//     }
//   };

//   return (
//     <div className="flex flex-col h-full w-full bg-[#25003E] p-4 relative">
//       {sessionId ? (
//         <div className="">
//           <ChatbotName />

//           <div className="flex-1 overflow-y-auto space-y-4 mt-24">
//             {messages.map((msg, index) => (
//               <ChatMessage key={index} message={msg} />
//             ))}
//           </div>

//           {/* <ChatInput
//         onSend={handleSend}
//         onAttachClick={() => setShowAttachmentPopup(true)}
//       /> */}

//           <ChatInput
//             onSend={handleSend}
//             onAttachClick={() => setShowAttachmentPopup(true)}
//             selectedFile={selectedFile}
//             onRemoveFile={() => setSelectedFile(null)}
//             inputText={inputText}
//             setInputText={setInputText}
//           />

//           <input
//             type="file"
//             id="pdf-upload"
//             accept=".pdf"
//             className="hidden"
//             onChange={(e) => handleFileUpload(e.target.files[0])}
//           />

//           <AttachmentPopup
//             isOpen={showAttachmentPopup}
//             onClose={() => setShowAttachmentPopup(false)}
//             onAttachTypeSelect={handleAttachType}
//           />

//           <RepositoryPopup
//             isOpen={showRepositoryPopup}
//             onClose={() => setShowRepositoryPopup(false)}
//             onSubmit={handleRepositorySubmit}
//           />

//           <WeburlPopup
//             isOpen={showUrlPopup}
//             onClose={() => setShowUrlPopup(false)}
//             onSubmit={handleUrlSubmit}
//           />

//           {/* <PdfNamePopup
//         isOpen={showPdfNamePopup}
//         onClose={() => {
//           setShowPdfNamePopup(false);
//           setSelectedFile(null);
//         }}
//         onSubmit={handlePdfSubmit}
//       /> */}
//         </div>
//       ) : (
//         <div className="text-white flex justify-center items-center h-[100vh]">
//           Please select a session
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatWindow;
