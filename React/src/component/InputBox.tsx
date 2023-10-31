import React, { useState } from "react";
import {socket} from "../pages/Home";

const InputBox = ( {currentChannel} ) =>{
  const dValue = document.getElementById('sendInput') as HTMLInputElement;

  const [inputValue, setInputValue] = useState<string>("");
  const HandleClick = async () => {
    socket.emit('chat', {message: inputValue, channelName: currentChannel});
    dValue.value = '';
  }
  const change = (e) =>{
    setInputValue(e.target.value);
  }
  const keyDown = (e) =>{
    if (e.key === 'Enter')
    {
      HandleClick();
      dValue.value = '';
    }
  }
    return(
        <div className="messageBoxInput">
          <input className="input" id="sendInput" type="text" onKeyDown={keyDown} onChange={change} placeholder="Type something..."/>
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
