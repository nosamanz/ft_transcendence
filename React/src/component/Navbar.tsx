import React from "react";
import {Link} from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import { cookies } from "../App";


const Navbar = ({user, setUser}) => {
    const HandleDisconnection = () => {
        cookies.remove("jwt_authorization");
        cookies.remove("TFAStatus");
        setUser({res: "undefined"})
    }
    return (
        <div className="navbar">
            <span className="logo"><Link to="/" className="link">TRANSCENDENCE</Link></span>
            {user.res !== "undefined" ? (
                <ul className="list">
                 <p className="pItem">{user.nick}</p>

                     {/* <img src="" alt="img" className="avatar"></img> */}
                     <span className="iconItem"><PersonIcon/></span>
                 <li className="listItem"><Link className="link" to="/profile">Profile</Link></li>
                 <li className="listItem"><Link className="link" to="/leaderboard">LeaderBoard</Link></li>
                 <li className="listItem"><Link className="link" to="/chat">Chat</Link></li>
                 <li className="listItem" onClick={HandleDisconnection}><Link className="link" to="/">Logout</Link></li>
             </ul>
            ) : (null)}

        </div>
    )
}
export default Navbar;
