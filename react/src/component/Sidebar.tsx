import React from "react";
import SidebarNav from "./SidebarNav";
import ChatSearch from "./ChatSearch";
const Sidebar = () =>{
    return(
        <div className="sidebar">
            <SidebarNav/>
            <ChatSearch/>
        </div>
    )

}

export default Sidebar;