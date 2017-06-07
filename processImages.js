/*eslint-disable*/

// DOCUMENTATION
// https://www.npmjs.com/package/imagemagick
// https://github.com/rsms/node-imagemagick

const IM = require('imagemagick')
const FS = require('fs')
const MKDIRP = require('mkdirp')
const PATH = require('path')
const C = require('colors')

// config options for project including image processing spec and locations 
// is controlled from a json file in src.
// here it is imported and value destructured
const CFG = require('./src/config.json').images

const sizes = CFG.sizes
const quality = CFG.quality.image
const thumbQuality = CFG.quality.thumb

const thumbSize = CFG.sizes.thumb
const thumbBlurLarge = CFG.thumbBlurLarge
const thumbBlurSmall = CFG.thumbBlurSmall

const { min, max, inc } = sizes
const count = (max - min) / inc
const imageLocation = CFG.location


// define the image location from config to be used for all processes
const images = PATH.join(__dirname, `${imageLocation}`)
console.log(C.cyan(images))

// in order fro the images to be used with js modules, create a js 'manifest' exporting 
// each image from that location so they can be programtically accessed by templates
const manifestTemplate = (name, size, file) => `export { default as ${CFG.jsPrefix || 'Img'}${name} } from './processed/${size}/${file}'`


function logResult(err, res) {
	if (err) {
		console.log(C.red(err))
	} else {
		console.log(C.green(res))
	}
}

function createFolderStructure(size, createThumbs) {
	if(createThumbs) {
		// MKDIRP(`${images}/_done`, err => console.log(err || 'dir created'))
		MKDIRP(`${images}/processed/thumb`, err => console.log(err || 'thumb dir created'))
		MKDIRP(`${images}/processed/thumbBlurSmall`, err => console.log(err || 'thumbBlurSmall dir created'))
		MKDIRP(`${images}/processed/thumbBlurLarge`, err => console.log(err || 'thumbBlurLarge dir created'))
	}

	MKDIRP(`${images}/processed/${size}`, err => {
		console.log(err || `${size} dir created`)
		size += inc
		if (size <= max) {
			createFolderStructure(size, false)
		} else {
			createAllImages()
		}
	})
}


function createAllImages() {
	FS.readdir(PATH.join(images, '_RAW'), (err, data) => {
		console.log(err || data)
		if (err) return
		const files = err || data
		// console.log(C.cyan(files.join('\t\n')))
		if (err) return // stop if there is an error
		
		files
			.filter(file => file.indexOf('.jpg') !== -1) // filter any files that are not jpg
			.forEach(file => {
				const manifest = []
				let currentSize = min
				
				manifest.push(manifestTemplate('thumb', 'thumb', file))
				manifest.push(manifestTemplate('thumbBlurSmall', 'thumbBlurSmall', file))
				manifest.push(manifestTemplate('thumbBlurLarge', 'thumbBlurLarge', file))
				
				IM.convert([
					`${images}/_RAW/${file}`, 
					'-resize', thumbSize, 
					'-quality', thumbQuality, 
					`${images}/processed/thumb/${file}`
				], 
					err => {
						logResult(err, `${file} processed to thumb`)
						IM.convert([
							`${images}/_RAW/${file}`, 
							'-resize', thumbSize, 
							'-quality', thumbQuality, 
							'-gaussian-blur', `0x${thumbBlurSmall}`,
							`${images}/processed/thumbBlurSmall/${file}`
						], 
							err => {
								logResult(err, `${file} processed to thumbBlueSmall`)
								IM.convert([
									`${images}/_RAW/${file}`, 
									'-resize', thumbSize, 
									'-quality', thumbQuality, 
									'-gaussian-blur', `0x${thumbBlurLarge}`,
									`${images}/processed/thumbBlurLarge/${file}`
								], 
									err => {
										logResult(err, `${file} processed to thumbBlurLarge`)
										createImageIncrement(currentSize, file, manifest)
									}
								)
							})
						})
					}
			)
		}
	)
}



function createImageIncrement(size, file, manifest) {
	manifest.push(manifestTemplate(size, size, file))
	const newName = `${file.split('.jpg')[0]}-${size}-done.jpg`
	console.log(C.grey(`processing ${file} to ${size}`))

	IM.convert([
		`${images}/_RAW/${file}`, 
		'-resize', size, 
		'-quality', quality, 
		'-blur', `0x0.05`,
		'-sharpen', '1x1',
		'-noise', '2',
		`${images}/processed/${size}/${file}`
	], 
		err => {
			logResult(err, `${file} processed ${size}`)
			size += inc
			// console.log({ size })
			if (size <= max) {
				createImageIncrement(size, file, manifest)
			} else {
				manifest.push('')
				FS.writeFile(`${images}/${file.split('.jpg')[0]}.js`, manifest.join(';\n'), err => {
					if (err) {
						console.log(C.red(err))
						return
					}
					console.log(C.bgGreen(` manifest created for ${file} `).black)
					console.log(C.bgGreen(` All files created for ${file} `).black)
					// FS.rename(`${images}/_RAW/${file}`, `${images}/_done/${file}`, err => {
					// 	if (err) {
					// 		console.log(C.red(err))
					// 		return
					// 	}
					// 	console.log(C.bgGreen(` ${file} moved to _done `).black)
					// })
				})
			}
		}
	)
}

createFolderStructure(min, true)
