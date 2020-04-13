import { Comment } from "../../js/product_description_utils/commentAdding.js";
import { Cart, CartProduct, areObjEqual, Wishlist } from "../../js/cart.js";
import { setCartItemsCount } from "../../js/setCartItemsCount.js";

export class Product {
    constructor() {
        // card.querySelectorAll("a").forEach(item => {
        //     item.addEventListener("click", event => {
        //         let prod = {
        //             name: String(event.target.innerText).toLowerCase(),
        //             category: String(
        //                 event.target.parentNode.parentNode.parentNode.dataset.category
        //             ).toLowerCase()
        //         };
        //         sessionStorage.setItem("reqProduct", JSON.stringify(prod));
        //     });
        // });
    }

    //method for product_description page
    static getProductByName(reqProd, products) {
        let found = false;
        for (let i = 0; i < products.length; i++) {
            if (
                String(reqProd.category).toLowerCase().trim() ===
                String(products[i].category).toLowerCase().trim()
            ) {
                for (let j = 0; j < products[i].items.length && found === false; j++) {
                    if (reqProd.id == products[i].items[j].id) {
                        found = true;

                        document.querySelector("div.product-info-container").dataset.id =
                            products[i].items[j].id;

                        document.querySelector(
                            "div.product-info-container"
                        ).dataset.category = products[i].category;

                        document.querySelector("div.product-info-container img").src =
                            products[i].items[j].image_path;

                        document.querySelector(
                            "div.product-info-container .product-info-content > h1"
                        ).innerText = products[i].items[j].name;

                        document.querySelector(
                            "div.product-info-container .product-info-content .price"
                        ).innerText += products[i].items[j].price.toFixed(2);

                        document.querySelector(
                            "div.product-info-container .product-info-content p.short-description"
                        ).innerText = products[i].items[j].description_short;

                        document.querySelector("div#Description >p").innerText =
                            products[i].items[j].description_detailed;

                        let commentsContainer = document.querySelector(".comments");
                        for (let review of products[i].items[j].reviews) {
                            Comment.appendCommentToContainer(commentsContainer, review);
                        }
                        //set the number of reviews
                        document.querySelector("span.review-count").innerText =
                            products[i].items[j].reviews.length;

                        document
                            .querySelectorAll(`.cart-operations button`)
                            .forEach((button) => {
                                button.addEventListener("click", (event) => {
                                    if (event.currentTarget.dataset.role === "add-to-cart") {
                                        console.log(event.currentTarget);

                                        const id =
                                            event.currentTarget.parentNode.parentNode.parentNode
                                            .dataset.id;
                                        const category =
                                            event.currentTarget.parentNode.parentNode.parentNode
                                            .dataset.category;
                                        const price = Number(
                                            event.currentTarget.parentNode.parentNode
                                            .querySelector(".price")
                                            .innerText.split("$")[1]
                                        );
                                        const name = event.currentTarget.parentNode.parentNode.querySelector(
                                            "h1"
                                        ).innerText;

                                        const imagePath = event.currentTarget.parentNode.parentNode.parentNode.querySelector(
                                            "img"
                                        ).src;

                                        const count = document.querySelector(
                                            '.quantity input[type="number"]'
                                        ).value;

                                        const cartItem = new CartProduct(
                                            id,
                                            name.toLowerCase(),
                                            price,
                                            category,
                                            count,
                                            imagePath
                                        );
                                        console.log(`Our item - ${cartItem}`);

                                        if (localStorage.getItem("UserCart") !== null) {
                                            let itemExists = false;
                                            //first we get the cart items fron LS
                                            let userCart = JSON.parse(
                                                localStorage.getItem("UserCart")
                                            );
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
                                                localStorage.setItem(
                                                    "UserCart",
                                                    JSON.stringify(userCart)
                                                );

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
                                        document
                                            .querySelector(`.cart-operations button:first-of-type`)
                                            .classList.add("inWishlist");

                                        document.querySelector(
                                            ".cart-operations button:first-of-type"
                                        ).innerHTML = `<i class="far fa-check-square "></i> Deja exista in cos`;
                                        // update the cart items count
                                        setCartItemsCount();
                                    } else if (
                                        event.currentTarget.dataset.role === "add-to-wishlist"
                                    ) {
                                        const id =
                                            event.currentTarget.parentNode.parentNode.parentNode
                                            .dataset.id;
                                        const category =
                                            event.currentTarget.parentNode.parentNode.parentNode
                                            .dataset.category;
                                        const price = Number(
                                            event.currentTarget.parentNode.parentNode
                                            .querySelector(".price")
                                            .innerText.split("$")[1]
                                        );
                                        const name = event.currentTarget.parentNode.parentNode.querySelector(
                                            "h1"
                                        ).innerText;

                                        const imagePath = event.currentTarget.parentNode.parentNode.parentNode.querySelector(
                                            "img"
                                        ).src;

                                        const count = document.querySelector(
                                            '.quantity input[type="number"]'
                                        ).value;

                                        const cartItem = new CartProduct(
                                            id,
                                            name.toLowerCase(),
                                            price,
                                            category,
                                            count,
                                            imagePath
                                        );
                                        console.log(`Our item - ${cartItem}`);

                                        if (localStorage.getItem("UserWishlist") !== null) {
                                            let itemExists = false;
                                            //first we get the cart items fron LS
                                            let userWishlist = JSON.parse(
                                                localStorage.getItem("UserWishlist")
                                            );
                                            //check if we already have this item

                                            userWishlist.items.forEach((item) => {
                                                if (areObjEqual(item, cartItem)) {
                                                    itemExists = true;
                                                }
                                            });

                                            if (!itemExists) {
                                                // we push our cart item to the JSON object of cart items
                                                userWishlist.items.push(cartItem);
                                                //we push  he whole JSON to the LS
                                                localStorage.setItem(
                                                    "UserWishlist",
                                                    JSON.stringify(userWishlist)
                                                );

                                                //add class inCart if it isn't set
                                                event.currentTarget.classList.add("inCart");
                                            } else {
                                                console.log("There is such item");
                                            }
                                        } else {
                                            let newWishlist = new Wishlist(cartItem);
                                            localStorage.setItem(
                                                "UserWishlist",
                                                JSON.stringify(newWishlist)
                                            );
                                        }

                                        document
                                            .querySelector(`.cart-operations button:last-of-type`)
                                            .classList.add("inWishlist");
                                    }
                                });
                            });

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

                        /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE wishlist ALREADY********/
                        if (localStorage.getItem("UserWishlist") !== null) {
                            let obj = JSON.parse(localStorage.getItem("UserWishlist"));

                            obj.items.forEach((item) => {
                                if (
                                    item.name ===
                                    document
                                    .querySelector(".product-info-content h1")
                                    .innerText.toLowerCase()
                                ) {
                                    document
                                        .querySelector(`.cart-operations button:last-of-type`)
                                        .classList.add("inWishlist");
                                }
                            });
                        }
                    }
                }
            }
        }

        if (found === false) {
            alert("Error");
            window.location = "index.html";
        }
    }
}