import React, { useEffect, useState } from "react";
import MessageBox from "../component/MessageBox";
import InputBox from "../component/InputBox";
import MainBox from "../component/MainBox";
import Friends from "../component/Friends";
import Sidebar from "../component/Sidebar";
import GroupSidebar from "../component/GroupSidebar";
import { cookies } from "../App";


const Chat = ({setCurrentChannel, currentChannel}) =>{
    return(
        <div className="chat">
            <div className="chatContainer">
                <Sidebar setCurrentChannel={setCurrentChannel} />
                <MainBox currentChannel={currentChannel} />
                <GroupSidebar  setCurrentChannel={setCurrentChannel}  />
            </div>
            <div className="friends">
                <Friends />
            </div>
        </div>
    )
}

export default Chat;
