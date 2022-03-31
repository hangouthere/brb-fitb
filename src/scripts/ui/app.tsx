import { useBooleanToggle, useListState } from '@mantine/hooks';
import React, { useEffect, useState, type ReactElement } from 'react';
import { default as InitTwitchService } from '../services/twitch';
import { useForceUpdate, type NormalizedEntry } from '../utils';
import AnswerManager from './AnswerManager';
import ChatManager, { type IncomingAnswer } from './ChatManager';
import EntryManager from './EntryManager';

//! FIXME HACK CRAP GET RID OF IT!
let u = new URLSearchParams(globalThis.location.search);
const isDevMode = null !== u.get('dev');
const username = u.get('username');
const password = u.get('token') || '';

export type ScoreMap = Record<string, number>;

export default function App(): ReactElement {
  const [letterDelay, setLetterDelay] = useState<number>();
  const [error, setError] = useState<JSX.Element>();

  // Error Display
  if (!username) {
    return (
      <div className="critical-error">
        You must supply a username in the url!
        <br /> <br />
        Example:{' '}
        <a href={window.location.href + '?username=MyTwitchName'}>{window.location.href + '?username=MyTwitchName'}</a>
      </div>
    );
  }

  // Init TwitchService on startup...
  useEffect(() => {
    try {
      InitTwitchService({ username, password });
    } catch (err) {
      // Error Display
      setError(
        <div className="critical-error">
          There was an error starting up the Twitch Chat service!
          <br />
          <br />
          Try ensuring the username is correct, and in all lowercase!
        </div>
      );
    }
  }, []);

  // Get --delay-letter root css var for animating
  useEffect(() => {
    const letterDelay = Number(getComputedStyle(document.documentElement).getPropertyValue('--delay-letter')) || 0;
    setLetterDelay(letterDelay);
  }, []);

  const [chosenBlank, setChosenBlank] = useState<NormalizedEntry>();
  const [answers, answerHandlers] = useListState<IncomingAnswer>();
  const [scores, setScores] = useState<ScoreMap>({});
  const [isAnswered, setIsAnswered] = useBooleanToggle(false);
  const [isTimeUp, setIsTimeUp] = useBooleanToggle(false);

  const [forceNewAnswer, chooseNewAnswer] = useForceUpdate();

  useEffect(() => {
    setIsTimeUp(false);
    setIsAnswered(false);
    answerHandlers.setState([]);
  }, [forceNewAnswer]);

  if (!letterDelay) {
    return <>Loading...</>;
  }

  return (
    error || (
      <div className="page-wrapper">
        <ChatManager
          addAnswer={answerHandlers.append}
          chosenBlank={chosenBlank}
          scores={scores}
          setIsAnswered={setIsAnswered}
          setScores={setScores}
          chooseNewAnswer={chooseNewAnswer}
        />

        <EntryManager
          chosenBlank={chosenBlank}
          isAnswered={isAnswered}
          isTimeUp={isTimeUp}
          letterDelay={letterDelay}
          setChosenBlank={setChosenBlank}
          chooseNewAnswer={forceNewAnswer}
        />

        <AnswerManager answerList={answers} removeAnswer={answerHandlers.remove} />

        {/* Need Score Display */}
        {/* - Running Score of Players */}
      </div>
    )
  );
}
