import React from "react";

const Friend = ({user}) =>{
	const HandleClick = async () => {
    }
    return(
        <div className="userChat">
                <div className="userChatInfo">
                    {/*<span onClick={HandleClick} >{user != undefined? user.nick : undefined}</span>*/}
                    <span onClick={HandleClick} >{user.OtherUserNick}</span>
                </div>
		</div>
    )
}
export default Friend;
