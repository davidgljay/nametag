const mockRdb = (res, calls, type) =>
  (req) => {
    calls.push({type, req})
    return {
      db: mockRdb(res, calls, 'db'),
      table: mockRdb(res, calls, 'table'),
      insert: mockRdb(res, calls, 'insert'),
      get: mockRdb(res, calls, 'get'),
      getAll: mockRdb(res, calls, 'getAll'),
      update: mockRdb(res, calls, 'update'),
      delete: mockRdb(res, calls, 'delete'),
      run: () => {
        calls.push({type: 'run'})
        return Promise.resolve(res)
      }
    }
  }
