export default function (event, properties) {
  // amplitude.getInstance().logEvent(event)
  mixpanel.track(event, properties)
}
