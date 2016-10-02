import React, {Component, PropTypes} from 'react'
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
  normText: {
    lineHeight: 1.4,
    padding: '7px 7px 7px 72px',
  },
  check: {
    height: 25,
    marginRight: 10,
    marginTop: 5,
    fill: green500,
  },
}

const defaultNorms = [
  'Refrain from personal attacks',
  'Respect the experiences of others',
  'Keep it on topic',
  'Keep it professional',
  'Keep it PG',
]


class Norms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customNorm: '',
      checkedNorms: [],
    }
    this.onNormClick = this.onNormClick.bind(this)
    this.normChecked = this.normChecked.bind(this)
  }

  onNormClick(norm, i) {
    return () => {
      if (this.normChecked(i)) {
        this.setState((prevState) => {
          const index = prevState.checkedNorms.indexOf(i)
          prevState.checkedNorms = prevState.checkedNorms.slice(0, index).concat(prevState.checkedNorms.slice(index + 1, prevState.checkedNorms.length))
          return prevState
        })
        this.props.removeNorm(norm, i)
      } else {
        this.setState((prevState) => {
          prevState.checkedNorms.push(i)
          return prevState
        })
        this.props.addNorm(norm, i)
      }
    }
  }

  normChecked(i) {
    return this.state.checkedNorms.indexOf(i) >= 0
  }

  render() {
    return   <div>
      {
        <List style={styles.norms}>
          {
            defaultNorms.map((norm, i) => {
              return <ListItem
                key={i}
                primaryText={norm}
                onClick={this.onNormClick(norm, i)}
                innerDivStyle={styles.normText}
                leftIcon={this.normChecked(i) ? <Check style={styles.check}/> : <div/>}
                style={styles.norm}/>
            }
            )
          }
        </List>
      }
    </div>
  }

}

Norms.propTypes = {
  addNorm: PropTypes.func.isRequired,
  removeNorm: PropTypes.func.isRequired,
}


export default Norms
