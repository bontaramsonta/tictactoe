import React from "react";

const getChar = (turn: number) => (turn === 1 ? "X" : "O");

const Score: React.FC<{ score: [number, number] }> = ({ score }) => {
  return (
    <div>
      {score[0]}:{score[1]}
    </div>
  );
};

function App() {
  const setRandomTurn = () => Math.floor(Math.random() * 2 + 1);

  const [gameState, setGameState] = React.useState(new Array(9).fill(null));
  const [turn, setTurn] = React.useState(setRandomTurn()); // 1,2
  const [result, setResult] = React.useState<string | null>(null);
  const [score, setScore] = React.useState<[number, number]>([0, 0]);
  const [moves, setMoves] = React.useState([]);

  const checkIfWon = () => {
    for (const turn of [1, 2]) {
      const char = getChar(turn);
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
    const char = getChar(turn);
    if (gameState[index] === null) {
      const newGameState = gameState;
      newGameState.splice(index, 1, char);
      setGameState(newGameState);
    }
    const won = checkIfWon();
    if (won) {
      setScore(
        score.map((score, i) => (i + 1 === turn ? score + 1 : score)) as [
          number,
          number
        ]
      );
      setResult(`Player ${turn} won`);
    }
    setTurn(turn === 1 ? 2 : 1);
  };

  return (
    <div>
      <Score score={score} />
      <p>{`its Player ${turn}'s turn (${getChar(turn)})`}</p>
      <div className="container">
        {gameState.map((value, index) => (
          <div key={index} onClick={() => play(index)} className="box">
            {value}
          </div>
        ))}
      </div>
      {result && (
        <div>
          <p>{result}</p>
          <button
            onClick={() => {
              console.log("[start new game]");
              setResult(null);
              setGameState(new Array(9).fill(null));
              setTurn(setRandomTurn());
            }}
          >
            start new game
          </button>
          <button onClick={() => {}}>reset scores</button>
        </div>
      )}
    </div>
  );
}

export default App;
