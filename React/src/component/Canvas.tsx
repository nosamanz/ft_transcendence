import React, { useEffect, useRef, useState } from 'react';
import { socketGame } from './Game';
import { cookies } from '../App';
import Confetti from './Confetti';

const Canvas = ({ location, myNick, rival, roomID, setState, setPrivGame}: { location: string, myNick: string, rival: {nick: string, id: number}, roomID: string, setState: any, setPrivGame: any}) => {
	const canvasRef1 = useRef<HTMLCanvasElement | null>(null);
	const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
	const speed = 15;
	const paddleWidth = 15;
	const paddleHeight = 80;
	const leftPaddleX = 30;
	const rightPaddleX = 800 - 15 - 30;
	let ctx1: any;
	let ctx2: any;
	const [disconnection, setDisconnection] = useState(false);
	const [myScore, setMyScore] = useState(0);
	const [rivalScore, setRivalScore] = useState(0);
	const [gameState, setGameState] = useState<{
		leftPaddleY: number,
		rightPaddleY: number,
		speedX: number,
		speedY: number,
		ballX: number,
		ballY: number}>({
			leftPaddleY: 300,
			rightPaddleY: 300,
			speedX: 5,
			speedY: 5,
			ballX: 395,
			ballY: 295
		});

	socketGame.on("updateGameState", (data) => {
		setGameState(data);
	});
	socketGame.on("scoreUpdate", async (pos) => {
		if (pos === "rivalDisconnected")
		{
			await fetch(`https://${process.env.REACT_APP_IP}:80/game/result/${rival.id}/3/0`, {
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
				}
			})
			setMyScore(3);
			setRivalScore(0);
			setDisconnection(true);
			socketGame.emit("stopInterval", roomID);
			socketGame.disconnect();
		}
		else if (location === pos){
			setMyScore(myScore + 1)
			if(myScore + 1 == 10)
			{
				console.log("I WON");
				await fetch(`https://${process.env.REACT_APP_IP}:80/game/result/${rival.id}/${myScore}/${rivalScore}`, {
					headers: {
						'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
					}
				})
				socketGame.emit("stopInterval", roomID);
				socketGame.disconnect();
			}
		}
		else {
			setRivalScore(rivalScore + 1)
			if(rivalScore + 1 == 10)
				socketGame.disconnect();
		}
	});

	const printNick = (ctx: any, nick: string, x: number, y: number): void => {
		if (nick !== undefined)
			ctx.fillText(nick.length > 10 ? nick.substring(0, 9) + "." : nick, x, y);
	}

	useEffect(() => {
		const canvas1 = canvasRef1.current;
		const canvas2 = canvasRef2.current;
		if (canvas2 && canvas1) {
			// Initialize your canvas2 and drawing logic here
			ctx1 = canvas1.getContext('2d');
			ctx2 = canvas2.getContext('2d');

			if(ctx1)
			{
				ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
				ctx1.fillStyle = 'black';
				ctx1.fillRect(0, 0, canvas1.width, canvas1.height);
				ctx1.fillStyle = 'white';
				ctx1.fillRect(5, 5, canvas1.width- 10, canvas1.height -10);
				ctx1.fillStyle = 'black';
				ctx1.fillRect(10, 10, canvas1.width- 20, canvas1.height -20);
				ctx1.fillStyle = 'white';
				ctx1.fillRect(393, 27, 15, 5);

				ctx1.font = '20px Arial';
				ctx1.fillStyle = 'white';


				if ( location === "left") {
					printNick(ctx1, myNick, 20, 35);
					printNick(ctx1, rival.nick, 675, 30);
					ctx1.font = '50px cursive';
					ctx1.fillStyle = 'white';
					ctx1.fillText(myScore, 340, 42);
					ctx1.fillText(rivalScore, 420, 42);
				} else {
					printNick(ctx1, myNick, 675, 30);
					printNick(ctx1, rival.nick, 20, 35);
					ctx1.font = '50px cursive';
					ctx1.fillStyle = 'white';
					ctx1.fillText(myScore, 420, 42);
					ctx1.fillText(rivalScore, 340, 42);
				}
			}
			if(ctx2)
				// Your drawing code goes here
				ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

				// back
				ctx2.fillStyle = 'black';
				ctx2.fillRect(0, 0, canvas2.width, canvas2.height);

				ctx2.fillStyle = 'white';
				ctx2.fillRect(5, 5, canvas2.width - 10, canvas2.height - 10);

				ctx2.fillStyle = 'black';
                ctx2.fillRect(10, 10, canvas2.width - 20, canvas2.height - 20);

				ctx2.fillStyle = 'white';
                ctx2.fillRect(canvas2.width / 2 - 7, 30, 15, canvas2.height - 60);


				// Draw left paddle
				ctx2.fillStyle = 'white';
				ctx2.fillRect(leftPaddleX, gameState.leftPaddleY, paddleWidth, paddleHeight);

				// Draw right paddle
				ctx2.fillStyle = 'white';
				ctx2.fillRect(rightPaddleX, gameState.rightPaddleY, paddleWidth, paddleHeight);

				// Draw ball
				ctx2.fillStyle = 'black';
				ctx2.fillRect(gameState.ballX, gameState.ballY, 20, 20);
				ctx2.fillStyle = 'white';
				ctx2.fillRect(gameState.ballX + 1, gameState.ballY + 1, 18, 18);
		}

	}, [gameState, myScore, rivalScore, disconnection, roomID]);

	const handleClick = () =>{
		socketGame.disconnect();
		setState(0);
		setPrivGame(0);
	}
	
	return (<>
		<canvas
			ref={canvasRef1}
			width={800}// Canvas Width
			height={60}// Canvas Height
			style={{ border: '1px solid black' }}
		></canvas>
			<div className='WinState'>
			{
				myScore === 10 ? (
					<div>
						<p className='confetti'>You Win</p>
						<Confetti /> 
					</div>
				) : rivalScore === 10 ? (
					<p className='confetti'>You Lose</p>
				) : disconnection === true ? (
					<div>
						<p className='confetti'>You Win (Your rival disconnected!)</p>
						<Confetti />
					</div>
				 ) :( null )
			}
			</div>
		<canvas
			ref={canvasRef2}
			width={800}// Canvas Width
			height={600}// Canvas Height
			style={{ border: '1px solid black' }}
		></canvas>
	    <button className="canvasX" onClick={handleClick}>X</button>
	</>);

};

export default Canvas;
