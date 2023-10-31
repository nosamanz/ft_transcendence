import React, { useState } from "react";
import { cookies } from "../App";

const ChannelCreate = ({setPopOpen}) =>{
	const [inputValue, setInputValue] = useState<string>("");
	const [pass, setPass] = useState<string>("undefined");
	const [inv, setInv] = useState<boolean>(false);
	const send = async () =>{
		console.log(pass + "====");
		const response = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${inputValue}/create/false/${inv}/${pass}`, {
			headers: {
			  'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
			}
		  });
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
			<div className="channelCreate" id="popActive" style={{ display: setPopOpen  ? 'block' : 'none' }} >
				<div>
					<button onClick={handleClick}>X</button>
					<label>Kanal İsmi</label><input type="text" id="channelName" onChange={changeName}/>
					<label>Şifre</label><input type="password" id="password" onChange={changePass} placeholder="No Password" />
					<label>invite only</label><input type="checkbox" id="invite" onChange={changeInvite}/>
					<button onClick={send}>Kanalı Oluştur</button>
				</div>
			</div>
		</div>
	)
}

export default ChannelCreate;
