import React, { useEffect, useState, useMemo, useContext } from "react";
import { PenLine, Trash, Search, Plus, LogOut } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import LoadingAnimation from "./LoadingAnimation";
import { AuthContext } from "../contexts/AuthContext";

const Sidebar = ({ 
  onSessionSelect, 
  onCreateSession, 
  refreshSessions, 
  setRefreshSessions,
  activeSession 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  
  // Use authenticated user from context instead of hardcoded value
  const { user, logout } = useContext(AuthContext);
  const userId = user?.id || user?.username;

  // Create an axios instance with auth headers
  const axiosWithAuth = () => {
    return axios.create({
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
  };

  const fetchSessions = async () => {
    if (!userId) {
      toast.error("User ID is missing. Please log in.");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axiosWithAuth().get(
        `http://localhost:8000/session/getAllSessions?user_id=${userId}`
      );
      setSessionData(response.data);
      console.log("Fetched Sessions:", response.data);
    } catch (error) {
      const errorMessage = error.response?.data?.detail || "Failed to fetch sessions";
      toast.error(errorMessage);
      console.error("Failed to fetch sessions:", error);
      
      // If unauthorized, logout user
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]); // Add userId as dependency so it refetches if user changes

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
      await axiosWithAuth().delete(`http://localhost:8000/session/deleteSession/${id}`);
      toast.success("Session deleted");
      
      // If we're deleting the active session, set active session to null
      if (activeSession === id) {
        // This will trigger the NewChatWindow to appear
        onSessionSelect(null);
      }
      
      // Refresh the sessions list
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
      await axiosWithAuth().put(
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
    onSessionSelect(sessionId);
  };

  // Add logout handler
  const handleLogout = () => {
    logout();
  };

  // Rest of your component code...
  const filteredSessions = sessionData.filter((session) =>
    session.sessionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categorizeSessions = useMemo(() => {
    // Your existing categorization code...
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
            {user?.username?.substring(0, 2).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-100">{user?.username || "User"}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button 
          className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          onClick={handleLogout}
        >
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
        {isLoading ? (
          <LoadingAnimation />
        ) : (
          <>
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
                              handleRename(session.sessionId, session.sessionName); // Changed from session.id to session.sessionId
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
                                handleDelete(session.sessionId);
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
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;