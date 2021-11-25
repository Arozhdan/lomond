const toggleVideoPlay = function(element) {
	const videoElemetWrapper = element.querySelector('.profile-card__video-layer');
	const videoElement = element.querySelector('video');
	element.addEventListener('mouseover', function() {
		if ( videoElement.readyState === 4 ) {
			videoElemetWrapper.classList.add('profile-card__video-layer--hovered');
			videoElement.classList.remove('hidden');
			videoElement.play();
		}else{
			videoElement.classList.add('hidden');
		}
	});
	element.addEventListener('mouseout', function() {
		videoElement.pause();
	});
}

const init = function() {
	const profileCards = document.querySelectorAll('.profile-card');
	console.log(profileCards.length);
	profileCards.forEach(function(profileCard) {
		toggleVideoPlay(profileCard);
	});
}




document.onload = setTimeout(() => {
	init();
}, 0);
