const init = () => {
	if(window.innerWidth > 768) {
		initHeaderAnimation();
	}
};

function initHeaderAnimation() {
  const body = document.querySelector("body");
  const headerSlideShowTextElement = document.querySelector(".header-slideshow__title");
  const topScroll = window.pageYOffset || document.documentElement.scrollTop;
  headerSlideShowTextElement.addEventListener("mouseover", () => {
    window.onscroll = function () {
      console.log("scrolled");
    };
  });
  headerSlideShowTextElement.addEventListener("mouseout", () => {
    window.onscroll = function () {};
  });
}

document.onload = init();
