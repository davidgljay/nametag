import React from 'react'
import style from '../../../styles/Utils/Alert.css'

const Alert = (props) => {
  let alert = null
  if (props.alert) {
    alert =
      <div className={style[props.alertType]} role="alert">
          {props.alert}
      </div>
  }
  return alert
}

export default Alert
