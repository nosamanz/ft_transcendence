import React, {useEffect, useState} from "react";
import setting from "../images/setting.png";
import { cookies } from "../App";
import TFA from "../component/TFA";
import ToggleSwitch from "../component/ToggleSwitch";
import { useLocation, useParams } from "react-router-dom";

const Profile = () => {

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const nick = searchParams.get('nick');
	const [selectedImage, setSelectesImage] = useState("");
	const [reader, setReader] = useState<any>();


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
	}, [nick])

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
		}
		else
			await fetch(`https://${process.env.REACT_APP_IP}:80/auth/tfa/disable`, {
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
				}
			})
		setToggleState(isChecked);
	};
	const handleClick = () =>{
		setSettingPopUp(true);
	}
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
		setNick(e.target.value);
	};
	const handleImageChange = (e) =>{
		const selectedFile = e.target.files[0];
		const fileReader = new FileReader();

		fileReader.onload = (ea: any) => {
			const dataURL = ea.target.result;

			setSelectesImage(URL.createObjectURL(selectedFile));
			setReader(dataURL);
		};
		fileReader.readAsDataURL(selectedFile);
	}
	const handleSubmit = async (e: React.FormEvent) =>{
		e.preventDefault();

		try {
			const data = {};
			data["file"] = reader;
			data["nick"] = nick;
			const responseImage = await fetch(`https://${process.env.REACT_APP_IP}:80/user/form`, {
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( data ),
			});
			console.log("response1");
			const responseImageGet = responseImage.json();
			console.log("response2");
			console.log(responseImageGet)
			if (responseImage.ok){
				setLoaded(true);
				const response = await fetch(`https://${process.env.REACT_APP_IP}:80/user/sign`, {
					headers: {
						'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					}
				});
				console.log('Form submitted successfully');
			}
			else{
				console.error('Form submission failed!');
			}
		}
		catch(error){
			console.error('An error occurred:', error);
		}
		setSettingPopUp(false);
	};
	return(
		<div className="Profile">
			{
				isTFAPopUp === true || isSettingPopUp === true ? 
				(
					<div>
					{
					isTFAPopUp === true ?(
						<div className="tfa_visible">
							<TFA qr={QR} setIsTFA={setToggleState} setIsTFAPopUp={setIsTFAPopUp} />
						</div>
					) : (
						<div className="profileBody">
							<div className="profileForm">
								<div className="profileFormHeader">
									<h2 className="profileFormH2">Nickname ve Resim Seçin</h2>
								</div>
								<div className="profileFormBody">
									<form>
										<div className="profileFormDiv">
											<label>Nickname: </label>
										<input type="text" name="name" placeholder={user.nick} onChange={handleChange} className="formInput"></input>
										</div><div className="formDiv">
											<label></label>
										<input id = "fileInput" type="file" name="image" accept="images/*" onChange={handleImageChange}/>
										</div>
										<div>
										<h3>Seçilen Resim</h3>
										<img src= {selectedImage} alt="" className="formImage"></img>
										</div>
										<button type="submit" onClick={handleSubmit}>Gönder</button>
									</form>
								</div>
							</div>
						</div>
					)
					}
					</div>
				):(
					<div className="profile">
						<div className="profileH1">
							<h1>Profile</h1>
						</div>
						<div className="profileContainer">
							<div className="pTopBlock">
								<img className="pTopBlockImage" src={`data:image/png;base64,${user.imgBuffer}`} alt="pImage"/>
							</div>
							<div className="pBottomBlock">
								{nick === null ? (
									<div className="pIconBlock">
										<div className="pIconBlockPosition">
											<div className="settingIcon">
												<img className="setting" src={setting} alt="a" onClick={handleClick} />
											</div>
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
										<div className="pRowBlock">{user.nick}</div>
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
