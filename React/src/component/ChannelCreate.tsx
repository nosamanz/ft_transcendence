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
				<div className="channelForm">
					<div>
						<div>
							<label>Kanal İsmi</label>
						</div>
						<div>
							<label>Şifre</label>
						</div>
						<div>
							<label>invite only</label>
						</div>
					</div>
					<div>
						<div>
							<input type="text" id="channelName" onChange={changeName}/>
						</div>
						<div>
							<input type="password" id="password" onChange={changePass} placeholder="No Password" />
						</div>
						<div>
							<input type="checkbox" id="invite" onChange={changeInvite}/>
						</div>
						</div>
				</div>
					<button onClick={send}>Kanalı Oluştur</button>
			</div>
		</div>
	)
}

export default ChannelCreate;
