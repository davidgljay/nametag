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
    color: 'inherit',
    textAlign: 'left',
  },
  normText: {
    lineHeight: 1.4,
    padding: '7px 7px 7px 72px',
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
              innerDivStyle={
                props.showChecks ? styles.normText
                : {...styles.normText, padding: 7}
              }
              leftIcon={props.showChecks ? <Check style={styles.check}/> : <div/>}
              style={styles.norm}/>
          )
        }
      </List>
    }
  </div>

export default Norms
