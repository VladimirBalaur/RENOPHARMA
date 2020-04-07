import { Navbar } from "../components/navbar/script.js";
import { setCartItemsCount } from "./setCartItemsCount.js";
import openModal from "../components/modal/modal.js";
const navUI = new Navbar();

class ContactsUI {
    async getData() {
        let response = await fetch("../data/faq.json", {
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            this.questionsItems = await response.json();
        } else {
            alert("We have an error");
            this.questionsItems = undefined;
        }
    }

    async setComponentsOnPage() {
        if (this.questionsItems !== undefined) {
            let output = "";

            let container = document.querySelector(".accordion .container");

            for (let item of this.questionsItems) {
                if (item) {
                    output += ` <div class="accordion-item">
                    <div class="item-head">
                        <i class="far fa-question-circle"></i>
                        <p>${item.title}</p>
                        <span class="arrow clickedChev"><i class="fas fa-chevron-right"></i></span>
                    </div>
                    <div class="content">
                        ${item.answer}
                    </div>
                </div>`;
                }
            }

            //

            container.innerHTML = output;

            //let the first question tab be open
            document.querySelectorAll(".accordion .content")[0].classList.add("openedTab");
        } else {
            console.log(`questions are undefined`);
        }
    }

    constructor() {
        this.getData().then(() => {
            this.setComponentsOnPage().then(() => {
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
            });
        });
    }
}

const UI = new ContactsUI();