import { Navbar } from "../components/navbar/script.js";
import { setStars } from "./utilityFunctions.js";
import { sortByProps as SortProds } from "./sortObjByProps.js";
import { Cart, CartProduct, areObjEqual, Wishlist } from "./cart.js";
import { setCartItemsCount } from "./setCartItemsCount.js";

const navOps = new Navbar(); //loading all events of the navbar

/***inserting products on a page, based on category */
let target_products_container = document.querySelector(".products-container"); //the target container of prods
let prodsPerPage = 9;
let userCategory = sessionStorage.getItem("userCategory") || "dental care";
sessionStorage.setItem("sortName", false);

if (
    String(userCategory).toLowerCase().trim() !==
    String("Produse").toLowerCase().trim()
) {
    //setting the title of the document
    document.querySelector("title").innerHTML = `${userCategory} - produse`;

    /*an array returned from the function, which returns an array of strings, each item of arr being a string of html code   that includes the products chunk*/
    let result_products_arr = load_products_from_category_by_chunks(
        products,
        userCategory,
        prodsPerPage
    );

    document.querySelector("select").addEventListener("change", (event) => {
        if (event.target.value == "asc") {
            sessionStorage.setItem("sortName", false);
        } else {
            sessionStorage.setItem("sortName", true);
        }
        result_products_arr = load_products_from_category_by_chunks(
            products,
            userCategory,
            prodsPerPage
        );

        insertProductsByPage(
            0,
            result_products_arr,
            target_products_container
        ).then(() => {
            document.querySelector("span.count").innerHTML = prodsPerPage;

            setCartItemsCount();
        });

        let number_of_pages = result_products_arr.length - 1;

        setPages(number_of_pages).then(() => {
            //for each li item of pagination, set a click event that inserts the products on the page that is based on li value
            document.querySelectorAll(".pagination ul li").forEach((item) => {
                item.addEventListener("click", (event) => {
                    insertProductsByPage(
                            parseInt(event.currentTarget.innerText) - 1, //the page count
                            result_products_arr,
                            target_products_container
                        ) //after clicking on the li paginating item, scroll to top
                        .then(() => {
                            window.scroll(0, 0);

                            document
                                .querySelector(".products-container")
                                .classList.remove("fadeInFromBottom");
                            document
                                .querySelector(".products-container")
                                .classList.add("fadeInFromBottom");

                            //mark the active li elem page
                            event.currentTarget.classList.toggle("active");

                            //unmark the rest
                            let pagItems = document.querySelectorAll("ul li");
                            console.log(pagItems);

                            for (let pagItem of pagItems) {
                                if (pagItem !== event.currentTarget) {
                                    pagItem.classList.toggle("active", false);
                                }
                            }
                        });
                });
            });
        });
    });

    /*loading the first page of products on the user category*/
    document.querySelector("body").addEventListener(
        "load",
        insertProductsByPage(
            0,
            result_products_arr,
            target_products_container
        ).then(() => {
            document.querySelector("span.count").innerHTML = prodsPerPage;
            setCartItemsCount();
        })
    );

    let number_of_pages = result_products_arr.length - 1;

    document.querySelector("body").addEventListener(
        "load",
        //Setting the pagination elements on page load

        setPages(number_of_pages).then(() => {
            //for each li item of pagination, set a click event that inserts the products on the page that is based on li value
            document.querySelectorAll(".pagination ul li").forEach((item) => {
                item.addEventListener("click", (event) => {
                    insertProductsByPage(
                            parseInt(event.currentTarget.innerText) - 1, //the page count
                            result_products_arr,
                            target_products_container
                        ) //after clicking on the li paginating item, scroll to top
                        .then(() => {
                            window.scroll(0, 0);
                            document
                                .querySelector(".products-container")
                                .classList.remove("fadeInFromBottom");
                            document
                                .querySelector(".products-container")
                                .classList.add("fadeInFromBottom");

                            //mark the active li elem page
                            event.currentTarget.classList.toggle("active");

                            //unmark the rest
                            let pagItems = document.querySelectorAll("ul li");
                            console.log(pagItems);

                            for (let pagItem of pagItems) {
                                if (pagItem !== event.currentTarget) {
                                    pagItem.classList.toggle("active", false);
                                }
                            }
                        });
                });
            });
        })
    );
} else {
    document.querySelector("title").innerHTML = `Toate produsele `;

    /*an array returned from the function, which returns an array of strings, each item of arr being a string of html code that includes the products chunk*/
    let result_products_arr = load_all_products_by_chunks(products, prodsPerPage);

    /*loading the first page of products on the user category*/
    document.querySelector("body").addEventListener(
        "load",
        insertProductsByPage(
            0,
            result_products_arr,
            target_products_container
        ).then(() => {
            document.querySelector("span.count").innerHTML = prodsPerPage;
            setCartItemsCount();
        })
    );

    let number_of_pages = result_products_arr.length - 1;

    document.querySelector("body").addEventListener(
        "load",
        //Setting the pagination elements on page load

        setPages(number_of_pages).then(() => {
            //for each li item of pagination, set a click event that inserts the products on the page that is based on li value
            document.querySelectorAll(".pagination ul li").forEach((item) => {
                item.addEventListener("click", (event) => {
                    insertProductsByPage(
                            parseInt(event.currentTarget.innerText) - 1, //the page count
                            result_products_arr,
                            target_products_container
                        ) //after clicking on the li paginating item, scroll to top
                        .then(() => {
                            window.scroll(0, 0);

                            document
                                .querySelector(".products-container")
                                .classList.remove("fadeInFromBottom");
                            document
                                .querySelector(".products-container")
                                .classList.add("fadeInFromBottom");
                        });
                });
            });
        })
    );
}

