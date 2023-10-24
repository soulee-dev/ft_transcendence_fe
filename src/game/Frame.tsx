"use client";

import { FunctionComponent, useCallback, useEffect } from "react";
import "../../style/Frame.css";
import Game from "../components/client/Game";
import dynamic from "next/dynamic";

const DynamicGame = dynamic(() => import("../components/client/Game"), {
	ssr: false,
});

export default function Frame() {
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
		<div>
			{/* <TopNavigator /> */}
			{/* <rightSide /> */}
			<Game />
			{/* <LeftSide /> */}

			{/* <div className="center"></div> */}
			{/* <Chat /> */}
		</div>
	);
}
