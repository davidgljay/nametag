import React, { PropTypes } from 'react'
import {Card} from 'material-ui/Card'
import Nametag from '../Nametag/Nametag'
import NametagIcon from '../Nametag/NametagIcon'
import ReactMarkdown from 'react-markdown'
import EmojiText from '../Message/EmojiText'
import {primary, white, grey} from '../../../styles/colors'

const Message = ({
    message: {
      id,
      author,
      text,
      nametag
    },
    style,
    hideAuthor
  }) => {
  // Compress messages if they are sequentally from the same author
  let messageStyle = hideAuthor ? {...styles.messageText, ...styles.compressed} : styles.messageText
  const messageContainerStyle = hideAuthor ? {...styles.message, ...styles.compressed} : styles.message
  const imageStyle = hideAuthor ? {...styles.image, ...styles.compressed} : styles.image

  let callout
  if (!author) {
    messageStyle = {...styles.messageText, ...styles.helpMessage}
  }
  if (nametag) {
    messageStyle = {...messageStyle, ...styles.nametagMessage}
  }

  // Getting around Markdown's splitting of the '_' character in a hacky way for now
  // Also, wrapping urls in brackets
  const emojiText = text
    .replace(/:\)/, ':slightly_smiling_face:')
    .replace(/:D/, ':grinning:')
    .replace(/:P/, ':stuck_out_tongue:')
    .replace(/:\(/, ':white_frowning_face:')
    .replace(/(?=\S+)_(?=\S+:)/g, '~@~A~')
    .replace(
      /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/,
      (url) => `[${url}](${url})`)

  return <div style={style}>
    <div
      className='message'
      style={messageContainerStyle}
      id={id}>
      {
        !nametag &&
        <div style={imageStyle}>
          {
            author && !hideAuthor && <NametagIcon
              image={author.image}
              name={author.name}
              diameter={50} />
          }
        </div>
      }
      <div style={messageStyle}>
        {
          author && !hideAuthor && <div style={styles.name}>
            {author.name}
          </div>
        }
        {
          callout
        }
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
            source={emojiText}
            escapeHtml />
        </div>
        {
          nametag &&
          <div style={styles.nametagContainer}>
            <Card key={nametag.id} id={nametag.id} style={styles.nametag}>
              <Nametag
                nametag={nametag} />
            </Card>
          </div>
        }
      </div>
    </div>
  </div>
}

const {shape, string, object, bool} = PropTypes

Message.propTypes = {
  message: shape({
    id: string.isRequired,
    text: string.isRequired,
    editedAt: string,
    author: shape({
      image: string,
      name: string.isRequired
    }),
    nametag: object
  }).isRequired,
  style: object.isRequired,
  hideAuthor: bool
}

export default Message

const styles = {
  message: {
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 10,
    marginBottom: 5,
    display: 'flex'
  },
  directMessageIncoming: {
    paddingTop: 10,
    backgroundColor: 'rgba(168, 168, 168, 0.05)',
    border: '1px solid rgba(168, 168, 168, 0.25)'
  },
  directMessageOutgoing: {
    paddingTop: 10,
    backgroundColor: 'rgba(168, 168, 168, 0.05)',
    border: '1px solid rgba(168, 168, 168, 0.25)'
  },
  dmCallout: {
    color: grey,
    fontStyle: 'italic',
    display: 'flex',
    marginLeft: 10,
    marginBottom: 10
  },
  messageText: {
    width: '100%',
    fontSize: 14,
    paddingRight: 40,
    paddingTop: 10,
    paddingLeft: 10,
    borderRadius: 5,
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    wordBreak: 'break-word'
  },
  nametagMessage: {
    paddingRight: 20,
    paddingLeft: 20,
    borderRadius: 5
  },
  helpMessage: {
    color: grey,
    textAlign: 'center',
    fontStyle: 'italic'
  },
  image: {
    paddingRight: 10,
    paddingLeft: 25,
    paddingTop: 10,
    minWidth: 50,
    verticalAlign: 'top',
    cursor: 'pointer'
  },
  below: {
    display: 'flex'
  },
  imageImg: {
    borderRadius: 25,
    width: 50,
    height: 50
  },
  tinyIconImg: {
    verticalAlign: 'middle',
    borderRadius: 10,
    width: 20,
    height: 20,
    display: 'inline-block',
    marginLeft: 5
  },
  name: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 5,
    cursor: 'pointer'
  },
  date: {
    fontSize: 10,
    fontStyle: 'italic',
    color: grey,
    height: 22,
    lineHeight: '22px',
    marginRight: 10
  },
  text: {
    fontSize: 16,
    fontWeight: 300
  },
  defaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    lineHeight: '50px',
    fontSize: 22,
    color: white,
    cursor: 'default'
  },
  tinyDefaultImage: {
    backgroundColor: primary,
    textAlign: 'center',
    lineHeight: '20px',
    fontSize: 10,
    fontStyle: 'normal',
    color: white,
    cursor: 'default'
  },
  compressed: {
    paddingTop: 0
  },
  nametag: {
    width: 240,
    marginTop: 10,
    marginBottom: 10,
    minHeight: 60,
    paddingBottom: 5
  },
  nametagContainer: {
    display: 'flex',
    justifyContent: 'center'
  }
}
