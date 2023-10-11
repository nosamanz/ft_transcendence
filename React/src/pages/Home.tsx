import React, {useState, useEffect, Component} from "react";
// import { cookies } from "../App";
import io from "socket.io-client";
import { cookies } from '../App';

export const socket = io('http://localhost:80', {
	transports: ['websocket']
});

socket.on("connect", async () => {
	const response = await fetch('http://10.12.14.1:80/chat/connect', {
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

const Home = ({setUser}) =>{
	const user = setUser;
	const [loaded, setLoaded] = useState(false);
	const [selectedImage, setSelectesImage] = useState("");
	const fileInput = document.getElementById('fileInput');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
		const {name, value} = e.target;
		// setFormData({ ...formData, [name]:value});
	};
	const [reader, setReader] = useState<{reader: any}>();
	const handleImageChange = (e) =>{
		const file = e.target.files[0];

		const reader = new FileReader();
		reader.readAsDataURL(file);
		setReader({reader: reader});
		console.log("filto: ", e.target.files[0])
		if (file){
			setSelectesImage(URL.createObjectURL(file));
			// console.log("I'm here");
			// formData.append('file', file);
		}
		else
		{
			setSelectesImage("");
		}
	}
	const handleSubmit = async (e: React.FormEvent) =>{
		e.preventDefault();

		try{
			// const response = await fetch('http://10.12.13.2:80/user/getForm', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// 	body: JSON.stringify(formData),
			// });
			// console.log(": " +formData.image);
			const formData = new FormData();
			console.log("File--- "+ reader?.reader.result)
			formData.append('file', reader?.reader.result);
			const responseImage = await fetch('http://10.12.14.1:80/avatar/upload', {
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					// 'authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTU5LCJpYXQiOjEzMzM0MTUwODc2fQ.nQc9al-VV2z-w9oYNrG7_6KgMqQUcfy3yqqLq9fdR28',
				},
				body: formData,
			});

			if (responseImage.ok){
				console.log('Image submitted successfully');
			}
			else{
				console.error('Image submission failed');
			}
			// if (response.ok){
				// 	console.log('Form submitted successfully');
				// }
				// else{
					// 	console.error('Form submission failed');
					// }
				}catch(error){
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
							<input type="text" name="name" placeholder={user} onChange={handleChange} className="formInput"></input>
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
