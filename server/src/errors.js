/**
 * ExtendableError provides a base Error class to source off of that does not
 * break the inheritence chain.
 */
class ExtendableError {
  constructor (message = null) {
    this.message = message
    this.stack = (new Error()).stack
  }
}

/**
 * APIError is the base error that all application issued errors originate, they
 * are composed of data used by the front end and backend to handle errors
 * consistently.
 */
class APIError extends ExtendableError {
  constructor (message, {status = 500, translationKey = null}, metadata = {}) {
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
const ErrPasswordTooShort = new APIError('password must be at least 8 characters', {
  status: 400,
  translation_key: 'PASSWORD_LENGTH'
})

const ErrMissingEmail = new APIError('email is required', {
  translation_key: 'EMAIL_REQUIRED',
  status: 400
})

const ErrMissingPassword = new APIError('password is required', {
  translation_key: 'PASSWORD_REQUIRED',
  status: 400
})

const ErrEmailTaken = new APIError('Email address already in use', {
  translation_key: 'EMAIL_IN_USE',
  status: 400
})

const ErrNotInRoom = new APIError('User has not joined this room', {
  translation_key: 'NOT_IN_ROOM',
  status: 400
})

const ErrNotLoggedIn = new APIError('You must be logged in to view this information', {
  translation_key: 'NOT_LOGGED_IN',
  status: 400
})

// ErrMissingToken is returned in the event that the password reset is requested
// without a token.
const ErrMissingToken = new APIError('token is required', {
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

const ErrNotFound = new APIError('not found', {
  status: 404
})

// ErrNotAuthorized is an error that is returned in the event an operation is
// deemed not authorized.
const ErrNotAuthorized = new APIError('not authorized', {
  translation_key: 'NOT_AUTHORIZED',
  status: 401
})

const errorLog = (err) => {
  console.log(err)
}

module.exports = {
  ExtendableError,
  APIError,
  ErrPasswordTooShort,
  ErrMissingEmail,
  ErrMissingPassword,
  ErrMissingToken,
  ErrNotInRoom,
  ErrNotLoggedIn,
  ErrEmailTaken,
  ErrNotFound,
  ErrAuthentication,
  ErrNotAuthorized,
  errorLog
}
