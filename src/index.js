// write your code here
const cardSection = document.querySelector('.image-container')
const state = {
    images: [],
    comments: []

}

function createCard(item) {
    // cardSection.innerHTML = ''
    const imageCard = document.createElement('article');
    imageCard.setAttribute('class', 'image-card');

    const titleOfImage = document.createElement('h2');
    titleOfImage.setAttribute('class', 'title');
    titleOfImage.textContent = item["title"];

    const deletePost = document.createElement('button');
    deletePost.setAttribute('class', 'delete-button');
    deletePost.textContent = 'Delete Post';

    deletePost.addEventListener('click', function () {
        state.images = state.images.filter(function (img) {
            return img.id !== item.id;
        })
        deleteImageFromServer(item.id);
        render();
    })

    titleOfImage.append(deletePost);

    const imageEl = document.createElement('img');
    imageEl.setAttribute('class', 'image');
    imageEl.setAttribute('src', item["image"]);

    const likesSection = document.createElement('div');
    likesSection.setAttribute('class', 'likes-section');

    const likes = document.createElement('span');
    likes.setAttribute('class', 'likes');
    if (item.likes > 1) {
        likes.textContent = item["likes"] + " likes";
    } else {
        likes.textContent = item["likes"] + " like";
    }


    const likeBtn = document.createElement('button');
    likeBtn.setAttribute('class', 'like-button');
    likeBtn.textContent = '♥';

    likeBtn.addEventListener('click', function () {
        item.likes++;
        updateImage(item);
        render();
    })

    likesSection.append(likes, likeBtn);

    const comments = document.createElement('ul');
    comments.setAttribute('class', 'comments')

    const matchedComments = state.comments.filter(function (element) {
        return element["imageId"] === item.id;
    })
    for (const comment of matchedComments) {

        const commentElement = document.createElement('li');
        commentElement.setAttribute('class', 'comment');
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('class', 'delete-button');

        deleteBtn.addEventListener('click', function () {
            state.comments = state.comments.filter(function (c) {
                return c.id !== comment.id;
            })
            deleteCommentFromServer(comment.id);
            render();
        })

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.setAttribute('class', 'edit-button');

        commentElement.textContent = comment["content"];
        commentElement.append(editBtn, deleteBtn);

        comments.append(commentElement);
    }

    const commentForm = document.createElement('form');
    commentForm.setAttribute('class', 'comment-form');

    const commentInput = document.createElement('input');
    commentInput.setAttribute('class', 'comment-input');
    commentInput.setAttribute('placeholder', 'Add a comment..');

    const commentBtn = document.createElement('button');
    commentBtn.setAttribute('class', 'comment-button');
    commentBtn.textContent = 'Post';

    commentForm.append(commentInput, commentBtn);

    commentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const commentContent = commentInput.value;
        // state.comments.push({ "content": commentContent, "imageId": item.id })
        const newComment = addNewCommentToTheServer(commentContent, item.id).then((object) => {
            state.comments.push(object)
            render()
        });
        commentInput.value = '';


    })

    imageCard.append(titleOfImage, imageEl, likesSection, comments, commentForm);
    cardSection.append(imageCard);
}


function createNewForm() {
    const container = document.createElement('article');
    container.setAttribute('class', 'new-post-article');

    const title = document.createElement('h1');
    title.setAttribute('class', 'new-post-title');
    title.textContent = 'New Post';

    const formEl = document.createElement('form');

    const titleInput = document.createElement('input');
    titleInput.setAttribute('class', 'title-input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('placeholder', 'Add a title..');

    const urlInput = document.createElement('input');
    urlInput.setAttribute('class', 'url-input');
    urlInput.setAttribute('type', 'url');
    urlInput.setAttribute('placeholder', 'Add an image url..');

    const submitBtn = document.createElement('button');
    submitBtn.setAttribute('class', 'submit-btn');
    submitBtn.textContent = 'Post';

    formEl.append(titleInput, urlInput, submitBtn);
    formEl.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = titleInput.value;
        const url = urlInput.value;

        const newImageObject = addNewImageToTheServer(title, url);
        newImageObject.then((object) => {
            state.images.unshift(object)
            render()
        })
        titleInput.value = ''
        urlInput.value = ''
        // render()
    })

    container.append(title, formEl);
    cardSection.prepend(container);
}

function renderNewFormCard() {

    createNewForm();
}

function renderCard() {
    for (const data of state.images) {
        createCard(data);
    }

}
function render() {
    cardSection.innerHTML = '';
    renderCard();
    renderNewFormCard();
}

function getComments() {
    return fetch('http://localhost:3000/comments').then((response) => response.json())
}

getComments().then((comment) => {
    state.comments = comment;
    render();
});

function getImages() {
    return fetch('http://localhost:3000/images').then((response) => response.json())

}

getImages().then(function (image) {
    state.images = image;
    render();
});

function addNewCommentToTheServer(content, imageId) {
    return fetch('http://localhost:3000/comments', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "content": content, "imageId": imageId })
    }).then(res => res.json())
}
function addNewImageToTheServer(title, url) {
    return fetch('http://localhost:3000/images', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ "title": title, "likes": 2, "image": url })
    }).then((res) => res.json())
}

function updateComments(comment) {
    fetch(`http://localhost:3000/comments/${comment.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(comment)
    })
}
function updateImage(image) {
    fetch(`http://localhost:3000/images/${image.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(image)
    })
}
function deleteCommentFromServer(id) {
    fetch(`http://localhost:3000/comments/${id}`, {
        method: 'DELETE'
    })
}
function deleteImageFromServer(id) {
    fetch(`http://localhost:3000/images/${id}`, {
        method: 'DELETE'
    })
}
render();