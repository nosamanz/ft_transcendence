import React, {useEffect, useState} from "react";
import image1 from "../images/avatar1.png"
import image2 from "../images/free-photo2.jpg"
import mute from "../images/mute.png"
import unmute from "../images/unmute.png"
import admin from  "../images/admin.png"
import ban from "../images/ban.png"
import kick from "../images/kick.png"
import { cookies } from "../App";

import { UseChannelContext } from "../Context/ChannelContext";

const ChannelPopUpList = ({client, channel}) =>{

    const [checkMute, setCheckMute] = useState<boolean>();
	const [loaded, setLoaded] = useState(false);

    const { channelList, setChannelList } = UseChannelContext();

    const channel1 = channelList.find(element => element.Name === channel.Name);
    console.log(channel1?.Name);
    if (loaded === false)
    {
            console.log(channel1?.MutedIDs.some(element => element === client.id));
            if (channel1?.MutedIDs.some(element => element === client.id))
            {
                setCheckMute(true);
            }
            else
            {
                setCheckMute(false);
            }
        setLoaded(true);
    }

    const changeMute = ()=>{
        console.log(channel1?.MutedIDs.some(element => element === client.id));
        if (channel1?.MutedIDs.some(element => element === client.id))
            setCheckMute(true);
        else
            setCheckMute(false);
    }


    // const updateMutedIDs = (channelId, newMutedIDs) => {
    //     // channels state'i içindeki channelId'e sahip kanalın MutedIDs'ini güncelleyin.
    //     const updatedChannels = channelList.map(channel => {
    //       if (channel.id === channelId) {
    //         return { ...channel, MutedIDs: newMutedIDs };
    //       }
    //       return channel;
    //     });
    //     setChannelList(updatedChannels);
    //   };

    const muteClick =() =>{

            const fetchData = async () =>{
                channel1?.MutedIDs.forEach(element => {console.log(element)});
                const response = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${channel.Name}/mute/${client.nick}`, {
                    headers: { 'authorization': 'Bearer ' + cookies.get("jwt_authorization"), }
                });
                const a = client.id;
                const mes: string = await response.text();
                if (mes.substring(0,3) !== "Err")
                {
                    // const updated = channelList.map(element => {
                    //     if (element.Name === channel1?.Name)
                    //         return (...channel1, MutedIDs: 98957)
                    //     return element;
                    // })
                    changeMute();
                    // setChannelList
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
