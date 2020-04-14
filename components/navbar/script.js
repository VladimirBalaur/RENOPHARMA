export class Navbar {
    constructor() {
        /** PRODUCT DROPDOWN JS TOGGLE */
        let dropdown_link = document.querySelector("nav div.dropdown a");
        let dropdown_content = document.querySelector("nav div.dropdown-content");
        dropdown_content.style.transition = "all 1s";
        dropdown_link.addEventListener("mouseover", () => {
            dropdown_content.style.height = "unset";
        });

        dropdown_link.addEventListener("mouseout", () => {
            let t = setTimeout(2500, () => {
                dropdown_content.style.height = "0";
            });
        });

        dropdown_content.addEventListener("mouseover", () => {
            dropdown_content.style.height = "unset";
        });

        dropdown_content.addEventListener("mouseout", () => {
            dropdown_content.style.height = "0";
        });
        /**************** */

        /** LANGUAGE  DROPDOWN JS TOGGLE */
        let language_dd_link = document.querySelector("div.language-dd >a");
        let language_dd_content = document.querySelector(
            "div.language-dd .dd-content"
        );

        language_dd_link.addEventListener("mouseover", () => {
            language_dd_content.style.height = "unset";
        });

        language_dd_link.addEventListener("mouseout", () => {
            let t = setTimeout(2500, () => {
                language_dd_content.style.height = "0";
            });
        });

        language_dd_content.addEventListener("mouseover", () => {
            language_dd_content.style.height = "unset";
        });

        language_dd_content.addEventListener("mouseout", () => {
            language_dd_content.style.height = "0";
        });

        /***Setting the sessionstorage events, that will memorize which category to return if a certain category was selected */

        document.querySelectorAll(".dropdown-content a").forEach((item) => {
            //for each item of links, add an event that will set the UserCategory the inner text
            item.addEventListener("click", (event) => {
                sessionStorage.setItem("userCategory", event.target.innerText);
                console.log(event.target.innerText);
            });
        });
    }
}