import React, {useEffect, useState} from "react";
import { cookies } from "../App";
import ChannelPopUpList  from "./ChannelPopUpList";

import { UseChannelContext } from "../Context/ChannelContext";


const ChannelPopUp = ({channel}) =>{

	const [clientList, setClientList] =  useState([]);

	useEffect ( () => {
		const fetchData = async () =>{
			const responseClients =await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${channel.Name}/users`, {
				headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    'Content-Type': 'application/json'
                }
			});
			const chCli = await responseClients.json();
			setClientList(chCli);
		}
		fetchData();
	}, [clientList])

return(
    <div className="channelPopUp">
        <div className="channelPopUpPage">
            <span className="groupName">{channel.Name}</span>
			{clientList.map((client, index) => (
				<ChannelPopUpList key={index} client={client} channel={channel}/>
			))}

        </div>
    </div>
)
}

export default ChannelPopUp;
