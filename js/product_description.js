import { Navbar } from "../components/navbar/script.js";
import { Product } from "../components/product-card/script.js";
import { Comment } from "./product_description_utils/commentAdding.js";
import { Cart, CartProduct, areObjEqual } from "./cart.js";
import { setCartItemsCount } from "./setCartItemsCount.js";

//I HAVE IMPLEMENTED THE ADD TO CART MECHANISM IN TEH PRODUCT CLASS
const navOps = new Navbar(); //loading all events of the navbar

//generate the correspoding info about the product, depeding on the reqProduct in the sessionStorage

const ProdOps = new Product();
//get the required product by user
let reqProd = JSON.parse(sessionStorage.getItem("reqProduct"));
//setting up the info on the product_descirption page, by querying the product
Product.getProductByName(reqProd, products);

let target_node = document.querySelector("#slide");
document.querySelector("body").addEventListener(
    "load",
    load_all_products(target_node, products, 10).then(() => {
        setCartItemsCount();

        let productCard = document.querySelectorAll("div.product-card");

        productCard.forEach((card) => {
            console.log(card);

            card.addEventListener("mouseover", () => {
                card
                    .querySelectorAll("div.product-buttons button")
                    .forEach((button) => {
                        button.style.transform = "translateX(0%)";
                    });
            });

            card.addEventListener("mouseleave", () => {
                card
                    .querySelectorAll("div.product-buttons button")
                    .forEach((button) => {
                        button.style.transform = "translateX(101%)";
                    });
            });

            card.querySelectorAll("a").forEach((item) => {
                item.addEventListener("click", (event) => {
                    let prod = {
                        name: String(event.target.innerText).toLowerCase(),
                        category: String(
                            event.target.parentNode.parentNode.parentNode.dataset.category
                        ).toLowerCase(),
                        id: event.target.parentNode.parentNode.parentNode.dataset.id,
                    };
                    sessionStorage.setItem("reqProduct", JSON.stringify(prod));
                    sessionStorage.setItem("userCategory", prod.category);
                });
            });
            /*ADD TO CART FUNCTIONALITY **/
            //set an event for each button , to create a new cart item and append it to cart localstorage
            card.querySelectorAll(".product-buttons button").forEach((button) => {
                console.log("HELLOOO");

                if (button.dataset.role === "add-to-cart") {
                    button.addEventListener("click", (event) => {
                        const id = event.currentTarget.parentNode.parentNode.dataset.id;
                        const category =
                            event.currentTarget.parentNode.parentNode.dataset.category;
                        const price = Number(
                            event.currentTarget.parentNode.parentNode
                            .querySelector(".price")
                            .innerText.split("$")[1]
                        );
                        const name = event.currentTarget.parentNode.parentNode.querySelector(
                            "p.title"
                        ).innerText;

                        const imagePath = event.currentTarget.parentNode.parentNode.querySelector(
                            ".product-image-container img"
                        ).src;

                        const cartItem = new CartProduct(
                            id,
                            name.toLowerCase(),
                            price,
                            category,
                            1,
                            imagePath
                        );
                        console.log(`Our item - ${cartItem}`);

                        if (localStorage.getItem("UserWishlist") !== null) {
                            let itemExists = false;
                            //first we get the cart items fron LS
                            let userCart = JSON.parse(localStorage.getItem("UserCart"));
                            //check if we already have this item

                            userCart.items.forEach((item) => {
                                if (areObjEqual(item, cartItem)) {
                                    itemExists = true;
                                }
                            });

                            if (!itemExists) {
                                // we push our cart item to the JSON object of cart items
                                userCart.items.push(cartItem);
                                //we push  he whole JSON to the LS
                                localStorage.setItem("UserCart", JSON.stringify(userCart));

                                //add class inCart if it isn't set
                                event.currentTarget.classList.add("inCart");
                            } else {
                                console.log("There is such item");
                            }
                        } else {
                            let newCart = new Cart(cartItem);
                            localStorage.setItem("UserCart", JSON.stringify(newCart));
                        }

                        console.log(
                            "Cart content---",
                            JSON.parse(localStorage.getItem("UserCart"))
                        );

                        // update the cart items count
                        setCartItemsCount();
                        /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                        if (localStorage.getItem("UserCart") !== null) {
                            let obj = JSON.parse(localStorage.getItem("UserCart"));

                            obj.items.forEach((item) => {
                                if (
                                    item.name ===
                                    document
                                    .querySelector(".product-info-content h1")
                                    .innerText.toLowerCase()
                                ) {
                                    document.querySelector(
                                        ".cart-operations button:first-of-type"
                                    ).innerHTML = `<i class="far fa-check-square "></i> Deja exista in cos`;

                                    document
                                        .querySelector(".cart-operations button:first-of-type")
                                        .classList.add("inWishlist");
                                }
                            });
                        }
                    });
                } else if (button.dataset.role === "add-to-wishlist") {
                    button.addEventListener("click", (event) => {
                        const id = event.currentTarget.parentNode.parentNode.dataset.id;
                        const category =
                            event.currentTarget.parentNode.parentNode.dataset.category;
                        const price = Number(
                            event.currentTarget.parentNode.parentNode
                            .querySelector(".price")
                            .innerText.split("$")[1]
                        );
                        const name = event.currentTarget.parentNode.parentNode.querySelector(
                            "p.title"
                        ).innerText;

                        const imagePath = event.currentTarget.parentNode.parentNode.querySelector(
                            ".product-image-container img"
                        ).src;

                        const cartItem = new CartProduct(
                            id,
                            name.toLowerCase(),
                            price,
                            category,
                            1,
                            imagePath
                        );
                        console.log(`Our item from wishlist - ${cartItem}`);

                        if (localStorage.getItem("UserWishlist") !== null) {
                            let itemExists = false;
                            //first we get the cart items fron LS
                            let UserWishlist = JSON.parse(
                                localStorage.getItem("UserWishlist")
                            );
                            //check if we already have this item

                            UserWishlist.items.forEach((item) => {
                                if (areObjEqual(item, cartItem)) {
                                    itemExists = true;
                                }
                            });

                            if (!itemExists) {
                                // we push our cart item to the JSON object of cart items
                                UserWishlist.items.push(cartItem);
                                //we push  he whole JSON to the LS
                                localStorage.setItem(
                                    "UserWishlist",
                                    JSON.stringify(UserWishlist)
                                );

                                //add class inCart if it isn't set
                                event.currentTarget.classList.add("inCart");
                            } else {
                                console.log("There is such item");
                            }
                        } else {
                            let newCart = new Wishlist(cartItem);
                            localStorage.setItem("UserWishlist", JSON.stringify(newCart));
                        }

                        console.log(
                            "Wishlist content---",
                            JSON.parse(localStorage.getItem("UserWishlist"))
                        );

                        // update the cart items count
                        setCartItemsCount();
                    });
                }

                button.addEventListener("click", () => {
                    /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                    if (localStorage.getItem("UserCart") !== null) {
                        let obj = JSON.parse(localStorage.getItem("UserCart"));

                        obj.items.forEach((item) => {
                            if (
                                item.name ===
                                card.querySelector(".title").innerText.toLowerCase()
                            ) {
                                card.querySelector(
                                    ".product-buttons button:first-of-type"
                                ).innerHTML = `<i class="far fa-check-square "></i>`;

                                card
                                    .querySelector(".product-buttons button:first-of-type")
                                    .classList.add("inCart");
                            }
                        });
                    }

                    /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                    if (localStorage.getItem("UserWishlist") !== null) {
                        let obj = JSON.parse(localStorage.getItem("UserWishlist"));

                        obj.items.forEach((item) => {
                            if (
                                item.name ===
                                card.querySelector(".title").innerText.toLowerCase()
                            ) {
                                card
                                    .querySelector(".product-buttons button:last-of-type")
                                    .classList.add("inCart");
                            }
                        });
                    }
                });
            });

            /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
            if (localStorage.getItem("UserCart") !== null) {
                let obj = JSON.parse(localStorage.getItem("UserCart"));

                obj.items.forEach((item) => {
                    if (
                        item.name === card.querySelector(".title").innerText.toLowerCase()
                    ) {
                        card.querySelector(
                            ".product-buttons button:first-of-type"
                        ).innerHTML = `<i class="far fa-check-square "></i>`;

                        card
                            .querySelector(".product-buttons button:first-of-type")
                            .classList.add("inCart");
                    }
                });
            }

            /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
            if (localStorage.getItem("UserWishlist") !== null) {
                let obj = JSON.parse(localStorage.getItem("UserWishlist"));

                obj.items.forEach((item) => {
                    if (
                        item.name === card.querySelector(".title").innerText.toLowerCase()
                    ) {
                        card
                            .querySelector(".product-buttons button:last-of-type")
                            .classList.add("inCart");
                    }
                });
            }
        });
    })
);
/********************************************************* */

