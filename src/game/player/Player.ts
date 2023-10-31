import GameObject from "../../core/gameobject/GameObject";

class Player {
	private _nickname: string | null = null;
	_pawn: GameObject | null = null;

	constructor() {}

	possess = (pawn: GameObject) => {
		this._pawn = pawn;
	};
}

export default Player;
