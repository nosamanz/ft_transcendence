import React, { useEffect, useState } from "react";
import { cookies } from "../App";
import MatchHistoryList from "./MatchHistoryList";

const MatchHistory = () =>{

    const [history, setHistory] = useState<{}[]>([]);
    const [user, setUser] = useState<{}[]>([]);

    useEffect(() => {
		const fetchData = async () =>{
			const response = await fetch(`https://${process.env.REACT_APP_IP}:80/user/matchHistory`, {///
				headers: {
					'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
				}
			})
			const res = await response.json();
			if (response.ok)
			{
				setHistory(res.MatchHistory);
				setUser(res);
				console.log(res);
				console.log("History : ", res.MatchHistory)
			}
		}
	fetchData();
	}, [])

	return(
		<div  className="matchHistory">
			<div className="matchHistoryBody">
				<div className="matchHistoryH">
					<h1>Match History</h1>
				</div>
				<div >
                {history.map((history, index) => (
                    <MatchHistoryList key={index} history={history} user={user}/>
                ))}
				</div>
			</div>
		</div>
	)
}

export default MatchHistory;
