import React from 'react'
import {primary} from '../../../styles/colors'
import {List, ListItem} from 'material-ui/List'
import Check from 'material-ui/svg-icons/navigation/check'

const styles = {
  norms: {
    textAlign: 'center',
    padding: 0,
    listStyle: 'none',
    fontWeight: 300
  },

  norm: {
    color: 'inherit',
    textAlign: 'left'
  },
  normText: {
    lineHeight: 1.4,
    padding: '7px 7px 7px 60px'
  },
  check: {
    height: 25,
    marginRight: 10,
    fill: primary
  }

}

const Norms = ({norms, showChecks}) =>
  <div id='norms'>
    {
      norms &&
      <List style={styles.norms}>
        {
          norms.map((norm, i) =>
            <ListItem
              key={i}
              primaryText={norm}
              disabled
              innerDivStyle={
                showChecks ? styles.normText
                : {...styles.normText, padding: 7, fontSize: 14}
              }
              leftIcon={showChecks ? <Check style={styles.check} /> : <div />}
              style={styles.norm} />
          )
        }
      </List>
    }
  </div>

export default Norms
