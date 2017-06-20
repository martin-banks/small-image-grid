import CONFIG from './config.json'
import STATE from './state'
import Content from './content/content'
import Styles from './app.sass'
import createSrcSet from './functions/createSrcSet'

import delegate from './functions/delegate'
import closest from './functions/closest'

import tiltOnHover from './functions/tiltOnHover'
import Icon_close from './icons/close_black.svg'
import Close from './icons/close'


function isMobileDevice() {
	const isMobile = /iPad|Android|webOS|iPhone|iPod|Blackberry/
		.test(navigator.userAgent) && !window.MSStream
	// console.info({ isMobile })
	return isMobile
}

const APP = document.querySelector(`#${CONFIG.projectName}`)
APP.setAttribute('data-mobile', isMobileDevice())

const overlayChildren = {
	title: value => `<h3 class="${Styles.title}"><span>${value}</span></h3>`,
	caption: value => `<p class="${Styles.caption}">${value}</p>`,
	credit: value => `<p class="${Styles.credit}">${value}</p>`,
}

const captions = nodes => `<div class="${Styles.overlayContainer}" data-type="overlay">
	${nodes.map(node => overlayChildren[node.type](node.value)).join('')}
</div>`

const randomColor = () => [0,0,0].map(val => Math.floor(Math.random() * 255)).join()

const TileTemplate = C => `<div class="${Styles.tile}" data-type='tile'>
	<div class="${Styles.inner}" 
		data-type='inner' 
		style="background: rgba(${randomColor()}, 1)"
	>
		<div class="${Styles.imgWrapper}">
			<img 
				class="${Styles.image}" 
				src="${C.image.src.Img200}" 
				srcset="${createSrcSet(C.image.src)}" 
				alt="${C.image.alt}" 
			/>
		</div>
		${captions(C.text)}
		<div class="${Styles.highlight}" data-type="highlight">
			<div class="${Styles.disc}"></div>
		</div>
	</div>
</div>`

const TileWrapper = tiles => `<section class="${Styles.wrapper}" data-type="wrapper">
	${tiles.join('')}
</section>
<section class="${Styles.popupContainer}" data-type="popup"></section>`


function POPUPIMG(src, srcset, caption) {
	return `
		<img src="${src}" srcset="${srcset}" alt="" />
		${Close()}
		<div class="${Styles.prev}" data-type="button" data-action="prev"><</div><!--
		--><div class="${Styles.next}" data-type="button" data-action="next">></div>
		<div class="${Styles.popupText}">${caption.innerHTML}</div>
	`
}

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
	console.log(e.target)
	const BUTTON = closest(e.target, '[data-type="button"]')
	if (!BUTTON) return
	if (BUTTON.dataset.action === 'close') {
		POPUP.style.zIndex = 0
		POPUP.innerHTML = ''
		POPUP.dataset.active = 'false'
		return
	} else if(BUTTON.dataset.action === 'prev') {
		console.log('getting prev')

	} else if (BUTTON.dataset.action === 'next'){
		console.log('getting next')
	}

}


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
})


console.log({ STATE })
