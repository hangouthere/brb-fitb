import React from 'react';
import type { ScoreMap } from './app';

type ScoreCompare = [string, number];

type ScoreBoardProps = {
  scores: ScoreMap;
  scoreboardNumPlayers: number;
};

export default function ScoreBoard({ scores, scoreboardNumPlayers }: ScoreBoardProps) {
  if (!scores) {
    return <></>;
  }

  return (
    <div className="scoreboard">
      <div className="header">Scores:</div>

      <div>
        {Object.entries(scores)
          .sort((a: ScoreCompare, b: ScoreCompare) => {
            return b[1] > a[1] ? 1 : b[1] < a[1] ? -1 : 0;
          })
          .slice(0, scoreboardNumPlayers)
          .map(([name, score]) => {
            return (
              <div className="score-entry" key={name}>
                <div className="username">{name}</div>
                <div className="score">{score}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
