import React from 'react'
import radium from 'radium'

const Media = (props) => {
  let media
  let yt = /youtube\.com\/watch\?v=([a-zA-Z0-9_]+)/.exec(props.url)
  if (yt) {
    let ytCode = yt[1]
    media = <div style={styles.video}>
      <iframe
        style={styles.videoFrame}
        width='560'
        height='315'
        src={'https://www.youtube.com/embed/' + ytCode}
        frameborder='0'
        allowfullscreen />
    </div>
  } else if (/.gif|.png|.jpg/.exec(props.url)) {
    media = <img src={props.url} style={styles.mediaImage} />
  }

  return <div style={styles.media}>
    {media}
  </div>
}

export default radium(Media)

const styles = {
  media: {
    padding: 10
  },
  mediaImage: {
    maxWidth: '80%'
  },
  video: {
    '@media (max-width: 975px)': {
      position: 'relative',
      paddingBottom: '56.25%', /* 16:9 */
      paddingTop: '25px',
      height: 0
    }
  },
  videoFrame: {
    '@media (max-width: 975px)': {
      position: 'absolute',
      top: 0,
      left: 0,
      maxWidth: '100%',
      maxHeight: '100%'
    }
  }
}
