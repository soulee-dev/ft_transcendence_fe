function LeftNavigator() {
	return (
		<div className="leftNav">
			<div className="leftNavList">
				<div className="wrapper" /*onClick={goHome}*/>
					<div className="leftNavBtn">홈</div>
				</div>
				<div className="container">
					<div className="leftNavBtn">알림</div>
				</div>
				<div className="container">
					<div className="leftNavBtn">친구 목록</div>
				</div>
				<div className="container">
					<div className="leftNavBtn">채팅방</div>
				</div>
				<div className="container">
					<div className="leftNavBtn">순위</div>
				</div>
				<div className="wrapper" /*onClick={blockList}*/>
					<div className="leftNavBtn">차단 목록</div>
				</div>
			</div>
		</div>
	);
}

export default LeftNavigator;
