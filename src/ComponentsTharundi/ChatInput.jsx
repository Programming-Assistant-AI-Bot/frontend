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

import { useState } from "react";
import { ArrowUpCircle, Paperclip } from "lucide-react";

const ChatInput = ({ onSend, onAttachClick }) => {
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    return (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center w-3/5 h-18 bg-[#392748] p-3 rounded-lg gap-3 shadow-md">
            <input
                type="text"
                className="flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none text-lg"
                placeholder="Ask Archelon..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            
            <button onClick={onAttachClick}>
                <Paperclip className="w-6 h-6 text-gray-300 hover:text-white" />
            </button>
            
            <button onClick={sendMessage} className="text-gray-300 hover:text-white">
                <ArrowUpCircle className="w-7 h-7" />
            </button>
        </div>
    );
};

export default ChatInput;