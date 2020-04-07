import { Navbar } from "../components/navbar/script.js";
import { Cart, CartProduct, areObjEqual, Wishlist } from "./cart.js";
import { setCartItemsCount } from "./setCartItemsCount.js";

const navOps = new Navbar();
setCartItemsCount();