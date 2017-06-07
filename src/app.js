import CONFIG from './config.json'
import Content from './content/content'
import Styles from './app.sass'
import createSrcSet from './functions/createSrcSet'

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
		<img class="${Styles.image}" src="${C.image.src.Img200}" srcset="${createSrcSet(C.image.src)}" alt="${C.image.alt}" />
		<div class="${Styles.highlight}" data-type="highlight">
			<div class="${Styles.disc}"></div>
		</div>
	</div>
</div>`

const TileWrapper = tiles => `<section class="${Styles.wrapper}" data-type="wrapper">
	${tiles.join('')}
</section>`


function getMousePosition(e) {
	const { clientX: x, clientY: y } = e
	// STATE.mouse = { x, y }
	const { left, top, width, height, center } = STATE.tile
	const tileX = x - left - (width / 2) - STATE.app.left
	const tileY = y - top - (height / 2) - STATE.app.top
	let pctX = ((tileX / width) * 2) * -1
	let pctY = ((tileY / height) * 2)
	const highlight = STATE.tile.elem.querySelector('[data-type="highlight"]')
	// console.table([{pctX}, {pctY}])
	const inner = STATE.tile.elem.querySelector('[data-type="inner"]')
	// console.log(STATE.tile.elem)
	if (pctY > 1) pctY = 1
	if (pctY < -1) pctY = -1
	if (pctX > 1) pctX = 1
	if (pctX < -1) pctX = -1

	inner.style.transform = `rotateX(${pctY * 2}deg) rotateY(${pctX * 2}deg) scale(1.2)`

	const maxPct = Math.max(pctX < 0 ? pctX*-1 : pctX, (pctY < 0 ? pctY*-1 : pctY))
	inner.style.boxShadow = `${pctX * -1 * 40}px ${pctY * 40}px ${maxPct * 80}px 0px rgba(0,0,0, ${1 - (Math.max(0.4, (maxPct-0.6)))})`
	highlight.style.transform = `translate3d(${50 * pctX * -1}%, ${50 * pctY}%, 0)`
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
	} = this;
	const highlight = this.querySelector('[data-type="highlight"]')
	const center = {
		x: left + (width / 2),
		y: (top - window.scrollY) + (height / 2),
	}

	STATE.tile = { top: (top - window.scrollY), left, width, height, center, elem: this }
	highlight.style.opacity = 1

}

function tiltReset(e) {
	const inner = this.querySelector('[data-type="inner"]')
	const highlight = this.querySelector('[data-type="highlight"]')
	TILES.forEach(tile => tile.querySelector('[data-type="inner"]').style.transform = '')
	highlight.style.opacity = 0
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
const wrapper = APP.querySelector('[data-type="wrapper"]')

TILES.forEach(tile => tile.addEventListener('mouseover', tiltHover))
TILES.forEach(tile => tile.addEventListener('mouseleave', tiltReset))
wrapper.addEventListener('mousemove', getMousePosition)
wrapper.addEventListener('mouseleave', tiltReset)
