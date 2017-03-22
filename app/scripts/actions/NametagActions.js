import errorLog from '../utils/errorLog'
import constants from '../constants'

export const addNametag = (nametag, id) => {
  return {
    type: constants.ADD_NAMETAG,
    nametag,
    id
  }
}

export const addNametagArray = (nametags) => {
  return {
    type: constants.ADD_NAMETAG_ARRAY,
    nametags
  }
}
