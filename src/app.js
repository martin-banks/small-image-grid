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




const {
	TileTemplate,
	TileWrapper,
	POPUPIMG,
} = templates


function TileClick(e) {
	const activeIndex = parseInt(closest(e.target, '[data-type="tile"]').getAttribute('data-index'), 10)
	console.log({ activeIndex })
	const IMG = this.querySelector('img')
	const CAPTION = this.querySelector('[data-type="overlay"]')
	POPUP.innerHTML = POPUPIMG({ index: activeIndex })
	POPUP.style.zIndex = 99
	POPUP.dataset.active = 'true'
	STATE.activeIndex = activeIndex

	console.log({ STATE })

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
	} else if (BUTTON.dataset.action === 'prev') {
		// console.log('getting prev')
		STATE.activeIndex--
		POPUP.innerHTML = POPUPIMG({ index: STATE.activeIndex })

	} else if (BUTTON.dataset.action === 'next') {
		// console.log('getting next')
		STATE.activeIndex++
		POPUP.innerHTML = POPUPIMG({ index: STATE.activeIndex })
	}
}

// get app container into global object: prevent multiple queries
const APP = document.querySelector(`#${CONFIG.projectName}`)

// Set attribute if mobile is detected; used for device specific styles (like hover)
APP.setAttribute('data-mobile', isMobileDevice())

APP.innerHTML = TileWrapper(Content.parts.map((tile, i) => TileTemplate({ tile, i })))

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
