import Link from "next/link";

function LeftSide() {
	return (
		<div className="leftSide">
			<div>
				<ul>
					<li>
						<Link href="/profile">마이페이지</Link>
					</li>
					<li>
						<Link href="/channels">채팅방</Link>
					</li>
					<li>
						<Link href="/game">게임하기</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default LeftSide;
