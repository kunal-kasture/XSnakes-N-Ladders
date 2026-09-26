import React, { useState } from "react";
import "./App.css";

const LADDERS = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  63: 81,
  71: 91,
};

const SNAKES = {
  17: 7,
  54: 34,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  99: 78,
};

const generateGrid = () => {
  const grid = [];
  for (let row = 9; row >= 0; row--) {
    const rowCells = [];
    for (let col = 0; col < 10; col++) {
      const num = row % 2 === 1 ? row * 10 + (10 - col) : row * 10 + (col + 1);
      rowCells.push(num);
    }
    grid.push(rowCells);
  }
  return grid;
};

const GRID = generateGrid();

export default function App() {
  const [positions, setPositions] = useState({ p1: 1, p2: 1 });
  const [turn, setTurn] = useState(1);
  const [lastRoll, setLastRoll] = useState(null);
  const [winner, setWinner] = useState(null);

  const rollDice = () => {
    if (winner) return;

    const roll = Math.floor(Math.random() * 6) + 1;
    setLastRoll(roll);

    const currentPlayer = turn === 1 ? "p1" : "p2";
    let nextPos = positions[currentPlayer] + roll;

    if (nextPos <= 100) {
      if (LADDERS[nextPos]) {
        nextPos = LADDERS[nextPos];
      } else if (SNAKES[nextPos]) {
        nextPos = SNAKES[nextPos];
      }
      setPositions((prev) => ({ ...prev, [currentPlayer]: nextPos }));

      if (nextPos === 100) {
        setWinner(turn);
        return;
      }
    }

    setTurn((prev) => (prev === 1 ? 2 : 1));
  };

  const resetGame = () => {
    setPositions({ p1: 1, p2: 1 });
    setTurn(1);
    setLastRoll(null);
    setWinner(null);
  };

  return (
    <div className="game-container">
      <div className="game-card">
        <h1 className="game-title">Snake & Ladders</h1>

        <div className="status-bar">
          <div className="turn-info">
            {winner ? (
              <span className="winner-announcement">
                <span className="winner-text">🏆 Player {winner} wins! </span>
                <span className="loser-text">
                  🥳 Player {winner === 1 ? 2 : 1} loses
                </span>
              </span>
            ) : (
              <span className="turn-display">
                Turn:{" "}
                <span
                  className={`turn-badge ${turn === 1 ? "badge-p1" : "badge-p2"}`}
                >
                  P{turn}
                </span>
              </span>
            )}
          </div>

          <div className="legend">
            <span className="legend-item">
              <span className="dot dot-p1" /> P1
            </span>
            <span className="legend-item">
              <span className="dot dot-p2" /> P2
            </span>
          </div>
        </div>

        <div className="board">
          {GRID.flat().map((num) => {
            const hasP1 = positions.p1 === num;
            const hasP2 = positions.p2 === num;
            const ladderTarget = LADDERS[num];
            const snakeTarget = SNAKES[num];

            return (
              <div key={num} className="board-cell">
                <span className="cell-number">{num}</span>

                {ladderTarget && (
                  <span className="badge badge-ladder">L→{ladderTarget}</span>
                )}
                {snakeTarget && (
                  <span className="badge badge-snake">S→{snakeTarget}</span>
                )}

                <div className="token-container">
                  {hasP1 && <span className="token token-p1">P1</span>}
                  {hasP2 && <span className="token token-p2">P2</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="controls">
          <button className="btn-roll" onClick={rollDice} disabled={!!winner}>
            🎲 Roll Dice{lastRoll !== null ? ` (${lastRoll})` : ""}
          </button>
          <button className="btn-reset" onClick={resetGame}>
            Reset
          </button>
        </div>

        <p className="game-description">
          Exact 100 is required to win. Land on a ladder to climb up, a snake to
          slide down.
        </p>
      </div>
    </div>
  );
}
