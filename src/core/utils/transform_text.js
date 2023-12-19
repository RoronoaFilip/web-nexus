/**
 * Replaces all instances of {{key}} in targetString with the value of replacementMap[key]
 * @param replacementMap - the map of keys to values
 * @param targetString - the string to replace text in
 * @return a transformed string
 */
function transformText(replacementMap, targetString) {
  for (const key in replacementMap) {
    const regex = new RegExp('{{' + key + '}}', 'g');
    const replacement = replacementMap[key];
    targetString = targetString.replace(regex, replacement);
  }
  return targetString;
}

module.exports = { transformText };
