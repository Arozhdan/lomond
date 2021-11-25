const init = () => {
	console.log('init');
	initMenuToggle();
}

function initMenuToggle() {
	console.log('init toggle');
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
		});
		menuCloseTrigger.addEventListener('click', () => {
			menuItem.classList.add('menu--hidden');
		});
	}
}


window.addEventListener('load', function(){
    init();
});
