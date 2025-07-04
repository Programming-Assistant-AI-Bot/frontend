import React, { useState, useEffect } from "react";
import SideBar from "./SideBar";
import ChatWindow from "./ChatWindow";
import NewChatWindow from "./NewChatWindow";

function Homepage() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [refreshSessions, setRefreshSessions] = useState(false);

  const handleSessionCreated = (sessionId) => {
    setSelectedSessionId(sessionId); // Select the newly created session
    setIsCreatingSession(false); // Switch back to ChatWindow
    setRefreshSessions(true); // Trigger Sidebar to refresh sessions
  };

  const handleCreateSession = () => {
    setIsCreatingSession(true); // Show NewChatWindow
    setSelectedSessionId(null); // Clear selected session
  };

  const handleCancelCreateSession = () => {
    setIsCreatingSession(false); // Switch back to ChatWindow
  };

  const handleSessionSelect = (sessionId) => {
    setSelectedSessionId(sessionId); // Select the session
    setIsCreatingSession(false); // Ensure NewChatWindow is hidden
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


// import React, { useState } from "react";
// import SideBar from "./SideBar";
// import ChatWindow from "./ChatWindow";

// function Homepage() {
//   const [selectedSessionId, setSelectedSessionId] = useState(null);

//   const handleSessionCreated = (sessionId) => {
//     setSelectedSessionId(sessionId); // Select the newly created session
//   };

//   return (
//     <div className="flex w-full h-screen">
//       <div className="w-1/5 h-full">
//         <SideBar 
//           onSessionSelect={setSelectedSessionId} 
//           onSessionCreated={handleSessionCreated}
//         />
//       </div>
//       <div className="w-4/5 h-full">
//       \
//         <ChatWindow sessionId={selectedSessionId} />
//       </div>
//     </div>
//   );
// }

// export default Homepage;



// import React, { useState } from "react";
// import SideBar from "./SideBar";
// import ChatWindow from "./Chatwindow";

// function Homepage() {
//   const [selectedSessionId, setSelectedSessionId] = useState(null);

//   return (
//     <div className="flex w-full h-screen">
//       <div className="w-1/5 h-full">
//         <SideBar onSessionSelect={setSelectedSessionId} />
//       </div>

//       <div className="w-4/5 h-full">
//         <ChatWindow sessionId={selectedSessionId} />
//       </div>
//     </div>
//   );
// }

// export default Homepage;
