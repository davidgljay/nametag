import {enc, SHA3} from 'crypto-js'
let timers = {}

const trackingEnabled = () => process.env.NODE_ENV !== 'test' && window.hasOwnProperty('mixpanel')

export const track = (event, properties) => {
  // amplitude.getInstance().logEvent(event)
  if (trackingEnabled()) {
    let data = {...properties, prod: process.env.NODE_ENV === 'production'}
    if (timers[event]) {
      data = {...data, time: new Date().getTime() - timers[event]}
      delete timers[event]
    }
    mixpanel.track(event, data)
  }
}

export const identify = (id, data) => {
  if (trackingEnabled()) {
    mixpanel.identify(SHA3(id, {outputLength: 224}).toString(enc.Base64))
    mixpanel.people.set(data)
    mixpanel.register(data)
  }
}

export const alias = (id) => {
  if (trackingEnabled()) {
    mixpanel.alias(SHA3(id, {outputLength: 224}).toString(enc.Base64))
  }
}

export const setMedatdata = (data) => {
  if (trackingEnabled()) {
    mixpanel.register(data)
    mixpanel.people.set(data)
  }
}

export const increment = category => {
  if (trackingEnabled()) {
    mixpanel.people.increment(category)
  }
}

export const setTimer = event => {
  timers[event] = new Date().getTime()
}
