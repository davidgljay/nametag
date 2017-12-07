import ta from 'timeago.js'
import has from 'lodash/has'
import get from 'lodash/get'
import merge from 'lodash/merge'

let en

if (window.YAML) {
  en = window.YAML.load('/public/locales/en.yml') //eslint-disable-line
} else {
  console.log('YAML not found, clearing cache and forcing hard reload.')
  caches.keys()
   .then(keys => {
     if (keys.indexOf('nametag-cache-v1') > -1) {
       caches.delete('nametag-cache-v1')
       document.location.reload(true)
     }
   })
}

// Translations are happening at https://translate.lingohub.com/the-coral-project/dashboard

const defaultLanguage = 'en'
const translations = {...en}

let lang
let timeagoInstance

function setLocale (locale) {
  try {
    localStorage.setItem('locale', locale) // eslint-disable-line
  } catch (err) {
    console.error(err)
  }
}

function getLocale () {
  return (localStorage.getItem('locale') || navigator.language || defaultLanguage).split('-')[0] // eslint-disable-line
}

function init () {
  const locale = getLocale()
  setLocale(locale)

  // Extract language key.
  lang = locale.split('-')[0]

  // Check if we have a translation in this language.
  if (!(lang in translations)) {
    lang = defaultLanguage
  }

  timeagoInstance = ta()
}

export function loadTranslations (newTranslations) {
  merge(translations, newTranslations)
}

export function timeago (time) {
  return timeagoInstance.format(new Date(time), lang)
}

/**
 * Expose the translation function
 *
 * it takes a string with the translation key and returns
 * the translation value or the key itself if not found
 * it works with nested translations (my.page.title)
 *
 * any extra parameters are optional and replace a variable marked by {0}, {1}, etc in the translation.
 */
export function t (key, ...replacements) {
  const fullKey = `${lang}.${key}`
  if (has(translations, fullKey)) {
    let translation = get(translations, fullKey)

    // replace any {n} with the arguments passed to this method
    replacements.forEach((str, i) => {
      translation = translation.replace(new RegExp(`\\{${i}\\}`, 'g'), str)
    })
    return translation
  } else {
    console.warn(`${fullKey} language key not set`)
    return key
  }
}

export default t

init()
