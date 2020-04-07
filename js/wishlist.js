import { Navbar } from "../components/navbar/script.js";
import { areObjEqual } from "./cart.js";
import { setCartItemsCount } from "./setCartItemsCount.js";
import openModal from "../components/modal/modal.js";

const navUI = new Navbar();
setCartItemsCount();

class WishlistUI {
    async loadWishListItems() {
        let wishlistItems = await JSON.parse(localStorage.getItem("UserWishlist"))
            .items;

        if (wishlistItems !== undefined) {
            let container = document.querySelector(".cart-products-container");

            wishlistItems.forEach((item) => {
                container.innerHTML += ` <div data-id="${item.id}" class="cart-item">
                <div class="product-name-img">
                    <div class="img-container">   <img src="${
                      item.imagePath
                    }" alt=""></div>
                    <p class="product-name"><span>${item.name}</span></p>
                </div>
                <div class="product-category"><span>${
                  item.category
                }</span></div>
                <div class="product-price"><span>$${item.price.toFixed(
                  2
                )}</span></div>
                <div class="cart-ops-container">
                <button type="submit">Adaugă în coș</button>
                    <i class="far fa-times-circle"></i>
                </div>
            </div>`;
            });
        }
    }

    constructor() {
        this.loadWishListItems().then(() => {
            console.log("LOADING FINISHED");

            //events for removal buttons
            let shoppingItemsRemoveBtns = document.querySelectorAll(
                ".cart-item  .cart-ops-container >:last-child"
            );

            shoppingItemsRemoveBtns.forEach((btn) => {
                // remove item on click
                btn.addEventListener("click", (event) => {
                    this.removeItem(event.currentTarget);
                });
            });

            //set events for each button to add the item in cart

            let addToCartButton = document
                .querySelectorAll(
                    `.cart-item  .cart-ops-container button[type="submit"]`
                )
                .forEach((btn) => {
                    btn.addEventListener("click", async(event) => {
                        let WishlistContent = await JSON.parse(
                            localStorage.getItem("UserWishlist")
                        );
                        let cartContent = await JSON.parse(
                            localStorage.getItem("UserCart")
                        );
                        let cartItems = cartContent.items;

                        let item = event.currentTarget;
                        let items = WishlistContent.items;
                        let Parent = item.parentNode.parentNode;

                        let title = Parent.querySelector(".product-name >span").innerText;
                        let category = Parent.querySelector(".product-category >span")
                            .innerText;
                        let price = Parent.querySelector(
                            ".product-price >span"
                        ).innerText.split("$")[1];
                        let id = Parent.dataset.id;

                        for (let wishlistItem of items) {
                            let itemExists = false; //item exists in cart from wishlist
                            if (
                                wishlistItem.price == price &&
                                wishlistItem.name == title &&
                                wishlistItem.category == category
                            ) {
                                for (let cartItem of cartItems) {
                                    if (areObjEqual(cartItem, wishlistItem, ["count"]) == true) {
                                        itemExists = true;

                                        console.log("I found this item in cart");
                                        console.log(cartItem, wishlistItem);

                                        break;
                                    }
                                }
                                if (itemExists) {
                                    console.log("Produsul selectat exista deja");
                                    openModal(
                                        `Acest produs există deja în <a style="text-decoration:underline" href="./shoppingCart.html"> coș</a>`
                                    );
                                } else {
                                    console.log(
                                        "Produsul selectat nu exista in cos, deci il voi adauga"
                                    );

                                    console.log(
                                        `---adaugam produsul`,
                                        wishlistItem,
                                        "in cos-----"
                                    );
                                    cartItems.push(wishlistItem);

                                    console.log(`----Stergem produsul din wishlist`);

                                    this.removeItem(event.currentTarget);
                                    cartContent.items = cartItems;
                                    localStorage.setItem("UserCart", JSON.stringify(cartContent));
                                }
                                // console.log(`exists item`, itemExists);
                                break;
                            }
                        }
                    });
                });
        });
    }

    async removeItem(item) {
        let WishlistContent = await JSON.parse(
            localStorage.getItem("UserWishlist")
        );
        let items = WishlistContent.items;
        let Parent = item.parentNode.parentNode;

        let titleElemToRemove = Parent.querySelector(".product-name >span")
            .innerText;
        let categoryElemToRemove = Parent.querySelector(".product-category >span")
            .innerText;
        let priceElemToRemove = Parent.querySelector(
            ".product-price >span"
        ).innerText.split("$")[1];

        console.log(titleElemToRemove, categoryElemToRemove, priceElemToRemove);

        for (let i = 0; i < items.length; i++) {
            if (
                items[i].category == categoryElemToRemove &&
                items[i].price == priceElemToRemove &&
                items[i].name == titleElemToRemove
            ) {
                console.log(`This is the element to remove `, items[i].price);

                items = items.filter((prod) => !areObjEqual(prod, items[i]));
                console.log(`this is your array after filtering `, items);
                WishlistContent.items = items;
                localStorage.setItem("UserWishlist", JSON.stringify(WishlistContent));
            }
        }

        //item is the <i></i> meant to trigger the removal
        Parent.remove();
        setCartItemsCount();
    }
}

const wishListUI = new WishlistUI();