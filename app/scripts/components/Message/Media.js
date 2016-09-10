import React from 'react'
import style from '../../../styles/Message/Media.css'


const Media = (props) => {
  let media
  if (/youtube\.com/.exec(props.url)) {
    let ytCode = /youtube\.com\/watch\?v=([a-zA-Z]+)/.exec(props.url)[1]
    media = <div className={style.video}>
        <iframe
          width='560'
          height='315'
          src={'https://www.youtube.com/embed/' + ytCode}
          frameborder='0'
          allowfullscreen/>;
      </div>
  } else if (/.gif|.png|.jpg/.exec(props.url)) {
    media = <img src={props.url} className={style.mediaImage}/>
  }

  return <div className={style.media}>
			{media}
		</div>
}

export default Media
