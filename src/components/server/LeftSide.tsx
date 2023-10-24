import Link from "next/link";

function LeftSide() {
	return (
		<div className="leftSide">
			<ul>
				<li>
					<Link href="/profile">마이페이지</Link>
				</li>
				<li>
					<Link href="/channels">채팅방</Link>
				</li>
				<li>
					<Link href="/game">게임</Link>
				</li>
				<li>
					<Link href="/friends">친구</Link>
				</li>
			</ul>
		</div>
	);
}

export default LeftSide;
