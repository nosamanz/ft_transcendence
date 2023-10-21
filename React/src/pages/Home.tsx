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
	const [selectedImage, setSelectesImage] = useState("");
	const fileInput = document.getElementById('fileInput');
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
		const {name, value} = e.target;
		// setFormData({ ...formData, [name]:value});
	};
	const [reader, setReader] = useState<{reader: any}>();
	const handleImageChange = (e) =>{
		// const file = e.target.files[0];

		// const reader = new FileReader();
		// reader.readAsDataURL(file);
		// setReader({reader: reader});
		// console.log("filto: ", e.target.files[0])
		// if (file){
		// 	setSelectesImage(URL.createObjectURL(file));
		// 	// console.log("I'm here");
		// 	// formData.append('file', file);
		// }
		// else
		// {
		// 	setSelectesImage("");
		// }
		const selectedFile = e.target.files[0];
		console.log(e.target);
		console.log(e.target.files);

		// Create a new FileReader
		const fileReader = new FileReader();

		// Set up an event listener for when the file is loaded
		 fileReader.onload = (ea: any) => {
			// e.target.result contains the data URL of the file
			console.log("merba");
			console.log(ea.target);
			console.log(ea.target.result);
			const dataURL = ea.target.result;

			// Update the state with the data URL
			setSelectesImage(URL.createObjectURL(selectedFile));
			setReader(dataURL);
		};


		// Read the file as a data URL
		fileReader.readAsDataURL(selectedFile);
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
			console.log("File--- ")
			console.log(reader);
			formData.append('file', reader?.reader.result);
			const responseImage = await fetch(`https://${process.env.REACT_APP_IP}:80/avatar/upload`, {
				method: 'POST',
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					// 'authorization': 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk4OTU5LCJpYXQiOjEzMzM0MTUwODc2fQ.nQc9al-VV2z-w9oYNrG7_6KgMqQUcfy3yqqLq9fdR28',
					'Content-Type': 'multipart/form-data',
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
