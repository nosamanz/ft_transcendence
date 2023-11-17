import React, { useEffect, useState } from 'react';
import io from "socket.io-client";
import Canvas from './Canvas';
import { cookies } from "../App";
import CanvasMode from './CanvasMode';
import GameRequest from './GameRequest';

let rivalSocketID: string = "";
let rivalID: number;

export let socketGame = io(`https://${process.env.REACT_APP_IP}:80`, {
    transports: ['websocket']
});

const Game = ({user}) => {
    const [state, setState] = useState(0);
    const [rivalNick, setRivalNick] = useState<string>("");
    const [myNick, setMyNick] = useState<string>("");
    const [location, setLocation] = useState<string>("");
    const [roomID, setRoomID] = useState<string>("");

    socketGame.on("openGame", async (data) => {
        rivalID = data.rivalId;
        rivalSocketID = data.rival;
        setRoomID(data.roomID);
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
    
    socketGame.on("openModeGame", async (data) => {
        rivalID = data.rivalId;
        rivalSocketID = data.rival;
        setRoomID(data.roomID);
        setLocation(data.myLocation);
        setState(3);
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
            if (state === 2)
                socketGame.emit('movePaddle', {rivalID: rivalSocketID, direction: e.key, location: location, roomID: roomID});
            else
                socketGame.emit('moveModePaddle', {rivalID: rivalSocketID, direction: e.key, location: location, roomID: roomID});
        }
    };

    const handleKeyUp = (e: any) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            if (state === 2)
                socketGame.emit('stopPaddle', {rivalID: rivalSocketID, direction: e.key, location: location, roomID: roomID});
            else
                socketGame.emit('stopModePaddle', {rivalID: rivalSocketID, direction: e.key, location: location, roomID: roomID});
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyDown);
        };
    }, [roomID, location]);

    const handleClick = () => {
        socketGame.disconnect();
        socketGame = io(`https://${process.env.REACT_APP_IP}:80`, {
            transports: ['websocket']
        });
        socketGame.emit('joinChannel', {id: user.id});
        setState(1);
    }
    
    const handleModeClick = () => {
        socketGame.disconnect();
        socketGame = io(`https://${process.env.REACT_APP_IP}:80`, {
            transports: ['websocket']
        });
        socketGame.emit('joinModeChannel', {id: user.id});
        setState(1);
    }

    return(
        <div className='oyun'>
        {
            state === 0 ? (<div className='game'>
                <div className="gameLeft">
                    <div className="PlayButton" onClick={handleClick}>
                        PLAY
                    </div>
                    <div className="PlayModeButton" onClick={handleModeClick}>
                        PLAY MODE
                    </div>
                </div>
                <div className="gameRight">
                    <GameRequest />
                </div>
            </div>
            )
            : state === 1 ? (
                <div>
                    <p>Please wait for a connection</p>
                </div>
            )
            : state === 2 ?(
                <div>
                    <Canvas location={location} myNick={myNick} rival={{nick: rivalNick, id: rivalID}} roomID={roomID} setState={setState}/>
                </div>
            ) : (
                <div>
                    <CanvasMode location={location} myNick={myNick} rival={{nick: rivalNick, id: rivalID}} roomID={roomID} setState={setState}/>
                </div>
            )
        }
        </div>
    )
};

export default Game;
