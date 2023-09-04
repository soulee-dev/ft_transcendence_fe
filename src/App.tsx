import React, { useState } from 'react';
import { socketService } from './SocketService';
import PongGame from './PongGame';

function App() {
  const [player, setPlayer] = useState(null); // initial state is null, meaning no player has been selected

  socketService.connect();

  const handlePlayerSelection = (selectedPlayer: any) => {
    setPlayer(selectedPlayer);
  }

  if (!player) {
    return (
      <div className="App">
        <h2>Select Your Player:</h2>
        <button onClick={() => handlePlayerSelection('A')}>Player A</button>
        <button onClick={() => handlePlayerSelection('B')}>Player B</button>
      </div>
    );
  }

  return (
    <div className="App">
      <PongGame player={player} />
    </div>
  );
}

export default App;
