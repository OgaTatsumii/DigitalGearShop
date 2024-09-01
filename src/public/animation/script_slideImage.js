const miniImages = document.querySelectorAll(".minipic img");
const bigImage = document.querySelector(".showpic");
var defaultImage = miniImages[0];
defaultImage.classList.add("active");

let currentIndex = 0;
let autoSwitchTimer;
let interactionTimeout;

function showNextImage() {
  miniImages[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + 1) % miniImages.length;
  miniImages[currentIndex].classList.add("active");
  let imgPath = miniImages[currentIndex].getAttribute("src");
  bigImage.style.opacity = 0;
  setTimeout(() => {
    bigImage.setAttribute("src", imgPath);
    bigImage.style.opacity = 1;
  }, 300);
}

function startAutoSwitch() {
  clearInterval(autoSwitchTimer);
  autoSwitchTimer = setInterval(showNextImage, 2000);
}

function resetAutoSwitch() {
  clearTimeout(interactionTimeout);
  clearInterval(autoSwitchTimer);
  interactionTimeout = setTimeout(startAutoSwitch, 5000);
}

miniImages.forEach((image, index) => {
  image.addEventListener("click", () => {
    miniImages[currentIndex].classList.remove("active");
    currentIndex = index;
    miniImages[currentIndex].classList.add("active");
    let imgPath = image.getAttribute("src");
    bigImage.style.opacity = 0;
    setTimeout(() => {
      bigImage.setAttribute("src", imgPath);
      bigImage.style.opacity = 1;
    }, 300);
    clearInterval(autoSwitchTimer);
    clearTimeout(interactionTimeout);
    interactionTimeout = setTimeout(startAutoSwitch, 5000);
  });
});

// Tự động hiển thị lần lượt các ảnh sau 3 giây
startAutoSwitch();

// Thiết lập sự kiện chờ để tái kích hoạt tự động chuyển sau 5 giây không có sự tương tác
document.addEventListener("click", () => {
  clearInterval(autoSwitchTimer);
  clearTimeout(interactionTimeout);
  interactionTimeout = setTimeout(startAutoSwitch, 5000);
});
