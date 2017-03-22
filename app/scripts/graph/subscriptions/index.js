import CHECK_NAMETAG_PRESENCE from './checkNametagPresence.graphql'

export const checkNametagPresence = subscribeToMore => params => subscribeToMore({
  document: CHECK_NAMETAG_PRESENCE,
  variables: {
    roomId: params.roomId
  },
  updateQuery: (oldData, {subscriptionData}) => {
    console.log('subscriptionData', subscriptionData)
    if (!subscriptionData.data) {
      return oldData
    }
    const {nametagId, present} = subscriptionData.data
    const newNametags = oldData.rooms.nametags.reduce(
      (nametags, nametag, i) => {
        if (nametag.id === nametagId) {
          nametags[i].present = present
        }
        return nametags
      }, oldData.rooms.nametags.slice())
    return {
      ...oldData,
      room: {
        ...oldData.room,
        nametags: newNametags
      },
      me: {
        ...oldData.me
      }
    }
  }
})
