import React, { useEffect, useRef, useState } from 'react';
import { type NormalizedEntry } from './utils';

type EntryDisplayProps = {
  category: string;
  chosenBlank: NormalizedEntry;
  isAnswered: boolean;
  isTimeUp: boolean;
  letterDelay: number;
  normalizedEntryList: NormalizedEntry[];
};

type BuildDumpOptions = {
  chosenBlank: NormalizedEntry;
  isAnswered: boolean;
  isTimeUp: boolean;
  letterDelay: number;
  normalizedEntryList: NormalizedEntry[];
  refBlank: React.RefObject<HTMLElement>;
};

type EntryBuilderOptions = {
  chosenBlank: NormalizedEntry | undefined;
  entry: NormalizedEntry;
  entryIdx: number;
  isAnswered: boolean;
  isTimeUp: boolean;
  letterDelay: number;
  refBlank?: React.RefObject<HTMLElement>;
  totalLettersBuilt: number;
};

const buildEntryDump = ({
  chosenBlank,
  entry,
  entryIdx,
  isAnswered,
  isTimeUp,
  letterDelay,
  refBlank,
  totalLettersBuilt
}: EntryBuilderOptions) => {
  let numLettersBuilt = 0;

  const shouldReveal = isAnswered || isTimeUp;
  const isChosen = chosenBlank === entry;

  const letters = entry.word.split('').map((letter, ltrIdx) => (
    <span
      className="letter"
      key={++numLettersBuilt}
      style={{
        animationDelay: isChosen
          ? `${numLettersBuilt * letterDelay}ms`
          : `${(totalLettersBuilt + numLettersBuilt) * letterDelay}ms`
      }}
    >
      {letter}
    </span>
  ));

  let className = 'word';
  className += isChosen ? ' chosen' : '';
  className += !shouldReveal && isChosen ? ' blanked' : '';

  return {
    numLettersBuilt: isChosen ? 1 : numLettersBuilt,
    wordDump: (
      <span
        key={entryIdx}
        ref={isChosen ? refBlank : null}
        className={className}
        style={{
          animationDelay: shouldReveal ? '0' : `${totalLettersBuilt * letterDelay}ms`
        }}
      >
        {letters}
      </span>
    )
  };
};
const buildNormalizedDump = ({
  chosenBlank,
  isAnswered,
  isTimeUp,
  letterDelay,
  normalizedEntryList,
  refBlank
}: BuildDumpOptions) => {
  let totalLettersBuilt = 0;

  return normalizedEntryList.map((word, wordIdx) => {
    const { numLettersBuilt, wordDump } = buildEntryDump({
      totalLettersBuilt,
      chosenBlank,
      isAnswered,
      isTimeUp,
      letterDelay,
      refBlank,
      entry: word,
      entryIdx: wordIdx
    });

    totalLettersBuilt = totalLettersBuilt + numLettersBuilt + 1; // +1 to offset words

    return wordDump;
  });
};

export default function EntryDisplay({
  category,
  chosenBlank,
  isAnswered,
  isTimeUp,
  letterDelay,
  normalizedEntryList
}: EntryDisplayProps) {
  const refBlank = useRef<HTMLElement>(null);
  const [processedEntryDump, setProcessedEntryDump] = useState<JSX.Element[]>();

  useEffect(() => {
    if (!letterDelay || !normalizedEntryList || !refBlank) {
      return;
    }

    setProcessedEntryDump(
      buildNormalizedDump({
        chosenBlank,
        isAnswered,
        isTimeUp,
        letterDelay,
        normalizedEntryList,
        refBlank
      })
    );
  }, [letterDelay, normalizedEntryList, refBlank, isAnswered, isTimeUp]);

  // Build state styling
  let className = 'entry';
  className += isAnswered ? ' is-answered' : '';
  className += isTimeUp ? ' is-timeup' : '';

  return (
    <section className="entry-display">
      <h3 className="category">Category: {category}</h3>

      <section className={className}>{processedEntryDump}</section>
    </section>
  );
}
