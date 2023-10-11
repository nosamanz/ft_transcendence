import React, { useEffect } from "react";
import Message from "./Message";
import { currentChannel } from "../pages/Chat";
import { cookies } from "../App";
import { socket } from "../pages/Home";

let messagesReceived;

socket.on('chat', async (data) => {
    console.log("My data: ")
    console.log(data);

    // messagesReceived = data {message. channel. sender.}
})

const Messages=() =>{
        const fetchData = async () =>{
            const responseMessages = await fetch(`http://10.12.14.1:80/${currentChannel}/messages`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    'Content-Type': 'application/json'
                }
            });
            messagesReceived = await responseMessages.json();
            console.log("Geldi Baba" + Messages);
        }
        if(currentChannel !== ""){
            fetchData();
        }
    return(
        <div className="messages">
            <Message messages = {messagesReceived} />
        </div>
    )
}
export default Messages;
