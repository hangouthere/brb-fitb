import { useInterval } from '@mantine/hooks';
import React, { useCallback, useEffect, type Dispatch, type SetStateAction } from 'react';
import { emitter as TwitchService, type ChatMessage } from '../services/twitch';
import { stripPunctuation, type NormalizedEntry } from '../utils';
import type { ScoreMap } from './app';

export const SCORE_INCREASE = 10;

export type IncomingAnswer = {
  key: string;
  username: string;
  isAnswer: boolean;
};

type ChatManagerProps = {
  addAnswer: (a: IncomingAnswer) => void;
  chooseNewAnswer: () => void;
  chosenBlank?: NormalizedEntry;
  isAnswered: boolean;
  setIsAnswered: Dispatch<SetStateAction<boolean>>;
  setScores: Dispatch<SetStateAction<ScoreMap>>;
};

export default function ChatManager({
  addAnswer,
  chooseNewAnswer,
  chosenBlank,
  isAnswered,
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
      if (!chosenBlank || isAnswered) {
        return;
      }

      const {
        message,
        tags: { id, username }
      } = (e as CustomEvent<ChatMessage>).detail;

      // prettier-ignore
      const isAnswer = -1 != message.split(' ')
        .findIndex(word => chosenBlank.strippedWord === stripPunctuation(word).toLowerCase());

      addAnswer({ username: username!, isAnswer, key: id! });

      if (!username || !id) {
        return;
      }

      //TODO: Add possible point loss at higher levels
      if (isAnswer) {
        setIsAnswered(true);

        //!FIXME: Need to increase score
        setScores(scores => {
          scores[username] = scores[username] || 0;
          scores[username] += SCORE_INCREASE;
          return { ...scores };
        });

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
