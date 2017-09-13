export const dragTypes = {
  badge: 'badge'
}

export default {

  // Actions
  ADD_NT_EDIT_BADGE: 'ADD_NT_EDIT_BADGE',
  REMOVE_NT_EDIT_BADGE: 'REMOVE_NT_EDIT_BADGE',
  UPDATE_NAMETAG_EDIT: 'UPDATE_NAMETAG_EDIT',
  ADD_TYPING_PROMPT: 'ADD_TYPING_PROMPT',
  REMOVE_TYPING_PROMPT: 'REMOVE_TYPING_PROMPT',

  // Timers
  ANIMATION_LONG: 400,
  TYPING_PROMPT_DELAY: 5000,

  // URLs
  RESIZE_LAMBDA: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image_resize',
  IMAGE_URL_LAMBDA: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image',
  FIREBASE_DB_URL: 'https://nametagproject.firebaseio.com',

  // Public keys and tokens
  FIREBASE_WEB_KEY: 'AIzaSyCkPlC2qRkXchd9AdubS6aAyvhE1TNAPqU',
  FIREBASE_SENDER_ID: '820872076821',
  SENTRY_DSN: 'https://5843edea127249928e8f94a645b46348@sentry.io/197147'
}
