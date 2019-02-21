// Write the isomorphisms between String and [Char].
//
// As a reminder, the following functions are available in the exercise's context:
//
//   split :: String -> String -> [String]
//   intercalate :: String -> [String] -> String

// strToList :: String -> [Char]
const strToList = s => s.split('');

// listToStr :: [Char] -> String
const listToStr = curry(intercalate(''));
