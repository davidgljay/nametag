import React, {Component, PropTypes} from 'react'
import FontIcon from 'material-ui/FontIcon'

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

    this.onClickSearch = (e) => {
      e.preventDefault()
      // this.setState({clicked: true})
      document.getElementById('searchInput').focus()
    }

    this.search = (e) => {
      e.preventDefault()
      this.props.search(this.state.query)
    }
  }

  render () {
    const {query} = this.state
    // const container = clicked ? {...styles.container, ...styles.border}
    //   : styles.container
    return <div style={styles.container}>
      <FontIcon
        style={styles.icon}
        onClick={this.onClickSearch}
        className='material-icons'>
        search
      </FontIcon>
      <form onSubmit={this.search} style={styles.form}>
        <input
          type='text'
          id='searchInput'
          style={styles.input}
          value={query}
          onClick={this.onClickSearch}
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
    padding: '10px'
  },
  border: {
    border: '1px solid grey',
    borderRadius: '5px'
  },
  icon: {
    cursor: 'pointer'
  },
  form: {
    flex: 1
  },
  input: {
    flex: 1,
    border: 'none',
    width: '100%',
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
