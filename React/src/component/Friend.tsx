import React, { useState } from "react";
import messageIcon from "../images/message.png";
import ignoreIcon from "../images/ignore.png"
import gameInvite from "../images/gameInvite.png"
import invite from "../images/invite.png"
import Profile from "../pages/Profile"
import { Link } from "react-router-dom";
import { cookies } from "../App";

const Friend = ({friend}) =>{
    const nick = useState<string>(friend.OtherUserNick);
	const privMsg = () =>
    {
        let myid: number;
        let chName: string;
        const fetchMe = async () =>{
            const response = await fetch(`https://${process.env.REACT_APP_IP}:80/user`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            })
            const res = await response.json();
            myid = res.id;
            if (myid > friend.OtherUserID)
                chName = friend.OtherUserID + "-" + myid;
            else
                chName = myid + "-" + friend.OtherUserID;

            const chcreateRes = await fetch(`https://${process.env.REACT_APP_IP}:80/chat/${chName}/create/true/false/undefined`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    'Content-Type': 'application/json'
                }
            })
        }
        fetchMe();
    }
    const ignorePerson = () =>
    {
        const fetchData = async () =>{
            const response = await fetch(`https://${process.env.REACT_APP_IP}:80/user/ignoreUser/${friend.OtherUserNick}`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            })
        }
        fetchData()
    }
    const gInvite = () =>
    {

    }
    const msgInvite = () =>
    {

    }
    return(
            <div className="friendOnePerson">
                <div>
                    <Link className="link" to={`/profile?nick=${friend.OtherUserNick}`} ><span>{friend.OtherUserNick}</span></Link>
                </div>
                <div className="friendIcons">
                    <img className="friendIcon"onClick={privMsg} src={messageIcon} alt="a"/>
                    <img className="friendIcon"onClick={ignorePerson} src={ignoreIcon} alt="b"/>
                    <img className="friendIcon"onClick={gInvite} src={gameInvite} alt="c"/>
                    <img className="friendIcon"onClick={msgInvite} src={invite} alt="d"/>
                </div>
            </div>
    )
}
export default Friend;
