import React, { useEffect, useState } from "react";
import MessageBox from "../component/MessageBox";
import InputBox from "../component/InputBox";
import MainBox from "../component/MainBox";
import Friends from "../component/Friends";
import Sidebar from "../component/Sidebar";
import GroupSidebar from "../component/GroupSidebar";
import { cookies } from "../App";

export let currentChannel = "";

const Chat = () =>{
    let [currentChannel, setCurrentChannel] = useState<string>("");
    //useEffect (() => {
    //    const fetchData = async () =>{
    //        const responseMessages = await fetch(`http://10.12.14.1:80/${currentChannel}/messages`, {
    //            headers: {
    //                'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
    //                'Content-Type': 'application/json'
    //            }
    //        });
    //        const Messages = await responseMessages.json();
    //    }
    //    if(currentChannel !== ""){
    //        fetchData();
    //    }
    //})
    console.log("Chat");
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
