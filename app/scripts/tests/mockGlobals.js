let i = 0

export function hzMock(results) {
  window.Horizon = () => {
    return () => {
      return {
        watch: () => {
          return {
            subscribe: (complete) => {
              complete(results[i])
              i = i + 1 % results.length
            },
          }
        },
      }
    }
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
