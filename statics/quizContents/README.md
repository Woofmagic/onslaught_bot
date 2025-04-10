# Quiz Contents

Here, we will expound upon the way in which we collect data to then format into simple quiz questions and what we require to do so.

## Question Format

Question banks are simply JSON files. We use a particular structure that contains all the data that ought to be present and available during the period in which a user interacts with the bot. 

Let us get insight into the data structure now by simply looking at how the the first question entry in the IT test bank is formatted:

```json
{
    "id": 1,
    "content": {
        "version": "1.0.0",
        "categories": ["CompTIA A+", "terminology", "peripherals"],
        "topics": ["introductory", "input devices", "peripherals", "hardware"],
        "questionText": "This is the word used to describe an auxillary device used to put information into and extract information out of a computer.",
        "examples": [
            "Typical peripherals are keyboards, mouses, microphones, scanners, and screens. Don't psyche yourself out here. This is just the word used to describe these kinds of input/output devices."
        ],
        "possibleAnswers": [
            "peripheral",
            "peripherals",
            "peripheral device"
        ],
        "difficulty": "easy",
        "extraInfo": "",
        "referencesSources": [
            "https://en.wikipedia.org/wiki/Peripheral",
            "https://books.google.com/books?id=U1M3clUwCfEC&pg=PA366#v=onepage&q&f=false"
        ]
    }
},
```

### `id`

The `id` of each question must be unique. While there are several unique fields in the `content` key, it is convenient to have a numerical index that we can use to look up the question later.

In the event that the answer to a given question is incorrect, the question wording is ambiguous and can be sharpened, additional sources substantiating the veracity of the answer or possible answers can be included, or otherwise any proposed modifications to the `content` fields, we need a given *key* that a user can use to reference the problem. It is not possible to do so using only the standard Discord interface, so this index is to be used much later.

### `content`

We, of course, require the `content` field, and it is here where all of the relevant question data must go.

#### `version`

We will update the version of the question as it gets modified. Every new question starts at version `1.0.0`, and we increment its version in one of the three places (whatever fancy name they're called) depending on the "magnitude" of the update; if the entire question statement is changed, we will likely call the question `2.0.0` rather than `1.1.0` or `1.0.1`. If a major addition to some of the answers, or a major rephrasing of one of the "qualitative fields" is performed, then we will likely call the question `1.1.0` rather than `2.0.0` or `1.0.1.`. In the last case, if a few words are shifted around, then we might call the question in its version `1.0.1` rather than `1.1.0`. But we should keep in mind that there is no strict rule determining the "version" after all.

#### `categories`

The way in which we classify these questions should actually be viewed at an abstract level: Questions that are about similar things need to provide metadata that enables one to identify in a rigorous manner that they *are* about similar things. By a "rigorous manner," we mostly mean in a data-analytical context, in which a computer is to determine if questions are "nearby" or "separate."

There is not a good understanding of what `categories` should be as opposed to `topics`. For the time being, we should use "broad strokes" for `categories` while more specific keywords should be used for `topics`.

#### `topics`

See the above.

#### `questionText`

This field is *incredibly important* --- it is directly exposed to the user when they use the associated Discord command. 

#### `examples`

This field is here for the purpose of providing nothing beyond some explanations for *why the answer to the question is the answer it is*. So, it is ideal for examples to also be well-written.

#### `possibleAnswers`

This field is also *incredibly important*. It is an array of strings that will be *used to directly compare* with the user's input. That is, if you write a question like, "Why do we like computers?"and intend for the answer to be `"memes n stuff"`, then, *unless you provide a diverse array of possible answers*, a user who types anything *other* than the aformenetioned string (up to capitalized/lowercase characters) will be judged as providing an incorrect answer.

It is precisely because of this data structure that the *types* of questions we can ask are quite restrictive: Open-ended questions eliciting a type of "essay" response simply are not feasible to include in our questions bank. (If we turn to an LLM approach, perhaps we could include such a thing. However, the LLM that we develop would have to do a "good job" at grading open-ended essay responses.)

#### `difficulty`

We must be able to provide users with a difficulty scale because every learner is at a different level.

We must emphasize that the `difficulty` of a question is largely subjective, and we aim to actually *compute* a numerical value for this field later based on an "intelligent average" (taking into account learner profile data) of previous answers to the question; if a user with low "quantitative skills" gets "difficult" math questions incorrect, it should *not* further indicate that the question is *actually* difficult. 

Let us agree upon the following scale for the time being:

1. "very easy"
2. "easy"
3. "medium"
4. "hard"
5. "very hard"
6. "difficult"
7. "very difficult"

#### `extraInfo`

There's not a good idea currently for what should go into this field. Maybe changelog information?

#### `referencesSources`

Every single question must provide *at least one resource* from which a user may consult to determine how the question was generated. It is dramatically important to provide references rather than Mr. Guy who coded it in his basement. Sources should *usually* be in the form of links to resources rather than strings of books, movies, or other media. *Questions without a single reference will not be accepted*.