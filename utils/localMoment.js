// types and documents https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat

export default function localMoment(
  formatType = 'DD.MM.YYYY',
  date,
  customOptions = null
) {
  let options = {}
  switch (formatType) {
    case 'DD.MM.YYYY': // 21.01.2021
      options = { day: '2-digit', month: '2-digit', year: 'numeric' }
      break
    case 'DD.MM.YYYY.hh.mm.ss': // 21.01.2021 09.43.21
      options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }
      break
    case 'DD.MM.YYYY.hh.mm': // 21.01.2021 09.43
      options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
      break
  }

  if (customOptions) {
    options = customOptions
  }

  const res = new Intl.DateTimeFormat('ru-Ru', options).format(new Date(date))
  const resString = res.replace(/,/gi, '')
  return resString
}
