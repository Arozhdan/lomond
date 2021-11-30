const bodyElement = document.querySelector("body");
const init = () => {
	if(window.innerWidth > 768){
		initNavigation();
	}
};

function initNavigation(){
	ScrollTrigger.create({
		trigger: "body",
		start: 100,
		onEnter: ({direction})=> navAnimation(direction),
		onLeaveBack: ({direction})=> navAnimation(direction),
	})
}
function navAnimation(direction){
	const scrollingDown = direction === 1 ? true : false;
	if(scrollingDown){
		bodyElement.classList.add("has-scrolled");
	} else{
		bodyElement.classList.remove("has-scrolled");
	}
	return gsap.to(".nav__links a", {
		duration: 0.2,
		stagger: 0.05,
		ease: "power3.out",
		autoAlpha: () => scrollingDown ? 0 : 1,
		y:()=>  scrollingDown ? "20" : "0" ,
	})
}


window.addEventListener('load', ()=>{
	init()
})