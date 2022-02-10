const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    bookId: { type: String, require: true },
    bookName: { type: String, require: true },
    bookAuthor: { type: String, require: true },
    isbn: { type: String, require: true },
    bookPrice: { type: String, require: true },
    availableBooks: { type: String, require: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('book', bookSchema);
