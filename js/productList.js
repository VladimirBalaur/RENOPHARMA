import { Navbar } from "../components/navbar/script.js";
import { setStars, setTags } from "./utilityFunctions.js";
import { sortByProps as SortProds } from "./sortObjByProps.js";
import { setCartItemsCount } from "./setCartItemsCount.js";
import { Cart, CartProduct, areObjEqual, Wishlist } from "./cart.js";

const NavUi = new Navbar();
// To do: DO THE FILTERS AND THINK ABOUT DOING THE HOVER EFFECTS AND FOCUS EFFECTS OF CURRENT ACTIVE CATEGORY LINK AND PAGE LINK
//Setting up all categories on ul
setCartItemsCount();

if (!sessionStorage.getItem("featuredProductsCategory")) {
    sessionStorage.setItem("featuredProductsCategory", "dental care");
}

let categoriesList = document.querySelector(
    "section.main  div.categories-list >ul"
);

console.log(products);
//set the category list based on categories we have
products.forEach((product) => {
    let li = document.createElement("li");

    let a = document.createElement("a");
    a.innerHTML = `${product.category}(${product.items.length})`;
    a.href = "./productList.html";
    a.dataset.category = String(product.category).toLowerCase().trim();
    a.addEventListener("click", (event) => {
        sessionStorage.setItem(
            "featuredProductsCategory",
            event.target.dataset.category
        );

        // event.currentTarget.classList.toggle("active", true);

        // let otherLinks = document.querySelectorAll(".categories-list li  a ");
        // for (let link of otherLinks) {
        //     if (link !== event.currentTarget) {
        //         link.classList.toggle("active", false);
        //     }
        // }
    });

    li.appendChild(a);
    categoriesList.appendChild(li);
});

// generating popular products of this category
let requestedCategory = sessionStorage.getItem("featuredProductsCategory");

document.addEventListener("DOMContentLoaded", () => {
    generatePopularProducts(products, requestedCategory);
});

let target_products_container = document.querySelector(
    ".right-container .products-container"
); //the target container of prods
let prodsPerPage = 4;
sessionStorage.setItem("minPrice", 0);
sessionStorage.setItem("maxPrice", 10e9);
let priceMin = Number(sessionStorage.getItem("minPrice"));
let priceMax = Number(sessionStorage.getItem("maxPrice"));

// default price sorting
sessionStorage.setItem("sortPrice", false); //true descending order, false- ascending

