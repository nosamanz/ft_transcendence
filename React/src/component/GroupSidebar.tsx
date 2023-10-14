import React from "react";
import GroupSidebarNav from "./GroupSidebarNav";
import GroupChatSearch from "./GroupChatSearch";
const GroupSidebar = ({setCurrentChannel}) =>{
    return(
        <div className="sidebar">
            <GroupSidebarNav/>
            <GroupChatSearch setCurrentChannel={setCurrentChannel}/>
        </div>
    )

}

export default GroupSidebar;
