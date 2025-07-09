import React, { useState } from "react";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import NewChatWindow from "./NewChatWindow";

function Homepage() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [refreshSessions, setRefreshSessions] = useState(false);

  const handleSessionCreated = (sessionId, query) => {
    setSelectedSessionId(sessionId);
    setIsCreatingSession(false);
    setRefreshSessions(true);
  };

  const handleCreateSession = () => {
    setIsCreatingSession(true);
    setSelectedSessionId(null);
  };

  const handleCancelCreateSession = () => {
    setIsCreatingSession(false);
  };

  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
    setIsCreatingSession(false);
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/5 h-full">
        <SideBar
          onSessionSelect={handleSessionSelect}
          onSessionCreated={handleSessionCreated}
          onCreateSession={handleCreateSession}
          refreshSessions={refreshSessions}
          setRefreshSessions={setRefreshSessions}
        />
      </div>
      <div className="w-4/5 h-full">
        {isCreatingSession || !selectedSessionId ? (
          <NewChatWindow
            onSessionCreated={handleSessionCreated}
            onCancel={handleCancelCreateSession}
          />
        ) : (
          <ChatWindow sessionId={selectedSessionId} />
        )}
      </div>
    </div>
  );
}

export default Homepage;