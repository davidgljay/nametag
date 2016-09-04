import React from 'react'
import style from '../../../styles/ModAction/VisibilityOptions.css'

const VisibilityOptions = (props) => <div className={style.chooseVis}>
    <div className={style.toggle} data-toggle="buttons">
      <label className={style.toggleOption + ' ' + (props.isPublic || style.active)}>
        <input
          type="radio"
          id="privateAction"
          onClick={props.setPublic(false)} />
        Private
      </label>
      <label className={style.toggleOption + ' ' + (!props.isPublic || style.active)}>
        <input type="radio" id="publicAction" onClick={props.setPublic(true)}/>
        Public
      </label>
    </div>
    <div className={style.visText}>
      {
        props.isPublic ?
        <p>
          <span
            aria-hidden="true"
            className={style.visIcon + 'glyphicon glyphicon-eye-open'}>
          </span>
          Visible to everyone in the room.
        </p>
        :
        <p>
          <span
          aria-hidden="true"
          className={style.visIcon + 'glyphicon glyphicon-eye-close'}>
          </span>
          Visible only to the author of this message.
        </p>
      }
    </div>
  </div>

export default VisibilityOptions
