import React from "react";

const getChar = (turn: number) => (turn === 1 ? "X" : "O");

const getReadablePosition = (index: number) => {
  const result: string[] = [];
  if (index === 4) result.push("center");
  if ([0, 1, 2].includes(index)) result.push("top");
  if ([3, 4, 5].includes(index)) result.push("middle");
  if ([6, 7, 8].includes(index)) result.push("bottom");
  if ([0, 3, 6].includes(index)) result.push("left");
  if ([2, 5, 8].includes(index)) result.push("right");
  return result.join(" ");
};

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
  const [moves, setMoves] = React.useState<[number, number][]>([]); // [index, turn]

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
    setMoves([...moves, [index, turn]]);
    setTurn(turn === 1 ? 2 : 1);
  };

  const undo = (index: number) => {
    if (result) return;
    console.log("[undo]", index);
    const movesToUndo = moves.slice(index);
    const newGameState = [...gameState];
    movesToUndo.forEach((move) => (newGameState[move[0]] = null));
    setTurn(movesToUndo[0][1]);
    setMoves(moves.slice(0, index));
    setGameState(newGameState);
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
              setMoves([]);
              setGameState(new Array(9).fill(null));
              setTurn(setRandomTurn());
            }}
          >
            start new game
          </button>
          <button
            onClick={() => {
              setScore([0, 0]);
            }}
          >
            reset scores
          </button>
        </div>
      )}
      <ul>
        <p>moves</p>
        {moves.map((move, index) => (
          <li key={index}>
            <button onClick={undo.bind(null, index)}>{`Player ${
              move[1]
            } put ${getChar(move[1])} at ${getReadablePosition(
              move[0]
            )}`}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
