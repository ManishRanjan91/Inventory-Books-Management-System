const Book = require('../models/book.model.js');
const Store = require('../models/store.model.js');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response.util')
const request = require('request');


// Create and Save a new book
exports.create = async (req, res) => {

    // check if book already exist
    const oldBookId = await Book.findOne({ bookId: req.body.bookId, });
    const isStore = await Store.findOne({ storeId: req.body.storeId });

    if (!isStore) {
        sendErrorResponse(res, 404, false, "store not found");
    }

    else if (oldBookId) {
        sendErrorResponse(res, 409, false, "Book Already Exist.");
    }
    else {

        // Save book in the database
        Book.create(req.body)
            .then(data => {
                isStore.books.push(data._id);
                isStore.save();
                sendSuccessResponse(res, 200, true, data)
            }).catch(err => {
                sendErrorResponse(res, 500, false, "Some error occurred while adding the book.");
            });
    }
};

// Retrieve and return all books from the database.
exports.findAll = (req, res) => {
    Book.find()
        .then(books => {
            request(process.env.google_book_api, function (error, response, body) {
                body = JSON.parse(body);
                var result = []
                if (books && body) {
                    books.forEach((a, i) => {
                        var bookData = body.items.find(o => o.id == a.bookId)
                        result.push(bookData)
                    })

                }
                sendSuccessResponse(res, 200, true, result);
            });
        }).catch(err => {
            sendErrorResponse(res, 500, false, "Some error occurred while retrieving books.");
        });
};

// Find a single book with a bookId
exports.findOne = (req, res) => {
    Book.findOne({ bookId: req.params.bookId })
        .then(book => {
            if (!book) {
                sendErrorResponse(res, 404, false, "book not found with id " + req.params.bookId);
            }
            request(`https://www.googleapis.com/books/v1/volumes/${req.params.bookId}`, function (error, response, body) {
                sendSuccessResponse(res, 200, true, JSON.parse(body));
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                sendErrorResponse(res, 404, false, "book not found with id " + req.params.bookId);
            }
            sendErrorResponse(res, 500, false, "Error retrieving book with id " + req.params.bookId);
        });
};

// Update a book identified by the bookId in the request
exports.update = (req, res) => {
    // Validate Request
    const {
        bookAuthor,
        isbn,
        bookPrice,
        availableBooks
    } = req.body;

    // Find book and update it with the request body
    Book.findOneAndUpdate({ bookId: req.params.bookId }, {
        bookAuthor,
        bookEdition,
        bookPrice,
        availableBooks
    }, { new: true })
        .then(book => {
            if (!book) {
                sendErrorResponse(res, 404, false, "book not found with id " + req.params.bookId);
            }
            sendErrorResponse(res, 200, true, "book updated successful");
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                sendErrorResponse(res, 404, false, "book not found with id " + req.params.bookId);
            }
            sendErrorResponse(res, 500, false, "Error updating book with id " + req.params.bookId);
        });
};

// Delete a book with the specified bookId in the request
exports.delete = (req, res) => {
    Book.findOneAndRemove({ bookId: req.params.bookId })
        .then(book => {
            if (!book) {
                sendErrorResponse(res, 404, false, "book not found with id " + req.params.bookId);
            }
            sendErrorResponse(res, 200, true, "book deleted successfully!");
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                sendErrorResponse(res, 404, false, "book not found with id " + req.params.bookId);
            }
            sendErrorResponse(res, 500, false, "book not delete book with id " + req.params.bookId);
        });
};