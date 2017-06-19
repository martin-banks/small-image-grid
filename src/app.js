import CONFIG from './config.json'
import STATE from './state'
import Content from './content/content'
import Styles from './app.sass'
import createSrcSet from './functions/createSrcSet'
import tiltOnHover from './functions/tiltOnHover'


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
		<div class="${Styles.close}">X</div>
		<div class="${Styles.popupText}">${caption.innerHTML}</div>
	`
}

function TileClick(e) {
	const IMG = this.querySelector('img')
	const CAPTION = this.querySelector('[data-type="overlay"]')
	POPUP.innerHTML = POPUPIMG(IMG.src, IMG.srcset, CAPTION)
	POPUP.style.zIndex = 99
	POPUP.dataset.active = 'true'
}
function closePopup(e) {
	this.style.zIndex = 0
	this.innerHTML = ''
	this.dataset.active = 'false'
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

POPUP.addEventListener('click', closePopup)
tiltOnHover({
	targets: TILES,
	wrapper,
})


console.log({ STATE })
