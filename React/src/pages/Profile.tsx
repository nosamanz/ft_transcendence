import React, {useEffect, useState} from "react";
import image from "../images/free-photo1.jpeg"
import addPerson from "../images/addPerson.png"
import { cookies } from "../App";
import TFA from "../component/TFA";
import ToggleSwitch from "../component/ToggleSwitch";
import { useLocation, useParams } from "react-router-dom";

const Profile = () => {
	const location = useLocation();
	console.log(location);
	const searchParams = new URLSearchParams(location.search);
	const nick = searchParams.get('nick');

	console.log(nick);

	const [user, setUser] = useState({imgBuffer: undefined});
	const [isTFAPopUp, setIsTFAPopUp] = useState<boolean>(false);
	const [toggleState, setToggleState] = useState<boolean>(false);
    const [QR, setQR] = useState("");
	let tfa: boolean = false;

	useEffect (() =>{
		if (nick)
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
	}, [])

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
	return(
		<div className="Profile">
			{
				isTFAPopUp === true ?
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
								<img className="pTopBlockImage" src={`data:image/png;base64,${user.imgBuffer}`} alt="pImage"/>
							</div>
							<div className="pBottomBlock">
								<div className="pIconBlock">
									<div className="pIconBlockPosition">
										<div className="toogleContainer">
											<ToggleSwitch checked={toggleState} onChange={handleToggleChange} />
										</div>
									</div>
								</div>
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
