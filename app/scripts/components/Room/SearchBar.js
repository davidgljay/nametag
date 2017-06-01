import React, {Component, PropTypes} from 'react'
import FontIcon from 'material-ui/FontIcon'

class SearchBar extends Component {

  render() {
    return <div style={styles.container}>
      <FontIcon
        style={styles.icon}
        className='material-icons'>
        search
      </FontIcon>
      <input type='text' style={styles.input} />
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
  }
}
