import CFG from './config.json'
import Styles from './app.sass'
import createSrcSet from './functions/createSrcSet'
import Content from './content/content'

// Icons
// Currently experimenting with coded svg vs png files
import Icon_close from './icons/close_black.svg'
import Close from './icons/close'
import Arrows from './icons/arrows'


// TEMPLATES
// ---------
// tile text overlay elements
const overlayChildren = {
	title: (value, container) => `<h3 class="${Styles.title}"><span>${value}</span></h3>`,
	caption: (value, container) => container !== 'tile' ? `<p class="${Styles.caption}">${value}</p>` : '',
	credit: (value, container) => container !== 'tile' ? `<p class="${Styles.credit}">${value}</p>` : '',
}

function captions({ nodes, container = 'all' } = {}) {
	return `<div class="${Styles.overlayContainer}" data-type="overlay">
		${nodes.map(node => overlayChildren[node.type](node.value, container)).join('')}
	</div>`
}

const randomColor = () => [0, 0, 0].map(() => Math.floor(Math.random() * 255)).join()

const TileTemplate = ({ tile, i } = {}) => `<div 
	class="${Styles.tile}" 
	data-type='tile'
	data-index="${i}"
>
	<div class="${Styles.inner}" 
		data-type='inner' 
		style="background: rgba(${randomColor()}, 1)"
	>
		<div class="${Styles.imgWrapper}">
			<img 
				class="${Styles.image}" 
				src="${tile.image.src.Img200}" 
				srcset="${createSrcSet(tile.image.src)}" 
				alt="${tile.image.alt}"
			/>
		</div>
		${captions({ nodes: tile.text, container: 'tile' })}
		<div class="${Styles.highlight}" data-type="highlight">
			<div class="${Styles.disc}"></div>
		</div>
	</div>
</div>`

const TileWrapper = tiles => `<section class="${Styles.wrapper}" data-type="wrapper">
	${tiles.join('')}
</section>
<section class="${Styles.popupContainer}" data-type="popup"></section>`


function POPUPIMG({ index } = {}) {
	return `
		<img 
			src="${Content.parts[index].image.src[`Img${CFG.images.sizes.max}`]}" 
			srcset="${createSrcSet(Content.parts[index].image.src)}" 
			alt="${Content.parts[index].image.alt}" 
		/>
		<div class="${Styles.popupText}">
			${captions({ nodes: Content.parts[index].text, container: 'popup' })}
		</div>
		${Close()}
		${index > 0 ? Arrows({ action: 'prev' }) : ''}
		${index < (Content.parts.length - 1) ? Arrows({ action: 'next' }) : ''}

	`
}

const templates = {
	overlayChildren,
	captions,
	randomColor,
	TileTemplate,
	TileWrapper,
	POPUPIMG,
}


export default templates
