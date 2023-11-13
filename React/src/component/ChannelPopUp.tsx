import React, {useEffect, useState} from "react";
import { cookies } from "../App";
import ChannelPopUpList  from "./ChannelPopUpList";
import setting from "../images/setting.png";
import ChannelSetting from "./ChannelSetting";


const ChannelPopUp = ({channel}) =>{

	const [popChannel, setPopChannel] =  useState({Users: []});
    const [checkMute, setCheckMute] = useState<boolean>();
	const [isPopOpen, setPopOpen] = useState<boolean>(false);
	const channelName = channel.Name;

	useEffect ( () => {
		console.log("Geldi");
		const fetchData = async () =>{
			const responseClients =await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${channel.Name}`, {
				headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    'Content-Type': 'application/json'
                }
			});
			const resPopChannel = await responseClients.json();
			setPopChannel(resPopChannel);
		}
		fetchData();
	}, [checkMute])

	const clickSetting = () =>{
		setPopOpen(true);
	}

return(
    <div className="channelPopUp">
        <div className="channelPopUpPage">
			<div className="channelPageUp">
            	<span className="groupName">{channel.Name}</span>
				<img onClick={clickSetting} className="settingGroup" src={setting} alt=""/>
			</div>
			<div>
				{popChannel.Users.map((client, index) => (
					<ChannelPopUpList key={index} client={client} channel={popChannel} checkMute={checkMute} setCheckMute={setCheckMute}/>
				))}
			</div>

        </div>
		{isPopOpen && <ChannelSetting setPopOpen={setPopOpen} channelName={channelName}></ChannelSetting>}
    </div>
)
}

export default ChannelPopUp;
