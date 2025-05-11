import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import SideBar from "./SideBar";
import ChatWindow from "./Chatwindow";


function Homepage() {
  return (
    <div className="flex w-full h-screen">
      {/* Sidebar - Takes 1/4th of the width */}
      <div className="w-1/5 h-full">
        <SideBar />
      </div>

      {/* Chat Window - Takes the rest */}
      <div className="w-4/5 h-full">
        <ChatWindow />
      </div>
    </div>
  );
}

export default Homepage;
