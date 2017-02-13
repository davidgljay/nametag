import constants from '../constants'
import _ from 'lodash'

const updateNametagEdit = (state, action) => {
  let newNametag = {...state[action.room], [action.property]: action.value}
  return {...state, [action.room]: newNametag}
}

const addCertificate = (state, action) => {
  const certs = state[action.room].certificates
  ? _.uniqBy([action.cert].concat(state[action.room].certificates), (c) => c.id)
    : [action.cert]
  const newEditNametag = {...state[action.room], certificates: certs}
  return {...state, [action.room]: newEditNametag}
}

const removeCertificate = (state, action) => {
  const editNametag = state[action.room]
  const newCerts = _.remove(editNametag.certificates, (c) => c === action.certId)
  let newNametag = {...editNametag, certificates: newCerts}
  return {...state, [action.room]: newNametag}
}

const nametagEdit = (state = {}, action) => {
  switch (action.type) {
    case constants.UPDATE_NAMETAG_EDIT:
      return updateNametagEdit(state, action)
    case constants.ADD_NT_EDIT_CERT:
      return addCertificate(state, action)
    case constants.REMOVE_NT_EDIT_CERT:
      return removeCertificate(state, action)
    default:
      return state
  }
}

export default nametagEdit
