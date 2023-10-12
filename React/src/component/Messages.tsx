import React, { useEffect, useState } from "react";
import Message from "./Message";
import { currentChannel } from "../pages/Chat";
import { cookies } from "../App";
import { socket } from "../pages/Home";

// const messes = [{message: "asdsadsad",senderNick: "ssss"},{message: "asdasd",senderNick: "sss"}]

const Messages=() =>{
    const [messagesReceived, setMessagesReceived] = useState([{}]);

    socket.on('chat', async (data) => {
        console.log("My data: ");
        console.log(data);

        setMessagesReceived([...messagesReceived, data]);
    });
    useEffect(() => {

        const fetchData = async () =>{
            // const responseMessages = await fetch(`http://10.12.14.1:80/chat/${currentChannel}/messages`, {
                const responseMessages = await fetch(`http://10.12.14.1:80/chat/123/messages`, {
                    headers: {
                        'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    }
                });
                const Mess: {
                    message: string,
                    channelName: string,
                    senderNick: string,
                    senderSocket: string,
                }[] =await responseMessages.json()
                Mess.forEach((element) =>{
                    console.log("q")
                    console.log(element)
                })

                console.log(typeof(Mess))
                setMessagesReceived([{message: "333", senderNick: "mkardes"},{message: "123", senderNick: "oozcan"},]);
                messagesReceived.forEach((element) =>{
                    console.log(":")
                    console.log(element)
                })
            }
            //if(currentChannel !== ""){
                fetchData();
                //}
    }, [])
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
