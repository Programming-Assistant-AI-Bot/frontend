import { useState, useRef, useEffect } from "react";
import { Send,ArrowUpCircle, Paperclip, X } from "lucide-react";


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
  }, [inputText]);

  const sendMessage = () => {
    if (!inputText.trim() && !selectedFile) return;
    onSend(inputText);
    setInputText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center w-3/5 bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 p-3 rounded-xl gap-3 shadow-lg">
      {selectedFile && (
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-3/5 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 p-3 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-blue-400" />
            <span className="text-sm truncate text-slate-200">{selectedFile.name}</span>
          </div>
          <button
            onClick={onRemoveFile}
            className="text-red-400 hover:text-red-300 p-1 hover:bg-red-400/10 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <textarea
        ref={textareaRef}
        className="flex-1 bg-transparent text-slate-100 placeholder-slate-400 focus:outline-none resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent max-h-36"
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

      <div className="flex items-center space-x-2">
        <button
          onClick={onAttachClick}
          className="text-slate-400 hover:text-blue-400 transition-colors p-2 hover:bg-slate-700/50 rounded-lg"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <button
          onClick={sendMessage}
          className="text-slate-400 hover:text-blue-400 transition-colors p-2 hover:bg-slate-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!inputText.trim() && !selectedFile}
        >
          <Send size={18} className="text-blue-500" />
        </button>

       
      </div>
    </div>
  );
};

export default ChatInput;














// import { useState, useRef, useEffect } from "react";
// import { ArrowUpCircle, Paperclip, X } from "lucide-react"; // Added X icon import

// const ChatInput = ({
//   onSend,
//   onAttachClick,
//   selectedFile,
//   onRemoveFile,
//   inputText,
//   setInputText,
// }) => {
//   const textareaRef = useRef(null);
//   const MAX_HEIGHT = 144;

//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       const newHeight = Math.min(textareaRef.current.scrollHeight, MAX_HEIGHT);
//       textareaRef.current.style.height = `${newHeight}px`;
//     }
//   }, [inputText]); // Changed to use inputText instead of input

//   const sendMessage = () => {
//     if (!inputText.trim() && !selectedFile) return;
//     onSend(inputText);
//     setInputText("");
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
//         value={inputText}
//         onChange={(e) => setInputText(e.target.value)}
//         onKeyDown={(e) => {
//           if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//           }
//         }}
//         style={{
//           minHeight: "24px",
//           lineHeight: "1.2rem",
//           padding: "6px 0",
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