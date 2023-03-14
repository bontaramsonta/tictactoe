import React from "react";

const setRandomTurn = () => Math.floor(Math.random() * 2 + 1);

const Score: React.FC<{ score: [number, number] }> = ({ score }) => {
  return (
    <div>
      {score[0]}:{score[1]}
    </div>
  );
};

function App() {
  const [gameState, setGameState] = React.useState<Array<string | null>>(
    new Array(9).fill(null)
  );
  const [turn, setTurn] = React.useState(setRandomTurn()); // 1,2
  const [result, setResult] = React.useState<string | null>(null);
  const [score, setScore] = React.useState<[number, number]>([0, 0]);
  const [moves, setMoves] = React.useState<[number, number][]>([]); // [index, turn]

  const char = React.useMemo(() => (turn === 1 ? "X" : "O"), [turn]);
  const getReadablePosition = React.useCallback(
    (index: number) => {
      const result: string[] = [];
      if (index === 4) result.push("center");
      if ([1, 3, 5, 7].includes(index)) result.push("middle");
      if ([0, 1, 2].includes(index)) result.push("top");
      if ([6, 7, 8].includes(index)) result.push("bottom");
      if ([0, 3, 6].includes(index)) result.push("left");
      if ([2, 5, 8].includes(index)) result.push("right");
      return result.join(" ");
    },
    [moves]
  );

  const checkIfWon = (gameState: Array<string | null>) => {
    const lines = [
      // rows
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      //columns
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 7],
      //diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const line of lines) {
      const [first, second, third] = line.map((index) => gameState[index]);
      if (first !== null && first === second && second === third) return first;
    }
    return null;
  };

  const play = (index: number) => {
    // game has already concluded
    if (result) return;
    // selected box is already filled
    if (gameState[index] !== null) return;

    // set new game state
    const newGameState = [...gameState];
    newGameState.splice(index, 1, char);
    setGameState(newGameState);
    const won = checkIfWon(newGameState);
    // set score and result if somebody won
    if (won) {
      setScore(
        score.map((score, i) => (i + 1 === turn ? score + 1 : score)) as [
          number,
          number
        ]
      );
      setResult(`Player ${turn} won`);
    }
    // all boxes are filled and nobody won
    if (newGameState.every((move) => move !== null)) {
      setResult(`Nobody won`);
    }
    // append the new move to the moves list
    setMoves([...moves, [index, turn]]);
    setTurn(turn === 1 ? 2 : 1);
  };

  const undo = (index: number) => {
    if (result) return;
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
      <div className="container">
        {gameState.map((value, index) => (
          <div key={index} onClick={() => play(index)} className="box">
            {value}
          </div>
        ))}
      </div>
      {result ? (
        <div>
          <p>{result}</p>
          <button
            onClick={() => {
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
      ) : (
        <p>{`its Player ${turn}'s turn (${char})`}</p>
      )}
      {moves.length > 0 && (
        <ul>
          <p>moves</p>
          {moves.map((move, index) => (
            <li key={index}>
              <button onClick={undo.bind(null, index)}>{`Player ${
                move[1]
              } put ${char} at ${getReadablePosition(move[0])}`}</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
