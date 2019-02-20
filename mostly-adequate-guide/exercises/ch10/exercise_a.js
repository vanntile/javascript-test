// Write a function that adds two possibly null numbers together using `Maybe` and `ap`.

// safeAdd :: Maybe Number -> Maybe Number -> Maybe Number
const safeAdd = curry((x, y) => Maybe.of(add)
  .ap(x)
  .ap(y));
