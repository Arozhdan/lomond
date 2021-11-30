gsap.registerPlugin(ScrollTrigger);

const init = () => {
	let bodyScrollbar = Scrollbar.init(document.querySelector('#viewport'));
	bodyScrollbar.track.xAxis.element.remove();
	// Tell ScrollTrigger to use these proxy getter/setter methods for the "body" element: 
	ScrollTrigger.scrollerProxy(document.body, {
		scrollTop(value) {
			if (arguments.length) {
				bodyScrollbar.scrollTop = value; // setter
			}
			return bodyScrollbar.scrollTop;    // getter
		}
	});
	const contactsLink = document.querySelector('.nav__link--contact');
	contactsLink.addEventListener('click', () => {
		bodyScrollbar.scrollTo(0, document.querySelector('.footer').offsetTop, 1200, 'easeInOutQuad');
	});
}

window.addEventListener('load', function() {
	if(window.innerWidth > 768){
		init();
	}
})