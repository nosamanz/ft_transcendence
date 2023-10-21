import React, { useEffect, useState } from "react";
import Friend from "./Friend";
import { cookies } from "../App";

const FriendsSidebar = () => {
    const [friendLists, setFriendLists] = useState([{}]);

    useEffect(() => {

        const fetchData = async () =>{
                const responseMessages = await fetch(`https://${process.env.REACT_APP_IP}:80/user/friends`, {
                    headers: {
                        'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                    }
                })
                setFriendLists(await responseMessages.json())
            }
            fetchData();
    }, [])
	return(
        <div>
            <div className="sidebarNav">
                <span className="sidebarLogo">Friends</span>
            </div>
            <div className="friendsMain">
                {friendLists.map((user, index) => (
                    <Friend key={index} user={user} />
                ))}
            </div>
        </div>
	)
}

export default FriendsSidebar;
