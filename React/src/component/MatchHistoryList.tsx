import React, { useState } from "react";

const MatchHistoryList = ({history, user}) =>{
	const [result, setResult] = useState<string>("win");

	// const myScore:number = user.Score;
	// const rivalScore:number = history.Score;
	// if (myScore > rivalScore)
	// 	setResult("win");
	// else
	// 	setResult("lose");
	console.log(history);
	return(
		<div className="mtchContainer">
				<div className="matchResult">
					{
						history.Score > history.RivalScore ? (
							<span className="mtchWin">
							WIN
							</span>
						):(
							<span className="mtchLose">
								Lose
							</span>
						)
					}
				</div>
				<div className="matchHistoryLeft">
					<div>
						<div className="nick">
							{user.nick}
							<div className="matchLetter">
								{user.LatterLevel}
							</div>
							<div className="mtchScore">
								{history.Score}
							</div>
						</div>
					</div>
				</div>
				<div className="matchHistoryRight">
					<div>
						<div className="nick">
							{history.RivalNick}
							<div className="matchLetter">
								{history.RivalLatter}
							</div>
							<div className="mtchScore">
								{history.RivalScore}
							</div>
						</div>
					</div>
				</div>
		</div>
	)
}

export default MatchHistoryList;
