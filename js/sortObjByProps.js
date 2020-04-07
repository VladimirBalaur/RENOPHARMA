export function sortByProps(object, propertyArr, reverse) {
    function compare(a, b) {
        var i = 0;
        while (propertyArr[i]) {
            if (a[propertyArr[i]] < b[propertyArr[i]]) return -1;
            if (a[propertyArr[i]] > b[propertyArr[i]]) return 1;
            i++;
        }
        return 0;
    }
    object.sort(compare);
    if (reverse) {
        object.reverse();
    }

    return object;
}

// the call will be like : sortByProps(obj,["prop"],true/false); //true = DESC