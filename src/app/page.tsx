// import Image from "next/image";
// import styles from "./page.module.css";
import React from "react";
import Link from "next/link";
import Game from "../components/client/Game";

export default function Home() {
	return (
		<div>
			<ul>
				<li><Link href="/profile">마이페이지</Link></li>
				<li><Link href="/channels">채팅방</Link></li>
				<li><Link href="/game">게임</Link></li>
			</ul>
		</div>
	);
}
