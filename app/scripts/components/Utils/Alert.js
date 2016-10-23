import React from 'react'

const Alert = (props) => {
  let alert = null
  if (props.alert) {
    alert =
      <div >
          {props.alert}
      </div>
  }
  return alert
}

export default Alert
