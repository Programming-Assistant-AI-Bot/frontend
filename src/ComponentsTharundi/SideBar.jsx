import React from "react";
import { Search, Plus, LogOut } from "lucide-react";
import SessionComponent from "./SessionComponent";

const Sidebar = () => {
  const todaySessions = ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"];
  const yesterdaySessions = ["Session 6", "Session 7", "Session 8", "Session 9"];
  const lastWeekSessions = ["Session 10", "Session 11", "Session 12", "Session 13"];
  const recentSessions = ["Session 14", "Session 15", "Session 16", "Session 17"];

  return (
    <div className="w-full h-screen bg-[#3A1D56] text-white flex flex-col p-4">

      {/* Profile Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center text-black font-bold">
            T
          </div>
          <span className="text-lg font-semibold">Tharundi Lavanya</span>
        </div>
        <button className="text-gray-300 hover:text-white transition" onClick={() => console.log("Logging out...")}>
          <LogOut size={20} />
        </button>
      </div>

      {/* Search Bar & Add Button */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search Session"
          className="flex-1 p-2 pl-8 rounded-lg bg-[#5B2A80] placeholder-gray-300 text-white focus:outline-none"
        />
        <Search className="absolute left-2 top-2 text-gray-300" size={18} />
        <button className="ml-2 p-2 bg-[#6A1B9A] rounded-md hover:bg-white hover:text-[#6A1B9A] transition">
          <Plus size={18} />
        </button>
      </div>

      {/* Scrollable Sessions Container */}
      <div className="flex-1 overflow-y-auto mt-4 pr-2 space-y-6 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent hover:scrollbar-thumb-white/50">

        {/* Today */}
        <div>
          <span className="text-gray-300">TODAY</span>
          <div className="flex flex-col gap-2 mt-2">
            {todaySessions.map((session, index) => (
              <SessionComponent key={index} sessionName={session} />
            ))}
          </div>
        </div>

        {/* Yesterday */}
        <div>
          <span className="text-gray-300">YESTERDAY</span>
          <div className="flex flex-col gap-2 mt-2">
            {yesterdaySessions.map((session, index) => (
              <SessionComponent key={index} sessionName={session} />
            ))}
          </div>
        </div>

        {/* Last Week */}
        <div>
          <span className="text-gray-300">LAST WEEK</span>
          <div className="flex flex-col gap-2 mt-2">
            {lastWeekSessions.map((session, index) => (
              <SessionComponent key={index} sessionName={session} />
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <span className="text-gray-300">RECENTS</span>
          <div className="flex flex-col gap-2 mt-2">
            {recentSessions.map((session, index) => (
              <SessionComponent key={index} sessionName={session} />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Sidebar;

