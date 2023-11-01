import React from "react";
import image from "../images/avatar1.png"

const PrivChannel = ({channel, setCurrentChannel}) =>{
	const HandleClick = async () => {
        setCurrentChannel(channel.Name);
    }
    console.log(channel.imageBuffer);
    return(
        <div className="userChat">
			    <img className="searchChatImage" src={`data:image/jpeg;base64,${channel.imageBuffer ? channel.imageBuffer.toString('base64'): image}`}/>
                <div className="userChatInfo">
                    <span onClick={HandleClick} >{channel.Users != undefined? channel.Users[0].nick : undefined}</span>
                </div>
		</div>
    )
}
export default PrivChannel;
