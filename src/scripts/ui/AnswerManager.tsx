import React from 'react';
import { SCORE_INCREASE, type IncomingAnswer } from './ChatManager';

type AnswerManagerProps = {
  answerList: IncomingAnswer[];
};

export default function AnswerManager({ answerList }: AnswerManagerProps) {
  const answers = answerList.map(answer => {
    let className = 'answer';
    className += answer.isAnswer ? ' correct' : ' incorrect';

    return (
      <div key={answer.key} className={className}>
        <span className="score">{SCORE_INCREASE}</span>
        {answer.username}
      </div>
    );
  });

  return <section className="answer-list">{answers}</section>;
}
