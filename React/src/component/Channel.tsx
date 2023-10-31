import React, {useState} from "react";
import image from "../images/avatar1.png"

import PopUp from "./ChannelPopUp"


const Channel = ({channel, setCurrentChannel}) =>{
	const HandleClick = async () => {
        setCurrentChannel(channel.Name);
    }
    const [isPopOpen, setPopOpen] = useState(false);
    const [popUpPosition, setPopUpPosition] = useState({left: 0, top:0});

    const mouseOver = (e) =>{
        setPopOpen(true);

        const rect = e.target.getBoundingClientRect();
        setPopUpPosition({
            left: rect.left + rect.width + 10,
            top: rect.top,
        });
    };
    const mouseOut = () =>{
        setPopOpen(false);
    };
    return(
        <div className="userChat" onClick={HandleClick} onMouseOver={mouseOver} onMouseLeave={mouseOut}>
                <img className="searchChatImage" src={image}/>
		        <div className="userChatInfo">
				<span>{channel.Name}</span>
			</div>
            <div  style={{left: popUpPosition.left, top:popUpPosition.top}}>
                {isPopOpen && <PopUp channel={channel.Name} />}
            </div>
		</div>
    )
}
export default Channel;
