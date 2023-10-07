const MAXIMUM_NUMBER_OF_TERMS = 100
const MAX_LENGTH = 7

const a = ["a", "e", "i", "o", "u"]
const b = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "q",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z", "ll",
]

const aSet = new Set(a)

class Node {
  value
  children = []
  parent

  constructor(parent, value) {
    this.parent = parent
    this.value = value
  }
}

onmessage = (event) => {
  const query = event.data

  const isEndsWith = query.startsWith("*")
  const endingWith = isEndsWith ? query.slice(1) : null

  let batch = []

  let sequences = [[]]
  let i = 0
  let length = 0
  while (length < MAX_LENGTH && i < MAXIMUM_NUMBER_OF_TERMS) {
    length++
    const isUnderMaxLength = length < MAX_LENGTH
    const nextSequences = []
    for (const sequence of sequences) {
      const c = sequence.length === 0 ?
        [...a, ...b] :
        aSet.has(sequence[sequence.length - 1]) ? b : a
      for (const characters of c) {
        const subSequence = [...sequence, characters]

        const term = subSequence.join("")
        if (isEndsWith) {
          if (term.endsWith(endingWith)) {
            batch.push(term)
            i++
            if (batch.length >= 10) {
              postMessage(batch)
              batch = []
            }
          }
        } else if (term.includes(event.data)) {
          batch.push(term)
          i++
          if (batch.length >= 10) {
            postMessage(batch)
            batch = []
          }
        }

        if (isUnderMaxLength) {
          nextSequences.push(subSequence)
        }
      }
    }
    sequences = nextSequences
  }

  if (batch.length >= 1) {
    postMessage(batch)
  }
}
