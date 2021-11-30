const init = () => {
	initMenuToggle();
}

function initMenuToggle() {
	const body = document.querySelector('body');
	const menuItem= document.querySelector('.menu');
	const menuOpenTrigger = document.querySelector('.js-menu-open-trigger');
	const menuCloseTrigger = document.querySelector('.js-menu-close-trigger');
	document.addEventListener('keypress', (e) => {
		if(e.key === "Escape") {
			menuItem.classList.add('menu--hidden');
		}
	})
	if (menuOpenTrigger && menuCloseTrigger) {
		menuOpenTrigger.addEventListener('click', () => {
			menuItem.classList.remove('menu--hidden');
			body.classList.add('menu--open');
		});
		menuCloseTrigger.addEventListener('click', () => {
			menuItem.classList.add('menu--hidden');
			body.classList.remove('menu--open');
		});
	}
}


window.addEventListener('load', function(){
    init();
});
