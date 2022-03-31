import { useInterval } from '@mantine/hooks';
import React, { useCallback, useEffect } from 'react';
import { emitter as TwitchService, type ChatMessage } from '../services/twitch';
import { stripPunctuation, type NormalizedEntry } from '../utils';
import type { ScoreMap } from './app';

export type IncomingAnswer = {
  key: string;
  username: string;
  isAnswer: boolean;
};

type ChatManagerProps = {
  addAnswer: (a: IncomingAnswer) => void;
  chooseNewAnswer: () => void;
  chosenBlank?: NormalizedEntry;
  scores: ScoreMap;
  setIsAnswered: (b: boolean) => void;
  setScores: (sm: ScoreMap) => void;
};

export default function ChatManager({
  addAnswer,
  chooseNewAnswer,
  chosenBlank,
  scores,
  setIsAnswered,
  setScores
}: ChatManagerProps) {
  // Auto Choosenew Answer
  const { start, stop } = useInterval(() => {
    stop();
    chooseNewAnswer();
  }, 3000);

  const onMessage = useCallback(
    (e: Event) => {
      if (!chosenBlank) {
        return;
      }

      const { message, tags } = (e as CustomEvent<ChatMessage>).detail;

      // prettier-ignore
      const isAnswer = -1 != message.split(' ')
        .findIndex(word => chosenBlank.strippedWord === stripPunctuation(word).toLowerCase());

      addAnswer({ username: tags.username!, isAnswer, key: tags.id! });

      //TODO: Add possible point loss at higher levels
      if (isAnswer) {
        setIsAnswered(true);

        //!FIXME: Need to increase score
        setScores(scores);

        start();
      }
    },
    [chosenBlank, addAnswer, setIsAnswered]
  );

  useEffect(() => {
    TwitchService.removeEventListener('message', onMessage);
    TwitchService.addEventListener('message', onMessage);
    return () => TwitchService.removeEventListener('message', onMessage);
  }, [onMessage]);

  return <></>;
}
