import React, {Component, PropTypes} from 'react'
import FontIcon from 'material-ui/FontIcon'
import key from 'keymaster'

class SearchBar extends Component {

  constructor (props) {
    super(props)

    this.state = {
      query: ''
    }

    this.onQueryChange = (e) => {
      e.preventDefault()
      this.setState({query: e.target.value})
    }

    this.search = (e) => {
      e.preventDefault()
      this.props.search(this.state.query)
    }
  }

  render () {
    return <div style={styles.container}>
      <FontIcon
        style={styles.icon}
        className='material-icons'>
        search
      </FontIcon>
      <form onSubmit={this.search}>
        <input
          type='text'
          style={styles.input}
          value={this.state.query}
          onChange={this.onQueryChange} />
        <input type='submit' style={styles.submit} />
      </form>
    </div>
  }
}

const {func} = PropTypes
SearchBar.propTypes = {
  search: func.isRequired
}

export default SearchBar

const styles = {
  container: {
    display: 'flex',
    margin: '0px 30px',
    padding: '10px',
    border: '1px solid grey',
    borderRadius: '5px'
  },
  input: {
    flex: 1,
    border: 'none',
    fontSize: 18,
    background: 'rgb(251, 251, 251)',
    focus: {
      border: 'none'
    }
  },
  submit: {
    display: 'none'
  }
}
