import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import { cookies } from "../App";
import { socket } from "../pages/Home";

// const messes = [{message: "asdsadsad",senderNick: "ssss"},{message: "asdasd",senderNick: "sss"}]
let oldCurrentChannel = "";
const Messages=({currentChannel, user}) =>{
    const [messagesReceived, setMessagesReceived] = useState<{message: string, channelName: string, senderNick: string}[]>([]);
    // data = {message: string, channelName: string, senderNick: string}
    socket.on('chat', async (data) => {
        if (data.channelName === currentChannel)
            setMessagesReceived([...messagesReceived, data]);
    });
    useEffect(() => {
        const fetchData = async () =>{
            const responseMessages = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${currentChannel}/messages`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            });
            const Mess:  {message: string, channelName: string, senderNick: string}[] =await responseMessages.json()
            console.log(Mess);
            setMessagesReceived(Mess);
        }
        if(currentChannel !== ""){
            fetchData();
        }

    },[currentChannel])
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() =>{
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
          }
    },[messagesReceived])
    return(
        <div className="messages">
            {messagesReceived.map((message, index) => (
                <Message key={index} message={message} user = {user} />
            ))}
        <div ref={bottomRef}/>
        </div>
    )
}
// never shall we die
export default Messages;
