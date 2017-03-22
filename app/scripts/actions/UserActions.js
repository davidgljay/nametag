import constants from '../constants'

/*
* Set a generic option for the user (e.g. Toggle login dialog)
* @params
*  option
*  value
*
* @returns
*   null
*/
export function setting (option, value) {
  return {
    type: constants.USER_SETTING,
    option,
    value
  }
}
