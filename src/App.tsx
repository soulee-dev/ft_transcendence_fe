import { useState } from "react";
import Pong from "./Pong";

function Title() {
	return (
		<header>
			<h1>
				<a href="/">PONG</a>
			</h1>
		</header>
	);
}

function App() {
	const [mode, SetMode] = useState("Title");

	let content = null;

	if (mode === "Title") {
		content = (
			<header>
				<h1>
					<a
						href="/"
						onClick={(event) => {
							event.preventDefault();
							SetMode("Pong");
						}}
					>
						PONG
					</a>
				</h1>
			</header>
		);
	} else if (mode === "Pong") {
		content = <Pong />;
	}

	return <div className="App">{content}</div>;
}

export default App;
