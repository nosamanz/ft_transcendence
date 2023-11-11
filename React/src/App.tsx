import React, {useState, useEffect} from 'react';
import './App.scss';
import Navbar from './component/Navbar';
import Home, { socket } from './pages/Home';
import Login from './pages/Login';
import {BrowserRouter, Routes, Route, Link, Navigate} from "react-router-dom";
import Profile from './pages/Profile';
import LeaderBoard from './pages/LeaderBoard';
import Chat from './pages/Chat';
import Cookies from 'universal-cookie';
import DeafaultPage from './pages/DeafaultPage';


export const cookies = new Cookies();

function App() {
	const [currentChannel, setCurrentChannel] = useState("");
  const [user, setUser] = useState({res: "undefined"});
	const [isTFAStatus, setIsTFAStatus] = useState(false);
	const [maxSocket, setMaxSocket] = useState(false);

  useEffect(() => {
		const fetchData = async () => {
      socket.on("connect", async () => {
        const token = cookies.get("jwt_authorization");
        if (token !== undefined){
          const responseIsConnected = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/isConnected`, {
          headers: {
            'authorization': 'Bearer ' + token,
          },
          });
          const IsConnected = await responseIsConnected.json();
          if (IsConnected.res === 1)
          {
          console.log("Home")
          alert(IsConnected.msg);
          setMaxSocket(true);
          return;
          }
          await fetch(`https://${process.env.REACT_APP_IP}:80/chat/connect`, {
          headers: {
            'socket-id': socket.id,
            'authorization': 'Bearer ' + token,
          },
          });
        }
      });
      if ( cookies.get("jwt_authorization") === "undefined")
      {
        setUser({res: "undefined"});
        return;
      }
      const responseUser = await fetch(`https://${process.env.REACT_APP_IP}:80/user/checkJWT`, {
        headers: {
          'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
        }
      });
      const res = await responseUser.json();
      if ( res.TFAuth === false || (res.TFAuth === true && cookies.get("Xcasfhajsd") === "kjshdfi23qwd"))
        setIsTFAStatus(false);
      else if (res.TFAuth === true)
        setIsTFAStatus(true);
      if(res === false)
      {
        cookies.remove('jwt_authorization')
        setUser({res: "undefined"});
        return;
      }
      setUser({...res, res: "user"});
		}
		fetchData();
	}, []);
  return (
    <BrowserRouter>
    <div className='body'>
        <Navbar user={user} setUser={setUser}/>
        <Routes>
          {
            user.res !== "undefined" && isTFAStatus !== true ?
            (<>
              <Route path='/' element = {<Home user={user} setMaxSocket={setMaxSocket}/>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/leaderboard" element={<LeaderBoard />} />
              <Route path='/chat' element={<Chat setCurrentChannel={setCurrentChannel} currentChannel={currentChannel}/>}/>
              <Route path='/*' element={<DeafaultPage/>}/>
            </>) : (<>
              <Route path='/' element={<Login setUser = {setUser} isTFAStatus={isTFAStatus} setIsTFAStatus={setIsTFAStatus} setMaxSocket={setMaxSocket}/>}/>
              <Route path='/*' element={<DeafaultPage/>}/>
            </>
            )
          }
        </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
