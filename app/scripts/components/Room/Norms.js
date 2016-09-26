import React from 'react'
import {green500} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'
import Check from 'material-ui/svg-icons/navigation/check'

const styles = {
  norms: {
    textAlign: 'center',
    padding: 0,
    listStyle: 'none',
  },

  norm: {
    textAlign: 'left',
  },
  check: {
    height: 25,
    marginRight: 10,
    fill: green500,
  },

}


const Norms = (props) =>
  <div>
    {
      props.norms &&
		  <List style={styles.norms}>
        {
          props.norms.map((norm, i) =>
            <ListItem
              key={i}
              primaryText={norm}
              leftIcon={props.showChecks ? <Check style={styles.check}/> : <div/>}
              style={styles.norm}/>
          )
        }
      </List>
    }
  </div>

export default Norms
