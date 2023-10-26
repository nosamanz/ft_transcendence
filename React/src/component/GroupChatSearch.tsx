import React, { useEffect, useState } from "react";
import Channel from "./Channel";
import { cookies } from "../App";

const GroupChatSearch = ({setCurrentChannel}) =>{
    const [channelList, setChannelList] = useState([{}]);
    useEffect (() => {
        const fetchData = async () =>{
            const responseChannels = await fetch(`https://${process.env.REACT_APP_IP}:80/user/channels`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    'Content-Type': 'application/json'
                }
            });
            const CHs = await responseChannels.json();
            setChannelList(CHs);
        }
        fetchData();
    }, [])
    const HandleClick = async () => {
        const updatedChannels = [...channelList, { Name: "publicchat3" }];
    
        // Set the state with the new array
        setChannelList(updatedChannels);
    }
    return(
        <div className="chatSearch">
            <button onClick={HandleClick} className="Btn">Add Channel</button>
            <div className="searchForm">
                <input className="searchInput" type="text" placeholder="find a user" />
            </div>
            {channelList.map((channel, index) => (
                <Channel key={index} channel={channel} setCurrentChannel={setCurrentChannel} />
            ))}
        </div>
    )
}

export default GroupChatSearch;
