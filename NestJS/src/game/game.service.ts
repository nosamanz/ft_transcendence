import { Injectable } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { connectedGameSockets } from 'src/game/game.gateway';

let roomStates: Map<string, { leftPaddleY: number, rightPaddleY: number, ballX: number, ballY: number, speedX: number, speedY: number, }> = new Map();
let speed: number = 10;
//let waitNewBallCount: number = 0;

@Injectable()
export class GameService {
    leaveRoom(server: Server, client: Socket): number
    {
        const adapter = server.of('/').adapter;
        let rooms: Map<string, string[]> = new Map()
		adapter.sids.forEach((value, key) => {
            const arr: any[] = Array.from(value)
            if(arr.length === 2)
            {
                if (rooms.has(arr[1]) === false)
                    rooms.set(arr[1], ["1", arr[0]]);
                else
                    rooms.set(arr[1], ["2", arr[0]]);
        }
        });
        rooms.forEach((value, key) => {
            if(value[0] === "1")
            {
                // value[1] won game because his rival disconnected
                let socket: Socket = connectedGameSockets.find(element => element.id === value[1]);
                if (socket)
                {
                    socket.emit("scoreUpdate", "rivalDisconnected");
                    socket.disconnect();
                }
            }
        })
        return;
    }

    createRoom(server: Server, roomId: string, socket1: Socket, socket2: Socket) {
        roomStates.set(roomId, { leftPaddleY: 245, rightPaddleY: 245, ballX: 395, ballY: 295, speedX: 5, speedY: 5 });
        socket1.join(roomId);
        socket2.join(roomId);
        socket1.emit('openGame', {rival: socket2.id, myLocation: "left", roomID: roomId});
        socket2.emit('openGame', {rival: socket1.id, myLocation: "right", roomID: roomId});
        this.startGameLoop(server, roomId);
    }

    startGameLoop(server: Server, roomId: string) {
		setInterval(() => {
            //if (waitNewBallCount === 0)
            //{
                let gameState = roomStates.get(roomId);
                if (gameState) {
                    if (gameState.ballX + gameState.speedX >= 780)
                    {
                        //soldaki atti
                        server.to(roomId).emit('scoreUpdate', "left");
                        gameState.ballX = 400;
                        gameState.ballY = 295;
                        gameState.speedX = -5;
                        gameState.speedY = 0;
                    }
                    if (gameState.ballX + gameState.speedX <= 10)
                    {
                        //sağdaki atti
                        server.to(roomId).emit('scoreUpdate',  "right");
                        gameState.ballX = 390;
                        gameState.ballY = 295;
                        gameState.speedX = 5;
                        gameState.speedY = 0;
                    }
                    if (gameState.ballY + gameState.speedY >= 580 || gameState.ballY + gameState.speedY <= 10 )
                        gameState.speedY = -gameState.speedY;
                    gameState = this.paddleCollision(gameState);
                    gameState.ballX += gameState.speedX;
                    gameState.ballY += gameState.speedY;
                    server.to(roomId).emit('updateGameState', gameState);
                }
            //}
            //else
            //{
            //    waitNewBallCount--;
            //}
        }, 1 ); // 60 FPS
	}

    paddleCollision(e: any): any{
        if (e.ballX >= 30 && e.ballX <= 30 + 15 && e.ballY >= e.leftPaddleY - 20 && e.ballY <= e.leftPaddleY + 80)
        {
            if(e.ballY >= e.leftPaddleY - 20 && e.ballY < e.leftPaddleY + 30)
            {
                //üst parça 45 fark
                e.speedY = -(((e.ballY - (e.leftPaddleY - 20)) / 5) + 1);
                e.speedX = (10 - (((e.ballY - (e.leftPaddleY - 20)) / 5) + 1));
            }
            if(e.ballY >= e.leftPaddleY + 30 && e.ballY < e.leftPaddleY + 80)
            {
                //alt parça
                e.speedY = (((e.ballY - (e.leftPaddleY + 30)) / 5) + 1);
                e.speedX = (10 - (((e.ballY - (e.leftPaddleY + 30)) / 5) + 1));
            }
            if(e.speedY >= 0 && e.speedY < 1)
            {
                e.speedY = 1;
                e.speedX = 9;
            }
            if(e.speedY <= 0 && e.speedY > -1)
            {
                e.speedY = -1;
                e.speedX = 9;
            }
            if((e.speedX >= 0 && e.speedX < 1) || e.speedX < 0)
            {
                e.speedY = 9;
                e.speedX = 1;
            }
        }
        if (e.ballX >= 755 - 10 && e.ballX <= 755 + 5 && e.ballY >= e.rightPaddleY - 20 && e.ballY <= e.rightPaddleY + 80)
        {
            if(e.ballY >= e.rightPaddleY - 20 && e.ballY < e.rightPaddleY + 30)
            {
                //üst parça 45 fark
                e.speedY = -(((e.ballY - (e.rightPaddleY - 10)) / 5) + 1);
                e.speedX = -(10 - (((e.ballY - (e.rightPaddleY - 10)) / 5) + 1));
            }
            if(e.ballY >= e.rightPaddleY + 30 && e.ballY < e.rightPaddleY + 80)
            {
                //alt parça
                e.speedY = (((e.ballY - (e.rightPaddleY + 30)) / 5) + 1);
                e.speedX = -(10 - (((e.ballY - (e.rightPaddleY + 30)) / 5) + 1));
            }
            if(e.speedY >= 0 && e.speedY < 1)
            {
                e.speedY = 1;
                e.speedX = -9;
            }
            if(e.speedY <= 0 && e.speedY > -1)
            {
                e.speedY = -1;
                e.speedX = -9;
            }
            if((e.speedX <= 0 && e.speedX > -1) || e.speedX > 0)
            {
                e.speedY = 9;
                e.speedX = -1;
            }
        }
        return e
    }

