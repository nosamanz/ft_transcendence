import React, { useEffect, useState } from "react";
import Message from "./Message";
import { cookies } from "../App";
import { socket } from "../pages/Home";

// const messes = [{message: "asdsadsad",senderNick: "ssss"},{message: "asdasd",senderNick: "sss"}]
let oldCurrentChannel = "";
const Messages=({currentChannel}) =>{
    const [messagesReceived, setMessagesReceived] = useState([{}]);
    // data = {message: string, channelName: string, senderNick: string}
    socket.on('chat', async (data) => {
        if (data.channelName === currentChannel)
            setMessagesReceived([...messagesReceived, data]);
    });
        const fetchData = async () =>{
            const responseMessages = await fetch(`https://10.12.14.1:80/chat/${currentChannel}/messages`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            });
            const Mess: {}[] =await responseMessages.json()
            setMessagesReceived(Mess);
        }
        if(currentChannel !== "" && (oldCurrentChannel != currentChannel)){
            fetchData();
            oldCurrentChannel = currentChannel;
        }
    return(
        <div className="messages">
            {messagesReceived.map((message, index) => (
                <Message key={index} message={message} />
            ))}
        </div>
    )
}
// never shall we die
export default Messages;
