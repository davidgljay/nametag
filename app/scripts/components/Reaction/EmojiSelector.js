import React, {Component} from 'react'
import EmojiImage from './EmojiImage'
import { emojiList as emoji } from 'get-emoji'

const selectorStyle = {
  boxShadow: '0 6px 8px 0 rgba(0, 0, 0, 0.24)',
  backgroundColor: '#fff',
  width: '250px',
  height: '220px',
  position: 'relative',
  left: '10px',
  top: '0px',
}

const PickerEmoji = ({onClick, image}) => (
  <span style={{cursor: 'pointer', padding: '5px'}} onClick={() => onClick()}>
    {image}
  </span>
)

export default class EmojiSelector extends Component {
  constructor() {
    super()
    this.state = {
      filter: '',
      xHovered: false,
      scrollPosition: 0,
    }
    this.onScroll = this.onScroll.bind(this)
  }

  onScroll() {
    this.setState({ scrollPosition: this.emojiContainer.scrollTop })
  }

  componentDidMount() {
    this.emojiContainer.addEventListener('scroll', this.onScroll)
  }

  componentWillUnMount() {
    this.emojiContainer.removeEventListener('scroll', this.onScroll)
  }

  render() {
    const SINGLE_EMOJI_HEIGHT = 23
    const LOAD_HEIGHT = 500
    const EMOJIS_ACROSS = 8

    const { showing, onEmojiClick, close } = this.props
    let xStyle = {
      color: '#E8E8E8',
      fontSize: '20px',
      cursor: 'pointer',
      float: 'right',
      marginTop: '-32px',
      marginRight: '5px',
    }
    if (this.state.xHovered) {
      xStyle.color = '#4fb0fc'
    }
    let searchInputStyle =
      {
        margin: '10px',
        width: '85%',
        borderRadius: '5px',
        border: '1px solid #E8E8E8',
      }

    const searchInput = (
      <div>
        <input
          style={Object.assign({}, searchInputStyle, this.props.customStyles.searchInput)}
          type='text'
          placeholder='Search'
          value={this.state.filter}
          onChange={(e) => this.setState({filter: e.target.value})}
        />
      </div>
    )
    const x =
      <span
        onClick={() => {
          this.setState({ xHovered: false})
          close()
        }}
        style={Object.assign({}, xStyle, this.props.customStyles.xStyle)}
        onMouseEnter={() => this.setState({ xHovered: true})}
        onMouseLeave={() => this.setState({ xHovered: false})}
      >
        x
      </span>
    const show = emoji.filter(name => name.indexOf(this.state.filter) !== -1)
    const emptyStyle = {
      height: '16px',
      width: '16px',
      display: 'inline-block',
    }
    const emojis = show.map((em, i) => {
      const row = Math.floor((i + 1) / EMOJIS_ACROSS)
      const pixelPosition = row * SINGLE_EMOJI_HEIGHT
      const position = this.state.scrollPosition + LOAD_HEIGHT
      const shouldShowImage = pixelPosition < position && (position - pixelPosition) <= LOAD_HEIGHT
      const image = shouldShowImage ? <EmojiImage name={em} /> : <div style={emptyStyle} />
      return (
        <PickerEmoji
          key={em}
          image={image}
          onClick={() => {
            onEmojiClick(em)
            close()
          }}
        />
      )
    })
    return (
      <div style={showing ? Object.assign({}, selectorStyle, this.props.customStyles.selectorStyle) : {display: 'none'}}>
        {searchInput}
        {x}
        <div
          style={{padding: '10px', paddingTop: '5px', width: '230px', height: '160px', overflow: 'auto'}}
          ref={(node) => this.emojiContainer = node}
        >
          {emojis}
        </div>
      </div>
    )
  }
}
