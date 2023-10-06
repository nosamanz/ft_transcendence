import React from "react";
const InputBox = () =>{
    return(
        <div className="messageBoxInput">
          <input className="input" type="text" placeholder="Type something..."/>
          <div className="send">
            <img className="mBImg" alt="a"/>
            <input type="file" style={{display:"none"}} id="file"/>
            <label htmlFor="file">
                <img className="mBImg" alt="i"/>
            </label>
            <button className="mBBtn">Send</button>
          </div>
        </div>
    )

}

export default InputBox;