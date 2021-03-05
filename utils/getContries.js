const str =
  'ardeenesfrheitnlnoptruseudzh'
function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'))
}
const array =  chunkString(str, 2)
array.unshift('Все страны')
export default array
