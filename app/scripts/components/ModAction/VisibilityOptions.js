import React from 'react'
import style from '../../../styles/ModAction/VisibilityOptions.css'
import { IconButton } from 'react-mdl'

const VisibilityOptions = (props) => <div className={style.chooseVis}>
    <div className={style.visText}>
      {
        props.isPublic ?
        <p>
          <IconButton name='visibility' onClick={props.setPublic(false)}/>
          Visible to everyone in the room.
        </p>
        :
        <p>
          <IconButton name='visibility_off' onClick={props.setPublic(true)}/>
          Visible only to the author of this message.
        </p>
      }
    </div>
  </div>

export default VisibilityOptions
