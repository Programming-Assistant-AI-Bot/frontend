import TurtleIcon from "./turtle.svg"; // Import Turtle Icon

const ChatMessage = ({ message }) => {
  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-center gap-4`}>
      {!isUser && <img src={TurtleIcon} alt="Turtle Icon" className="w-10 h-10" />} {/* Show turtle for bot */}
      <div
        className={`px-4 py-2 rounded-lg max-w-xs text-white ${
          isUser ? "bg-[#6C2BD9]" : "bg-[#1E3A8A]"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default ChatMessage;
