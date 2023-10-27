import React, {useState, useEffect, Component} from "react";
// import { cookies } from "../App";
import io from "socket.io-client";
import { cookies } from '../App';

export const socket = io(`https://${process.env.REACT_APP_IP}:80`, {
	transports: ['websocket']
});

socket.on("connect", async () => {
	const response = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/connect`, {
		headers: {
			'socket-id': socket.id,
			'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
		},
	});
	// socket.emit("chat", {channelName: "123", message: "Geldim"})
	// console.log("RESPONSE-"+response.ok);
});

socket.on('connect_error', (error) =>{
	console.log('Bağlantı hatası', error);
});

const Home = ({user}) =>{
	const [loaded, setLoaded] = useState(false);
	const [reader, setReader] = useState<any>();
	const [selectedImage, setSelectesImage] = useState("");
	const [nick, setNick] = useState("");
	useEffect (() => {
		const fetchData = async () =>{
			const response = await fetch(`https://${process.env.REACT_APP_IP}:80/user/isSigned`, {
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            });
            const IsSigned = await response.json();
			if (IsSigned === true)
			setLoaded(true);
        }
		if (loaded === false)
        	fetchData();
    }, [])
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
	};

	return(
		<div className="home">
		{
			loaded ? (
				<div className="containerHome">
				</div>
			)
			:
			(
				<div className="form">
					<div className="formHeader">
						<h2 className="homeForm">Nickname ve Resim Seçin</h2>
					</div>
					<div className="formBody">
						<form>
							<div className="formDiv">
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
			)
		}
		</div>
	)
}

export default Home;
