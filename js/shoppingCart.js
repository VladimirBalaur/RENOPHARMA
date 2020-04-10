import { Navbar } from "../components/navbar/script.js";
import { areObjEqual } from "./cart.js";
import { setCartItemsCount } from "./setCartItemsCount.js";
import openModal from "../components/modal/modal.js";

const navUI = new Navbar();
setCartItemsCount();

class shoppingCartUI {
    discounts = [{
            code: "Vladimir",
            total: 110,
        },
        {
            code: "Practica",
            total: 50,
        },
    ];
    discountToGet = 0;

    async loadCartItems() {
        let cartItems = await JSON.parse(localStorage.getItem("UserCart")).items;

        if (cartItems !== undefined) {
            let container = document.querySelector(".cart-products-container");

            cartItems.forEach((item) => {
                container.innerHTML += ` <div class="cart-item">
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
                    <input type="number" value="${
                      item.count
                    }" min="1" max="999" name="" id="" />
                    <i class="far fa-times-circle"></i>
                </div>
            </div>`;
            });
        }
        setCartItemsCount();
    }

    constructor() {
        //we remove the leftovers of cartTotals SS var in case it exists

        if (sessionStorage.getItem("cartTotals")) {
            sessionStorage.removeItem("cartTotals");
        }

        if (sessionStorage.getItem("cartCoupon")) {
            sessionStorage.removeItem("cartCoupon");
        }

        this.loadCartItems().then(() => {
            this.Pay();
            this.getCountriesAndInsertInForm().then((countries) => {
                console.log(`My countries`, countries);

                let selectCountries = document.querySelector("select#country_select");
                let regionsForm = document.querySelector("select#region_select");

                selectCountries.addEventListener("change", (event) => {
                    console.log(event.currentTarget.value);

                    for (let country of countries) {
                        if (country.name == event.currentTarget.value) {
                            regionsForm.innerHTML = "";
                            let option = document.createElement("option");
                            option.setAttribute("value", country.capital);
                            option.textContent = country.capital;
                            regionsForm.appendChild(option);
                        }
                    }
                });
                // document
                //   .querySelectorAll("select#country_select option")
                //   .forEach((option) => {
                //     option.addEventListener("click", (event) => {
                //       let regionsForm = document.querySelector("select#region_select");
                //       console.log("I have an event");

                //       console.log("hello");

                //       // for (let country of countries) {
                //       //     // if (event.currentTarget.value == country.name) {
                //       //     //     console.log(country.name);
                //       //     // }

                //       //     console.log(country);
                //       // }
                //     });
                //   });
            });

            //events for removal buttons
            let shoppingItemsRemoveBtns = document.querySelectorAll(
                ".cart-item  .cart-ops-container >:last-child"
            );
            shoppingItemsRemoveBtns.forEach((btn) => {
                // remove item on click
                btn.addEventListener("click", (event) => {
                    this.removeItem(event.currentTarget).then(() => {
                        this.Pay();
                    });
                });
            });

            let checkoutButton = document.querySelector(
                `input[data-role="checkout"]`
            );

            checkoutButton.addEventListener("click", (event) => {
                let spanTotal = document.querySelector("span.total");
                sessionStorage.setItem("cartTotals", spanTotal.innerText.split("$")[1]);
                sessionStorage.setItem("cartCoupon", this.discountToGet || 0);
            });

            let inputProdCount = document.querySelectorAll(
                `.cart-ops-container input[type="number"]`
            );

            inputProdCount.forEach((item) => {
                item.addEventListener("change", (ev) => {
                    let val = ev.currentTarget.value;

                    let cartContent = JSON.parse(localStorage.getItem("UserCart"));
                    let items = cartContent.items;
                    let Parent = item.parentNode.parentNode;

                    let title = Parent.querySelector(".product-name >span").innerText;
                    let category = Parent.querySelector(".product-category >span")
                        .innerText;
                    let price = Parent.querySelector(
                        ".product-price >span"
                    ).innerText.split("$")[1];

                    console.log(title, category, price);

                    for (let i = 0; i < items.length; i++) {
                        if (
                            items[i].category == category &&
                            items[i].price == price &&
                            items[i].name == title
                        ) {
                            console.log(
                                `This is the element to alter count `,
                                items[i].price
                            );

                            items[i].count = parseInt(val);

                            cartContent.items = items;
                            localStorage.setItem("UserCart", JSON.stringify(cartContent));
                            this.Pay();

                            break;
                        }
                    }
                });
            });

            /*****************/

            //events to coupon form
            document
                .querySelector(`.coupon-form input[type="submit"]`)
                .addEventListener("click", (event) => {
                    let inputText = document.querySelector(
                        `.coupon-form input[type="text"]`
                    ).value;

                    if (inputText) {
                        this.getCouponDiscount(inputText);
                    } else {
                        this.discountToGet = 0;
                        this.Pay();
                    }
                });
        });
    }

    async removeItem(item) {
        let cartContent = JSON.parse(localStorage.getItem("UserCart"));
        let items = cartContent.items;
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

                items = items.filter(
                    (prod) => !areObjEqual(prod, items[i], ["id", "count"])
                );
                console.log(`this is your array after filtering `, items);
                cartContent.items = items;
                localStorage.setItem("UserCart", JSON.stringify(cartContent));
            }
        }

        //item is the <i></i> meant to trigger the removal
        Parent.classList.add("fade");
        Parent.addEventListener("animationend", () => {
            event.currentTarget.remove();
        });
        // Parent.remove();
        setCartItemsCount();
    }

    getCouponDiscount(code) {
        if (JSON.parse(localStorage.getItem("UserCart")).items.length) {
            this.discounts.forEach((discount) => {
                if (discount.code.trim() === code.trim()) {
                    this.discountToGet = discount.total;

                    document.querySelector("span.coupon").innerText =
                        "-$" + this.discountToGet.toFixed(2);

                    this.Pay();
                }
            });
        } else {
            openModal(`Nu aveți nici un produs, pentru a executa această operație`);
        }
    }

    Pay() {
        if (JSON.parse(localStorage.getItem("UserCart")).items.length > 0) {
            let totalPrice = 0;

            let cartItems = JSON.parse(localStorage.getItem("UserCart")).items;

            cartItems.forEach((item) => {
                totalPrice += item.price * item.count;
                console.log(item.price);
            });

            document.querySelector("span.subtotal").innerText =
                "$" + totalPrice.toFixed(2);
            document.querySelector("span.coupon").innerText =
                "-$" + this.discountToGet.toFixed(2);
            totalPrice -= this.discountToGet;
            console.log(this.discountToGet);

            document.querySelector("span.total").innerText =
                "$" + totalPrice.toFixed(2);
        } else {
            openModal("Nu puteti procura nimic, nu aveti produse");
            document.querySelector("span.subtotal").innerText = "$" + 0;
            document.querySelector("span.coupon").innerText = "-$" + 0;

            document.querySelector("span.total").innerText = "$" + 0;
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

                let selectCountries = document.querySelector("select#country_select");
                console.log();

                countries.forEach((country) => {
                    let option = document.createElement("option");
                    option.setAttribute("value", country.name);
                    option.textContent = country.name + " /" + country.nativeName;

                    selectCountries.appendChild(option);
                });

                return countries;
            } else {
                throw new Error("Failed to fetch data about countries");
            }
        } catch (err) {
            console.log(err);
        }
    }
}

const cartUI = new shoppingCartUI();