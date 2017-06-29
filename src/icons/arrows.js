import Styles from '../app.sass'

const SIZES = {
	default: 'medium',
	small: 30,
	medium: 40,
	large: 50,
}

const COLORS = {
	default: 'light',
	light: {
		icon: '#000',
		background: '#fff',
	},
	dark: {
		icon: '#fff',
		background: '#000',
	},
}
const paths = {
	prev: `
		<path 
			d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"/>
		<path d="M0-.5h24v24H0z" 
			fill="none"/>`,

	next: `<path 
		d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
	<path d="M0 0h24v24H0z" 
		fill="none"/>`,
}


function Arrows({ color = COLORS.default, size = SIZES.default, action } = {}) {
	const COLOR_ICON = COLORS[color].icon
	const COLOR_BACKGROUND = COLORS[color].background
	const SIZE = SIZES[size]

	return `
	<div
		class="${Styles[action]}"
		data-type="button" 
		data-action="${action}">
		<svg
			style="
				width: ${SIZE}px; 
				height: ${SIZE}px;
			"
		>
			<rect 
				rx="4px"
				ry="4px"
				x="${0}px"
				y="${0}px"
				width="${SIZE}px" 
				height="${SIZE}px" 
				fill="${COLOR_BACKGROUND}"  
			/>
		</svg>
		

		<svg
			style="
				position: absolute;
				top: 8px;
				right: 8px;
				left: 8px;
				transform: scale(1.1)
			"
			fill="${COLOR_ICON}" 
			width="${SIZE}px"
			height="${SIZE - 16}px" 
			xmlns="http://www.w3.org/2000/svg"
		>
		  ${paths[action]}
		</svg>


	</div>`
}

export default Arrows
