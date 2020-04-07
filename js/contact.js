import { Navbar } from "../components/navbar/script.js";
import { setCartItemsCount } from "./setCartItemsCount.js";
import openModal from "../components/modal/modal.js";
const navUI = new Navbar();

//Accordion functionality
let arrows = document.querySelectorAll(".accordion .item-head span.arrow").forEach((arrow) => {
    arrow.addEventListener("click", (event) => {
        event.currentTarget.classList.toggle("clickedChev", true);

        let content = event.currentTarget.parentNode.parentNode.querySelector(".content");
        content.classList.toggle("openedTab", true);

        let arrows = document.querySelectorAll(".accordion .item-head span.arrow");
        console.log(arrows);

        for (let i = 0; i < arrows.length; i++) {
            if (arrows[i] != event.currentTarget) {
                arrows[i].classList.toggle("clickedChev", false);

                let content = arrows[i].parentNode.parentNode.querySelector(".content");
                content.classList.toggle("openedTab", false);
            }
        }
    });
});