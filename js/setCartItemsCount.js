// HELPERS
export function setCartItemsCount() {
    let cart = localStorage.getItem("UserCart");

    if (cart !== null) {
        cart = JSON.parse(cart);

        if (parseInt(cart.items.length) > 9) {
            document.querySelector(".shopping-cart >span").innerHTML = "9+";
        } else {
            document.querySelector(".shopping-cart >span").innerHTML =
                cart.items.length;
        }
    } else {
        document.querySelector(".shopping-cart > span").innerHTML = 0;
    }
}