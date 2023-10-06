import React from "react";
import image from "../images/avatar1.png"
const ChatSearch = () =>{
    return(
        <div className="chatSearch">
            <div className="searchForm">
                <input className="searchInput" type="text" placeholder="find a user" />
            </div>
            <div className="userChat">
                <img className="searchChatImage" src={image}/>
                <div className="userChatInfo">
                    <span>Jane</span>
                </div>
            </div>
        </div>
    )

}

export default ChatSearch;