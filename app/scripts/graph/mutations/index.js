import {graphql} from 'react-apollo'
import POST_NAMETAG from './createNametag.graphql'

export const createNametag = graphql(POST_NAMETAG, {
  props: ({ownProps, mutate}) => ({
    createNametag: (nametag) => mutate({
      variables: {
        nametag
      }
    })
  })
})
