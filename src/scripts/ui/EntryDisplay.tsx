import React, { useEffect, useRef, useState } from 'react';
import { type NormalizedEntry } from '../utils';

type BlankTupleBase = {
  chosenBlank: NormalizedEntry;
  refBlank?: React.RefObject<HTMLElement>;
};

type BuildOptionsBase = BlankTupleBase & {
  isAnswered: boolean;
  isTimeUp: boolean;
  letterDelay: number;
};

type BuildDumpOptions = BuildOptionsBase & {
  normalizedEntryList: NormalizedEntry[];
};

type EntryBuilderOptions = BuildOptionsBase & {
  entry: NormalizedEntry;
  entryIdx: number;
  totalLettersBuilt: number;
};

type EntryDisplayProps = BuildDumpOptions & {
  category: string;
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
      key={letter + ++numLettersBuilt}
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
        key={entry.word + entryIdx}
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
    <section className={`entry-display ${category}`}>
      <h3 className="category" key={category}>
        Category: {category}
      </h3>

      <section className={className}>{processedEntryDump}</section>
    </section>
  );
}
