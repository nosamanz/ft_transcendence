import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import Canvas from './Canvas';

let rivalID: string = "";

export let socketGame = io(`https://${process.env.REACT_APP_IP}:80`, {
    transports: ['websocket']
});

const Game = ({user}) => {
    const [state, setState] = useState(0);
    const [rivalSocket, rivalSocketSet] = useState<string>("");
    const [location, locationSet] = useState<string>("");
    const [roomID, roomIDSet] = useState<string>("");

    socketGame.on("openGame", (data) => {
        rivalID = data.rival;
        roomIDSet(data.roomID);
        rivalSocketSet(data.rival);
        locationSet(data.myLocation);
        setState(2);
    });

    const handleKeyDown = (e: any) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            socketGame.emit('movePaddle', {rivalID: rivalID, direction: e.key, location: location, roomID: roomID});
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [roomID, rivalSocket, location]);

    const handleClick = () => {
        socketGame.disconnect();
        socketGame = io(`https://${process.env.REACT_APP_IP}:80`, {
            transports: ['websocket']
        });
        socketGame.emit('joinChannel');
        setState(1);
        console.log("Girdim " + socketGame.id)
    }

    return(
        <div className='oyun'>
        {
            state === 0 ? (
                <button onClick={handleClick} className="paddle">Play</button>
            )
            : state === 1 ? (
                <div>
                    <p>Please wait for a connection</p>
                </div>
            )
            :
            (
                <div>
                    <Canvas rivalSocket={rivalSocket} location={location} user={user}/>
                </div>
            )
        }
        </div>
    )
};

export default Game;
