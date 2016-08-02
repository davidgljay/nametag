export function hzMock(result) {
  window.Horizon = () => {
    return () => {
      return {
        watch: () => {
          return {
            subscribe: (complete) => {
              complete(result)
            },
          }
        },
      }
    }
  }
}


export function setGlobals() {
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
}
