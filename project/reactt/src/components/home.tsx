import React from "react";
import Login from "./Login";
import Navbar from "./Navbar";

type  PropsType = {
    login: boolean,
    setViewCart: React.Dispatch<React.SetStateAction<boolean>>,
}

const Home = ({login, setViewCart}:PropsType) => {

	return (

		<div>
			<Navbar login={login} setViewCart={setViewCart} />
			<Login />
			<div>
				
			</div>
		</div>
	);
}
 export default Home;

