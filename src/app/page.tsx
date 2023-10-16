// import Image from "next/image";
// import styles from "./page.module.css";
import React from "react";
import Link from "next/link";
import Game from "../components/client/Game";

export default function Home() {
	return (
		<div>
			<Link
				href={
					"https://auth.42.fr/auth/realms/students-42/protocol/openid-connect/auth?client_id=intra&redirect_uri=https%3A%2F%2Fprofile.intra.42.fr%2Fusers%2Fauth%2Fkeycloak_student%2Fcallback&response_type=code&state=a4f9df248c2d7469412b7759a95837bf400ffa1a9648d548"
				}
				style={{ textDecoration: "none", color: "white" }}
			>
				로그인 하기.
			</Link>
			<div>
				<Link href={"/game"}>테스트</Link>
			</div>
		</div>
	);
}
