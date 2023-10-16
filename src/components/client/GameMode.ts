class GameMode {
    isPlaying: boolean;
    constructor() {
        this.isPlaying = false;
    }

    gameStart(): void {
        this.isPlaying = true;
    }

    gameStop(): void {
        this.isPlaying = false;
    }
}


export default GameMode;