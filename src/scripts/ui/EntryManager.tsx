import categories from '-/categories';
import React, { useEffect, useState } from 'react';
import { randomFromArray, toNormalizedEntry, type NormalizedEntry } from '../utils';
import EntryDisplay from './EntryDisplay';

type EntryManagerProps = {
  chooseNewAnswer: any;
  chosenBlank?: NormalizedEntry;
  isAnswered: boolean;
  isTimeUp: boolean;
  letterDelay: number;
  setChosenBlank: (b: NormalizedEntry) => void;
};

export default function EntryManager({
  chooseNewAnswer,
  chosenBlank,
  isAnswered,
  isTimeUp,
  letterDelay,
  setChosenBlank
}: EntryManagerProps) {
  const [category, setCategory] = useState('Loading...');
  const [normalizedEntryList, setNormalizedEntryList] = useState<NormalizedEntry[]>();

  // Rebuild UI on state changes
  useEffect(() => {
    if (!letterDelay) {
      return;
    }

    // Choose random category, and entry
    const randCategory = randomFromArray(Object.keys(categories));
    const randEntry = randomFromArray<string>(categories[randCategory]);
    const normalizedEntryList = toNormalizedEntry(randEntry);

    // Choose Randomized blank, that shouldn't be ignored
    let chosenBlank: NormalizedEntry;
    while ((chosenBlank = randomFromArray<NormalizedEntry>(normalizedEntryList)) && chosenBlank.shouldIgnoreForGuess) {}

    // Set our init state!
    setCategory(randCategory);
    setChosenBlank(chosenBlank);
    setNormalizedEntryList(normalizedEntryList);
  }, [letterDelay, chooseNewAnswer]);

  if (!chosenBlank || !letterDelay || !normalizedEntryList) {
    return <></>;
  }

  return (
    <EntryDisplay
      category={category}
      chosenBlank={chosenBlank}
      isAnswered={isAnswered}
      isTimeUp={isTimeUp}
      letterDelay={letterDelay}
      normalizedEntryList={normalizedEntryList}
    />
  );
}
