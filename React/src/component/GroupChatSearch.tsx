import React from "react";
import image from "../images/avatar4.jpeg"
const GroupChatSearch = () =>{
    return(
        <div className="chatSearch">
            <div className="searchForm">
                <input className="searchInput" type="text" placeholder="find a user" />
            </div>
            <div className="userChat">
                <img className="searchChatImage" src={image}/>
                <div className="userChatInfo">
                    <span>Bizim Tayfa</span>
                </div>
            </div>
        </div>
    )

}

export default GroupChatSearch;