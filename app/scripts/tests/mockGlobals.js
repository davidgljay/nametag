let i = 0

export function hzMock(results) {
  let mockHz = () => {
    return {
      watch: mockHz,
      fetch: mockHz,
      find: mockHz,
      subscribe: (complete) => {
        complete(results[i])
        i = i + 1 % results.length
      },
    }
  }
  window.Horizon = () => {
    return mockHz
  }
}

window.Firebase = () => {}
window.Horizon = () => {
  return () => {
    return {
      watch: () => {
        return {
          subscribe: (complete) => {
            complete()
          },
        }
      },
    }
  }
}
