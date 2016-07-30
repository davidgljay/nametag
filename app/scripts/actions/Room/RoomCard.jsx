import fbase from '../../api/firebase'

// Meet our first thunk action creator!
// Though its insides are different, you would use it just like any other action creator:
// store.dispatch(fetchPosts('reactjs'))
export function subscribe() {
  return function subscribeAction(dispatch) {
    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    // In this case, we return a promise to wait for.
    // This is not required by thunk middleware, but it is convenient for us.

    return fbase.on('value', function onValue(value) {
      console.log('Got value')
      console.log(value)
    })

      // In a real world app, you also want to
      // catch any error in the network call.
  }
}
