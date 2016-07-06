import React from 'react';
import style from '../../../styles/Room/Media.css';


const Media = (props) => {
	let media;
	if (/youtube\.com/.exec(props.url)) {
		media = //Youtube Embed code
	} else if (/.gif|.png|.jpg/.exec(props.url)) {
		media = <img src={props.url} clasName={style.mediaImage}/>;
	}

	return <div className={style.media}>
			{media}
		</div>;
};


export default Media;