import React, { useState } from "react";
import {socket} from "../pages/Home";

const InputBox = () =>{
  const [inputValue, setInputValue] = useState<string>("");
  const HandleClick = async () => {
    console.log("Bura geldi   [" + inputValue + "]");
    socket.emit('chat', {message: inputValue, channelName: "123", sender: socket.id });
  }
  const change = (e) =>{
    setInputValue(e.target.value);
  }
    return(
        <div className="messageBoxInput">
          <input className="input" type="text" onChange={change} placeholder="Type something..."/>
          <div className="send">
            <img className="mBImg" alt="a"/>
            <input type="file" style={{display:"none"}} id="file"/>
            <label htmlFor="file">
                <img className="mBImg" alt="i"/>
            </label>
            <button onClick={HandleClick} className="mBBtn">Send</button>
          </div>
        </div>
    )

}

export default InputBox;
