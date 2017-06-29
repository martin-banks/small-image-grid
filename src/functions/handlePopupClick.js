import STATE from '../state'
import closest from './closest'
import templates from '../templates'

const { POPUPIMG } = templates

// Use this to map action types to different keys pressed
const KEYS = {
	37: 'prev', // left arrow
	39: 'next', // right arrow
	27: 'close', // esc
}

// Different actions that can be performed
// If there is an activeIndex value in the STATE object then the
// popup is active and returns an object of actions that can be performed
function actions() {
	if (!STATE.activeIndex) return false
	const close = () => {
		// Close the popup
		STATE.POPUP.style.zIndex = 0
		STATE.POPUP.innerHTML = ''
		STATE.POPUP.setAttribute('data-active', 'false')
		STATE.activeIndex = null
	}
	const next = () => {
		// Get and dispaly the next image
		STATE.activeIndex++
		STATE.POPUP.innerHTML = POPUPIMG({ index: STATE.activeIndex })
	}
	const prev = () => {
		// Get and dispaly the previous image
		STATE.activeIndex--
		STATE.POPUP.innerHTML = POPUPIMG({ index: STATE.activeIndex })
	}
	return { close, next, prev }
}


function handlePopupClick(e) {
	// Create a new instance of the availble actions.
	// If there aren't any, then end function now
	const doAction = actions()
	if (!doAction) return

	// for keyboard events we get it's keycode, 
	// cross reference the keys obj above to get the approriate action type for this key
	let actionToTake = null
	if (e.keyCode || e.whichKey) {
		const keyPressed = KEYS[e.keyCode || e.whichKey]
		actionToTake = keyPressed || null
	} else {
		// If the event is not a keyboard event we assume it is a button press
		// Supported buttons should have a data-action assigned to them
		const BUTTON = closest(e.target, '[data-type="button"]')
		actionToTake = BUTTON.getAttribute('data-action') || null
	}

	// if a supported action type has been assigned to the actionToTake variable
	// get the apporprproate action from the actions instance and call it
	if (doAction[actionToTake]) doAction[actionToTake]()
}

export default handlePopupClick
