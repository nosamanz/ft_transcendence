import React, { useState } from "react";
import messageIcon from "../images/message.png";
import ignoreIcon from "../images/ignore.png"
import gameInvite from "../images/gameInvite.png"
import invite from "../images/invite.png"
import Profile from "../pages/Profile"
import { Link } from "react-router-dom";

const Friend = ({user}) =>{
    const nick = useState<string>(user.OtherUserNick);
	const HandleClick = async () =>
    {

    }
    return(
            <div className="friendOnePerson">
                <div>
                    <Link className="link" to={`/profile?nick=${user.OtherUserNick}`} ><span>{user.OtherUserNick}</span></Link>
                </div>
                <div className="friendIcons">
                    <img className="friendIcon" src={messageIcon} alt="a"/>
                    <img className="friendIcon" src={ignoreIcon} alt="b"/>
                    <img className="friendIcon" src={gameInvite} alt="c"/>
                    <img className="friendIcon" src={invite} alt="d"/>
                </div>
            </div>
    )
}
export default Friend;
