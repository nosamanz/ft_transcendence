import React from "react";



const Login  = () => {
	return(
		<div className="login--style" style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
			<div className="login--container" style={{width:'300px', height:'500px'}}>
			 	<button type="button" id = "42" onClick={event=>{window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-1f2410ba3886eb4fffb4504867eb5932cf2c822199a8e574ec4f6c3ab43f1104&redirect_uri=http%3A%2F%2F10.12.14.1%3A80%2Fauth%2Fgetcode&response_type=code'}}>42 İle Giriş Yap</button>
			</div>
		</div>
	);
};

export default Login;
