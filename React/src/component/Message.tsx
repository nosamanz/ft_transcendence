import React from "react";
import image from "../images/free-photo1.jpeg";
import image2 from "../images/free-photo2.jpg";


const Message = ({message}) =>{
    const userMessage = message;
    return(
        <div className="message owner">
            <div className="messageInfo">
               <span>{userMessage.sender}</span>
            </div>
            <div className="messageContent">
                <p className="messageP">{userMessage.message}</p>
                {/* <img className="mIImg" src={image2} alt="dneeme"/> */}
            </div>
        </div>
    )
}
export default Message;
