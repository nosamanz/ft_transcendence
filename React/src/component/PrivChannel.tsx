import React from "react";
import image from "../images/avatar1.png"

const PrivChannel = ({channel, setCurrentChannel}) =>{
	const HandleClick = async () => {
        setCurrentChannel(channel.Name);
    }
    return(
        <div className="userChat">
			    <img className="searchChatImage" src={image}/>
                <div className="userChatInfo">
                    <span onClick={HandleClick} >{channel.users}</span>
                </div>
		</div>
    )
}
export default PrivChannel;
