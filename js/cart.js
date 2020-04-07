export let areObjEqual = (obj1, obj2, arrayOfPropsToAvoid) => {
    for (let key in obj1) {
        let safeToGo = false;

        if (arrayOfPropsToAvoid !== undefined) {
            for (let i = 0; i < arrayOfPropsToAvoid.length; i++) {
                if (key != arrayOfPropsToAvoid[i]) {
                    safeToGo = true;
                } else {
                    safeToGo = false;
                    break;
                }
            }
        } else {
            safeToGo = true;
        }

        if (safeToGo) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }
    }
    return true;
};
export class CartProduct {
    constructor(id, name, price, category, count = 1, imagePath = "") {
        this.id = Number(id) || 0;
        this.name = String(name) || null;
        this.price = Number(price) || 0;
        this.category = String(category) || null;
        this.count = Number(count) || 1;
        this.imagePath = String(imagePath) || null;
    }
}

export class Cart {
    items = [];

    constructor(...it) {
        this.items = it;
    }

    removeCartItem(item) {
        this.items = this.items.filter((prod) => !areObjEqual(item, prod));
    }

    addCartItems(item) {
        this.items.push(item);
    }

    getItems() {
        return this.items;
    }
}
export class Wishlist extends Cart {}