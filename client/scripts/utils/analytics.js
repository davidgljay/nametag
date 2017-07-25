import {enc, SHA3} from 'crypto-js'

export const track = (event, properties) => {
  // amplitude.getInstance().logEvent(event)
  if (process.env.NODE_ENV !== 'test' && mixpanel) {
    mixpanel.track(event, {...properties, prod: process.env.NODE_ENV === 'production'})
  }
}

export const register = (id, data) => {
  if (process.env.NODE_ENV !== 'test' && mixpanel) {
    mixpanel.identify(SHA3(id, {outputLength: 224}).toString(enc.Base64))
    mixpanel.people.set(data)
    mixpanel.register(data)
  }
}

export const setMedatdata = (data) => {
  if (process.env.NODE_ENV !== 'test' && mixpanel) {
    mixpanel.register(data)
    mixpanel.people.set(data)
  }
}

export const increment = category => {
  if (process.env.NODE_ENV !== 'test' && mixpanel) {
    mixpanel.people.increment(category)
  }
}
