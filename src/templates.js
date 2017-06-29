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
	title: value => `<h3 class="${Styles.title}"><span>${value}</span></h3>`,
	caption: value => `<p class="${Styles.caption}">${value}</p>`,
	credit: value => `<p class="${Styles.credit}">${value}</p>`,
}

const captions = nodes => `<div class="${Styles.overlayContainer}" data-type="overlay">
	${nodes.map(node => overlayChildren[node.type](node.value)).join('')}
</div>`

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
		${captions(tile.text)}
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
		${Close()}
		${Arrows({ action: 'prev' })}
		${Arrows({ action: 'next' })}

		<div class="${Styles.popupText}">
			${captions(Content.parts[index].text)}
		</div>
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
