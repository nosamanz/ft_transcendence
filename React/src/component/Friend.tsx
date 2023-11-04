import React from "react";
import messageIcon from "../images/message.png";
import ignoreIcon from "../images/ignore.png"
import addFriend from "../images/addPerson.png"
import invite from "../images/invite.png"

const Friend = ({user}) =>{
	const HandleClick = async () => {
    }
    return(
            <div className="friendOnePerson">
                <div>
                    <span onClick={HandleClick} >{user.OtherUserNick}</span>
                </div>
                <div className="friendIcons">
                    <img className="friendIcon" src={messageIcon} alt="a"/>
                    <img className="friendIcon" src={ignoreIcon} alt="b"/>
                    <img className="friendIcon" src={addFriend} alt="c"/>
                    <img className="friendIcon" src={invite} alt="d"/>
                </div>
            </div>
    )
}
export default Friend;
