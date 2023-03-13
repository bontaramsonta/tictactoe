import React, { useCallback } from "react";
function App() {
  const [gameState, setGameState] = React.useState(new Array(9).fill(null));
  const [turn, setTurn] = React.useState(Math.floor(Math.random() * 2 + 1)); // 1,2
  const [result, setResult] = React.useState<string | null>(null);
  const [score, setScore] = React.useState([0, 0]);
  const [moves, setMoves] = React.useState([]);

  const checkIfWon = () => {
    for (const turn of [1, 2]) {
      const char = turn === 1 ? "X" : "O";
      // column check
      for (let i = 0; i < 3; i++) {
        const [first, second, third] = [
          gameState[i],
          gameState[i + 3],
          gameState[i + 6],
        ];
        if (first === char && first === second && second === third) {
          return turn;
        }
      }
      // row check
      for (let i = 0; i < 3; i++) {
        const [first, second, third] = [
          gameState[i * 3],
          gameState[i * 3 + 1],
          gameState[i * 3 + 2],
        ];
        if (first === char && first === second && second === third) {
          return turn;
        }
      }
      // diagonal check
      if (
        [gameState[0], gameState[4], gameState[8]].every(
          (cell) => cell === char
        ) ||
        [gameState[2], gameState[4], gameState[6]].every(
          (cell) => cell === char
        )
      ) {
        return turn;
      }
    }
  };

  console.log({ turn, gameState, result });
  const play = (index: number) => {
    if (result) {
      return;
    }
    console.log("[played]", turn, index, gameState[index]);
    const char = turn === 1 ? "X" : "O";
    if (gameState[index] === null) {
      const newGameState = gameState;
      newGameState.splice(index, 1, char);
      setGameState(newGameState);
    }
    const won = checkIfWon();
    if (won) {
      setResult(`Player ${turn} won`);
    }
    setTurn(turn === 1 ? 2 : 1);
  };

  return (
    <div className="container">
      {gameState.map((value, index) => (
        <div key={index} onClick={() => play(index)} className="box">
          {value}
        </div>
      ))}
    </div>
  );
}

export default App;
