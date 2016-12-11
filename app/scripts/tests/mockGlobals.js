
export function mockHz(res, calls, type) {
  return (req) => {
    calls.push({type, req})
    return {
      watch: mockHz(res, calls, 'watch'),
      fetch: mockHz(res, calls, 'fetch'),
      find: mockHz(res, calls, 'find'),
      upsert: mockHz(res, calls, 'upsert'),
      update: mockHz(res, calls, 'update'),
      insert: mockHz(res, calls, 'insert'),
      findAll: mockHz(res, calls, 'findAll'),
      delete: mockHz(res, calls, 'delete'),
      subscribe: (cb) => {
        calls.push({type: 'subscribe'})
        cb(res)
      },
      unsubscribe: () => {calls.push({type: 'unsubscribe'})},
    }
  }
}

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
