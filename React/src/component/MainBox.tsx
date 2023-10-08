import React from "react";
import MessageBox from "./MessageBox";
import InputBox from "./InputBox";

const MainBox = () =>{
    return(
        <div className="mainBox">
          <MessageBox/>
            <InputBox/>
        </div>
    )

}

export default MainBox;