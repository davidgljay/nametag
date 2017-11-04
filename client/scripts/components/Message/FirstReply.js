import React, {PropTypes} from 'react'
import EmojiText from './EmojiText'
import NametagIcon from '../Nametag/NametagIcon'
import ReactMarkdown from 'react-markdown'
import {grey} from '../../../styles/colors'

const FirstReply = ({reply: {id, text, author}, showReplies}) => {
  const replyText = text
    .replace(/:\)/, ':grinning:')
    .replace(/:[pP]/, ':stuck_out_tongue:')
    .replace(/:\(/, ':white_frowning_face:')
    .replace(/(?=\S+)_(?=\S+:)/g, '~@~A~')
    .replace(
      /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/,
      (url) => `[${url}](${url})`)
    .split(' ')
    .slice(0, 15)
    .join(' ')
    .concat(text.split(' ').length > 15 ? '...' : '')

  return <div>
    <div style={styles.replyContainer} onClick={showReplies}>
      <div style={styles.image} >
        <NametagIcon
          image={author.image}
          name={author.name}
          marginRight={10}
          diameter={25} />
      </div>
      <div style={styles.text} className='messageText'>
        <ReactMarkdown
          containerTagName={'span'}
          className={'messageText'}
          style={styles.text}
          renderers={{
            text: ({literal}) => {
              const text = literal.replace(/~@~A~/g, '_')
              return <EmojiText text={text} />
            },
            link: ({href}) => <a href={href} target='_blank'>{href}</a>
          }}
          source={replyText}
          escapeHtml />
      </div>
    </div>
    <div style={styles.readMore}>
      Read Replies
    </div>
  </div>
}

const {string, shape, func} = PropTypes

FirstReply.proptypes = {
  reply: shape({
    text: string.isRequired,
    author: shape({
      id: string.isRequired,
      name: string.isRequired,
      image: string
    })
  }).isRequired,
  showReplies: func.isRequired
}

export default FirstReply

const styles = {
  text: {
    fontWeight: 300,
    fontSize: '13px'
  },
  replyContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  },
  readMore: {
    fontSize: 10,
    fontStyle: 'italic',
    color: grey,
    textAlign: 'right'
  }
}
