import React from "react";
import image from "../images/free-photo1.jpeg";
import msgImg from "../images/msg.jpg";
import icon from "bootstrap-icons"

// const item = (data) =>{
// 	return(
// 		<>
// 		{
// 			data.map((value,index) =>{
// 				<div className="lBblock">
// 				<div className="item">
// 					<h3 className="lBH3">Index</h3>
// 					<img className="lBImage" src="image" alt=""/>
// 					<div className="info">
// 						<h3 className="lBH3">Nick</h3>
// 						<span className="lBSpan">Latter Level</span>
// 					</div>
// 				</div>
// 				<div className="item">
// 					<span>Win</span>
// 					<span>Lose</span>
// 				</div>
// 			</div>
// 			})
// 		}
// 		</>
// 	)
// }

// const LeaderBoardProfile = (Leaderboard) =>{
// 	return(
// 		<div>
// 			<div className="lBblock">
// 				{/* {item(Leaderboard)} */}
// 				<div className="item1">
// 					<h3 className="lBH3">1</h3>
// 					<img className="lBImage" src={image} alt=""/>
// 					<div className="info">
// 						<h3 className="lBH3">deneme</h3>
// 						<span className="lBSpan">500</span>
// 					</div>
// 				</div>
// 				<div className="itemIcon">
// 					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
// 						<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
// 						<path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
// 					</svg>
// 				</div>
// 				<div className="itemIcon">
// 					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
// 						<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
// 						<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
// 					</svg>
// 				</div>
// 				<div className="item2">
// 					<div>
// 						<span className="itemSpan">Win</span>
// 						<span className="valueSpan">10</span>
// 					</div>
// 					<div>
// 						<span className="itemSpan">Lose</span>
// 						<span className="valueSpan">4</span>
// 					</div>
// 				</div>
// 			</div>
// 		</div>

// 	)
// }
// export default LeaderBoardProfile;

const LeaderBoardProfile = ({index, user}) =>{
	return(
		<div>
			<div className="lBblock">
				{/* {item(Leaderboard)} */}
				<div className="item1">
					<h3 className="lBH3">{index + 1} .  </h3>
					<img className="lBImage" src={`data:image/png;base64,${user.imgBuffer}`} alt=""/>
					<div className="info">
						<h3 className="lBH3">{user.nick}</h3>
						<span className="lBSpan">{user.LatterLevel}</span>
					</div>
				</div>
				<div className="itemIcon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-person-add" viewBox="0 0 16 16">
						<path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
						<path d="M8.256 14a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z"/>
					</svg>
				</div>
				<div className="itemIcon">
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-left-text" viewBox="0 0 16 16">
						<path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414A2 2 0 0 0 3 11.586l-2 2V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
						<path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
					</svg>
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
