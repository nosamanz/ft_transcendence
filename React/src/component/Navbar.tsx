import React,{ Component, useState } from "react";
import {Link, Routes, Route, Router, useNavigate} from "react-router-dom";
import Login from "../pages/Login";
import PersonIcon from '@mui/icons-material/Person';
import Profile from "../pages/Profile";
import LeaderBoard from "../pages/LeaderBoard";


const Navbar = ({user}) => {
    const navigate = useNavigate();
    const [location, setLocation] = useState("");
    const handleClick = (location) =>{
        navigate(location);
    }   
    return (
        <div className="navbar">
            <span className="logo"><Link to="/" className="link">TRANSCENDENCE</Link></span>
            {user ? (
                <ul className="list">
                 <p className="pItem">{user}</p>
                   
                     {/* <img src="" alt="img" className="avatar"></img> */}
                     <span className="iconItem"><PersonIcon/></span>
                 <li className="listItem"><Link className="link" to="/profile">Profile</Link></li>
                 <li className="listItem"><Link className="link" to="/leaderboard">LeaderBoard</Link></li>
                 <li className="listItem"><Link className="link" to="/chat">Chat</Link></li>
                 <li className="listItem">Logout</li>
             </ul>
            ) : (
                <ul className="list">
                        <li className="listItem">
                <Link className="link" to="login" >
                            Login
                </Link>
                        </li>
                 </ul>
            )}
           
        </div>
    )
}
export default Navbar;