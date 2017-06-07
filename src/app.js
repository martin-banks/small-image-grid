import CONFIG from './config.json'
import Content from './content/content'
import Styles from './app.sass'

const STATE = {
	mouse: null,
	tile: null,
}

function isMobileDevice() {
	const isMobile = /iPad|Android|webOS|iPhone|iPod|Blackberry/.test(navigator.userAgent) && !window.MSStream
	// console.info({ isMobile })
	return isMobile
}


const APP = document.querySelector(`#${CONFIG.projectName}`)

const TileTemplate = C => `<div class="${Styles.tile}" data-type='tile'>
	<div class="${Styles.inner}" data-type='inner' style="background: rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 1)">
		<img class="${Styles.image}" src="${C.image.src.Img400}" alt="${C.image.alt}" />
	</div>
</div>`

const TileWrapper = tiles => `<section class="${Styles.wrapper}">${tiles.join('')}</section>`


function getMousePosition(e) {
	const { clientX: x, clientY: y } = e
	// STATE.mouse = { x, y }
	const { left, top, width, height, center } = STATE.tile

	const tileX = x - left - (width / 2) - STATE.app.left
	const tileY = y - top - (height / 2) - STATE.app.top

	// console.log(tileX, tileY)

	const pctX = ((tileX / width) * 2)
	const pctY = ((tileY / height) * 2) * -1
	// console.table([{pctX}, {pctY}])
	// console.log(STATE.tile.elem)
	const inner = STATE.tile.elem.querySelector('[data-type="inner"]')
	inner.style.transform = `rotateX(${pctY * 5}deg) rotateY(${pctX * 5}deg) scale(1.3)`
	const maxPct = Math.max(pctX < 0 ? pctX*-1 : pctX, (pctY < 0 ? pctY*-1 : pctY))
	inner.style.boxShadow = `${pctX * -1 * 40}px ${pctY * 40}px ${maxPct * 80}px 0px rgba(0,0,0, ${1 - (Math.max(0.4, (maxPct-0.6)))})`
	// inner.style.transition = ''
}


function tiltHover(e) {
	// console.log(this.__proto__)
	TILES.forEach(tile => {
		const inner = tile.querySelector('[data-type="inner"]')
		inner.style.transform = ''
		inner.style.boxShadow = ''
	})
	
	const {
		offsetWidth: width,
		offsetHeight: height,
		offsetTop: top,
		offsetLeft: left,
	} = this

	const center = {
		x: left + (width / 2),
		y: (top - window.scrollY) + (height / 2),
	}
	STATE.tile = { top: (top - window.scrollY), left, width, height, center, elem: this }
}

function tiltReset(e) {
	const inner = this.querySelector('[data-type="inner"]')
	// inner.style.transition = 'transform 200ms'
	inner.style.transform = ''
	inner.style.boxShadow = ''
}


APP.innerHTML = TileWrapper(Content.parts.map(tile => TileTemplate(tile)))
// console.log(APP.offsetLeft, APP.offsetTop)
STATE.app = {
	left: APP.offsetLeft,
	top: APP.offsetTop
}
const TILES = document.querySelectorAll('[data-type="tile"]')

TILES.forEach(tile => tile.addEventListener('mouseover', tiltHover))
TILES.forEach(tile => tile.addEventListener('mouseout', tiltReset))
APP.addEventListener('mousemove', getMousePosition)
