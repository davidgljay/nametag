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
  SET_VISIBLE_REPLIES: 'SET_VISIBLE_REPLIES',
  SET_BADGE_GRANTEE: 'SET_BADGE_GRANTEE',
  SET_BADGE_TO_GRANT: 'SET_BADGE_TO_GRANT',
  TOGGLE_NAMETAG_IMAGE_MENU: 'TOGGLE_NAMETAG_IMAGE_MENU',

  // Times
  ANIMATION_LONG: 400,
  TYPING_PROMPT_DELAY: 5000,
  ROOM_TIMEOUT: 2629746000,

  // URLs
  RESIZE_LAMBDA: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image_resize',
  IMAGE_URL_LAMBDA: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image',
  FIREBASE_DB_URL: 'https://nametagproject.firebaseio.com',

  // Public keys and tokens
  FIREBASE_WEB_KEY: 'AIzaSyCkPlC2qRkXchd9AdubS6aAyvhE1TNAPqU',
  FIREBASE_SENDER_ID: '820872076821',
  SENTRY_DSN: 'https://5843edea127249928e8f94a645b46348@sentry.io/197147',
<<<<<<< HEAD
  STRIPE_CLIENT_ID: 'pk_test_rKR5HbQPaYLCwqA3ZVylCpaD'
=======
  STRIPE_CLIENT_PUBLISHABLE: 'pk_test_rKR5HbQPaYLCwqA3ZVylCpaD',
  STRIPE_CLIENT_ID: 'ca_C2MwXiLMHINblnFauKnQ7eQ5Y'
>>>>>>> master
}
