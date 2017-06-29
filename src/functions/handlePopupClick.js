import STATE from '../state'
import closest from './closest'
import templates from '../templates'

const { POPUPIMG } = templates

const KEYS = {
	37: 'prev',
	39: 'next',
	27: 'close',
}

function actions() {
	const close = () => {
		STATE.POPUP.style.zIndex = 0
		STATE.POPUP.innerHTML = ''
		STATE.POPUP.setAttribute('data-active', 'false')
		STATE.activeIndex = null
	}
	const next = () => {
		// console.log('getting next')
		STATE.activeIndex++
		STATE.POPUP.innerHTML = POPUPIMG({ index: STATE.activeIndex })
	}
	const prev = () => {
		// console.log('getting prev')
		STATE.activeIndex--
		STATE.POPUP.innerHTML = POPUPIMG({ index: STATE.activeIndex })
	}
	if (STATE.activeIndex) return { close, next, prev }
	return false
}


function handlePopupClick(e) {
	// console.log(e.target)
	const doAction = actions()
	let actionToTake = null
	if (e.type === 'keydown') {
		const keyPressed = KEYS[e.keyCode || e.whichKey]
		if (!keyPressed) return
		actionToTake = keyPressed
	} else {
		const BUTTON = closest(e.target, '[data-type="button"]')
		if (!BUTTON) return
		actionToTake = BUTTON.getAttribute('data-action')
	}

	if (doAction[actionToTake]) doAction[actionToTake]()

}

export default handlePopupClick
