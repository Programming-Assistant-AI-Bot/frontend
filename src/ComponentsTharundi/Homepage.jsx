import React, { useState } from "react";
import SideBar from "./SideBar";
import ChatWindow from "./Chatwindow";

function Homepage() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/5 h-full">
        <SideBar onSessionSelect={setSelectedSessionId} />
      </div>

      <div className="w-4/5 h-full">
        <ChatWindow sessionId={selectedSessionId} />
      </div>
    </div>
  );
}

export default Homepage;