    movePaddle(server: Server, clientID: string, obj: {rivalID: string, direction: string, location: string, roomID: string}): void {
        let gameStates: any = roomStates.get(obj.roomID);
        const stick: number = this.findStick(clientID, obj.rivalID, obj.location);
        const paddles: {leftPaddleY: number, rightPaddleY: number} = this.move(obj.direction, stick, gameStates)
        gameStates.leftPaddleY = paddles.leftPaddleY;
        gameStates.rightPaddleY = paddles.rightPaddleY;
        roomStates.set(obj.roomID, gameStates);
        server.to(obj.roomID).emit('updateGameState', gameStates)
    }

    move(direction: string, stick: number, gameStates: any): {leftPaddleY: number, rightPaddleY: number} {
		let leftY: number = gameStates.leftPaddleY;
		let rightY: number = gameStates.rightPaddleY;
        if(direction == "ArrowUp")
		{
			// up movement
			if (stick === 0)
			{
				if (gameStates.leftPaddleY >= 15 + 15)
                    leftY = gameStates.leftPaddleY - speed;
                //gameStates = this.moveWithAcceleration(gameStates, direction);
                //    leftY = gameStates.leftPaddleY;
            }
			else
			{
                if (gameStates.rightPaddleY >= 15 + 15)
                    rightY = gameStates.rightPaddleY - speed;
            }
        }
        else
        {
            // down movement
            if (stick === 0)
            {
                //gameStates = this.moveWithAcceleration(gameStates, direction);
                //leftY = gameStates.leftPaddleY;
                if (gameStates.leftPaddleY <= 600 - (80)/*paddleHeight*/ - 15 - 10 - 10)// Canvas Height
                    leftY = gameStates.leftPaddleY + speed;
            }
            else
            {
                if (gameStates.rightPaddleY <= 600 - (80)/*paddleHeight*/ - 15 - 10 - 10)// Canvas Height
                    rightY = gameStates.rightPaddleY + speed;
            }
        }
        return {leftPaddleY: leftY, rightPaddleY: rightY};
    }

	findStick(player: string, rivalSocket: string, location: string): number {
		let res: number = 0;
		if(rivalSocket === player)
		{
			if(location === "left")
				res = 1
		}
		else if(location === "right")
			res = 1;
		return res;
	}
    //private speed: number = 0;
    //private acceleration: number = 0.5;
    //private maxSpeed: number = 10;
    //moveWithAcceleration(gameState, direction){
    //    if (direction === "ArrowUp") {
    //        // Accelerate the paddle upwards
    //        this.speed -= this.acceleration;
    //      } else if (direction === "ArrowDown") {
    //        // Accelerate the paddle downwards
    //        this.speed += this.acceleration;
    //      } else {
    //        // Decelerate the paddle when no input is given
    //        if (this.speed > 0) {
    //          this.speed -= this.acceleration;
    //        } else if (this.speed < 0) {
    //          this.speed += this.acceleration;
    //        }
    //      }
    //      console.log(this.speed);
    //      // Limit the paddle's speed to the maximum speed
    //      this.speed = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.speed));
    //
    //      // Update the paddle's position based on its current speed
    //      gameState.leftPaddleY += this.speed;
    //      return gameState
    //      // Ensure the paddle stays within the game boundaries
    //    //  this.y = Math.max(0, Math.min(gameHeight - paddleHeight, this.y));
    //}
}
