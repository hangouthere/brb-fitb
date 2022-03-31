import React from 'react';
import type { IncomingAnswer } from './ChatManager';

type AnswerManagerProps = {
  answerList: IncomingAnswer[];
  removeAnswer: (...indices: number[]) => void;
};

export default function AnswerManager({ answerList }: AnswerManagerProps) {
  const answers = answerList.map(answer => {
    let className = 'answer';
    className += answer.isAnswer ? ' correct' : ' incorrect';

    return (
      <div key={answer.key} className={className}>
        {answer.username}
      </div>
    );
  });

  return <section className="answer-list">{answers}</section>;
}
