/**
 * ExtendableError provides a base Error class to source off of that does not
 * break the inheritence chain.
 */
class ExtendableError {
  constructor (message = null) {
    this.message = message
  }
}

/**
 * APIError is the base error that all application issued errors originate, they
 * are composed of data used by the front end and backend to handle errors
 * consistently.
 */
class APIError extends ExtendableError {
  constructor (message, {status = 500, translationKey = null} = {}, metadata = {}) {
    super(message)

    this.status = status
    this.translation_key = translationKey
    this.metadata = metadata
  }

  toJSON () {
    return {
      message: this.message,
      status: this.status,
      translation_key: this.translationKey,
      metadata: this.metadata
    }
  }
}

// ErrPasswordTooShort is returned when the password length is too short.
const ErrPasswordTooShort = new APIError('Password must be at least 8 characters', {
  status: 400,
  translation_key: 'PASSWORD_LENGTH'
})

const ErrMissingEmail = new APIError('Email is required', {
  translation_key: 'EMAIL_REQUIRED',
  status: 400
})

const ErrMissingPassword = new APIError('Password is required', {
  translation_key: 'PASSWORD_REQUIRED',
  status: 400
})

const ErrEmailTaken = new APIError('Email address already in use', {
  translation_key: 'EMAIL_IN_USE',
  status: 400
})

const ErrBadAuth = new APIError('E-mail or password is incorrect', {
  translation_key: 'BAD_AUTH',
  status: 400
})

const ErrNotInRoom = new APIError('User has not joined this room', {
  translation_key: 'NOT_IN_ROOM',
  status: 400
})

const ErrNotMod = new APIError('User must be the mod of this room', {
  translation_key: 'NOT_ROOM_MOD',
  status: 400
})

const ErrNotLoggedIn = new APIError('User not logged in', {
  translation_key: 'NOT_LOGGED_IN',
  status: 400
})

// ErrMissingToken is returned in the event that the password reset is requested
// without a token.
const ErrMissingToken = new APIError('token is required', {
  status: 400
})

const ErrNotYourNametag = new APIError('that nametag is not part of your account', {
  status: 400
})

const ErrNotNametagAdmin = new APIError('you must be a nametag administrator to perform this action', {
  status: 400
})

/**
 * ErrAuthentication is returned when there is an error authenticating and the
 * message is provided.
 */
class ErrAuthentication extends APIError {
  constructor (message = null) {
    super('authentication error occured', {
      status: 401
    }, {
      message
    })
  }
}

const ErrNotFound = new APIError('Not Found', {
  status: 404
})

// ErrNotAuthorized is an error that is returned in the event an operation is
// deemed not authorized.
const ErrNotAuthorized = new APIError('Not Authorized', {
  translation_key: 'NOT_AUTHORIZED',
  status: 401
})

const ErrInvalidToken = new APIError('Invalid Token', {
  translation_key: 'INVALID_TOKEN',
  status: 401
})

const errorLog = (msg) => (err) => {
  if (!(err instanceof APIError)) {
    console.log(err)
  }
}

module.exports = {
  ExtendableError,
  APIError,
  ErrBadAuth,
  ErrPasswordTooShort,
  ErrMissingEmail,
  ErrMissingPassword,
  ErrMissingToken,
  ErrNotInRoom,
  ErrNotMod,
  ErrNotYourNametag,
  ErrNotLoggedIn,
  ErrEmailTaken,
  ErrNotFound,
  ErrAuthentication,
  ErrNotAuthorized,
  ErrInvalidToken,
  ErrNotNametagAdmin,
  errorLog
}
