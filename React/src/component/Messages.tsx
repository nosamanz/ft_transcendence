import React, { useEffect, useState } from "react";
import Message from "./Message";
import { currentChannel } from "../pages/Chat";
import { cookies } from "../App";
import { socket } from "../pages/Home";

const Messages=() =>{
    const [messagesReceived, setMessagesReceived] = useState([{}]);
    
    socket.on('chat', async (data) => {
        console.log("My data: ");
        console.log(data);
        
        setMessagesReceived((prevMessages) => [...prevMessages, data]);
    });
        const fetchData = async () =>{
            const responseMessages = await fetch(`http://10.12.14.1:80/${currentChannel}/messages`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            });
            setMessagesReceived(await responseMessages.json());
            console.log("Geldi Baba" + Messages);
        }
        //if(currentChannel !== ""){
            fetchData();
        //}
        console.log("Merba");
    return(
        <div className="messages">
            <Message messages = {messagesReceived} />
        </div>
    )
}
export default Messages;
