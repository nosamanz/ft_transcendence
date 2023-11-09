import React, { useEffect, useState } from "react";
import Friend from "./Friend";
import { cookies } from "../App";
import find from "../images/find.png";

const FriendsSidebar = () => {
    const [friendLists, setFriendLists] = useState([{}]);
    const [finds, setFinds] = useState<string>();

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
    const change = (e) =>{
        setFinds(e.target.value);
    }
    const handleClick = () =>{
        const fetchData = async () =>{
            const response = await fetch(`https://${process.env.REACT_APP_IP}:80/user/findUser/${finds}`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            })
            const deneme = await response.json();
            console.log(finds, deneme);
        }

        // const fetchData3 = async () =>{
        //     const response2 = await fetch(`https://${process.env.REACT_APP_IP}:80/user/acceptFriend/oozcan`, {
        //         headers: {
        //             'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
        //         }
        //     })
        //     const a = await response2.json();
        //     console.log(finds, a);
        // }

        fetchData();
        // fetchData3();
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
                {friendLists.map((user, index) => (
                    <Friend key={index} user={user} />
                ))}
            </div>
        </div>
	)
}

export default FriendsSidebar;
