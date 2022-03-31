import categories from '-/categories';
import React, { useEffect, useState, type ReactElement } from 'react';
import EntryDisplay from './EntryDisplay';
import { randomFromArray, toNormalizedEntry, type NormalizedEntry } from './utils';

//! FIXME HACK CRAP GET RID OF IT!
let u = new URLSearchParams(globalThis.location.search);
const isDevMode = null !== u.get('dev');

export default function App(): ReactElement {
  const [letterDelay, setLetterDelay] = useState<number>();
  const [category, setCategory] = useState('Loading...');
  const [normalizedEntryList, setNormalizedEntryList] = useState<NormalizedEntry[]>();
  const [chosenBlank, setChosenBlank] = useState<NormalizedEntry>();

  // Get --delay-letter root css var for animating
  useEffect(() => {
    const letterDelay = Number(getComputedStyle(document.documentElement).getPropertyValue('--delay-letter')) || 0;
    setLetterDelay(letterDelay);
  }, []);

  // Rebuild UI on state changes
  useEffect(() => {
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
  }, [letterDelay]);

  if (!chosenBlank || !letterDelay || !normalizedEntryList) {
    return <>Loading...</>;
  }

  return (
    <div className="page-wrapper">
      <h1>BRB: Fill in the Blank!</h1>

      <EntryDisplay
        category={category}
        chosenBlank={chosenBlank}
        isAnswered={false}
        isTimeUp={false}
        letterDelay={letterDelay}
        normalizedEntryList={normalizedEntryList}
      />
    </div>
  );
}
