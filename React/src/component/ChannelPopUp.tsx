import React, {useEffect, useState} from "react";
import { cookies } from "../App";
import ChannelPopUpList  from "./ChannelPopUpList";
import setting from "../images/setting.png";

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

	const clickSetting = () =>{

	}

return(
    <div className="channelPopUp">
        <div className="channelPopUpPage">
			<div className="channelPageUp">
            	<span className="groupName">{channel.Name}</span>
				<img onClick={clickSetting} className="settingGroup" src={setting} alt=""/>
			</div>
			<div>
				{clientList.map((client, index) => (
					<ChannelPopUpList key={index} client={client} channel={channel}/>
				))}

			</div>

        </div>
    </div>
)
}

export default ChannelPopUp;
