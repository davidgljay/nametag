import React from 'react'
import style from '../../../styles/Room/Norms.css'

const Norms = (props) =>
  <div>
    {
      props.norms &&
		  <ul className={style.norms + ' list-group'}>
        {
          props.norms.map((norm, i) =>
            <li key={i} className="list-group-item">
              {
                props.showChecks &&
                <span
                  className={style.check + ' glyphicon glyphicon-ok'}/>
              }

              {norm}
            </li>
          )
        }
      </ul>
    }
  </div>

export default Norms
