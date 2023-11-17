import React, { useState, useEffect } from 'react';
import L42 from '../images/42icon.png';
import { cookies } from '../App';
import TFAVerify from '../component/TFAVerify';
import { socket } from './Home';



export const Login = ({setUser, isTFAStatus, setIsTFAStatus, setMaxSocket, setIsFormSigned}) => {

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
				// {token: Jwt_Token,  result: 0} The new user has been saved in database and the token has been created.
				// {token: Jwt_Token,  result: 1} The user has already been saved in database and the token has been created.
				// {token: Jwt_Token,  result: 2} The user should be redirected to the TFA page.
				// {token: return_msg, result:-1} The user couldn't log in.
				if (responseData.result === -1)
				{
					alert("You couldn't log in!!");
					return;
				}
				const responseIsConnected = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/isConnected`, {
					headers: {
						'authorization': 'Bearer ' + responseData.token,
					},
				});
				const IsConnected = await responseIsConnected.json();
				if (IsConnected.res === 1)
				{
					console.log("Login");
					alert(IsConnected.msg);
					setMaxSocket(true);
					return;
				}
				setMaxSocket(false);
				await fetch(`https://${process.env.REACT_APP_IP}:80/chat/connect`, {
					headers: {
						'socket-id': socket.id,
						'authorization': 'Bearer ' + responseData.token,
					},
				});
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
			const resIsSigned = await fetch(`https://${process.env.REACT_APP_IP}:80/user/isSigned`, {
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
			});
			const IsSigned = await resIsSigned.json();
			if (IsSigned === true)
				setIsFormSigned(true);
		}
		fetchData();
	}, []);


	const handleFTLogin = () => {
		window.location.href=(process.env.REACT_APP_API);
	};
	const calculateTransform = (index) => {
		const degree = 7.2 * index;
		return `rotate(${degree}deg) translate(300px) rotate(${0}deg)`;
	  };
	const spanCount = 50;

  	const spans = Array.from({ length: spanCount }, (_, index) => (
   	 <span key={index} style={{ '--i': index, transform: calculateTransform(index)}} className="blinking-span"></span>
 	 ));
	return (
		<div className='login'>
		{
			isTFAStatus === true ?
			(<TFAVerify setIsTFAStatus={setIsTFAStatus} setUser={setUser}/>):
			(<div className="wrapper">
				<div className='login-box'>
					<div className="loginButton" onClick={handleFTLogin}>
						<img src={L42} alt="" className="icon" />
						Login
					</div>
				</div>
				{spans}
			</div>
			)
		}
		</div>
  );
};

export default Login;
