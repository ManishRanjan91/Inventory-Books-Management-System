module.exports = (app) => {
    const books = require('../controllers/book.controller.js');
    const auth = require("../middleware/auth.js");

    // Create a new book
    app.post('/api/books', auth, books.create);

    // Retrieve all books
    app.get('/api/books', auth, books.findAll);

    // Retrieve a single book with bookId
    app.get('/api/books/:bookId', auth, books.findOne);

    // Update a book with bookId
    app.patch('/api/books/:bookId', auth, books.update);

    // Delete a book with bookId
    app.delete('/api/books/:bookId', auth, books.delete);
}
