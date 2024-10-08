
export function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
  }
  
  return array
}

export function getRoomId() {
  const code = shuffleArray('0123456789'.split(''))
    .join('')
    .substring(0, 10)
  
    return code
}

export function getRandomCode() {
  const code = shuffleArray('0123456789abcdefghijklmnopqrstuvwxyz'.split(''))
    .join('')
    .substring(0, 16)
  
    return code
}