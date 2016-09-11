import React from 'react'
import style from '../../../styles/Message/Media.css'


const Media = (props) => {
  let media
  let yt = /youtube\.com\/watch\?v=([a-zA-Z0-9_]+)/.exec(props.url)
  if (yt) {
    let ytCode = yt[1]
    media = <div className={style.video}>
        <iframe
          width='560'
          height='315'
          src={'https://www.youtube.com/embed/' + ytCode}
          frameborder='0'
          allowfullscreen/>
      </div>
  } else if (/.gif|.png|.jpg/.exec(props.url)) {
    media = <img src={props.url} className={style.mediaImage}/>
  }

  return <div className={style.media}>
			{media}
		</div>
}

export default Media
