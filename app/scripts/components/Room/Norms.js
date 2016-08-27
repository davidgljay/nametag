import React from 'react'
import style from '../../../styles/Room/Norms.css'

const Norms = (props) => {
  let norms = null
  let normkey = 0
  if (props.norms) {
    norms =
		<ul className={style.norms + ' list-group'}>
            {props.norms.map(function(norm) {
              normkey++
              return (
                <li key={normkey} className="list-group-item">
                  <span
                    className={style.check + ' glyphicon glyphicon-ok'}/>
                  {norm}
                </li>
                )
            })}
          </ul>
  }
  return norms
}

export default Norms