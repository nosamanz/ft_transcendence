import React, {useEffect, useState} from "react";
import image1 from "../images/avatar1.png"
import image2 from "../images/free-photo2.jpg"
import mute from "../images/mute.png"
import unmute from "../images/unmute.png"
import admin from  "../images/admin.png"
import ban from "../images/ban.png"
import kick from "../images/kick.png"
import { cookies } from "../App";

const ChannelPopUpList = ({client, channel}) =>{

    const [checkMute, setCheckMute] = useState<boolean>();

    useEffect(() => {
        if (channel.MutedIDs.some(element => element === client.id))
            setCheckMute(true);
        else
            setCheckMute(false);
    },[])

    const changeMute = ()=>{
        if (channel.MutedIDs.some(element => element === client.id))
            setCheckMute(true);
        else
            setCheckMute(false);
    }

    const muteClick =() =>{

            const fetchData = async () =>{
                const response = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${channel.Name}/mute/${client.nick}`, {
                    headers: { 'authorization': 'Bearer ' + cookies.get("jwt_authorization"), }
                });
                const mes: string = await response.text();
                if (mes.substring(0,3) !== "Err")
                {
                    changeMute();
                }
            }
            fetchData();
    }
	return(
		<div>
			 <div className="groupOnePerson">
                <div>
                    <p>{client.nick}</p>
                </div>
                <div className="groupOnePersonIcons">
                    <img className="channelPopUpIcon" src={kick}/>
                    <img className="channelPopUpIcon" src={ban}/>
                    <img className="channelPopUpIcon" src={admin}/>
                    {checkMute === true ? (
                        <img onClick={muteClick} className="channelPopUpIcon" src={mute}/>
                        ):(
                            <img onClick={muteClick} className="channelPopUpIcon" src={unmute}/>
                    )}
                </div>
            </div>
		</div>
	)

}

export default ChannelPopUpList;