/*****quantity buttons toggle */

jQuery(
    '<div class="quantity-nav"><div class="quantity-button quantity-up">+</div><div class="quantity-button quantity-down">-</div></div>'
).insertAfter(".quantity input");
jQuery(".quantity").each(function() {
    var spinner = jQuery(this),
        input = spinner.find('input[type="number"]'),
        btnUp = spinner.find(".quantity-up"),
        btnDown = spinner.find(".quantity-down"),
        min = input.attr("min"),
        max = input.attr("max");

    btnUp.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue >= max) {
            var newVal = oldValue;
        } else {
            var newVal = oldValue + 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
    });

    btnDown.click(function() {
        var oldValue = parseFloat(input.val());
        if (oldValue <= min) {
            var newVal = oldValue;
        } else {
            var newVal = oldValue - 1;
        }
        spinner.find("input").val(newVal);
        spinner.find("input").trigger("change");
    });
});

/************************* */

let star_rating_arr = document.querySelectorAll("form .star-container");

/*HELPER FUNCTIONS */
const insertFullStar = (count) => {
    let output = "";

    for (let i = 0; i < count; i++) {
        output += '<i class="fas fa-star"></i>';
    }

    return output;
};

const insertEmptyStar = (count) => {
    let output = "";

    for (let i = 0; i < count; i++) {
        output += '<i class="far fa-star"></i>';
    }

    return output;
};

