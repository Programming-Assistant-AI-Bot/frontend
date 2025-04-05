// import { useState } from "react";
// import ChatMessage from "./ChatMessage";
// import ChatInput from "./ChatInput.jsx";
// import ChatbotName from "./ChatbotName";

// const ChatWindow = () => {
//   const [messages, setMessages] = useState([
//     { sender: "bot", text: "Hello! How can I assist you?" },
//     { sender: "user", text: "Give me a Perl code to add two numbers." },
//     { sender: "bot", text: "Sure! Here is the code..." },
//   ]);

//   const handleSend = (newMessage) => {
//     if (!newMessage.trim()) return;
//     setMessages([...messages, { sender: "user", text: newMessage }]);

//     // Simulated bot response (Replace with API call)
//     setTimeout(() => {
//       setMessages((prev) => [
//         ...prev,
//         { sender: "bot", text: "Processing your request..." },
//       ]);
//     }, 1000);
//   };

//   return (
//     <div className="flex flex-col h-full w-full bg-[#25003E] p-4 relative">
//       {/* Chatbot Header */}
//       <ChatbotName />

//       {/* Chat Messages */}
//       <div className="flex-1 overflow-y-auto space-y-4 mt-24"> {/* Added margin for spacing */}
//         {messages.map((msg, index) => (
//           <ChatMessage key={index} message={msg} />
//         ))}
//       </div>

//       {/* Chat Input */}
//       <ChatInput onSend={handleSend} />
//     </div>
//   );
// };

// export default ChatWindow;
import { useState } from "react";
import ChatMessage from "./ChatMessage.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatbotName from "./ChatbotName.jsx";
import AttachmentPopup from "./AttachmentPopup.jsx";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you?" },
    { sender: "user", text: "Give me a Perl code to add two numbers." },
    { sender: "bot", text: "Sure! Here is the code..." },
  ]);
  const [showAttachmentPopup, setShowAttachmentPopup] = useState(false);

  const handleSend = (newMessage) => {
    if (!newMessage.trim()) return;
    setMessages([...messages, { sender: "user", text: newMessage }]);

    // Simulated bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Processing your request..." },
      ]);
    }, 1000);
  };

  const handleAttachType = (type) => {
    switch (type) {
      case "repository":
        console.log("Handle repository link attachment");
        break;
      case "website":
        console.log("Handle website URL attachment");
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
        alert("File size exceeds 25MB limit");
        return;
      }
      console.log("Uploading PDF:", file);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#25003E] p-4 relative">
      <ChatbotName />
      
      <div className="flex-1 overflow-y-auto space-y-4 mt-24">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
        ))}
      </div>

      <ChatInput
        onSend={handleSend}
        onAttachClick={() => setShowAttachmentPopup(true)}
      />

      <input
        type="file"
        id="pdf-upload"
        accept=".pdf"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />

      {/* Single AttachmentPopup with all props */}
      <AttachmentPopup
        isOpen={showAttachmentPopup}
        onClose={() => setShowAttachmentPopup(false)}
        onAttachTypeSelect={handleAttachType}
      />
    </div>
  );
};

export default ChatWindow;