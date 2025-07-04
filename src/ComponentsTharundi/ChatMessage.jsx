import TurtleIcon from "./turtle.svg";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Upload, User } from "lucide-react";
import DOMPurify from "dompurify";

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  const renderAttachment = () => {
    if (!message.attachment) return null;

    const { type, name, status, link, url } = message.attachment;

    return (
      <div className="flex items-center gap-2 mt-2 p-2 bg-white/10 rounded-lg max-w-md">
        {type === "pdf" ? (
          <>
            <Upload className="h-4 w-4 text-purple-300" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">{name}</div>
              {status === "uploading" && (
                <div className="flex items-center gap-2">
                  <Progress value={0} className="w-24 h-2 bg-gray-700" />
                  <span className="text-xs text-gray-300">Uploading...</span>
                </div>
              )}
              {status === "success" && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  View Document
                </a>
              )}
              {status === "error" && (
                <div className="text-sm text-red-400 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Upload failed
                </div>
              )}
            </div>
          </>
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:text-blue-300 transition"
          >
            {type === "repository" ? "View Repository" : "Visit Website"}
          </a>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-3xl w-full flex ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="flex-shrink-0 mx-2">
          {isUser ? (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
          ) : (
            <img
              src={TurtleIcon}
              alt="Archelon AI"
              className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full p-1.5"
            />
          )}
        </div>
        <div className={`rounded-2xl px-4 py-3 ${isUser ? "bg-[#4e0363] rounded-tr-none" : "bg-[#741e8a] rounded-tl-none"}`}>
          <div className={`text-white ${isUser ? "text-right" : ""}`}>
            {isUser ? (
              message.text.split("\n").map((paragraph, i) => <p key={i} className="mb-2 last:mb-0">{paragraph}</p>)
            ) : (
              <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message.text) }} />
            )}
          </div>
          {renderAttachment()}
          {message.loading && <div className="text-gray-300 text-sm mt-2">Loading...</div>}
          {message.error && <div className="text-red-400 text-sm mt-2">Error generating response</div>}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;




// import TurtleIcon from "./turtle.svg";
// import { Progress } from "@/components/ui/progress";
// import { CheckCircle2, AlertCircle, Upload, User } from "lucide-react";

// const ChatMessage = ({ message }) => {
//   const isUser = message.sender === "user";
  
//   const renderAttachment = () => {
//     if (!message.attachment) return null;
    
//     const { type, name, status, link } = message.attachment;
    
//     return (
//       <div className="flex items-center gap-2 mt-2 p-2 bg-white/10 rounded-lg max-w-md">
//         <Upload className="h-4 w-4 text-purple-300" />
//         <div className="flex-1">
//           <div className="text-sm font-medium text-white">{name}</div>
//           {status === "uploading" && (
//             <div className="flex items-center gap-2">
//               <Progress value={0} className="w-24 h-2 bg-gray-700" />
//               <span className="text-xs text-gray-300">Uploading...</span>
//             </div>
//           )}
//           {status === "success" && (
//             <a
//               href={link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
//             >
//               <CheckCircle2 className="h-4 w-4" />
//               View Document
//             </a>
//           )}
//           {status === "error" && (
//             <div className="text-sm text-red-400 flex items-center gap-1">
//               <AlertCircle className="h-4 w-4" />
//               Upload failed
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
//       <div className={`max-w-3xl w-full flex ${isUser ? "flex-row-reverse" : ""}`}>
//         {/* Avatar */}
//         <div className="flex-shrink-0 mx-2">
//           {isUser ? (
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
//               <User className="h-5 w-5 text-white" />
//             </div>
//           ) : (
//             <img 
//               src={TurtleIcon} 
//               alt="Archelon AI" 
//               className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-full p-1.5" 
//             />
//           )}
//         </div>
        
//         {/* Message Content */}
//         <div className={`rounded-2xl px-4 py-3 ${isUser ? "bg-[#4e0363] rounded-tr-none" : "bg-[#741e8a] rounded-tl-none"}`}>
//           <div className={`text-white ${isUser ? "text-right" : ""}`}>
//             {message.text.split('\n').map((paragraph, i) => (
//               <p key={i} className="mb-2 last:mb-0">{paragraph}</p>
//             ))}
//           </div>
//           {renderAttachment()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatMessage;




// import TurtleIcon from "./turtle.svg"; // Import Turtle Icon
// import { Progress } from "@/components/ui/progress";
// import { CheckCircle2, AlertCircle, Upload } from "lucide-react";


// const ChatMessage = ({ message }) => {
//   const isUser = message.sender === "user";
//   const renderAttachment = () => {
//     if (!message.attachment) return null;
    
//     const { type, name, status, link } = message.attachment;
    
//     return (
//       <div className="flex items-center gap-2 mt-2 p-2 bg-white/10 rounded-lg">
//         <Upload className="h-4 w-4" />
//         <div className="flex-1">
//           <div className="text-sm font-medium">{name}</div>
//           {status === "uploading" && (
//             <div className="flex items-center gap-2">
//               <Progress value={0} className="w-24 h-2" />
//               <span className="text-xs">Uploading...</span>
//             </div>
//           )}
//           {status === "success" && (
//             <a
//               href={link}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-sm text-blue-400 hover:underline flex items-center gap-1"
//             >
//               <CheckCircle2 className="h-4 w-4" />
//               View in Drive
//             </a>
//           )}
//           {status === "error" && (
//             <div className="text-sm text-red-400 flex items-center gap-1">
//               <AlertCircle className="h-4 w-4" />
//               Upload failed
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };


//   return (
//     <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-center gap-4`}>
//       {!isUser && <img src={TurtleIcon} alt="Turtle Icon" className="w-10 h-10" />} {/* Show turtle for bot */}
//       <div
//         className={`px-4 py-2 rounded-lg max-w-xs text-white ${
//           isUser ? "bg-[#4e0363]" : "bg-[#741e8a]"
//         }`}
//       >
//         {message.text}
//       </div>
//       {renderAttachment()}
//     </div>
//   );
// };

// export default ChatMessage;
