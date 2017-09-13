export const dragTypes = {
  badge: 'badge'
}

export default {

  // Actions
  ADD_ROOM: 'ADD_ROOM',
  SET_ROOM_NT_COUNT: 'SET_ROOM_NT_COUNT',
  ADD_NAMETAG: 'ADD_NAMETAG',
  ADD_NT_EDIT_BADGE: 'ADD_NT_EDIT_BADGE',
  REMOVE_NT_EDIT_BADGE: 'REMOVE_NT_EDIT_BADGE',
  UPDATE_USER_NAMETAG: 'UPDATE_USER_NAMETAG',
  ADD_USER_NAMETAG_ARRAY: 'ADD_USER_NAMETAG_ARRAY',
  ADD_USER: 'ADD_USER',
  LOGOUT_USER: 'LOGOUT_USER',
  ADD_BADGE_ARRAY: 'ADD_BADGE_ARRAY',
  UPDATE_BADGE: 'UPDATE_BADGE',
  ADD_MESSAGE: 'ADD_MESSAGE',
  SET_ROOM_PROP: 'SET_ROOM_PROP',
  ADD_ROOM_MESSAGE: 'ADD_ROOM_MESSAGE',
  ADD_REACTION: 'ADD_REACTION',
  USER_SETTING: 'USER_SETTING',
  APPEND_USER_ARRAY: 'APPEND_USER_ARRAY',
  ADD_USER_DATA: 'ADD_USER_DATA',
  UPDATE_NAMETAG_EDIT: 'UPDATE_NAMETAG_EDIT',
  ADD_NAMETAG_ARRAY: 'ADD_NAMETAG_ARRAY',
  ADD_MESSAGE_ARRAY: 'ADD_MESSAGE_ARRAY',
  ADD_ROOM_ARRAY: 'ADD_ROOM_ARRAY',
  POST_DIRECT_MESSAGE: 'POST_DIRECT_MESSAGE',
  WATCH_DIRECT_MESSAGE: 'WATCH_DIRECT_MESSAGE',
  SAVE_MESSAGE: 'SAVE_MESSAGE',

  // Times
  ANIMATION_LONG: 400,
  ROOM_TIMEOUT: 2629746000,

  // URLs
  RESIZE_LAMBDA: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image_resize',
  IMAGE_URL_LAMBDA: 'https://cl3z6j4irk.execute-api.us-east-1.amazonaws.com/prod/image',
  FIREBASE_DB_URL: 'https://nametagproject.firebaseio.com',

  // Public keys and tokens
  FIREBASE_WEB_KEY: 'AIzaSyCkPlC2qRkXchd9AdubS6aAyvhE1TNAPqU',
  FIREBASE_SENDER_ID: '820872076821',
  SENTRY_DSN: 'https://5843edea127249928e8f94a645b46348@sentry.io/197147'
}
