import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import Canvas from './Canvas';
import L42 from '../images/42icon.png';
import { cookies } from "../App";

let rivalSocketID: string = "";
let rivalID: number;

export let socketGame = io(`https://${process.env.REACT_APP_IP}:80`, {
    transports: ['websocket']
});

const Game = ({user}) => {
    const [state, setState] = useState(0);
    const [rivalSocket, setRivalSocket] = useState<string>("");
    const [rivalNick, setRivalNick] = useState<string>("Başlangic");
    const [myNick, setMyNick] = useState<string>("Başlangic");
    const [location, setLocation] = useState<string>("");
    const [roomID, setRoomID] = useState<string>("");

    socketGame.on("openGame", async (data) => {
        rivalID = data.rivalId;
        rivalSocketID = data.rival;
        setRoomID(data.roomID);
        setRivalSocket(data.rival);
        setLocation(data.myLocation);
        setState(2);
        const response = await fetch(`https://${process.env.REACT_APP_IP}:80/user/nick/${rivalID}`, {
            headers: {
                'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
            }
        })
        const res = await response.json();
        setRivalNick(res.nick);
        setMyNick(res.myNick);
    });

    const handleKeyDown = (e: any) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            socketGame.emit('movePaddle', {rivalID: rivalSocketID, direction: e.key, location: location, roomID: roomID});
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
        socketGame.emit('joinChannel', {id: user.id});
        setState(1);
        console.log("Girdim " + socketGame.id)
    }

    return(
        <div className='oyun'>
        {
            state === 0 ? (
                <div className="PlayButton" onClick={handleClick}>
                    PLAY
                </div>
            )
            : state === 1 ? (
                <div>
                    <p>Please wait for a connection</p>
                </div>
            )
            :
            (
                <div>
                    <Canvas location={location} myNick={myNick} rival={{nick: rivalNick, id: rivalID}}/>
                </div>
            )
        }
        </div>
    )
};

export default Game;
