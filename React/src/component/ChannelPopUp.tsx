import React, {useEffect, useState} from "react";
import { cookies } from "../App";
import ChannelPopUpList  from "./ChannelPopUpList";

const ChannelPopUp = ({channel}) =>{
	const [clientList, setClientList] = useState([{}]);
	useEffect ( () => {
		const fetchData = async () =>{
			const responseClients =await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${channel}/users`, {
				headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    'Content-Type': 'application/json'
                }
			});
			const chCli = await responseClients.json();
			console.log(chCli);
			setClientList(chCli);
		}
		fetchData();
	}, [])
    // channel = "Bizim Tayfa";

return(
    <div className="channelPopUp">
        <div className="channelPopUpPage">
            <span className="groupName">{channel}</span>
			{clientList.map((client, index) => (
				<ChannelPopUpList key={index} client={client}/>
			))}

        </div>
    </div>
)
}

export default ChannelPopUp;
