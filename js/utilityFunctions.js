export function setStars(count) {
    let output = "";

    if (count > 5) count = 5;
    else if (count < 0) count = 0;

    for (let star = 0; star < count; star++) {
        output += '<i class="fas fa-star"></i>';
    }

    for (let star = 0; star < 5 - count; star++) {
        output += '<i class="far fa-star"></i>';
    }

    return output;
}

export function setTags(product) {
    let output = "";

    for (let i = 0; i < product.tags.length; i++) {
        output += `<span>${product.tags[i]}</span>`;
    }

    return output;
}