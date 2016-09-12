import { connect } from 'react-redux'
import component from '../../components/Reaction/Reactions'
import {addReaction, watchMessageReactions, unWatchMessageReactions} from '../../actions/ReactionActions'

export const mapStateToProps = (state, ownProps) => {
  let messageReactions = Object.keys(state.reactions)
    .filter(key => {
      return state.reactions[key].message === ownProps.message
    })
    .reduce((res, key) => {
      res[key] = state.reactions[key]
      return res
    }, {})
  return Object.assign({}, {
    reactions: messageReactions,
  }, ownProps)
}

export const mapDispatchToProps = (dispatch) => {
  return {
    addReaction(reaction) {
      dispatch(addReaction(reaction))
    },
    watchMessageReactions(message) {
      dispatch(watchMessageReactions(message))
    },
    unWatchMessageReactions(message) {
      dispatch(unWatchMessageReactions(message))
    },
  }
}

const Reactions = connect(
  mapStateToProps,
  mapDispatchToProps
)(component)

export default Reactions
