import React, {useEffect, useState} from "react";
import image1 from "../images/avatar1.png"
import image2 from "../images/free-photo2.jpg"
import mute from "../images/mute.png"
import unmute from "../images/unmute.png"
import admin from  "../images/admin.png"

const ChannelPopUpList = ({client}) =>{

	const [checkMute, setCheckMute] = useState(true);

    const muteClick =() =>{
        setCheckMute(false);
    }
    const unmuteClick = () =>{
        setCheckMute(true);
    }
	return(
		<div>
			 <div className="groupOnePerson">
                <p>{client.nick}</p>
                <div className="groupOnePersonIcons">
                    <img className="channelPopUpIcon" src=""/>
                    <img className="channelPopUpIcon" src=""/>
                    <img className="channelPopUpIcon" src={admin}/>
                    {checkMute === true ? (
                        <img onClick={muteClick} className="channelPopUpIcon" src={unmute}/>
                        ):(
                            <img onClick={unmuteClick} className="channelPopUpIcon" src={mute}/>
                    )}
                </div>
            </div>
		</div>
	)

}

export default ChannelPopUpList;
