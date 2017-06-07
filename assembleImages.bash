cd ./src/content/images

# for file in *.js; do
# 	if [[ -f "$file" ]]; then
# 		echo "export { * as $file } from './images/$file'" >> ../allimages.js
# 	fi

# # echo "export { default as ImgThumb } from './processed/thumbnail/$file'" >> "allimage.json"

# done

# cd ../../../

for file in *.js; do
	if [[ -f "$file" ]]; then
		echo "import * as $file from './images/$file'" >> ../allimageImports.js
		echo "{
	image: {
		src: $file,
		alt: '',
	}
},
" >> ../allimgObjects.js
	fi

done

cd ../../../


