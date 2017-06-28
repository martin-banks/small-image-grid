import Styles from './app.sass'
import createSrcSet from './functions/createSrcSet'

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

const randomColor = () => [0, 0, 0].map(val => Math.floor(Math.random() * 255)).join()

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
		${Close()}
		<div class="${Styles.prev}" data-type="button" data-action="prev"><</div><!--
		--><div class="${Styles.next}" data-type="button" data-action="next">></div>
		<div class="${Styles.popupText}">${caption.innerHTML}</div>
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
