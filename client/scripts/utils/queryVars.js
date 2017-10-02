module.exports.getQueryVariable = (variable) => {
  let query = window.location.search.substring(1)
  let vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1])
    }
  }

  // If not found, return null.
  return null
}

module.exports.removeQueryVar = variable => {
  const regexp = new RegExp(`${variable}=[^&]+`)
  const newSearch = window.location.search.replace(regexp, '')
  const newQuery = newSearch > 1 ? newSearch : ''
  var newurl = window.location.protocol + '//' + window.location.host +
    window.location.pathname + newQuery
  window.history.pushState({path: newurl}, '', newurl)
}
