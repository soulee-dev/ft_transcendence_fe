import { FunctionComponent, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Frame.css";
import Chat from "./Chat";
import RightNavigator from "./RightNavigator";
import LeftNavigator from "./LeftNavigator";
import TopNavigator from "./TopNavigator";
import Game from "./Game";
const Frame: FunctionComponent = () => {
	// const navigate = useNavigate();
	// const addFriend = useCallback(() => {
	// 	alert("친구 추가");
	// 	// Please sync "친구 추가" to the project
	// }, []);
	// const goHome = useCallback(() => {
	// 	navigate("/");
	// }, [navigate]);
	// const blockList = useCallback(() => {
	// 	// Please sync "차단 목록" to the project
	// }, []);
	// const editProfile = useCallback(() => {
	// 	// Please sync "프로필" to the project
	// }, []);
	// useEffect(() => {
	// 	const preventArrowKeysScroll = (e: KeyboardEvent) => {
	// 		if (
	// 			["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
	// 				e.key
	// 			)
	// 		) {
	// 			e.preventDefault();
	// 		}
	// 	};

	// 	window.addEventListener("keydown", preventArrowKeysScroll);

	// 	return () =>
	// 		window.removeEventListener("keydown", preventArrowKeysScroll);
	// }, []);

	return (
		<div className="frame">
			<TopNavigator />
			<RightNavigator />
			<Game />
			<LeftNavigator />

			{/* <div className="center"></div> */}
			{/* <Chat /> */}
		</div>
	);
};
export default Frame;
