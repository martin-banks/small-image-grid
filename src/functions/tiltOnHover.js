import STATE from '../state'

const makePositive = num => Math.sqrt(num ** 2)

function getMousePosition(e) {
	const { clientX: x, clientY: y } = e
	// STATE.mouse = { x, y }
	const { left, top, width, height } = STATE.tile
	const tileX = x - left - (width / 2) - STATE.app.left
	const tileY = y - top - (height / 2) - STATE.app.top
	let pctX = ((tileX / width) * 2) * -1
	let pctY = ((tileY / height) * 2)
	const highlight = STATE.tile.elem.querySelector('[data-type="highlight"]').querySelector('div')
	const overlay = STATE.tile.elem.querySelector('[data-type="overlay"]')
	const text = overlay.querySelectorAll('p, h3')
	const inner = STATE.tile.elem.querySelector('[data-type="inner"]')
	const img = inner.querySelector('img')

	if (pctY > 1) pctY = 1
	if (pctY < -1) pctY = -1
	if (pctX > 1) pctX = 1
	if (pctX < -1) pctX = -1

	const maxPct = Math.max(makePositive(pctX), makePositive(pctY))
	const SHADOW = {
		x: `${pctX * -1 * 40}px`,
		y: `${pctY * 40}px`,
		blur: `${maxPct * 80}px`,
		distance: '0px',
		color: `rgba(0,0,0, ${1 - (Math.max(0.4, (maxPct - 0.6)))})`,
	}

	const TEXTSHADOW = {
		x: `${pctX * -1 * 8}px`,
		y: `${pctY * 8}px`,
		blur: `${maxPct * 20}px`,
		distance: '0px',
		color: `rgba(0,0,0, ${1 - (Math.max(0.4, (maxPct - 0.6)))})`,
	}
	const POSITION = {
		x: 100 * pctX * -1,
		y: 100 * pctY,
		z: '0',
	}

	window.requestAnimationFrame(() => {
		inner.style.transform = `rotateX(${pctY * 1}deg) rotateY(${pctX * 1}deg) scale(1.1)`
		overlay.style.transform = 'translateY(0)'
		Array.from(text).forEach(t => {
			t.style.transform = `
				translateX(${-1 * POSITION.x * 0.05}%) 
				translateY(${-1 * POSITION.y * 0.2}%) 
				scale(${(((POSITION.x + POSITION.y) / 2) / 1000) + 1}`
			t.style.textShadow = `${TEXTSHADOW.x} ${TEXTSHADOW.y} ${TEXTSHADOW.blur} ${TEXTSHADOW.color}`
		})
		inner.style.boxShadow = `${SHADOW.x} ${SHADOW.y} ${SHADOW.blur} ${SHADOW.distance} ${SHADOW.color}`
		highlight.style.transform = `
			translateX(${POSITION.x * 0.75}%) 
			translateY(${POSITION.y * 0.75}%)`
		img.style.transform = `translateX(${1 * POSITION.x * 0.015}%) translateY(${1 * POSITION.y * 0.015}%) scale(1.2)`
		
	})

}


function tiltHover(e) {
	// console.log(this.__proto__)
	STATE.TILES.forEach(tile => {
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
	const highlight = this.querySelector('[data-type="highlight"]').querySelector('div')
	const center = {
		x: left + (width / 2),
		y: (top - window.scrollY) + (height / 2),
	}

	STATE.tile = {
		top: (top - window.scrollY),
		left,
		width,
		height,
		center,
		elem: this,
	}
	highlight.style.opacity = 1
}

function tiltReset(e) {
	const inner = this.querySelector('[data-type="inner"]')
	const highlight = this.querySelector('[data-type="highlight"]').querySelector('div')
	const overlay = this.querySelector('[data-type="overlay"]')
	STATE.TILES.forEach(tile => tile.querySelector('[data-type="inner"]').style.transform = '')
	highlight.style.opacity = 0
	inner.style.transform = ''
	inner.style.boxShadow = ''
	overlay.style.transform = ''
}


function tiltOnHover({ targets = null, wrapper = null } = {}) {
	if (!targets) console.error('The targets array was not defined')
	if (!wrapper) console.error('A wrapper dom element was not defined')
	if (!wrapper || !targets) return

	Array.from(targets).forEach(target => {
		target.addEventListener('mouseover', tiltHover)
		target.addEventListener('mouseleave', tiltReset)
	})
	wrapper.addEventListener('mouseleave', tiltReset)
	wrapper.addEventListener('mousemove', getMousePosition)
}

export default tiltOnHover

