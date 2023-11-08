import React, { useState } from "react";
import { cookies } from "../App";

const ChannelCreate = ({setPopOpen, channelName}) =>{
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
	}
	const handleClick = () =>{
		setPopOpen(false);
	}
	const changePass = (e) =>{
		console.log(e.target.value);
		setPass(e.target.value);
		if (!e.target.value)
			setPass("undefined");
	}
	return(
		<div>
			<div className="channelSetting" id="popActive" style={{ display: setPopOpen  ? 'block' : 'none' }}>
				<div className="channelSettingX">
					<button onClick={handleClick}>X</button>
				</div>
				<div className="channelSettingForm">
					<div>
						<div>
							<label>Kanal İsmi</label>
						</div>
						<div>
							<label>Şifre</label>
						</div>
					</div>
					<div>
						<div>
							<label>{channelName}</label>
						</div>
						<div>
							<input type="password" id="password" onChange={changePass} placeholder="No Password" />
						</div>
						</div>
				</div>
					<button onClick={send}>Şifre Değiştir</button>
			</div>
		</div>
	)
}

export default ChannelCreate;
