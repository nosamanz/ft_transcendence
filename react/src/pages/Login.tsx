import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L42 from '../images/42icon.png';
import { Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Home from '../pages/Home';

const Login = ({setUser}) => {

	const [data, setData] = useState("");
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const params = new URLSearchParams(window.location.search);
			const code = params.get('code');
			const data = {};
			data["data"] = code;

			if (!loaded) {
				setLoaded(true);
			}
			else if(code)
			{
				const response = await fetch('http://10.12.14.1:80/auth/42/signin_intra', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( data ), // Assuming code is an object
			});

			const responseData = await response.json();
			console.log("----->");
			console.log(responseData.token);

			const responseUser = await fetch("http://10.12.14.1:80/user", {
				headers: {
					'authorization': 'Bearer ' + responseData.token,
                    'Content-Type': 'application/json'
				}
			});
			const UserData = await responseUser.json();
			console.log(UserData);
			setUser(UserData.name);
		}
	}
    fetchData();
  }, [loaded]);


  const handleFTLogin = () => {
	window.location.href=('https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-49c00e638b92e23cd3e1a9e499e18c4f0187c30258c088afa3788a9d97129c66&redirect_uri=http%3A%2F%2F10.12.14.1%3A80%2Fauth%2F42%2Fgetcode&response_type=code');
};

  return (
    <div className="login">
      <div className="wrapper">
        <h1 className="loginH1">Giriş Yapınız</h1>

        <div className="loginButton" onClick={handleFTLogin}>
          <img src={L42} alt="" className="icon" />
          Login
        </div>
      </div>
    </div>
  );
};

export default Login;