/*



NOT IN USE







*/


// import handlePopupClick from './handlePopupClick'
// import closePopup from './closePopup'

// /* KEY CODES */
// const left = 37
// const right = 39
// const esc = 27

// function handleKeyboard() {
// 	const activate = () => {
// 		window.onkeydown = e => {
// 			const keyIs = key => e.keyCode == key || e.which == key

// 			if (keyIs(left)) {
// 				/* left key pressed */
// 				e.preventDefault()
// 				/* simulate click on prev button */
// 				const button = document.querySelector('#cc-prev-button')
// 				!!button ? handleClick_nav(button) : null
// 			} else if (keyIs(right)) {
// 				/* right key pressed */
// 				e.preventDefault()
// 				/* simulate click on next button */
// 				const button = document.querySelector('#cc-next-button')
// 				!!button ? handleClick_nav(button) : null
// 			} else if(keyIs(esc)){
// 				/* esc pressed */
// 				e.preventDefault()
// 				closePopup()
// 			}
// 		}
// 	}

// 	const deactivate = () => {
// 		/* reset keyboard defaults	*/
// 		window.onkeydown = e => true
// 	}
// 	return {
// 		activate,
// 		deactivate
// 	}
// }

// export default handleKeyboard

// // module.exports = {
// // 	activate,
// // 	deactivate
// // }