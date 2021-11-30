
function initHoverReveal(){
	const sections = document.querySelectorAll('.rg__column')
	sections.forEach(section => {
		section.image = section.querySelector('.rg__image img')
		section.imageOverlay = section.querySelector('.rg__column__overlay')
		section.text = section.querySelector('.rg__text')
		section.textCopy = section.querySelector('.rg__text--copy')
		section.textMask = section.querySelector('.rg__text--mask')
		section.textHidden = section.querySelector('.rg__text--copy a')
	
		gsap.set(section.textMask, {	yPercent: -101})
		gsap.set(section.imageOverlay, {	yPercent: -101})
		gsap.set(section.textHidden, {	yPercent: 100})
		gsap.set(section.image, {	scale: 1.1})
		
		section.addEventListener('mouseenter', createHoverReveal)
		section.addEventListener('mouseleave', createHoverReveal)
	})
}


function getTextHeight(textCopy){
	return textCopy.clientHeight
}

function createHoverReveal(e){

	const { image, text, textCopy, textMask, textHidden, imageOverlay } = e.target

	const tl = gsap.timeline({
		defaults:{
			duration: 0.7,
			ease: 'power4.Out'
		}
	})			
	if(e.type === 'mouseenter'){
		tl
			.to([textMask, textHidden, imageOverlay], {yPercent: 0},0)
			.to(text, {y: ()=> -getTextHeight(textCopy)}, 0)
			.to(image, {scale: 1, duration: 1.1}, 0)

	} else if(e.type === 'mouseleave'){

		tl
			.to(text, {y: 0}, 0)
			.to(textHidden, {yPercent: 100}, 0)
			.to([textMask, imageOverlay], {yPercent: -101}, 0)
			.to(image, {scale: 1.1, duration: 1.1}, 0)
	}

	return tl
}

function init(){
	if(window.innerWidth > 768){
		initHoverReveal()
	}
}

window.addEventListener('load', function(){
    init();
});
