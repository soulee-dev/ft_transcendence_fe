import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Game from "./Game";
import Login from "./Login";
import Frame from "./Frame";

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
		content = <Frame />;
	}

	// return <div className="App">{content}</div>;
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Frame />} />
			</Routes>
		</Router>
	);
}

export default App;
