// import { useState } from "react";
// import { ArrowUpCircle, Paperclip } from "lucide-react";
// import AttachmentPopup from "./AttachmentPopup";

// const ChatInput = ({ onSend }) => {
//   const [input, setInput] = useState("");

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     onSend(input);
//     setInput(""); // Clear input after sending
//   };

//   const [showAttachPopup, setShowAttachPopup] = useState(false);

//   return (
//     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center w-3/5 h-18 bg-[#392748] p-3 rounded-lg gap-3 shadow-md">
//       <input
//         type="text"
//         className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
//         placeholder="Ask Archelon..."
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />
//       <button onClick={() => setShowAttachPopup(true)}>
//         <Paperclip className="w-6 h-6 text-gray-300 hover:text-white" />
//       </button>

//       <AttachmentPopup
//         isOpen={showAttachPopup}
//         onClose={() => setShowAttachPopup(false)}
//       />

//       <button onClick={sendMessage} className="text-gray-300 hover:text-white">
//         <ArrowUpCircle className="w-7 h-7" />
//       </button>
//     </div>
//   );
// };

// export default ChatInput;

// import { useState } from "react";
// import { ArrowUpCircle, Paperclip } from "lucide-react";

// const ChatInput = ({ onSend, onAttachClick }) => {
//     const [input, setInput] = useState("");

//     const sendMessage = () => {
//         if (!input.trim()) return;
//         onSend(input);
//         setInput("");
//     };

//     return (
//         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center w-3/5 h-18 bg-[#392748] p-3 rounded-lg gap-3 shadow-md">
//             <input
//                 type="text"
//                 className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
//                 placeholder="Ask Archelon..."
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//             />

//             <button onClick={onAttachClick}>
//                 <Paperclip className="w-6 h-6 text-gray-300 hover:text-white" />
//             </button>

//             <button onClick={sendMessage} className="text-gray-300 hover:text-white">
//                 <ArrowUpCircle className="w-7 h-7" />
//             </button>
//         </div>
//     );
// };

// export default ChatInput;

// import { useState, useRef, useEffect } from "react";
// import { ArrowUpCircle, Paperclip } from "lucide-react";

// const ChatInput = ({
//   onSend,
//   onAttachClick,
//   selectedFile,
//   onRemoveFile,
//   inputText,
//   setInputText,
// }) => {
//   const [input, setInput] = useState("");
//   const textareaRef = useRef(null);
//   const MAX_HEIGHT = 144; // Increased from 120 to 144px (about 6 lines)

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       const newHeight = Math.min(textareaRef.current.scrollHeight, MAX_HEIGHT);
//       textareaRef.current.style.height = `${newHeight}px`;
//     }
//   }, [input]);

//   const handleInput = (e) => {
//     setInput(e.target.value);
//   };

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     onSend(input);
//     setInput("");
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//     }
//   };

//   return (
//     <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center w-3/5 bg-[#392748] p-3 rounded-lg gap-3 shadow-md">
//       {selectedFile && (
//         <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-3/5 bg-[#392748] p-3 rounded-lg flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Paperclip className="h-4 w-4" />
//             <span className="text-sm truncate">{selectedFile.name}</span>
//           </div>
//           <button
//             onClick={onRemoveFile}
//             className="text-red-400 hover:text-red-300"
//           >
//             <X className="h-4 w-4" />
//           </button>
//         </div>
//       )}

//       <textarea
//         ref={textareaRef}
//         className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent max-h-36"
//         placeholder="Ask Archelon..."
//         value={input}
//         onChange={handleInput}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//           }
//         }}
//         style={{
//           minHeight: "24px", // Reduced from 44px
//           lineHeight: "1.2rem", // Tighter line spacing
//           padding: "6px 0", // Reduced vertical padding
//         }}
//       />

//       <div className="flex-col space-x-2">
//         <button
//           onClick={onAttachClick}
//           className="text-gray-300 hover:text-white transition-colors"
//         >
//           <Paperclip className="w-6 h-6" />
//         </button>

//         <button
//           onClick={sendMessage}
//           className="text-gray-300 hover:text-white transition-colors"
//         >
//           <ArrowUpCircle className="w-7 h-7" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatInput;


import { useState, useRef, useEffect } from "react";
import { ArrowUpCircle, Paperclip, X } from "lucide-react"; // Added X icon import

const ChatInput = ({
  onSend,
  onAttachClick,
  selectedFile,
  onRemoveFile,
  inputText,
  setInputText,
}) => {
  const textareaRef = useRef(null);
  const MAX_HEIGHT = 144;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, MAX_HEIGHT);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputText]); // Changed to use inputText instead of input

  const sendMessage = () => {
    if (!inputText.trim() && !selectedFile) return;
    onSend(inputText);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center w-3/5 bg-[#392748] p-3 rounded-lg gap-3 shadow-md">
      {selectedFile && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-3/5 bg-[#392748] p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm truncate">{selectedFile.name}</span>
          </div>
          <button
            onClick={onRemoveFile}
            className="text-red-400 hover:text-red-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <textarea
        ref={textareaRef}
        className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent max-h-36"
        placeholder="Ask Archelon..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        style={{
          minHeight: "24px",
          lineHeight: "1.2rem",
          padding: "6px 0",
        }}
      />

      <div className="flex-col space-x-2">
        <button
          onClick={onAttachClick}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <Paperclip className="w-6 h-6" />
        </button>

        <button
          onClick={sendMessage}
          className="text-gray-300 hover:text-white transition-colors"
        >
          <ArrowUpCircle className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;