function load_all_products_by_chunks(products, chunk_size) {
    let output_string = "";
    let page_nr;
    let page_contents = []; //this is the array that will hold N products on each position
    let last_item_index = 0;
    let temp = 0; //will hold the last index temporarily
    let total_product_count = () => {
        let count = 0;
        for (let i = 0; i < products.length; i++) {
            count += products[i].items.length;
        }

        return count;
    };
    let count_of_prods = total_product_count();
    let array_of_all_prods = [];

    //if the chunk exceeds the number of available products, reset the value to the amount of prods we have

    //get the number of pages
    page_nr = Math.ceil(Number(count_of_prods / chunk_size));

    for (let i = 0; i < products.length; i++) {
        for (let j = 0; j < products[i].items.length; j++) {
            output_string = "";
            if (products[i].items != "undefined") {
                output_string += `  <div data-id="${
          products[i].items[j].id
        }" data-category="${products[i].category}" class="product-card">
                          <div class="product-image-container">
          
                          <img src="${
                            products[i].items[j].image_path
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
                              <p class="title">
                              <a href="././product_description.html">${products[
                                i
                              ].items[j].name.trim()}</a>
                              </p>
                              <p class="price">${products[i].items[j].price}</p>
                              <p style="color:#ff9600">${setStars(
                                products[i].items[j].rating
                              )}</p>
                          </div>
                      </div>`;
                array_of_all_prods.push(output_string);
            }
        }
    }

    for (let page = 0; page <= page_nr; page++) {
        output_string = "";
        last_item_index = temp;
        let current_selected_prods = 0;
        for (
            let j = last_item_index;
            /*j < chunk_size + last_item_index &&*/
            current_selected_prods < chunk_size && j < array_of_all_prods.length; j++
        ) {
            current_selected_prods++;
            output_string += array_of_all_prods[j];

            temp = j + 1;
        }
        //set the cunk of elements on the corresponding page
        page_contents.push(output_string);
    }

    return page_contents;
}

