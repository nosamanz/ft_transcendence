import React, { useEffect, useState } from "react";
import PrivChannel from "./PrivChannel";
import { cookies } from "../App";

const ChatSearch = ({setCurrentChannel}) =>{
    const [channelList, setChannelList] = useState([{}]);
    useEffect (() => {
        const fetchData = async () =>{
            const responseChannels = await fetch(`http://10.12.14.1:80/user/privChannels`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            });
            console.log(responseChannels)
            const CHs = await responseChannels.json();
            console.log(CHs)
            setChannelList(CHs);
        }
        fetchData();
    }, [])
    // const channelList = [{Name: "Priv1"}, {Name: "Priv2"}];
    return(
        <div className="chatSearch">
            <div className="searchForm">
                <input className="searchInput" type="text" placeholder="find a user" />
            </div>
                 {channelList.map((channel, index) => (
                     <PrivChannel key={index} channel={channel} setCurrentChannel={setCurrentChannel} />
                 ))}
        </div>
    )

}

export default ChatSearch;
