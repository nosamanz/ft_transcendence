import React, { useEffect, useState } from "react";
import { cookies } from "../App";
import LeaderBoardProfile from "../component/LeaderBoardProfile";
import TFA from "../component/TFA";

const LeaderBoard = ({user}) =>{
	const [Users, setUsers] = useState([]);
	const myid:number = user.id;
	useEffect (() => {
        const fetchData = async () =>{
            const response = await fetch(`https://${process.env.REACT_APP_IP}:80/leaderboard`, {
                headers: {
                    'authorization': 'Bearer ' + cookies.get("jwt_authorization"),
                }
            });
            const resUsers = await response.json();
			setUsers(resUsers);
        }
        fetchData();
    }, [])
	const closeTfa = (is: Boolean) =>
	{
	}
	return(
		<div className="leaderBoard">
			<div className="lBh1">
				<h1>LeaderBoard</h1>
			</div>
				{Users.map((user, index) => (
					<LeaderBoardProfile key={index} index={index} user={user} myid={myid}/>
				))}
		</div>
	)
}

export default LeaderBoard;
