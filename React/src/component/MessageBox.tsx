import React, { useState } from "react";
import Messages from "./Messages";
import ChannelCreate from "./ChannelCreate";
import groupAdd from "../images/groupAdd.png"
const MessageBox = ({currentChannel, user}) =>{
	const [isPopOpen, setPopOpen] =useState(false);
	const handleClick = () =>{
		setPopOpen(true);
		console.log("true");
	}
	return(
		<div className="messageBox">

			<div className="messageBoxInfo">
				<span>{currentChannel}</span>
				<div className="messageBoxIcon">
					<div onClick={handleClick}>
						<img className="messageBoxIconImage"  src={groupAdd} />
					</div>
				</div>
			</div>
			<div>
				<Messages currentChannel={currentChannel} user = {user} />
			</div>
			{isPopOpen && <ChannelCreate setPopOpen ={setPopOpen} />}
		</div>
	)

}

export default MessageBox;
