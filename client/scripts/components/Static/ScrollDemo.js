import React, {Component} from 'react'
import DemoMessage from './DemoMessage'

const participants = [
  {
    id: 'part1',
    name: 'Naomi Clark',
    image: 'https://s3.amazonaws.com/nametag_images/50/1505782452205-4-Caitlin-Taylor-1100x733.jpg'
  },
  {
    id: 'part2',
    name: 'Bill Weston',
    bio: 'Lawyer, father of two, advocate for patient\'s rights.'
  }
]

const messages = [
  {
    id: 'msg1',
    author: participants[0],
    text: 'Hi, I\'m running for the congressional seat in our district, and I want to hear about your experiences with healthcare.'
  },
  {
    id: 'msg2',
    author: participants[0],
    text: 'Healthcare is a big part of why I\'m running, it\'s been a struggle for my family for the several years.'
  },
  {
    id: 'msg4',
    text: 'Someone new has joined the conversation:',
    nametag: participants[1]
  },
  {
    id: 'msg3',
    author: participants[1],
    text: 'Thanks for hosting this conversation. I can relate, since my wife got sick the national debate has felt deeply personal. Something needs to change.'
  }
]

class ScrollDemo extends Component {

  constructor (props) {
    super(props)

    this.state = {
      scroll: 0
    }

    this.getStyle = (start, end) => {
      const {scroll} = this.state
      const headerHeight = window.innerWidth < 800 ? 0 : window.innerWidth * 493 / 1023 / 2
      const adjustedScroll = scroll - headerHeight
      let tween = 0
      if (adjustedScroll < start) {
        tween = 0
      } else if (adjustedScroll > end) {
        tween = 1
      } else {
        tween = (adjustedScroll - start) / (end - start)
      }
      return {
        opacity: tween,
        position: 'relative',
        top: 30 - tween * 30
      }
    }
  }

  componentDidMount () {
    document.onscroll = () => {
      this.setState({scroll: window.pageYOffset})
    }
  }

  render () {
    return <div style={styles.container}>
      <img style={styles.phoneTop} src='https://s3.amazonaws.com/nametag_images/site/phonetop.png' />
      <div style={styles.demoMessagesContainer}>
        {
          messages.map((message, i) =>
            <DemoMessage
              key={i}
              hideAuthor={i === 1}
              style={this.getStyle(80 + i * 100, 250 + i * 100)}
              message={message} />
        )
        }
      </div>
    </div>
  }
}

export default ScrollDemo

const styles = {
  container: {
    maxWidth: 800
  },
  phoneTop: {
    width: '100%',
    marginTop: 20
  },
  demoMessagesContainer: {
    padding: 10,
    background: 'url(https://s3.amazonaws.com/nametag_images/site/phonebg.png)',
    backgroundSize: 'contain',
    backgroundRepeatY: 'repeat'
  }
}
