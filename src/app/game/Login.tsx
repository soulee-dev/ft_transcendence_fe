function Login(props: { setMode: (mode: string) => void }) {
	return (
		<header>
			<h1>
				<a
				// href="/Login"
				// onClick={(event) => {
				// 	event.preventDefault();
				// 	props.setMode("Game");
				// }}
				>
					로그인하세요.
				</a>
			</h1>
		</header>
	);
}

export default Login;
