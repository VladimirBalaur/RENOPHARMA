import { Navbar } from "../components/navbar/script.js";
import { Cart, CartProduct, areObjEqual, Wishlist } from "./cart.js";
import { setCartItemsCount } from "./setCartItemsCount.js";
const navOps = new Navbar();

if (!localStorage.getItem("UserWishlist")) {
    localStorage.setItem("UserWishlist", JSON.stringify({ items: [] }));
}

if (!localStorage.getItem("UserCart")) {
    localStorage.setItem("UserCart", JSON.stringify({ items: [] }));
}

let target_node = document.querySelector("section.product-grid .container");
document.querySelector("body").addEventListener(
    "load",
    load_all_products(target_node, products, 10).then(() => {
        setCartItemsCount();
        /**product overlay buttons hover event */
        let productCard = document.querySelectorAll(".container .product-card");
        productCard.forEach((card) => {
            console.log(card);

            card.addEventListener("mouseover", () => {
                card.querySelectorAll("div.product-buttons button").forEach((button) => {
                    button.style.transform = "translateX(0%)";
                });
            });

            card.addEventListener("mouseleave", () => {
                card.querySelectorAll("div.product-buttons button").forEach((button) => {
                    button.style.transform = "translateX(101%)";
                });
            });

            card.querySelectorAll("a").forEach((item) => {
                item.addEventListener("click", (event) => {
                    let prod = {
                        name: String(event.target.innerText).toLowerCase(),
                        category: String(event.target.parentNode.parentNode.parentNode.dataset.category).toLowerCase(),
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
                        const category = event.currentTarget.parentNode.parentNode.dataset.category;
                        const price = Number(
                            event.currentTarget.parentNode.parentNode.querySelector(".price").innerText.split("$")[1]
                        );
                        const name = event.currentTarget.parentNode.parentNode.querySelector("p.title").innerText;

                        const imagePath = event.currentTarget.parentNode.parentNode.querySelector(
                            ".product-image-container img"
                        ).src;

                        const cartItem = new CartProduct(id, name.toLowerCase(), price, category, 1, imagePath);
                        console.log(`Our item - ${cartItem}`);

                        if (localStorage.getItem("UserCart") !== null) {
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
                            event.currentTarget.click();
                        }

                        console.log("Cart content---", JSON.parse(localStorage.getItem("UserCart")));

                        // update the cart items count
                        setCartItemsCount();
                    });
                } else if (button.dataset.role === "add-to-wishlist") {
                    button.addEventListener("click", (event) => {
                        const id = event.currentTarget.parentNode.parentNode.dataset.id;
                        const category = event.currentTarget.parentNode.parentNode.dataset.category;
                        const price = Number(
                            event.currentTarget.parentNode.parentNode.querySelector(".price").innerText.split("$")[1]
                        );
                        const name = event.currentTarget.parentNode.parentNode.querySelector("p.title").innerText;

                        const imagePath = event.currentTarget.parentNode.parentNode.querySelector(
                            ".product-image-container img"
                        ).src;

                        const cartItem = new CartProduct(id, name.toLowerCase(), price, category, 1, imagePath);
                        console.log(`Our item from wishlist - ${cartItem}`);

                        if (localStorage.getItem("UserWishlist") !== null) {
                            let itemExists = false;
                            //first we get the cart items fron LS
                            let UserWishlist = JSON.parse(localStorage.getItem("UserWishlist"));
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
                                localStorage.setItem("UserWishlist", JSON.stringify(UserWishlist));

                                //add class inCart if it isn't set
                                event.currentTarget.classList.add("inCart");
                            } else {
                                console.log("There is such item");
                            }
                        } else {
                            let newCart = new Wishlist(cartItem);
                            localStorage.setItem("UserWishlist", JSON.stringify(newCart));
                        }

                        console.log("Wishlist content---", JSON.parse(localStorage.getItem("UserWishlist")));

                        // update the cart items count
                        setCartItemsCount();
                    });
                }
                //when user clicks
                if (localStorage.getItem("UserCart") !== null) {
                    /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                    let obj = JSON.parse(localStorage.getItem("UserCart"));

                    obj.items.forEach((item) => {
                        if (item.name === card.querySelector(".title").innerText.toLowerCase()) {
                            card.querySelector(
                                ".product-buttons button:first-of-type"
                            ).innerHTML = `<i class="far fa-check-square "></i>`;

                            card.querySelector(".product-buttons button:first-of-type").classList.add("inCart");
                        }
                    });
                }

                if (localStorage.getItem("UserWishlist") !== null) {
                    /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                    let obj = JSON.parse(localStorage.getItem("UserWishlist"));

                    obj.items.forEach((item) => {
                        if (item.name === card.querySelector(".title").innerText.toLowerCase()) {
                            card.querySelector(".product-buttons button:last-of-type").classList.add("inCart");
                        }
                    });
                }
            });

            /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
            //when cards finish loading
            if (localStorage.getItem("UserCart") !== null) {
                let obj = JSON.parse(localStorage.getItem("UserCart"));

                obj.items.forEach((item) => {
                    if (item.name === card.querySelector(".title").innerText.toLowerCase()) {
                        card.querySelector(
                            ".product-buttons button:first-of-type"
                        ).innerHTML = `<i class="far fa-check-square "></i>`;

                        card.querySelector(".product-buttons button:first-of-type").classList.add("inCart");
                    }
                });
            }

            if (localStorage.getItem("UserWishlist") !== null) {
                /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                let obj = JSON.parse(localStorage.getItem("UserWishlist"));

                obj.items.forEach((item) => {
                    if (item.name === card.querySelector(".title").innerText.toLowerCase()) {
                        card.querySelector(".product-buttons button:last-of-type").classList.add("inCart");
                    }
                });
            }
        });
    })
);

document.addEventListener("DOMContentLoaded", () => {
    sessionStorage.setItem("featuredProductsCategory", String(products[0].category).toLowerCase().trim());
});

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
                target_container.innerHTML += `  <div data-category="${products[j].category}" data-id="${
          products[j].items[product_index].id
        }" class="product-card">
                <div class="product-image-container">

                <img src="${products[j].items[product_index].image_path}" alt="product" />
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
                    <p class="price">$${products[j].items[product_index].price}</p>
                    <p style="color:#ff9600">${setStars(products[j].items[product_index].rating)}</p>
                </div>
            </div>`;
            }
            product_index++;
            i++;
        }
    }
}