if (String(requestedCategory).toLowerCase().trim()) {
    //setting the title of the document
    document.querySelector("title").innerHTML = `${requestedCategory} - produse`;

    /*an array returned from the function, which returns an array of strings, each item of arr being a string of html code   that includes the products chunk*/
    let result_products_arr = load_products_from_category_by_chunks_withing_price_range(
        products,
        requestedCategory,
        prodsPerPage,
        Number(sessionStorage.getItem("minPrice")),
        Number(sessionStorage.getItem("maxPrice"))
    );
    // load_products_from_category_by_chunks(
    //     products,
    //     requestedCategory,
    //     prodsPerPage
    // );

    // events for sort By button

    //event to trigger when the price filter is fired
    document
        .querySelector("#price-range-submit")
        .addEventListener("click", (event) => {
            sessionStorage.setItem(
                "minPrice",
                document.querySelector("#min_price").value
            );

            sessionStorage.setItem(
                "maxPrice",
                document.querySelector("#max_price").value
            );

            result_products_arr = load_products_from_category_by_chunks_withing_price_range(
                products,
                requestedCategory,
                prodsPerPage,
                Number(sessionStorage.getItem("minPrice")),
                Number(sessionStorage.getItem("maxPrice"))
            );
            // load_products_from_category_by_chunks(
            //     products,
            //     requestedCategory,
            //     prodsPerPage
            // );

            insertProductsByPage(
                0,
                result_products_arr,
                target_products_container
            ).then(() => {
                document.querySelector("span.count").innerHTML = prodsPerPage;
            });

            //Setting the pagination elements on page load
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

    document.querySelectorAll("select").forEach((item) => {
        item.addEventListener("change", (ev) => {
            if (ev.currentTarget.value != "desc") {
                sessionStorage.setItem("sortPrice", false);
            } else {
                sessionStorage.setItem("sortPrice", true);
            }
            result_products_arr = load_products_from_category_by_chunks_withing_price_range(
                products,
                requestedCategory,
                prodsPerPage,
                Number(sessionStorage.getItem("minPrice")),
                Number(sessionStorage.getItem("maxPrice"))
            );
            // load_products_from_category_by_chunks(
            //     products,
            //     requestedCategory,
            //     prodsPerPage
            // );

            insertProductsByPage(
                0,
                result_products_arr,
                target_products_container
            ).then(() => {
                document.querySelector("span.count").innerHTML = prodsPerPage;

                console.log("prods inserted");
            });
            //Setting the pagination elements on page load
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
    });

    //sorting prods based on their price
    /*loading the first page of products on the user category*/
    document.querySelector("body").addEventListener(
        "load",
        insertProductsByPage(
            0,
            result_products_arr,
            target_products_container
        ).then(() => {
            document.querySelector("span.count").innerHTML = prodsPerPage;
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
    alert("ERROR");
    window.location = "index.html";
}

// HELPERS
function generatePopularProducts(products, requestedCategory) {
    let counter = 0;
    let popularProdString = "";
    for (let i = 0; i < products.length; i++) {
        if (
            String(products[i].category).toLowerCase().trim() === requestedCategory
        ) {
            console.log(`found your category${products[i].category}`);

            // get the higher mark
            let highestRating;
            let ratings = []; //saving all marks in an arra
            for (let k = 0; k < products[i].items.length; k++) {
                ratings.push(products[i].items[k].rating);
            }

            highestRating = Math.max(...ratings);
            // ratings.length = 0;

            console.log(`The highest rating ${highestRating}`);

            for (let j = 0; j < products[i].items.length || counter <= 3; j++) {
                if (products[i].items[j].rating == "undefined") {
                    console.log(`${products[i].items[j]} is undefined`);
                }

                if (products[i].items[j].rating == highestRating) {
                    document.querySelector(
                        ".popular-products-container"
                    ).innerHTML += ` <div class="product-item">
                    <div class="image-container">
                        <img src="${products[i].items[j].image_path}" alt="${products[i].items[j].name}" />
                    </div>
                    <div class="product-content">
                        <h4>${products[i].items[j].name}</h4>
                        <p class="price">$${products[i].items[j].price}</p>
                    </div>
                </div>`;

                    counter++;
                    console.log("looser");

                    // console.log(popularProdString);
                    console.log(popularProdString);
                }
            }
        }

        // document.querySelector(
        //     ".popular-products-container"
        // ).innerHTML = popularProdString;
    }
}

//this function is the same as the previous, although it filters the price out
function load_products_from_category_by_chunks_withing_price_range(
    products,
    category,
    chunk_size,
    priceMin,
    priceMax
) {
    let output_string = "";
    let page_nr;
    let page_contents = []; //this is the array that will hold N products on each position
    let last_item_index = 0;
    let temp = 0; //will hold the last index temporarily
    let productsCount = 0; //the nr of prods withing the price range

    for (let i = 0; i < products.length; i++) {
        //looking for the suitable category
        if (
            String(category).toLowerCase() ===
            String(products[i].category).toLowerCase()
        ) {
            //we'll check how many products are withing this price range
            products[i].items.forEach((item) => {
                if (item.price >= priceMin && item.price <= priceMax) {
                    productsCount++;
                }
            });
            //if the chunk exceeds the number of available products, reset the value to the amount of prods we have
            if (chunk_size > productsCount) {
                chunk_size = productsCount;
            }

            // sort the products by their price in this category

            //if the session val is false, sort ascending else descending
            if (sessionStorage.getItem("sortPrice") == "false") {
                SortProds(products[i].items, ["price"]);
            } else {
                SortProds(products[i].items, ["price"], true);
                console.log(products[i].items, productsCount);
            }

            //get the number of pages
            page_nr = Math.ceil(Number(productsCount / chunk_size));
            console.log(page_nr);
            //for each page, well set the required products per chunks in the result array
            for (let page = 0; page <= page_nr; page++) {
                output_string = "";
                last_item_index = temp;
                console.log(`We re in the for page loop`);
                console.log(`The chunk size ${chunk_size}`);
                let current_selected_prods = 0;

                for (
                    let j = last_item_index;
                    /*j < chunk_size + last_item_index &&*/
                    current_selected_prods < chunk_size && j < products[i].items.length; j++
                ) {
                    console.log(`Curreent evaluated products `);
                    console.log(products[i].items[j].price, " the product index ", j);

                    if (products[i].items[j] != "undefined") {
                        if (
                            products[i].items[j].price >= priceMin &&
                            products[i].items[j].price <= priceMax
                        ) {
                            current_selected_prods++;
                            output_string += ` <div data-category="${
                products[i].category
              }" data-id="${products[i].items[j].id}" class="product-container">
                        <div class="product-img"><img src="${
                          products[i].items[j].image_path
                        }" alt="${products[i].items[j].name}"> </div>
                        <div class="product-main-content">
                            <h1> <a href="./product_description.html">  ${
                              products[i].items[j].name
                            }</a></h1>
                            <h2>$${products[i].items[j].price}</h2>
                            <p class="product-rating">${setStars(
                              products[i].items[j].rating
                            )}</p>
                            <p class="product-description"> ${
                              products[i].items[j].description_short
                            }
                            </p>
                            <p class="product-tags">
                                ${setTags(products[i].items[j])}
                            </p>
                            <div class="buttons-container">
                                <button data-role="add-to-cart"><i class="fas fa-cart-plus"></i>Adauga in cos</button>
                                <button data-role="add-to-wishlist"><i class="far fa-heart"></i></button>
                            </div>
                        </div>
                    </div>`;
                        }
                    }

                    temp = j + 1;
                }
                //set the chunk of elements on the corresponding page
                page_contents.push(output_string);
            }
            break;
        }
    }

    console.log(page_contents);

    return page_contents;
}

async function insertProductsByPage(
    page,
    page_contents_arr,
    target_products_container
) {
    //get the content of html string of products on the corresponding page
    target_products_container.innerHTML = page_contents_arr[page];

    //ADDING TO CART FUNCTIONALITY
    let items = document.querySelectorAll(".product-container");
    items.forEach((card) => {
        card.querySelectorAll(".buttons-container button").forEach((item) => {
            item.addEventListener("click", (event) => {
                let button = event.currentTarget;
                console.log(button);

                if (button.dataset.role === "add-to-cart") {
                    const id =
                        event.currentTarget.parentNode.parentNode.parentNode.dataset.id;
                    const category =
                        event.currentTarget.parentNode.parentNode.parentNode.dataset
                        .category;
                    const price = Number(
                        event.currentTarget.parentNode.parentNode.parentNode
                        .querySelector("h2")
                        .innerText.split("$")[1]
                    );
                    const name = event.currentTarget.parentNode.parentNode.parentNode.querySelector(
                        "h1"
                    ).innerText;

                    const imagePath = event.currentTarget.parentNode.parentNode.parentNode.querySelector(
                        "img"
                    ).src;

                    const cartItem = new CartProduct(
                        id,
                        name.toLowerCase(),
                        price,
                        category,
                        1,
                        imagePath
                    );
                    console.log(`Our item - `, cartItem);

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
                    /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                    if (localStorage.getItem("UserCart") !== null) {
                        let obj = JSON.parse(localStorage.getItem("UserCart"));

                        obj.items.forEach((item) => {
                            if (
                                item.name === card.querySelector("h1").innerText.toLowerCase()
                            ) {
                                card.querySelector(
                                    ".buttons-container button:first-of-type"
                                ).innerHTML = `<i class="far fa-check-square "></i> Deja exista in cos`;

                                card
                                    .querySelector(".buttons-container button:first-of-type")
                                    .classList.add("inCart");
                            }
                        });
                    }
                } else if (button.dataset.role === "add-to-wishlist") {
                    const id =
                        event.currentTarget.parentNode.parentNode.parentNode.dataset.id;
                    const category =
                        event.currentTarget.parentNode.parentNode.parentNode.dataset
                        .category;
                    const price = Number(
                        event.currentTarget.parentNode.parentNode.parentNode
                        .querySelector("h2")
                        .innerText.split("$")[1]
                    );
                    const name = event.currentTarget.parentNode.parentNode.parentNode.querySelector(
                        "h1"
                    ).innerText;

                    const imagePath = event.currentTarget.parentNode.parentNode.parentNode.querySelector(
                        "img"
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
                }
                //on click
                /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                if (localStorage.getItem("UserCart") !== null) {
                    let obj = JSON.parse(localStorage.getItem("UserCart"));

                    obj.items.forEach((item) => {
                        if (
                            item.name === card.querySelector("h1").innerText.toLowerCase()
                        ) {
                            card.querySelector(
                                ".buttons-container button:first-of-type"
                            ).innerHTML = `<i class="far fa-check-square "></i> Deja exista in cos`;

                            card
                                .querySelector(".buttons-container button:first-of-type")
                                .classList.add("inCart");
                        }
                    });
                }

                /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
                if (localStorage.getItem("UserWishlist") !== null) {
                    let obj = JSON.parse(localStorage.getItem("UserWishlist"));

                    obj.items.forEach((item) => {
                        if (
                            item.name === card.querySelector("h1").innerText.toLowerCase()
                        ) {
                            card
                                .querySelector(".buttons-container button:last-of-type")
                                .classList.add("inWishlist");
                        }
                    });
                }
            });
        });
        //on items load
        /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
        if (localStorage.getItem("UserCart") !== null) {
            let obj = JSON.parse(localStorage.getItem("UserCart"));

            obj.items.forEach((item) => {
                if (item.name === card.querySelector("h1").innerText.toLowerCase()) {
                    card.querySelector(
                        ".buttons-container button:first-of-type"
                    ).innerHTML = `<i class="far fa-check-square "></i> Deja exista in cos`;

                    card
                        .querySelector(".buttons-container button:first-of-type")
                        .classList.add("inCart");
                }
            });
        }

        /**********THIS CODE CHECKS IF ANY PRODUCT ON THE PAGE IS IN THE CART ALREADY********/
        if (localStorage.getItem("UserWishlist") !== null) {
            let obj = JSON.parse(localStorage.getItem("UserWishlist"));

            obj.items.forEach((item) => {
                if (item.name === card.querySelector("h1").innerText.toLowerCase()) {
                    card
                        .querySelector(".buttons-container button:last-of-type")
                        .classList.add("inWishlist");
                }
            });
        }

        //when you click on the title, go to the corresponding page
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
    });
}

async function __insertProductsByPage() {}

//generate pagination
async function setPages(pages) {
    let list_items = "";

    for (let i = 1; i <= pages; i++) {
        list_items += `<li>${i}</li>`;
    }

    document.querySelector(".pagination >ul").innerHTML = list_items;
}