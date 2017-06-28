// general options - especially image size and increments
import CONFIG from './config.json'
// All styles
import Styles from './app.sass'
// object data is dynamically stored into for use through the app
import STATE from './state'
// all content
import Content from './content/content'

// helper functions, cleaned up into sepatate files
import delegate from './functions/delegate'
import closest from './functions/closest'
import tiltOnHover from './functions/tiltOnHover'
import isMobileDevice from './functions/isMobile'

import templates from './templates'

// Icons
// Currently experimenting with coded svg vs png files
import Icon_close from './icons/close_black.svg'
import Close from './icons/close'


const {
	TileTemplate,
	TileWrapper,
	POPUPIMG,
} = templates


function TileClick(e) {
	const IMG = this.querySelector('img')
	const CAPTION = this.querySelector('[data-type="overlay"]')
	POPUP.innerHTML = POPUPIMG(IMG.src, IMG.srcset, CAPTION)
	POPUP.style.zIndex = 99
	POPUP.dataset.active = 'true'
	Array.from(POPUP.querySelectorAll('h3, p')).forEach(elem => {
		elem.style.transform = ''
		elem.style.textShadow = ''
	})
}


function handlePopupClick(e) {
	// console.log(e.target)
	const BUTTON = closest(e.target, '[data-type="button"]')
	if (!BUTTON) return
	if (BUTTON.dataset.action === 'close') {
		POPUP.style.zIndex = 0
		POPUP.innerHTML = ''
		POPUP.dataset.active = 'false'
		return
	} else if(BUTTON.dataset.action === 'prev') {
		console.log('getting prev')
	} else if (BUTTON.dataset.action === 'next') {
		console.log('getting next')
	}
}

// get app container into global object: prevent multiple queries
const APP = document.querySelector(`#${CONFIG.projectName}`)

// Set attribute if mobile is detected; used for device specific styles (like hover)
APP.setAttribute('data-mobile', isMobileDevice())

APP.innerHTML = TileWrapper(Content.parts.map(tile => TileTemplate(tile)))

STATE.app = {
	left: APP.offsetLeft,
	top: APP.offsetTop,
}

STATE.TILES = document.querySelectorAll('[data-type="tile"]')
STATE.wrapper = APP.querySelector('[data-type="wrapper"]')
STATE.POPUP = APP.querySelector('[data-type="popup"]')
const { TILES, wrapper, POPUP } = STATE

TILES.forEach(tile => {
	tile.addEventListener('click', TileClick)
})

delegate('[data-type="popup"]', 'click', '*', handlePopupClick)
// POPUP.addEventListener('click', handlePopupClick)

tiltOnHover({
	targets: TILES,
	wrapper,
	app: STATE.app,
})


console.log({ STATE })
