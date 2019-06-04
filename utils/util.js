/**
 * 时间计算
 */
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate() 
  return [year, month, day].map(formatNumber).join('-')
}

export const formatTimeYYMMDD = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

export const formatTimeForAxis = time => {
  return time.substring(5,13)
}

export const newformatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('')
}

export const formatDate1 = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('')
}