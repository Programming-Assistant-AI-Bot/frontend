import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import NewChatWindow from "./NewChatWindow";

function Homepage() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isCreatingSession, setIsCreatingSession] = useState(true); // Default to true
  const [refreshSessions, setRefreshSessions] = useState(false);
  const [initialQuery, setInitialQuery] = useState("");
  const [initialFile, setInitialFile] = useState(null);

  const handleSessionCreated = (sessionId, query, file = null) => {
    setSelectedSessionId(sessionId);
    setIsCreatingSession(false);
    setRefreshSessions(true);
    setInitialQuery(query);
    setInitialFile(file);
  };

  const handleCreateSession = () => {
    setIsCreatingSession(true);
    setSelectedSessionId(null);
    // Clear any previous data
    setInitialQuery("");
    setInitialFile(null);
  };

  const handleCancelCreateSession = () => {
    setIsCreatingSession(false);
  };

  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId);
    // If sessionId is null, we should show the NewChatWindow
    setIsCreatingSession(sessionId === null);
    // Reset initial values
    setInitialQuery("");
    setInitialFile(null);
  };

  // Force UI to show NewChatWindow when no session is selected
  useEffect(() => {
    if (selectedSessionId === null) {
      setIsCreatingSession(true);
    }
  }, [selectedSessionId]);

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/5 h-full">
        <SideBar
          onSessionSelect={handleSessionSelect}
          onSessionCreated={handleSessionCreated}
          onCreateSession={handleCreateSession}
          refreshSessions={refreshSessions}
          setRefreshSessions={setRefreshSessions}
          activeSession={selectedSessionId}
        />
      </div>
      <div className="w-4/5 h-full">
        {isCreatingSession || !selectedSessionId ? (
          <NewChatWindow
            onSessionCreated={handleSessionCreated}
            onCancel={handleCancelCreateSession}
            key="new-chat-window" // Add key to force remount
          />
        ) : (
          <ChatWindow 
            sessionId={selectedSessionId} 
            initialQuery={initialQuery}
            initialFile={initialFile}
            key={selectedSessionId} // Ensure proper remounting
          />
        )}
      </div>
    </div>
  );
}

export default Homepage;