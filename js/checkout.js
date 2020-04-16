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
        /**  */
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
            this.getCountriesAndInsertInForm().then(() => {
                // adding an event for input button click to save the data
                let formSubmitBtn = document
                    .querySelector(`#submit`)
                    .addEventListener("click", () => {
                        console.log("Submitting");

                        formValidate();
                    });
            });
        });
    }
}

function formValidate() {
    let name = document.querySelector(`form input[name="name"]`).value;
    let surname = document.querySelector(`form input[name="surname"]`).value;
    let country = document.querySelector(`select#country`).value;
    let companyName = document.querySelector(`form #company_name`).value;
    let address = document.querySelector(`form #address`).value;
    let city = document.querySelector(`form #city`).value;
    let email = document.querySelector(`form #email`).value;
    let phone = document.querySelector(`form #phone`).value;
    let createAccount = document.querySelector("#checkbox_1").value;

    console.log(
        name,
        surname,
        country,
        companyName,
        address,
        city,
        email,
        phone,
        createAccount
    );

    let obj = {
        aaa: "bbb",
    };

    postCheckoutData(obj);
}

async function postCheckoutData(dataObj) {
    fetch("../data/checkout.json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObj),
    }).then((response) => {
        return response.json();
    });
}
let UI = new CheckoutUI();