import React from "react";
import image from "../images/free-photo1.jpeg"
import image2 from "../images/free-photo2.jpg"


const Message = () =>{
    return(
        <div className="message owner">
            <div className="messageInfo">
                <img className="mImg" src={image}/>
                <span>Just Now</span>
            </div>
            <div className="messageContent">
                <p className="messageP">Hello</p>
                <img className="mIImg" src={image2} alt="dneeme"/>
            </div>
        </div>
    )
}
export default Message;