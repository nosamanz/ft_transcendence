import React from "react";
import image from "../images/avatar4.jpeg"
const GroupChatSearch = () =>{
    // useEffect (() => {
    //     const fetchData = async () =>{
    //         const responseGroupChat = await fetch(`http://10.12.14.1:80/user/GroupChat`, {
    //             headers: {
    //                 'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
    //                 'Content-Type': 'application/json'
    //             }
    //         });
    //         const Messages = await responseMessages.json();
    //     }
    //     if(currentChannel !== ""){
    //         fetchData();
    //     }
    // })
    return(
        <div className="chatSearch">
            <div className="searchForm">
                <input className="searchInput" type="text" placeholder="find a user" />
            </div>
            <div className="userChat">
                <div className="userChatInfo">
                    <span>Bizim Tayfa</span>
                </div>
            </div>
        </div>
    )
}

export default GroupChatSearch;
