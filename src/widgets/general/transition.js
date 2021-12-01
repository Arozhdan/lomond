// const init = () => {	
// 	initLoader();
// };
const select = e=> document.querySelector(e);
const selectAll = e=> document.querySelectorAll(e);

const loader = select('.loader');
const loaderInner = select('.loader .inner');
const progressBar = select('.loader .progress');

gsap.set(loader, {autoAlpha: 1});
gsap.set(loaderInner, {scaleY:0.005, transformOrigin: 'bottom'});
const progressTween = gsap.to(progressBar, {paused: true, scaleX:0, ease: 'none', transformOrigin: 'right'})

let loadedImagesCount = 0, imageCount;
const container = select('#main-wrapper')

const imgLoad = imagesLoaded(container)
imageCount = imgLoad.images.length;

updateProgress(0);

imgLoad.on('progress', (instance, image) => {
	loadedImagesCount++;
	updateProgress(loadedImagesCount);
});

function updateProgress( value ) {
    // console.log(value/imageCount)
    // tween progress bar tween to the right value
    gsap.to(progressTween, {progress: value/imageCount, duration: 0.3, ease: 'power1.out'})
}

imgLoad.on( 'done', function( instance ) {
    gsap.set(progressBar, {autoAlpha: 0, onComplete: initLoader()});// change to initPageTransition()
});

function pageTransitionIn(){
	console.log('pageTransitionIn')
	return gsap.timeline('.transition', {yPercent:-100, ease: 'power1.inOut'})
}

function pageTransitionOut(){
	console.log('pageTransitionOut')
	return gsap.timeline('.transition', {yPercent:0, ease: 'power1.inOut'})
}


function initLoader() {
	const tlLoaderIn = gsap.timeline({
		id: 'tlLoaderIn',
		defaults:{
			duration: 1.1,
			ease: 'power2.out'
		},
		onComplete: ()=> select('body').classList.remove('is-loading') 
	}); 

	const image = select('.loader__image img');
	const mask = select('.loader__image--mask');
	const line1 = select('.loader__title--mask:nth-child(1) span');
	const line2 = select('.loader__title--mask:nth-child(2) span');
	const lines = selectAll('.loader__title--mask');
	const loaderContent = select('.loader__content');

	tlLoaderIn
		.set(loaderContent, {autoAlpha: 1})
		.to(loaderInner, {
			scaleY:1,
			transformOrigin: 'bottom',
			ease: 'power2.inOut'
		})
		.addLabel('revealImage')
		.from(mask,{yPercent: 100}, 'revealImage-=0.6')
		.from(image,{yPercent: -80}, 'revealImage-=0.6')
		.from([line1,line2],{yPercent: 100, stagger: 0.1}, 'revealImage-=0.4')
	
		const tlLoaderOut = gsap.timeline({
			id: 'tlLoaderOut',
			defaults:{
				duration: 1.2,
				ease: 'power2.inOut'
			},
			delay: 1
		}); 
		tlLoaderOut
			.to(lines,{yPercent: -500, stagger: 0.2}, 0)
			.to([loader, loaderContent],{yPercent: -100}, 0.2)
			.from('#main-wrapper', {y:150}, 0.2)


		const tlLoader = gsap.timeline({});
		tlLoader
			.add(tlLoaderIn)
			.add(tlLoaderOut)
}

function initPageTransition(){
	// barba.init({
	// 	transitions: [{
	// 		once(){
	// 			initLoader()
	// 		},
	// 		async leave(){
	// 			await pageTransitionIn()
	// 		},
	// 		enter(){
	// 			pageTransitionOut()
	// 		}

	// 	}]
	// })
}

// window.addEventListener('load', function() {
// 	init();
// });
