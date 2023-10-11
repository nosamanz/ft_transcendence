import React from "react";
import MessageBox from "./MessageBox";
import InputBox from "./InputBox";

const MainBox = () =>{
    console.log("Mainbox");
    return(
        <div className="mainBox">
          <MessageBox/>
            <InputBox/>
        </div>
    )

}

export default MainBox;