/*******************/

function completeStars_click(ev) {
    let lastIndex;
    for (let i = 0; i < ev.currentTarget.dataset.starIndex; i++) {
        star_rating_arr[i].innerHTML = insertFullStar(i + 1);
        lastIndex = i + 1;
    }

    for (let i = lastIndex; i <= star_rating_arr.length; i++) {
        star_rating_arr[i].innerHTML = insertEmptyStar(i + 1);
    }
}

for (let starContainer of star_rating_arr) {
    starContainer.addEventListener("click", completeStars_click, true);
}

/*********************************************************/

/*****PRODUCT SLIDER ***************/
("use strict");

productScroll();

function productScroll() {
    let slider = document.getElementById("slider");
    let next = document.getElementsByClassName("pro-next");
    let prev = document.getElementsByClassName("pro-prev");
    let slide = document.getElementById("slide");
    let item = document.getElementById("slide");

    for (let i = 0; i < next.length; i++) {
        //refer elements by class name

        let position = 0; //slider postion

        prev[i].addEventListener("click", function() {
            //click previos button
            if (position > 0) {
                //avoid slide left beyond the first item
                position -= 1;
                translateX(position); //translate items
            }
        });

        next[i].addEventListener("click", function() {
            if (position >= 0 && position < hiddenItems()) {
                //avoid slide right beyond the last item
                position += 1;
                translateX(position); //translate items
            }
        });
    }

    function hiddenItems() {
        //get hidden items
        let items = getCount(item, false);
        let visibleItems = slider.offsetWidth / 390;
        return items - Math.ceil(visibleItems);
    }
}

