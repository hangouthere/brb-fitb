# BRB - Fill in the Blank (FITB)!

## Start Dev

docker-compose -f ./docker-compose.yml -f ./docker-compose.dev.yml up



## Start Prod

docker-compose -f ./docker-compose.yml -f ./docker-compose.prod.yml up

## TODO:

* Clean up docker-compose envs
  * needs to be generally consistent

## Concept

### FITB:

#### Global Rules/Assumptions:
    * Needs to have a customizable IGNORE_WORDS list (init with simple "and", "of", "the", etc's)
    * Split words into Normalized Data structure (similar to `twitch-chat` from `gh`)
    * Punctuation should be removed for basic consideration
    * Allow array of alternate spellings (ie, strings), and predicates (ie, functions), and matchers (ie regex) (similar to deal-bot)

#### Categories/Sub Rules
    Music:
        "Rolling Stones" => "_______ Stones"
    Movies:
        "Harry Potter and the Sorcerer's Stone" => "Harry Potter and the _______ Stone"
            "Sorcerer's" is technically the answer
            "sorcerer's" should be valid
            "sorcerers" should be valid (sans punctuation)


Trivia:
    Music:
        "Played during the 1995 Super Bowl HalfTime: ________"

