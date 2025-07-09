// import React, { useEffect, useState } from "react";
// import { PenLine, Trash, Search, Plus, LogOut } from "lucide-react";
// import axios from "axios";
// import { toast } from "sonner";

// const Sidebar = ({ onSessionSelect, onSessionCreated, onCreateSession, refreshSessions, setRefreshSessions }) => {
//   const [sessionData, setSessionData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeSession,setActiveSession] = useState(null)
//   const userId = "tharundi_lavanya"; // Replace with actual user ID (e.g., from auth context)

//   const fetchSessions = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8000/session/getAllSessions?user_id=${userId}`
//       );
//       setSessionData(response.data);
//       console.log("Fetched Sessions:", response.data);
//     } catch (error) {
//       console.error("Failed to fetch sessions:", error);
//       toast.error("Failed to fetch sessions");
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   useEffect(() => {
//     if (refreshSessions) {
//       fetchSessions();
//       setRefreshSessions(false);
//     }
//   }, [refreshSessions, setRefreshSessions]);

//   const handleCreateSession = () => {
//     onCreateSession(); // Trigger NewChatWindow in Homepage
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8000/session/deleteSession/${id}`);
//       toast.success("Session deleted");
//       fetchSessions();
//     } catch (error) {
//       toast.error("Failed to delete session");
//       console.error(error);
//     }
//   };

//   const handleRename = async (id, oldName) => {
//     const newName = prompt("Enter new session name:", oldName);
//     if (!newName || newName.trim() === "") {
//       toast.error("Session name cannot be empty");
//       return;
//     }
//     try {
//       await axios.put(
//         `http://localhost:8000/session/rename/${id}/${newName.trim()}`
//       );
//       toast.success("Session renamed");
//       await fetchSessions();
//     } catch (error) {
//       toast.error("Failed to rename session");
//       console.error(error);
//     }
//   };

//   const handleSessionCreated = (sessionId) => {
//     fetchSessions(); // Refresh session list to include the new session
//     onSessionCreated(sessionId); // Notify parent to select new session
//   };

//   const handleSessionSelect = (sessionId)=>{
//     onSessionSelect(sessionId)
//     setActiveSession(sessionId)
//   }

//   const filteredSessions = sessionData.filter((session) =>
//     session.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
//   );

// const categorizeSessions = (sessions) => {
//   const now = new Date();
//   const today = new Date(now);
//   today.setHours(0, 0, 0, 0);

//   const grouped = sessions.reduce(
//     (acc, session) => {
//       const sessionDate = new Date(session.createdAt);
//       const diffTime = today - sessionDate;
//       const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

//       if (diffDays < 1) {
//         acc.today.push(session);
//       } else if (diffDays === 1) {
//         acc.yesterday.push(session);
//       } else if (diffDays > 1 && diffDays <= 7) {
//         acc.lastWeek.push(session);
//       } else {
//         acc.weekAgo.push(session);
//       }
//       return acc;
//     },
//     { today: [], yesterday: [], lastWeek: [], weekAgo: [] }
//   );

//   // Sort each group descending by createdAt
//   for (const key in grouped) {
//     grouped[key].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );
//   }

//   return grouped;
// };

//   const groups = categorizeSessions(filteredSessions);

//   return (
//     <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-gray-900 text-white flex flex-col p-4 border-r border-slate-700/50">
//       <div className="flex items-center justify-between mb-6 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center font-bold shadow-lg">
//             TL
//           </div>
//           <div>
//             <p className="text-sm font-semibold text-slate-100">Tharundi Lavanya</p>
//             <p className="text-xs text-slate-400">Premium Plan</p>
//           </div>
//         </div>
//         <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200">
//           <LogOut size={20} className="text-slate-400 hover:text-slate-200" />
//         </button>
//       </div>

//       <div className="relative flex items-center mb-6 group">
//         <Search
//           className="absolute left-3 top-3 text-slate-400"
//           size={18}
//         />
//         <input
//           type="text"
//           placeholder="Search sessions..."
//           className="w-full p-2.5 pl-10 pr-4 bg-slate-800/50 backdrop-blur-sm rounded-xl
//                      placeholder-slate-400 text-sm focus:ring-2 focus:ring-blue-500/50
//                      border border-slate-700/50 transition-all focus:border-blue-500/50"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <button
//           className="ml-2 p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl 
//                           hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105"
//           onClick={handleCreateSession}
//         >
//           <Plus size={18} className="text-white" />
//         </button>
//       </div>

//       <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
//         {[groups.today, groups.yesterday, groups.lastWeek, groups.weekAgo].map(
//           (group, i) => {
//             const groupTitles = ["TODAY", "YESTERDAY", "LAST WEEK", "WEEK AGO"];
//             return (
//               group.length > 0 && (
//                 <div key={groupTitles[i]} className="group">
//                   <div className="flex items-center mb-3">
//                     <span className="text-xs font-semibold text-slate-400 tracking-wider">
//                       {groupTitles[i]}
//                     </span>
//                     <div className="ml-2 flex-1 h-px bg-slate-700/50 group-hover:bg-slate-600/50 transition-colors" />
//                   </div>
//                   <div className="space-y-1.5">
//                     {group.map((session) => (
//                       <div
//                         key={session.id}
//                         className="flex items-center p-2.5 rounded-lg hover:bg-slate-800/50 
//               cursor-pointer transition-colors relative group/item border border-transparent hover:border-slate-700/30"
//                         onClick={()=>handleSessionSelect(session.id)}
//                       >
//                         <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 shadow-sm" />
//                         <span className="text-sm text-slate-200">{session.sessionName}</span>
//                         <div className="ml-auto flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleRename(session.id, session.sessionName);
//                             }}
//                             aria-label="Rename session"
//                             className="p-1 hover:bg-slate-700/50 rounded transition-colors"
//                           >
//                             <PenLine
//                               size={15}
//                               className="text-slate-400 hover:text-blue-400 transition-colors"
//                             />
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               handleDelete(session.id);
//                             }}
//                             aria-label="Delete session"
//                             className="p-1 hover:bg-slate-700/50 rounded transition-colors"
//                           >
//                             <Trash
//                               size={15}
//                               className="text-slate-400 hover:text-red-400 transition-colors"
//                             />
//                           </button>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )
//             );
//           }
//         )}
//         {filteredSessions.length === 0 && searchQuery && (
//           <div className="text-center text-slate-400 py-8">
//             <Search size={48} className="mx-auto mb-3 text-slate-500" />
//             <p>No sessions found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;










import React, { useEffect, useState, useMemo } from "react";
import { PenLine, Trash, Search, Plus, LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";

const Sidebar = ({ onSessionSelect, onSessionCreated, onCreateSession, refreshSessions, setRefreshSessions }) => {
  const [sessionData, setSessionData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const userId = "tharundi_lavanya"; // Replace with actual user ID (e.g., from auth context)

  const fetchSessions = async () => {
    if (!userId) {
      toast.error("User ID is missing. Please log in.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8000/session/getAllSessions?user_id=${userId}`
      );
      setSessionData(response.data);
      console.log("Fetched Sessions:", response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Failed to fetch sessions";
      toast.error(errorMessage);
      console.error("Failed to fetch sessions:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (refreshSessions) {
      fetchSessions();
      setRefreshSessions(false);
    }
  }, [refreshSessions, setRefreshSessions]);

  const handleCreateSession = () => {
    onCreateSession(); // Trigger NewChatWindow in Homepage
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/session/deleteSession/${id}`);
      toast.success("Session deleted");
      if (activeSession === id) {
        setActiveSession(null);
        onSessionSelect(null); // Clear active session
      }
      fetchSessions();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Failed to delete session";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleRename = async (id, oldName) => {
    const newName = prompt("Enter new session name:", oldName);
    if (!newName || newName.trim() === "") {
      toast.error("Session name cannot be empty");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8000/session/rename/${id}/${newName.trim()}`
      );
      toast.success("Session renamed");
      await fetchSessions();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Failed to rename session";
      toast.error(errorMessage);
      console.error(error);
    }
  };

  const handleSessionSelect = (sessionId) => {
    setActiveSession(sessionId);
    onSessionSelect(sessionId);
  };

  const filteredSessions = sessionData.filter((session) =>
    session.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categorizeSessions = useMemo(() => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const grouped = filteredSessions.reduce(
      (acc, session) => {
        const sessionDate = new Date(session.createdAt);
        const diffTime = today - sessionDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) {
          acc.today.push(session);
        } else if (diffDays === 1) {
          acc.yesterday.push(session);
        } else if (diffDays > 1 && diffDays <= 7) {
          acc.lastWeek.push(session);
        } else {
          acc.weekAgo.push(session);
        }
        return acc;
      },
      { today: [], yesterday: [], lastWeek: [], weekAgo: [] }
    );

    // Sort each group descending by createdAt
    for (const key in grouped) {
      grouped[key].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return grouped;
  }, [filteredSessions]);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-slate-900 to-gray-900 text-white flex flex-col p-4 border-r border-slate-700/50">
      <div className="flex items-center justify-between mb-6 p-3 bg-slate-800/50 rounded-xl border border-slate-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center font-bold shadow-lg">
            TL
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">Tharundi Lavanya</p>
            <p className="text-xs text-slate-400">Premium Plan</p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200">
          <LogOut size={20} className="text-slate-400 hover:text-slate-200" />
        </button>
      </div>

      <div className="relative flex items-center mb-6 group">
        <Search
          className="absolute left-3 top-3 text-slate-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search sessions..."
          aria-label="Search sessions"
          className="w-full p-2.5 pl-10 pr-4 bg-slate-800/50 backdrop-blur-sm rounded-xl
                     placeholder-slate-400 text-sm focus:ring-16 focus:ring-blue-500/50
                     border border-slate-700/50 transition-all focus:border-blue-500/50"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="ml-2 p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl 
                     hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105"
          onClick={handleCreateSession}
          aria-label="Create new session"
        >
          <Plus size={18} className="text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {Object.entries(categorizeSessions).map(([key, group]) => {
          const groupTitles = {
            today: "TODAY",
            yesterday: "YESTERDAY",
            lastWeek: "LAST WEEK",
            weekAgo: "WEEK AGO"
          };
          return (
            group.length > 0 && (
              <div key={key} className="group">
                <div className="flex items-center mb-3">
                  <span className="text-xs font-semibold text-slate-400 tracking-wider">
                    {groupTitles[key]}
                  </span>
                  <div className="ml-2 flex-1 h-px bg-slate-700/50 group-hover:bg-slate-600/50 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  {group.map((session) => (
                    <div
                      key={session.sessionId}
                      className={`flex items-center p-2.5 rounded-lg hover:bg-slate-800/50 
                                 cursor-pointer transition-colors relative group/item border 
                                 ${activeSession === session.sessionId ? 'bg-slate-800/70 border-blue-500/50' : 'border-transparent hover:border-slate-700/30'}`}
                      onClick={() => handleSessionSelect(session.sessionId)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSessionSelect(session.sessionId);
                        }
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full mr-3 shadow-sm ${activeSession === session.sessionId ? 'bg-blue-500' : 'bg-blue-400'}`} />
                      <span className="text-sm text-slate-200">{session.sessionName}</span>
                      <div className="ml-auto flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(session.id, session.sessionName);
                          }}
                          aria-label="Rename session"
                          className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                        >
                          <PenLine
                            size={15}
                            className="text-slate-400 hover:text-blue-400 transition-colors"
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(session.id);
                          }}
                          aria-label="Delete session"
                          className="p-1 hover:bg-slate-700/50 rounded transition-colors"
                        >
                          <Trash
                            size={15}
                            className="text-slate-400 hover:text-red-400 transition-colors"
                          />
                        </button>
                        </div>
                      </div>
                    
                  ))}
                </div>
              </div>
            )
          );
        })}
        {filteredSessions.length === 0 && searchQuery && (
          <div className="text-center text-slate-400 py-8">
            <Search size={48} className="mx-auto mb-3 text-slate-500" />
            <p>No sessions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;