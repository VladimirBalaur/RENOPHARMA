import { Navbar } from "../components/navbar/script.js";
import { setCartItemsCount } from "./setCartItemsCount.js";
import openModal from "../components/modal/modal.js";
const navUI = new Navbar();

let chunkSize = 4;

class NewsUI {
    constructor() {
        setCartItemsCount();
        this.getData().then(() => {
            this.generateContent();
        });
    }

    async getData() {
        let response = await fetch("../data/news.json", {
            headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
            this.newsItems = await response.json();
        } else {
            alert("We have an error");
            this.newsItems = undefined;
        }
    }

    async generateContent() {
        console.log(this.newsItems);

        let contentPerPage = generateContentPerPage(this.newsItems, chunkSize);
        console.log(`Content of pages`, contentPerPage);

        let nrOfPages = contentPerPage.length;

        document.querySelector("body").addEventListener("load", insertNewsByPage(0, contentPerPage));

        //set paginating elements
        let ul = document.querySelector(".pagination ul");

        for (let i = 1; i <= nrOfPages; i++) {
            let li = document.createElement("li");
            li.innerText = i;
            ul.appendChild(li);
        }

        let li = ul.querySelectorAll("li");

        setPages(nrOfPages).then(() => {
            document.querySelectorAll(".pagination ul li").forEach((item) => {
                item.addEventListener("click", (event) => {
                    insertNewsByPage(
                            parseInt(event.currentTarget.innerText) - 1, //the page count
                            contentPerPage
                        ) //after clicking on the li paginating item, scroll to top
                        .then(() => {
                            window.scroll(0, 0);

                            //mark the active li elem page
                            event.currentTarget.classList.toggle("active", true);

                            //unmark the rest
                            let pagItems = document.querySelectorAll(".pagination li");
                            for (let pagItem of pagItems) {
                                if (pagItem !== event.currentTarget) {
                                    pagItem.classList.toggle("active", false);
                                }
                            }
                        });
                });
            });
        });
    }
}

//HELPERS
const newsUI = new NewsUI();

function generateContentPerPage(newsItems, chunkSize) {
    let pageContentArr = [];
    let newsItemsCount = newsItems.length;
    console.log(`The news items length is ${newsItemsCount}`);

    let pageCount = Math.ceil(newsItemsCount / chunkSize);
    console.log(`The total number of pages is ${pageCount}`);

    let newsString = "";

    let lastIndex = 0;

    if (chunkSize > newsItemsCount) {
        chunkSize = newsItemsCount;
    }

    for (let page = 0; page < pageCount; page++) {
        newsString = "";
        let selectedItems = 0;

        console.log(`We are at page ${page}`, `Current last index is ${lastIndex}`);

        for (let i = lastIndex; selectedItems < chunkSize && i < newsItemsCount; i++) {
            console.log(`Current index`, i);

            if (newsItems[i] != undefined) {
                selectedItems++;
                newsString += ` <div class="news-wrapper">
            <div class="img-container"><img src="${newsItems[i].imagePath}" alt="control medical asigurat" /></div>

            <div class="news-content">
                <h1>${newsItems[i].title}</h1>
                <p>
                   ${newsItems[i].description}
                </p>
            </div>
        </div>`;
            }
        }
        lastIndex += chunkSize;
        console.log(newsString);

        pageContentArr.push(newsString);
    }

    return pageContentArr;
}

async function insertNewsByPage(pageNr, pageContentArr) {
    let container = document.querySelector(".news-container");

    console.log(`This is our container`, container);
    container.innerHTML = pageContentArr[pageNr];
}

//generate pagination
async function setPages(pages) {
    let list_items = "";

    for (let i = 1; i <= pages; i++) {
        list_items += `<li>${i}</li>`;
    }

    document.querySelector(".pagination >ul").innerHTML = list_items;
}