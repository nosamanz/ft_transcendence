import React from "react";
import SidebarNav from "./SidebarNav";
import ChatSearch from "./ChatSearch";
import GroupSidebarNav from "./GroupSidebarNav";
import GroupChatSearch from "./GroupChatSearch";
const GroupSidebar = () =>{
    return(
        <div className="sidebar">
            <GroupSidebarNav/>
            <GroupChatSearch/>
        </div>
    )

}

export default GroupSidebar;