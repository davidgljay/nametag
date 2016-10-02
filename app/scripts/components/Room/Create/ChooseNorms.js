import React, {Component, PropTypes} from 'react'
import {green500} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List'
import Check from 'material-ui/svg-icons/navigation/check'
import TextField from 'material-ui/TextField'

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
  formCheck: {
    height: 25,
    marginRight: 10,
    marginTop: 16,
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


class ChooseNorms extends Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedNorms: [],
      customNorms: [''],
    }
    this.onNormClick = this.onNormClick.bind(this)
    this.normChecked = this.normChecked.bind(this)
    this.onCustomNormChange = this.onCustomNormChange.bind(this)
  }

  onNormClick(norm, i) {
    return () => {
      if (this.normChecked(i)) {
        this.setState((prev) => {
          const index = prev.checkedNorms.indexOf(i)
          prev.checkedNorms = prev.checkedNorms.slice(0, index).concat(prev.checkedNorms.slice(index + 1, prev.checkedNorms.length))
          return prev
        })
        this.props.removeNorm(i)
      } else {
        this.setState((prev) => {
          prev.checkedNorms.push(i)
          return prev
        })
        this.props.addNorm(norm, i)
      }
    }
  }

  normChecked(i) {
    return this.state.checkedNorms.indexOf(i) >= 0
  }

  onCustomNormChange(subIndex, i) {
    return (e) => {
      const val = e.target.value
      this.setState((prev) => {
        if (subIndex === prev.customNorms.length - 1
          && prev.customNorms[subIndex].length === 0) {
          prev.customNorms.push('')
        }
        prev.customNorms[subIndex] = val
        return prev
      })
      this.props.addNorm(val, i)
    }
  }

  render() {
    return   <div style={this.props.style}>
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
            })
          }
          {
            this.state.customNorms.map((norm, subIndex) => {
              let i = subIndex + defaultNorms.length
              return <ListItem
                key={i}
                primaryText={<TextField
                  value={norm}
                  multiLine={true}
                  hintText='Add a norm...'
                  onChange={this.onCustomNormChange(subIndex, i)}
                  />}
                onClick={this.onNormClick(norm, i)}
                innerDivStyle={styles.normText}
                leftIcon={this.normChecked(i) ? <Check style={styles.formCheck}/> : <div/>}
                style={styles.norm}/>
            })
          }
        </List>
    </div>
  }

}

ChooseNorms.propTypes = {
  addNorm: PropTypes.func.isRequired,
  removeNorm: PropTypes.func.isRequired,
}


export default ChooseNorms
