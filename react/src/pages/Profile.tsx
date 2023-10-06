import React, {useEffect, useState} from "react";
import image from "../images/free-photo1.jpeg"
// import { cookies } from "../App";

const Profile = () => {
	const [user, setUser] = useState({});
	useEffect (() =>{
		const fetchData = async () =>{

			const responseUser = await fetch("http://10.12.14.1:80/user", {
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					'Content-Type': 'application/json'
				}
			});
			setUser(await responseUser.json());
			console.log("profile "+user);
		}
		fetchData();
	}, [])

	return(
		<div className="profile">
			<div className="profileH1">
				<h1>Profile</h1>
			</div>
			<div className="profileContainer">
				<div className="pTopBlock">
					<img className="pTopBlockImage" src={image} alt="pImage"/>
				</div>
				<div className="pBottomBlock">
					<div className="pIconBlock">
						<div className="addIcon">
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" >
								<path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
								<path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
							</svg>
						</div>
						<div className="toogleContainer">
							<input id="toogle" className="toggle-checkbox" type="checkbox" />
							<label for="toogle" className="toogle-label">
									<div className="toogle-p-Div">
										<p className="toogle-p">
										ON    OFF
										</p>
									</div>
							</label>
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

export default Profile;
// [
// 	{
// 		nick: makrdes,
// 		win_count: 12,
// 		looe_count: 12,
// 		latterLevel: 290,
// 	},
// 	{
// 		nick: ebattal,
// 		win_count: 12,
// 		looe_count: 12,
// 		latterLevel: 290,
// 	},
// 	{
// 		nick:oozcan,
// 		win_count: 12,
// 		looe_count: 12,
// 		latterLevel: 290,
// 	}
// ]