function translateX(position) {
    //translate items
    slide.style.left = position * -370 + "px";
}

function getCount(parent, getChildrensChildren) {
    //count no of items
    let relevantChildren = 0;
    let children = parent.childNodes.length;
    for (let i = 0; i < children; i++) {
        if (parent.childNodes[i].nodeType != 3) {
            if (getChildrensChildren)
                relevantChildren += getCount(parent.childNodes[i], true);
            relevantChildren++;
        }
    }
    return relevantChildren;
}

/*********************************************************/

/******************LOAD SIMILAR PRODUCTS****************** */
function setStars(count) {
    let output = "";

    for (let star = 0; star < count; star++) {
        output += '<i class="fas fa-star"></i>';
    }

    for (let star = 0; star < 5 - count; star++) {
        output += '<i class="far fa-star"></i>';
    }

    return output;
}

async function load_all_products(target_container, products, count) {
    let i = 0;
    let product_index = 0;

    while (i < count) {
        for (let j = 0; j < products.length; j++) {
            if (product_index < products[j].items.length) {
                target_container.innerHTML += `  <div data-category="${
          products[j].category
        }" data-id="${
          products[j].items[product_index].id
        }" class="product-card">
                          <div class="product-image-container">
          
                          <img src="${
                            products[j].items[product_index].image_path
                          }" alt="product" />
                          </div>
                          <div class="product-buttons">
                              <button data-role="add-to-cart">
                        <i class="fas fa-cart-plus"></i>
                      </button>
                              <button data-role="add-to-wishlist">
                        <i class="fas fa-heart"></i>
                      </button>
                          </div>
                          <div class="product-content">
                              <p class="title"><a href="././product_description.html">
                              ${products[j].items[product_index].name}</a>
                              </p>
                              <p class="price">$${
                                products[j].items[product_index].price
                              }</p>
                              <p style="color:#ff9600">${setStars(
                                products[j].items[product_index].rating
                              )}</p>
                          </div>
                      </div>`;
            }
            product_index++;
            i++;
        }
    }
}

document
    .querySelectorAll(".your-rating >div.star-container")
    .forEach((item) => {
        item.addEventListener("click", (event) => {
            sessionStorage.setItem(
                "selectedStars",
                event.currentTarget.dataset.starIndex
            );
        });
    });

document.querySelector("#Review form").addEventListener("submit", (event) => {
    let username = document.querySelector("input#username").value;
    let email = document.querySelector("input#user_email").value;
    let rating = parseInt(sessionStorage.getItem("selectedStars"));
    let content = document.querySelector("#Review textarea").value;

    if (username && email && rating && content) {
        let comment = new Comment(
            username,
            email,
            rating,
            content,
            String(
                new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })
            )
        );

        console.log(comment);

        let target_container = document.querySelector(".comments");

        for (let i = 0; i < products.length; i++) {
            if (
                String(products[i].category).toLowerCase().trim() ==
                String(sessionStorage.getItem("userCategory").toLowerCase().trim())
            ) {
                console.log(`i found your desired category ${products[i].category}`);

                products[i].items[reqProd.id - 1].reviews.push(comment);
                console.log(products[i].items[reqProd.id - 1].reviews);

                Comment.appendCommentToContainer(target_container, comment);

                document.querySelector("span.review-count").innerText =
                    products[i].items[reqProd.id - 1].reviews.length;
                break;

                let inputs = document.querySelector("form > input");
                let textarea = document.querySelector("form > textarea");

                concat(inputs, textarea).forEach((item) => {
                    item.value = "";
                });
            }
        }
    }
});

document.querySelector("body").addEventListener("unload", () => {
    sessionStorage.clear();
});