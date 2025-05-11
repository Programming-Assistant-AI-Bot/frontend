import TurtleIcon from "./turtle.svg"; // Import Turtle Icon
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, Upload } from "lucide-react";


const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";
  const renderAttachment = () => {
    if (!message.attachment) return null;
    
    const { type, name, status, link } = message.attachment;
    
    return (
      <div className="flex items-center gap-2 mt-2 p-2 bg-white/10 rounded-lg">
        <Upload className="h-4 w-4" />
        <div className="flex-1">
          <div className="text-sm font-medium">{name}</div>
          {status === "uploading" && (
            <div className="flex items-center gap-2">
              <Progress value={0} className="w-24 h-2" />
              <span className="text-xs">Uploading...</span>
            </div>
          )}
          {status === "success" && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:underline flex items-center gap-1"
            >
              <CheckCircle2 className="h-4 w-4" />
              View in Drive
            </a>
          )}
          {status === "error" && (
            <div className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Upload failed
            </div>
          )}
        </div>
      </div>
    );
  };


  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-center gap-4`}>
      {!isUser && <img src={TurtleIcon} alt="Turtle Icon" className="w-10 h-10" />} {/* Show turtle for bot */}
      <div
        className={`px-4 py-2 rounded-lg max-w-xs text-white ${
          isUser ? "bg-[#4e0363]" : "bg-[#741e8a]"
        }`}
      >
        {message.text}
      </div>
      {renderAttachment()}
    </div>
  );
};

export default ChatMessage;
