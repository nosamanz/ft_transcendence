import React, { useState } from "react";
import { cookies } from "../App";

const ChannelCreate = ({setPopOpen, channelList, setChannelList}) =>{
	const [inputValue, setInputValue] = useState<string>("");
	const [pass, setPass] = useState<string>("undefined");
	const [inv, setInv] = useState<boolean>(false);

	const send = async () =>{
		const response = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${inputValue}/create/false/${inv}/${pass}`, {
			headers: {
				'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                'Content-Type': 'application/json'
			}
		})
		const ch = await response.json();
		const UpdateChannel = [...channelList, ch]
		setChannelList(UpdateChannel);
	}
	const handleClick = () =>{
		setPopOpen(false);
	}
	const changeName = (e) =>{
		setInputValue(e.target.value);
	}
	const changePass = (e) =>{
		console.log(e.target.value);
		setPass(e.target.value);
		if (!e.target.value)
			setPass("undefined");
		}
	const changeInvite = (e) =>{
		setInv(e.target.checked);
	}
	return(
		<div>
			<div className="channelCreate" id="popActive" style={{ display: setPopOpen  ? 'block' : 'none' }}>
				<div className="channelCreateX">
					<button onClick={handleClick}>X</button>
				</div>
				<div className="channelCreateBody">
					<div className="channelForm">
						<div className="channelFormLeft">
							<div className="channelFormLabel">
								<label>Kanal İsmi</label>
							</div>
							<div className="channelFormLabel">
								<label>Şifre</label>
							</div>
							<div className="channelFormLabel">
								<label>invite only</label>
							</div>
						</div>
						<div className="channelFormRight">
							<div>
								<input type="text" id="channelName" onChange={changeName}/>
							</div>
							<div>
								<input type="password" id="password" onChange={changePass} placeholder="No Password" />
							</div>
							<div>
								<input className="formInviteCheck" id="inviteCheck" type="checkbox" id="invite" onChange={changeInvite}/>
								<label for="inviteCheck"></label>
							</div>
						</div>
					</div>
				<button onClick={send}>Kanalı Oluştur</button>
				</div>
			</div>
		</div>
	)
}

export default ChannelCreate;
