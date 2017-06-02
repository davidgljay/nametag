const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

export const dateFormat = (d) => {
  const date = new Date(d)
  return `${months[date.getMonth() - 1]} ${date.getDate()}, ${date.getYear() + 1900}`
}

export const timeFormat = (d) => {
  const date = new Date(d)
  return `${date.getHours() > 12 ? date.getHours() - 12 : date.getHours()}:${date.getMinutes()}` +
  `${date.getHours() > 12 ? 'PM' : 'AM'}`
}
