import React from "react";
import ok from "../images/ok.png"
import ko from "../images/close.png"

const GameRequest = () =>{
return(
	<div className="gameRequest">
		<span className="gameRequestH">
			Game Request
		</span>
		<div className="gameRequestList">
			<div className="gameRequestLi">
				<li>istekler</li>
				<div><img src={ok} /><img src={ko} /></div>
			</div>
		</div>
	</div>
)
}
export default GameRequest;