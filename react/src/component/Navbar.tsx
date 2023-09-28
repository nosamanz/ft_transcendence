import React,{ Component } from "react";
import {Link} from "react-router-dom";
import Login from "../pages/Login";

const Navbar = ({user}) => {
    return (
        <div className="navbar">
            <span className="logo"><Link to="/" className="link">TRANSCENDENCE</Link></span>
            {user ? (
                 <ul className="list">
                 <li className="listItem">
                     <img src="" alt="img" className="avatar"></img>
                 </li>
                 <p className="pItem">{user}</p>
                 <li className="listItem">Profile</li>
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