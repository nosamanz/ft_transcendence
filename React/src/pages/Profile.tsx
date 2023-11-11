import React, {useEffect, useState} from "react";
import edit from "../images/edit.png";
import nickOk from "../images/nickOk.png";
import x from "../images/close.png";
import { cookies } from "../App";
import TFA from "../component/TFA";
import ToggleSwitch from "../component/ToggleSwitch";
import { useLocation } from "react-router-dom";

const Profile = () => {

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const nick = searchParams.get('nick');
	const [newNick, setNewNick] = useState<string>("");
	const [user, setUser] = useState({imgBuffer: undefined});
	const [isTFAPopUp, setIsTFAPopUp] = useState<boolean>(false);
	const [isSettingPopUp, setSettingPopUp] = useState<boolean>(false);
	const [toggleState, setToggleState] = useState<boolean>(false);
    const [QR, setQR] = useState("");
	let tfa: boolean = false;

	useEffect (() =>{
		if (nick !== null)
		{
			const fetchData = async () =>{
				const responseUser = await fetch(`https://${process.env.REACT_APP_IP}:80/user/profile/${nick}`, {
					headers: {
						'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					}
				});
				const resUser = await responseUser.json();
				setUser(resUser);
			}
			fetchData();
		}
		else{
			const fetchData = async () =>{
				const responseUser = await fetch(`https://${process.env.REACT_APP_IP}:80/user/profile`, {
					headers: {
						'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					}
				});
				const resUser = await responseUser.json()
				setToggleState(resUser.TFAuth);
				setUser(resUser);
			}
			fetchData();
		}
	}, [nick])// [nick,user] was there but there is a risky movement like while(1) infinite loop

	const handleToggleChange = async (isChecked: boolean) => {
		if (isChecked === true)
		{
			const response = await fetch(`https://${process.env.REACT_APP_IP}:80/auth/tfa/enable`, {
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
				}
			})
			const qrCodeImageData = await response.blob();
			const imageUrl = URL.createObjectURL(qrCodeImageData);
			setQR(imageUrl);
			setIsTFAPopUp(true);
			cookies.set("Xcasfhajsd","kjshdfi23qwd");
		}
		else
			await fetch(`https://${process.env.REACT_APP_IP}:80/auth/tfa/disable`, {
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
				}
			})
		setToggleState(isChecked);
	};

	const changeName = (e) =>{
		setSettingPopUp(true);
	}
	const close = () =>{
		setSettingPopUp(false);
	}
	const handleChange =(e:React.ChangeEvent<HTMLInputElement>)=>{
		setNewNick(e.target.value);
	}
	const send = () =>{
		const fetchData = async () =>{
			const response = await fetch(`https://${process.env.REACT_APP_IP}:80/user/changeNick/${newNick}`, {
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
				}
			});
			const resUser = await response.json();
			// if (response.ok)
				// setUser(resUser);
		}
		fetchData();
		console.log(newNick);
		setSettingPopUp(false);
	}
	return(
		<div className="Profile">
			{
				isTFAPopUp === true  ?
				(
					<div className="tfa_visible">
						<TFA qr={QR} setIsTFA={setToggleState} setIsTFAPopUp={setIsTFAPopUp} />
					</div>
				):(
					<div className="profile">
						<div className="profileH1">
							<h1>Profile</h1>
						</div>
						<div className="profileContainer">
							<div className="pTopBlock">
								<img className="pTopBlockImage" src={`data:image/png;base64,${user.imgBuffer}`} alt="pImage"/><img className="imageSetting" src={edit}/>
							</div>
							<div className="pBottomBlock">
								{nick === null ? (
									<div className="pIconBlock">
										<div className="pIconBlockPosition">
											<div className="toogleContainer">
												<ToggleSwitch checked={toggleState} onChange={handleToggleChange} />
											</div>
										</div>
									</div>
								):
								(null)}
								<div className="pValueBlock">
									<div className="leftBlock">
										<div className="pRowBlock">Nick</div>
										<div className="pRowBlock">Latter Level</div>
										<div className="pRowBlock">Win</div>
										<div className="pRowBlock">Lose</div>
									</div>
									<div className="rightBlock">
										<div className="pRowBlock" id="changeNameId">
										{ isSettingPopUp === false?
											(<label className="settingIcon">{user.nick}
											{
												nick === null?(<img onClick={changeName} className="setting" src={edit}/>):(null)
											}</label>):
											(<label className="settingIcon"><input type="text" name="name" onChange={handleChange}></input><img onClick={send} src={nickOk} className="setting"/><img onClick={close} src={x} className="setting"/></label>)
										}
										</div>
										<div className="pRowBlock">{user.LatterLevel}</div>
										<div className="pRowBlock">{user.WinCount}</div>
										<div className="pRowBlock">{user.LoseCount}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					)
				}
			</div>
	)
}

export default Profile;
