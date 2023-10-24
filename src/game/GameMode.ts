import Player from "./Player";
import Engine from "./Engine";

class GameMode {
	private _engine: Engine;
	private _playerArray: Player[];

	constructor(engine: Engine) {
		this._engine = engine;
		this._playerArray = [];
	}

	startMatch = () => {
		setTimeout(this._engine.start, 2000);
		console.log("GameMode startMatch");
	};
}

export default GameMode;
