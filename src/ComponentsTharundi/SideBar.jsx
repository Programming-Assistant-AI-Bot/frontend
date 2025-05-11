// import{ React,useEffect,useState} from "react";
// import { Search, Plus, LogOut } from "lucide-react";
// import SessionComponent from "./SessionComponent";
// import axios from 'axios'


// const Sidebar = () => {

// const [sessionData, setSessionData] = useState([]);

//   const fetchSessions = async () => {
//     try {
//       const response = await axios.get('http://localhost:8000/session/getAllSessions');
//       setSessionData(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.error("Failed to fetch sessions", error);
//     }
//   };

//   useEffect(() => {
//     fetchSessions();
//   }, []);

//   // ... (previous imports and data)
//   const todaySessions = ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"];
//   const yesterdaySessions = ["Session 6", "Session 7", "Session 8", "Session 9"];
//   const lastWeekSessions = ["Session 10", "Session 11", "Session 12", "Session 13"];
//   const recentSessions = ["Session 14", "Session 15", "Session 16", "Session 17"];

//   return (
//     <div className="w-full h-screen bg-gradient-to-b from-[#2A0B3D] to-[#47175E] text-white flex flex-col p-4 border-r border-purple-900/50">
//       {/* Profile Section */}
//       <div className="flex items-center justify-between mb-6 p-3 bg-purple-900/20 rounded-xl">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-full flex items-center justify-center font-bold shadow-lg">
//             TL
//           </div>
//           <div>
//             <p className="text-sm font-semibold">Tharundi Lavanya</p>
//             <p className="text-xs text-purple-300">Premium Plan</p>
//           </div>
//         </div>
//         <button className="p-2 hover:bg-purple-900/30 rounded-lg transition-all duration-200">
//           <LogOut size={20} className="text-purple-300 hover:text-purple-100" />
//         </button>
//       </div>

//       {/* Search & Add */}
//       <div className="relative flex items-center mb-6 group">
//         <Search className="absolute left-3 top-3 text-purple-300/80" size={18} />
//         <input
//           type="text"
//           placeholder="Search sessions..."
//           className="w-full p-2.5 pl-10 pr-4 bg-purple-900/30 backdrop-blur-sm rounded-xl
//                      placeholder-purple-300/80 text-sm focus:ring-2 focus:ring-purple-500/50
//                      border border-purple-800/50 transition-all"
//         />
//         <button className="ml-2 p-2.5 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl 
//                           hover:shadow-lg hover:shadow-purple-500/20 transition-all">
//           <Plus size={18} className="text-white" />
//         </button>
//       </div>

//       {/* Sessions Container */}
//       <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
//         {[todaySessions, yesterdaySessions, lastWeekSessions, recentSessions].map((group, i) => (
//           <div key={i} className="group">
//             <div className="flex items-center mb-3">
//               <span className="text-xs font-semibold text-purple-300/80 tracking-wider">
//                 {['TODAY', 'YESTERDAY', 'LAST WEEK', 'RECENTS'][i]}
//               </span>
//               <div className="ml-2 flex-1 h-px bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors" />
//             </div>
//             <div className="space-y-1.5">
//               {group.map((session, j) => (
//                 <div key={j} className="flex items-center p-2.5 rounded-lg hover:bg-purple-900/30 
//                                       cursor-pointer transition-colors relative group/item">
//                   <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 shadow-sm" />
//                   <span className="text-sm">{session}</span>
//                   <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">
//                     <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


import { React, useEffect, useState } from "react";
import { Search, Plus, LogOut } from "lucide-react";
import axios from 'axios';

const Sidebar = () => {
  const [sessionData, setSessionData] = useState([]);

  const fetchSessions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/session/getAllSessions');
      setSessionData(response.data);
    } catch (error) {
      console.error("Failed to fetch sessions", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

 

  // Function to categorize sessions by date
  const categorizeSessions = (sessions) => {
    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    return sessions.reduce((acc, session) => {
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
        acc.recents.push(session);
      }
      return acc;
    }, { today: [], yesterday: [], lastWeek: [], recents: [] });
  };

  const groups = categorizeSessions(sessionData);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-[#2A0B3D] to-[#47175E] text-white flex flex-col p-4 border-r border-purple-900/50">
      {/* Profile Section */}
      <div className="flex items-center justify-between mb-6 p-3 bg-purple-900/20 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-fuchsia-500 rounded-full flex items-center justify-center font-bold shadow-lg">
            TL
          </div>
          <div>
            <p className="text-sm font-semibold">Tharundi Lavanya</p>
            <p className="text-xs text-purple-300">Premium Plan</p>
          </div>
        </div>
        <button className="p-2 hover:bg-purple-900/30 rounded-lg transition-all duration-200">
          <LogOut size={20} className="text-purple-300 hover:text-purple-100" />
        </button>
      </div>

      {/* Search & Add */}
      <div className="relative flex items-center mb-6 group">
        <Search className="absolute left-3 top-3 text-purple-300/80" size={18} />
        <input
          type="text"
          placeholder="Search sessions..."
          className="w-full p-2.5 pl-10 pr-4 bg-purple-900/30 backdrop-blur-sm rounded-xl
                     placeholder-purple-300/80 text-sm focus:ring-2 focus:ring-purple-500/50
                     border border-purple-800/50 transition-all"
        />
        <button className="ml-2 p-2.5 bg-gradient-to-br from-purple-500 to-fuchsia-500 rounded-xl 
                          hover:shadow-lg hover:shadow-purple-500/20 transition-all">
          <Plus size={18} className="text-white" />
        </button>
      </div>

      {/* Sessions Container */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-purple-900/50 scrollbar-track-transparent">
        {[groups.today, groups.yesterday, groups.lastWeek, groups.recents].map((group, i) => {
          const groupTitles = ['TODAY', 'YESTERDAY', 'LAST WEEK', 'RECENTS'];
          return group.length > 0 && (
            <div key={groupTitles[i]} className="group">
              <div className="flex items-center mb-3">
                <span className="text-xs font-semibold text-purple-300/80 tracking-wider">
                  {groupTitles[i]}
                </span>
                <div className="ml-2 flex-1 h-px bg-purple-900/50 group-hover:bg-purple-800/50 transition-colors" />
              </div>
              <div className="space-y-1.5">
                {group.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center p-2.5 rounded-lg hover:bg-purple-900/30 
                             cursor-pointer transition-colors relative group/item"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 shadow-sm" />
                    <span className="text-sm">{session.sessionName}</span>
                    <div className="ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

