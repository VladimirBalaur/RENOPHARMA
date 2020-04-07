import { setStars } from "../utilityFunctions.js";

export class Comment {
    constructor(name, email, rating, content, dateCreated) {
        this.name = String(name).trim();
        this.email = String(email).trim();
        this.rating = parseInt(rating);
        this.content = String(content).trim();
        this.date = dateCreated;
    }

    static appendCommentToContainer(targetElement, commentObj) {
        targetElement.innerHTML += ` <div data-index="${
      commentObj.index
    }" class="comment-container">
        <div class="image"></div>
        <div class="comment-content">
            <div class="comment-header">
                <div class="rating">
                   ${setStars(commentObj.rating)}
                </div>
                <div class="date">${commentObj.date}</div>
            </div>
            <div class="main-content">
                <h1 class="username">${commentObj.name}</h1>
                <p>
                   ${commentObj.content}
                </p>
            </div>
        </div>
    </div>`;
    }

    static removeAllComments(targetElement) {
        targetElement.innerHTML = "";
    }

    static removeCommentByIndex(targetElement, index) {
        targetElement.removeChild(targetElement.childNodes[index]);
    }
}