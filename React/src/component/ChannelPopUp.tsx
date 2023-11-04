import React, {useEffect, useState} from "react";
import { cookies } from "../App";
import ChannelPopUpList  from "./ChannelPopUpList";

import { UseChannelContext } from "../Context/ChannelContext";


const ChannelPopUp = ({channel}) =>{

	const { channelList, setChannelList } = UseChannelContext();

	// const [clientList, setClientList] = useState([{}]);
	const cli = channelList.find(element => element.Name === channel.Name)?.Users;
	// console.log("CLIENTS");
	// console.log(cli);
	const [clientList, setClientList] =  useState([{cli}]);

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
	}, [])

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
