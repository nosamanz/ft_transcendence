import React, { useEffect, useState } from "react";
import Channel from "./Channel";
import { cookies } from "../App";

const GroupChatSearch = ({setCurrentChannel}) =>{
    const [channelList, setChannelList] = useState([{}]);
    useEffect (() => {
        const fetchData = async () =>{
            const responseChannels = await fetch(`https://10.12.14.1:80/user/channels`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    'Content-Type': 'application/json'
                }
            });
            console.log(responseChannels)
            const CHs = await responseChannels.json();
            console.log(CHs)
            setChannelList(CHs);
        }
        fetchData();
    }, [])
    return(
        <div className="chatSearch">
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
