import constants from '../constants'


const addCertificate = (state, action) => {
  let certs = [action.cert]
  let userNametag = state[action.room]
  if (userNametag && userNametag.certificates) {
    let unique = true
    let currentCerts = userNametag.certificates
    for (let i = currentCerts.length - 1; i >= 0; i--) {
      if (currentCerts[i].id === action.cert.id) {
        unique = false
      }
    }
    if (unique) {
      certs = userNametag.certificates.concat(certs)
    }
  }
  let newUserNametag = Object.assign({}, userNametag, {certificates: certs})
  return Object.assign({}, state, {[action.room]: newUserNametag})
}

const removeCertificate = (state, action) => {
  let certs = []
  let userNametag = state[action.room]

  if (userNametag && userNametag.certificates) {
    certs = userNametag.certificates
  }
  let newCerts = certs.slice()
  for (let i = certs.length - 1; i >= 0; i--) {
    if (certs[i].id === action.certId) {
      newCerts = certs.slice(0, i).concat(certs.slice(i + 1, certs.length))
    }
  }
  let newNametag = Object.assign({}, userNametag, {certificates: newCerts})
  return Object.assign({}, state, {[action.room]: newNametag})
}

const updateUserNametag = (state, action) => {
  let newNametag = Object.assign({}, state[action.room], {[action.property]: action.value})
  return Object.assign({}, state, {[action.room]: newNametag})
}

const userNametag = (state = {}, action) => {
  switch (action.type) {
  case constants.ADD_USER_NT_CERT:
    return addCertificate(state, action)
  case constants.REMOVE_USER_NT_CERT:
    return removeCertificate(state, action)
  case constants.ADD_USER_NAMETAG:
    return Object.assign({}, state, {[action.room]: action.nametag})
  case constants.UPDATE_USER_NAMETAG:
    return updateUserNametag(state, action)
  default:
    return state
  }
}

export default userNametag
