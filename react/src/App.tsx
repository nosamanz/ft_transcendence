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
  const [user, setUser] = useState(null);
  console.log(user);
  return (
    <BrowserRouter>
    <div className='body'>
        <Navbar user = "Esma"/>
        <Routes>
          {
            user ? (<>
            <Route path='/' element = {<Home setUser={setUser}/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<LeaderBoard />} />
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
