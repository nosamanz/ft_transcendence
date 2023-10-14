import React from "react";
import MessageBox from "./MessageBox";
import InputBox from "./InputBox";

const MainBox = ({currentChannel}) =>{
    return(
        <div className="mainBox">
          <MessageBox currentChannel={currentChannel} />
            <InputBox currentChannel={currentChannel} />
        </div>
    )

}

export default MainBox;
