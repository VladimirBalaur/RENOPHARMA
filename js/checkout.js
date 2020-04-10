import { Navbar } from "../components/navbar/script.js";
import { setCartItemsCount } from "./setCartItemsCount.js";
import openModal from "../components/modal/modal.js";
const navUI = new Navbar();

setCartItemsCount();

class CheckoutUI {
    async getCartData() {
        if (
            localStorage.getItem("UserCart") &&
            sessionStorage.getItem("cartTotals")
        ) {
            this.cartItems = await JSON.parse(localStorage.getItem("UserCart")).items;
        } else {
            openModal(
                "Nu puteti efectua aceasta operatie, nu aveti nimic setat in cosul de cumparaturi"
            );
            setTimeout(() => {
                window.location = "shoppingCart.html";
            }, 3000);
        }
    }

    async getCountriesAndInsertInForm() {
        try {
            let responseCountries = await fetch(
                "https://restcountries-v1.p.rapidapi.com/all", {
                    method: "GET",
                    headers: {
                        "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
                        "x-rapidapi-key": "f004cb53d4msh23a56366c5d1ab5p13f806jsn495f5fe7cbfa",
                    },
                }
            );

            if (responseCountries.ok) {
                let countries = await responseCountries.json();

                console.log(countries);

                let selectCountries = document.querySelector("select#country");
                console.log();

                countries.forEach((country) => {
                    let option = document.createElement("option");
                    option.setAttribute("value", country.name);
                    option.textContent = country.name + " /" + country.nativeName;

                    selectCountries.appendChild(option);
                });
            } else {
                throw new Error("Failed to fetch data about countries");
            }
        } catch (err) {
            console.log(err);
        }
    }

    insertData() {
        // Set cart items in the checkout
        let cartItemsContainer = document.querySelector(
            `div[data-content="cart-items"]`
        );
        for (let cartItem of this.cartItems) {
            cartItemsContainer.innerHTML += `   <p class="item"><span data-role="name-count">${cartItem.name}   x${cartItem.count}</span> <span data-role="price">$${cartItem.price}</span> </p>`;
        }

        let subtotal = Number(sessionStorage.getItem("cartTotals"));
        let discount = Number(sessionStorage.getItem("cartCoupon"));
        //set the totals
        document.querySelector(`span.subtotal`).innerHTML =
            "$" + (subtotal + discount) + " -$" + discount;

        document.querySelector(`span#total`).innerHTML =
            "$" + sessionStorage.getItem("cartTotals");
    }
    constructor() {
        this.getCartData().then(() => {
            this.insertData();
            this.getCountriesAndInsertInForm();
        });
    }
}

let UI = new CheckoutUI();