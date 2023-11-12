import React from "react";
import image from "../images/free-photo1.jpeg";
import msgImg from "../images/msg.jpg";
import addPerson from "../images/addPerson.png";
import msg from "../images/message.png";
import { Link } from "react-router-dom";

const LeaderBoardProfile = ({index, user}) =>{
	return(
		<div>
			<div className="lBblock">
				{/* {item(Leaderboard)} */}
				<div className="item1">
					<h3 className="lBH3">{index + 1} .  </h3>
					<img className="lBImage" src={`data:image/png;base64,${user.imgBuffer}`} alt=""/>
					<div className="info">
						<Link className="link" to={`/profile?nick=${user.nick}`}><h3 className="lBH3">{user.nick}</h3></Link>
						<span className="lBSpan">{user.LatterLevel}</span>
					</div>
				</div>
				<div className="itemIcon">
					<img src={addPerson} alt="" />
				</div>
				<div className="itemIcon">
				<img src={msg} alt="" />
				</div>
				<div className="item2">
					<div>
						<span className="itemSpan">Win</span>
						<span className="valueSpan">{user.WinCount}</span>
					</div>
					<div>
						<span className="itemSpan">Lose</span>
						<span className="valueSpan">{user.LoseCount}</span>
					</div>
				</div>
			</div>
		</div>

	)
}
export default LeaderBoardProfile;
