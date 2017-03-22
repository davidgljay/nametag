import {graphql} from 'react-apollo'
import CREATE_NAMETAG from './createNametag.graphql'
import CREATE_MESSAGE from './createMessage.graphql'

export const createNametag = graphql(CREATE_NAMETAG, {
  props: ({ownProps, mutate}) => ({
    createNametag: (nametag) => mutate({
      variables: {
        nametag
      }
    })
  })
})

export const createMessage = graphql(CREATE_MESSAGE, {
  props: ({ownProps, mutate}) => ({
    createMessage: (message) => {
      console.log('message', message)
      return mutate({
        variables: {
          message
        }
      })
    }
  })
})
