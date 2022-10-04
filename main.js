const books = [];
const RENDER_EVENT = 'render-book'
const SAVEDBOOK_KEY = 'saved-book'
const STORAGEBOOK_KEY = 'BOOKSHELF_APPS'

function addBook() {
    const inputBookTitle = document.getElementById("inputBookTitle").value;
    const inputBookAuthor = document.getElementById("inputBookAuthor").value;
    const inputBookYear = document.getElementById("inputBookYear").value;
    const inputBookIsComplete = document.getElementById("inputBookIsComplete").checked;

    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBookData();
}


function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    };
}

function saveBookData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGEBOOK_KEY, parsed);
        document.dispatchEvent(new Event(SAVEDBOOK_KEY));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }

    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGEBOOK_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
    const bookTitle = document.createElement("h2");
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = bookObject.author;

    const bookYear = document.createElement("p");
    bookYear.innerText = bookObject.year;

    const bookContainer = document.createElement("article");
    bookContainer.classList.add("book_item");
    bookContainer.append(bookTitle, bookAuthor, bookYear,);
    bookContainer.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {

        const uncompleteBook = document.createElement("button");
        uncompleteBook.innerText = "Belum Selesai dibaca";
        uncompleteBook.classList.add("green");
        uncompleteBook.setAttribute('id', `button-${bookObject.id}`);
        uncompleteBook.addEventListener("click", function () {
            addBookToCompleted(bookObject.id);
        });

        const removeBook = document.createElement("button");
        removeBook.innerText = "Hapus buku";
        removeBook.classList.add("red");
        removeBook.setAttribute('id', `button-${bookObject.id}`);
        removeBook.addEventListener("click", function () {
            removeReadBook(bookObject.id);

        });

        const bookAction = document.createElement("div");
        bookAction.classList.add("action");
        bookAction.append(uncompleteBook, removeBook);
        bookContainer.setAttribute('id', `button-${bookObject.id}`);

        bookContainer.append(bookAction);
    } else {

        const completeBook = document.createElement("button");
        completeBook.classList.add("green");
        completeBook.innerText = "Selesai dibaca";
        completeBook.setAttribute('id', `button-${bookObject.id}`);
        completeBook.addEventListener("click", function () {
            addBookToUncompleted(bookObject.id);
        });

        const removeBook = document.createElement("button");
        removeBook.classList.add("red");
        removeBook.innerText = "Hapus buku";
        removeBook.setAttribute('id', `button-${bookObject.id}`);
        removeBook.addEventListener("click", function () {
            removeReadBook(bookObject.id);
        });

        const bookAction = document.createElement("div");
        bookAction.classList.add("action");
        bookAction.append(completeBook, removeBook);
        bookAction.setAttribute('id', `book-${bookObject.id}`);


        bookContainer.append(bookAction);
    }
    return bookContainer;
}

function addBookToUncompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}

function removeReadBook(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBookData();
}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));

    saveBookData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id == bookId) {
            return index;
        }
    }
    return -1;
}

document.addEventListener("DOMContentLoaded", function () {
    const inputBook = document.getElementById("inputBook");
    inputBook.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVEDBOOK_KEY, function () {
    console.log(localStorage.getItem(STORAGEBOOK_KEY));
});

document.addEventListener(RENDER_EVENT, function () {

    const uncompletedBOOKList = document.getElementById("incompleteBookshelfList");
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById("completeBookshelfList");
    completedBOOKList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completedBOOKList.append(bookElement);
        }
    }
});
