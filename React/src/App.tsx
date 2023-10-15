import React, {useState, useEffect} from 'react';
import './App.css';
import Navbar from './component/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import {BrowserRouter, Routes, Route, Link, Navigate} from "react-router-dom";
import Profile from './pages/Profile';
import LeaderBoard from './pages/LeaderBoard';
import Chat from './pages/Chat';
import Cookies from 'universal-cookie';
export const cookies = new Cookies();

function App() {
	const [currentChannel, setCurrentChannel] = useState("");
  const [user, setUser] = useState({res: "undefined"});
  useEffect(() => {
		const fetchData = async () => {
      if ( cookies.get("jwt_authorization") === "undefined")
      {
        setUser({res: "undefined"});
        return;
      }
      const responseUser = await fetch("http://10.12.14.1:80/user", {
        headers: {
          'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
        }
      });
      const res = await responseUser.json();
      if(res.statusCode === 403)
      {
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
        <Navbar user = "We won this match"/>
        <Routes>
          {
            user.res !== "undefined" ? (<>
            <Route path='/' element = {<Home user={user}/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
            <Route path='/chat' element={<Chat setCurrentChannel={setCurrentChannel}currentChannel={currentChannel} />}/>
            </>
              ) : (
                <Route path='/' element = {<Login setUser = {setUser}/>} />
            )
          }
        </Routes>
        {/* <Routes>
        <Route path='/home' element = {<Home setUser={setUser}/>} />
        <Route path='/login' element={<Login setUser={setUser} />}></Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
        <Route path='chat' element={<Chat/>}/>
        </Routes> */}
    </div>
    </BrowserRouter>
  );
}

export default App;
