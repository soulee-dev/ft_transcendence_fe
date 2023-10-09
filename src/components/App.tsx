import { useEffect, useState } from "react";
import Game from "./Game";
import Login from "./Login";

function App() {
	const defaultMode = window.localStorage.getItem("mode") || "Login";
	const [mode, setMode] = useState(defaultMode);

	useEffect(() => {
		window.localStorage.setItem("mode", mode);
	}, [mode]);

	let content = null;

	if (mode === "Login") {
		content = <Login setMode={setMode} />;
	} else if (mode === "Game") {
		content = <Game />;
	}

	return <div className="App">{content}</div>;
}

export default App;