// Generate products on the page
function load_products_from_category_by_chunks(products, category, chunk_size) {
    let output_string = "";
    let page_nr;
    let page_contents = []; //this is the array that will hold N products on each position
    let last_item_index = 0;
    let temp = 0; //will hold the last index temporarily

    for (let i = 0; i < products.length; i++) {
        //looking for the suitable category
        if (
            String(category).toLowerCase() ===
            String(products[i].category).toLowerCase()
        ) {
            //if the chunk exceeds the number of available products, reset the value to the amount of prods we have
            if (chunk_size > products[i].items.length) {
                chunk_size = products[i].items.length;
            }

            if (sessionStorage.getItem("sortName") == "false") {
                SortProds(products[i].items, ["name"]); //sort asc by name
            } else {
                SortProds(products[i].items, ["name"], true); //sort desc by name
            }

            //get the number of pages
            page_nr = Math.ceil(Number(products[i].items.length / chunk_size));

            //for each page, well set the required products per chunks in the result array
            for (let page = 0; page <= page_nr; page++) {
                output_string = "";
                last_item_index = temp;

                let current_selected_prods = 0;
                for (
                    let j = last_item_index;
                    /*j < chunk_size + last_item_index*/
                    current_selected_prods < chunk_size && j < products[i].items.length; j++
                ) {
                    if (products[i].items != "undefined") {
                        current_selected_prods++;
                        output_string += `  <div data-id="${
              products[i].items[j].id
            }" data-category="${products[i].category}" class="product-card">
                                            <div class="product-image-container">
                                            <img src="${
                                              products[i].items[j].image_path
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
                                                <p class="title">
                                                <a href="././product_description.html">${products[
                                                  i
                                                ].items[j].name.trim()}</a></p>
                                                <p class="price">$${
                                                  products[i].items[j].price
                                                }</p>
                                                <p style="color:#ff9600">${setStars(
                                                  products[i].items[j].rating
                                                )}</p>
                                            </div>
                                        </div>`;
                    }

                    temp = j + 1;
                }
                //set the cunk of elements on the corresponding page
                page_contents.push(output_string);
            }
            break;
        }
    }

    return page_contents;
}

async function insertProductsByPage(
    page,
    page_contents_arr,
    target_products_container
) {
    //get the content of html string of products on the corresponding page
    target_products_container.innerHTML = page_contents_arr[page];

    /**product overlay buttons hover event */
    let productCard = document.querySelectorAll(
        ".products-container .product-card"
    );

    console.log(productCard);
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
                    }

                    console.log(
                        "Cart content---",
                        JSON.parse(localStorage.getItem("UserCart"))
                    );

                    // update the cart items count
                    setCartItemsCount();
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
                    console.log(`Our item - ${cartItem}`);

                    if (localStorage.getItem("UserWishlist") !== null) {
                        let itemExists = false;
                        //first we get the cart items fron LS
                        let userCart = JSON.parse(localStorage.getItem("UserWishlist"));
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
                            localStorage.setItem("UserWishlist", JSON.stringify(userCart));

                            //add class inCart if it isn't set
                            event.currentTarget.classList.add("inCart");
                        } else {
                            console.log("There is such item");
                        }
                    } else {
                        let newWishlist = new Wishlist(cartItem);
                        localStorage.setItem("UserWishlist", JSON.stringify(newWishlist));
                    }

                    console.log(
                        "Cart content---",
                        JSON.parse(localStorage.getItem("UserWishlist"))
                    );

                    // update the cart items count
                    setCartItemsCount();
                });
            }
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
}

//generate pagination
async function setPages(pages) {
    let list_items = "";

    for (let i = 1; i <= pages; i++) {
        list_items += `<li>${i}</li>`;
    }

    document.querySelector(".pagination >ul").innerHTML = list_items;
}

/***Setting the sessionstorage events, that will memorize which category to return if a certain category was selected */

document
    .querySelectorAll("nav .dropdown .dropdown-content a")
    .forEach((item) => {
        //for each item of links, add an event that will set the UserCategory the inner text
        item.addEventListener("click", (event) => {
            sessionStorage.setItem("userCategory", event.target.innerText);
            console.log(event.target.innerText);
        });
    });