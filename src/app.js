import CONFIG from './config.json'
import Content from './content'
import Styles from './app.sass'

function isMobileDevice() {
	const isMobile = /iPad|Android|webOS|iPhone|iPod|Blackberry/.test(navigator.userAgent) && !window.MSStream
	// console.info({ isMobile })
	return isMobile
}

const APP = document.querySelector(`#${CONFIG.projectName}`)
