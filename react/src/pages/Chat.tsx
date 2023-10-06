import React, { useState } from "react";
import MessageBox from "../component/MessageBox";
import InputBox from "../component/InputBox";
import MainBox from "../component/MainBox";
import Friends from "../component/Friends";
import Sidebar from "../component/Sidebar";
import GroupSidebar from "../component/GroupSidebar";
const Chat = () =>{
    const [whos, setWho] = useState("");
    return(
        <div className="chat">
            <div className="chatContainer">
                <Sidebar/>
                <MainBox/>
                <GroupSidebar/>
            </div>
            <div className="friends">
                <Friends />
            </div>
        </div>
    )
}

export default Chat;