import React, { useState } from 'react';
import Pong from './Pong';

function App() {
  
  return (
    <div className="App">
      <Pong width="400" height="300"
      style={{border: 1 + "px solid green"}} />
    </div>
  );
}

export default App;
