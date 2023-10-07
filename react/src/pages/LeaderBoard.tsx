import React from "react";
import LeaderBoardProfile from "../component/LeaderBoardProfile";
import { Leaderboard } from "../database/database";

const LeaderBoard = () =>{
	return(
		<div className="leaderBoard">
			<div className="lBh1">
				<h1>LeaderBoard</h1>
			</div>
			<LeaderBoardProfile LeaderBoard={Leaderboard} />


		</div>
	)
}

export default LeaderBoard;
