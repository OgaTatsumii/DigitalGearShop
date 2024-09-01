const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registerLink = document.querySelector(".register-link");
const btnPopup = document.querySelector(".sign-up");
const rgtPopup = document.querySelector(".sign-in");
const iconClose1 = document.querySelector(".close1");
const modal = document.querySelector(".modal");

registerLink.addEventListener("click", () => {
    wrapper.classList.add("active");
});

loginLink.addEventListener("click", () => {
    wrapper.classList.remove("active");
});

rgtPopup.addEventListener("click", () => {
    modal.classList.add("active-popup");
    wrapper.classList.add("active-popup");
    wrapper.classList.add("active");
});

btnPopup.addEventListener("click", () => {
    modal.classList.add("active-popup");
    wrapper.classList.add("active-popup");
    wrapper.classList.remove("active");
});

iconClose1.addEventListener("click", () => {
    wrapper.classList.remove("active-popup");
    modal.classList.remove("active-popup");
});
