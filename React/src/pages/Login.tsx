import React, { useState, useEffect } from 'react';
import L42 from '../images/42icon.png';
import { cookies } from '../App';
import TFAVerify from '../component/TFAVerify';
import { socket } from './Home';

export const Login = ({setUser, isTFAStatus, setIsTFAStatus}) => {

	useEffect(() => {
		const fetchData = async () => {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');

			if(code)
			{
				const data = {}
				data['grant_type']= 'authorization_code';
				data['client_id']= process.env.REACT_APP_UID;
				data['client_secret']= process.env.REACT_APP_SECRET;
				data['code']= code;
				data['redirect_uri']= process.env.REACT_APP_REDIRECT_URI;

				const response = await fetch(`https://${process.env.REACT_APP_IP}:80/auth/42/signin_intra`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify( data ), // Assuming code is an object
				});
				const responseData = await response.json();
				await fetch(`https://${process.env.REACT_APP_IP}:80/chat/connect`, {
					headers: {
						'socket-id': socket.id,
						'authorization': 'Bearer ' + responseData.token,
					},
				});
				// {token: Jwt_Token, result: 0} The new user has been saved in database and the token has been created.
				// {token: Jwt_Token, result: 1} The user has already been saved in database and the token has been created.
				// {token: Jwt_Token, result: 2} The user should be redirected to the TFA page.
				cookies.set("jwt_authorization", responseData.token);
				if(responseData.result === 2)
				{
					setIsTFAStatus(true);
					return;
				}
				const responseUser = await fetch(`https://${process.env.REACT_APP_IP}:80/user`, {
					headers: {
						'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					}
				});
				const UserData = await responseUser.json();
				setUser(UserData);
			}
		}
		fetchData();
	}, []);


	const handleFTLogin = () => {
		window.location.href=(process.env.REACT_APP_API);
	};

	return (
		<div className='login'>
		{
			isTFAStatus === true ?
			(<TFAVerify setIsTFAStatus={setIsTFAStatus} setUser={setUser}/>):
			(<div className="wrapper">
				<div className="loginButton" onClick={handleFTLogin}>
				<img src={L42} alt="" className="icon" />
				Login
				</div>
			</div>
			)
		}
		</div>
  );
};

export default Login;
