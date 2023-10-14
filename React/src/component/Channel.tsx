import React from "react";

const Channel = ({channel, setCurrentChannel}) =>{
	const HandleClick = async () => {
        setCurrentChannel(channel.Name);
    }
    return(
        <div className="userChat">
			<div className="userChatInfo">
				<span onClick={HandleClick}>{channel.Name}</span>
			</div>
		</div>
    )
}
export default Channel;
