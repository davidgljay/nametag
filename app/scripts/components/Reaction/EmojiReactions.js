import React, { Component } from 'react'
import { emojiList as emoji } from 'get-emoji'
import EmojiSelector from './EmojiSelector'
import EmojiImage from './EmojiImage'


const wrapperStyle = {
  display: 'inline-block',
  marginTop: '2px',
  marginBottom: '2px',
  marginRight: '4px',
  padding: '1px 3px',
  borderRadius: '5px',
  backgroundColor: '#fff',
  border: '1px solid #E8E8E8',
  cursor: 'pointer',
  height: '1.4rem',
  lineHeight: '23px',
  WebkitUserSelect: 'none',
  msUserSelect: 'none',
  MozUserSelect: 'none',
}

const emojiStyle = {
  lineHeight: '20px',
  verticalAlign: 'middle',
  display: 'inline-block',
}

const wrapperHover = {
  border: '1px solid #4fb0fc',
}

const countStyle = {
  fontSize: '11px',
  fontFamily: 'helvetica, arial',
  position: 'relative',
  top: '-2px',
  padding: '0 1px 3px',
  color: '#959595',
}

const countHover = {
  color: '#4fb0fc',
}

class SingleEmoji extends Component {
	constructor() {
		super()
		this.state = { hovered: false }
	}

	render() {
		const {
			name,
			count = 1,
			onClick = () => {},
		} = this.props

		const wrapperFinalStyle = this.state.hovered ? Object.assign({}, this.props.customStyles.wrapperStyle, this.props.customStyles.wrapperHover) : this.props.customStyles.wrapperStyle
		const countFinalStyle = this.state.hovered ? Object.assign({}, this.props.customStyles.countStyle, this.props.customStyles.countHover) : this.props.customStyles.countStyle
		return (
			<div
				style={wrapperFinalStyle}
				onClick={() => onClick(name)}
				onMouseEnter={() => this.setState({hovered: true})}
				onMouseLeave={() => this.setState({hovered: false})}
			>
				<span style={emojiStyle}><EmojiImage name={name} /></span>
				<span style={countFinalStyle}>{count}</span>
			</div>
		)
	}
}

const EmojiWrapper = ({reactions, onReaction, customStyles}) => {
	return (
		<div style={{display: 'inline-block'}}>
			{reactions.map(({name, count}) => (
				<SingleEmoji
					name={name}
					count={count}
					key={name}
					onClick={onReaction}
					customStyles={customStyles} />
			))}
		</div>
	)
}

export default class EmojiReact extends Component {
	constructor() {
		super()
		this.state = { hovered: false, showSelector: false }
		this.onKeyPress = this.onKeyPress.bind(this)
		this.closeSelector = this.closeSelector.bind(this)
		this.onClick = this.onClick.bind(this)
	}

	onKeyPress(e) {
		if (e.keyCode === 27) {
			this.closeSelector()
		}
	}

	onClick({ target }) {
		if (this.node && !this.node.contains(target) && this.state.showSelector) {
			this.closeSelector()
		}
	}

	componentDidMount() {
		document.addEventListener('click', this.onClick)
		document.addEventListener('keydown', this.onKeyPress)
	}

	componentWillUnMount() {
		document.removeEventListener('click', this.onClick)
		document.removeEventListener('keydown', this.onKeyPress)
	}

	closeSelector() {
		this.setState({ showSelector: false })
	}

	render() {
		let customStyles = {
			wrapperStyle: Object.assign({}, wrapperStyle, this.props.wrapperStyle), 
			emojiStyle: Object.assign({}, emojiStyle, this.props.emojiStyle), 
			countStyle: Object.assign({}, countStyle, this.props.countStyle),
			wrapperHover: Object.assign({}, wrapperHover, this.props.wrapperHover),
			countHover: Object.assign({}, countHover, this.props.countHover),
		}
		const { reactions, onReaction } = this.props
		const plusButtonStyle = this.state.hovered ? Object.assign({}, customStyles.wrapperStyle, customStyles.wrapperHover) : customStyles.wrapperStyle
		const plusStyle = this.state.hovered ? Object.assign({}, customStyles.countStyle, customStyles.countHover) : customStyles.countStyle
		const selector = (
			<div style={{display: 'inline-block'}} ref={node => this.node = node}>
				<div
					style={plusButtonStyle}
					onMouseEnter={() => this.setState({ hovered: true })}
					onMouseLeave={() => this.setState({ hovered: false})	}
					onClick={this.props.toggleSelector}
				>
					<span style={plusStyle}>+</span>
				</div>
			</div>
		)
  return (
			<div style={{display: 'inline-flex'}}>
				<EmojiWrapper
					onReaction={onReaction}
					reactions={reactions}
					customStyles={customStyles} />
				{selector}
			</div>
		)
	}
}
