import React, { useEffect, useState } from "react";
import Friend from "./Friend";
import { cookies } from "../App";
import find from "../images/find.png";
import { socket } from "../pages/Home";

const FriendsSidebar = () => {
    const [friendLists, setFriendLists] = useState([{}]);
    const [finds, setFinds] = useState<string>();
    const [status, setStatus] = useState<number>(0);

    socket.on("Friend Status", () => {
        console.log("Status değişti");
        setStatus(status + 1);
    })
    useEffect(() => {
        const fetchData = async () =>{
            console.log("İstek");
            const responseMessages = await fetch(`https://${process.env.REACT_APP_IP}:80/user/friends`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            })
            setFriendLists(await responseMessages.json())
        }
        fetchData();
    }, [status])

    const change = (e) =>{
        setFinds(e.target.value);
    }

    const handleClick = () =>{
        const fetchData = async () =>{
            await fetch(`https://${process.env.REACT_APP_IP}:80/user/findUser/${finds}`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            })
        }
        fetchData();
    }
	return(
        <div className="friendContainer">
            <div className="sidebarNav">
                <span className="sidebarLogo">Friends</span>
            </div>
            <div className="friendsMain">
                <div className="friendSearchForm">
                     <input className="searchInput" type="text" placeholder="find a user" onChange={change}/><div onClick={handleClick} className="searchButton"><img src={find} alt="find" /></div>
                </div>
                {friendLists.map((friend, index) => (
                    <Friend key={index} friend={friend} />
                ))}
            </div>
        </div>
	)
}

export default FriendsSidebar;
