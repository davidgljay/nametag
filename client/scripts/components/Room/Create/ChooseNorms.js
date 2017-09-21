import React, {Component, PropTypes} from 'react'
import {grey, primary, red} from '../../../../styles/colors'
import {List, ListItem} from 'material-ui/List'
import Check from 'material-ui/svg-icons/navigation/check'
import TextField from 'material-ui/TextField'

const defaultNorms = [
  'Refrain from personal attacks',
  'Avoid explicit language & content',
  'Take time to welcome newcomers',
  'What\'s said here stays here',
  'Keep comments brief and to the point',
  'Personal experience > personal opinion',
  'Curiosity > judgement',
  'Maintain an environment of safety and support',
  'Maintain professionalism',
  'Keep it light & fun'
]

class ChooseNorms extends Component {
  constructor (props) {
    super(props)
    this.state = {
      customNorms: []
    }

    this.onNormClick = (norm, i) => {
      return () => {
        if (this.normChecked(i)) {
          this.props.removeNorm(i)
        } else if (norm.length > 0) {
          this.props.addNorm(norm, i)
        }
      }
    }

    this.normChecked = (i) => {
      return this.props.normsObj[i]
    }

    this.onCustomNormChange = (subIndex, i) => {
      return (e) => {
        const val = e.target.value
        this.setState((prev) => {
          if (subIndex === prev.customNorms.length - 1 &&
            prev.customNorms[subIndex].length === 0) {
            prev.customNorms.push('')
          }
          prev.customNorms[subIndex] = val
          return prev
        })
        this.props.addNorm(val, i)
      }
    }
  }

  componentDidMount () {
    this.setState((prev) => {
      prev.customNorms = Object.keys(this.props.normsObj)
        .filter((key) => key >= defaultNorms.length)
        .reduce((arr, key) => arr.concat(this.props.normsObj[key]), [])
      prev.customNorms.push('')
      return prev
    })
    // Make the first three norms checked by default
    this.props.addNorm(defaultNorms[0], 0)
    this.props.addNorm(defaultNorms[1], 1)
    this.props.addNorm(defaultNorms[2], 2)
  }

  render () {
    return <div style={this.props.style}>
      <h3>Set Conversation Norms</h3>
      <div style={styles.helpText}>
        As a host, you will be able to hold people accountable to these norms.
      </div>
      {
          this.props.error &&
          <div style={styles.error}>
            {this.props.error}
          </div>
        }
      <List style={styles.norms}>
        {
            defaultNorms.map((norm, i) => {
              return <ListItem
                key={i}
                primaryText={norm}
                onClick={this.onNormClick(norm, i)}
                innerDivStyle={styles.normText}
                leftIcon={this.normChecked(i) ? <Check style={styles.check} /> : <div />}
                style={styles.norm} />
            })
          }
        {
            this.state.customNorms.map((norm, subIndex) => {
              let i = subIndex + defaultNorms.length
              return <ListItem
                key={i}
                primaryText={<TextField
                  value={norm}
                  id='addCustomNorm'
                  multiLine
                  hintText='Add a norm...'
                  onChange={this.onCustomNormChange(subIndex, i)}
                  />}
                onClick={this.onNormClick(norm, i)}
                innerDivStyle={styles.normText}
                leftIcon={this.normChecked(i) ? <Check style={styles.formCheck} /> : <div />}
                style={styles.norm} />
            })
          }
      </List>
    </div>
  }
}

ChooseNorms.propTypes = {
  addNorm: PropTypes.func.isRequired,
  removeNorm: PropTypes.func.isRequired,
  normsObj: PropTypes.object.isRequired
}

const styles = {
  textfield: {
    fontSize: 20,
    padding: 0,
    textAlign: 'left',
    margin: '20px 20px 10px 10px'
  },
  titleForm: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    flexDirection: 'column'
  },
  descriptionField: {
    fontSize: 16
  },
  helpText: {
    color: grey,
    fontSize: 14,
    fontStyle: 'italic'
  },
  norms: {
    textAlign: 'center',
    padding: 0,
    listStyle: 'none'
  },

  norm: {
    textAlign: 'left'
  },
  normText: {
    lineHeight: 1.4,
    padding: '7px 7px 7px 72px'
  },
  check: {
    height: 25,
    marginRight: 10,
    marginTop: 5,
    fill: primary
  },
  formCheck: {
    height: 25,
    marginRight: 10,
    marginTop: 16,
    fill: primary
  },
  error: {
    color: red
  }
}

export default ChooseNorms
