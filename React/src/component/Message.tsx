import React from "react";
import image from "../images/free-photo1.jpeg";
import image2 from "../images/free-photo2.jpg";


const Message = ({message}) =>{
    return(
        <div className="message owner">
            <div className="messageInfo">
               <span>{message === undefined ? "" : message.senderNick}</span>
            </div>
            <div className="messageContent">
                <p className="messageP">{message == undefined ? "" : message.message}</p>
                {/* <img className="mIImg" src={image2} alt="dneeme"/> */}
            </div>
        </div>
    )
}
export default Message;
