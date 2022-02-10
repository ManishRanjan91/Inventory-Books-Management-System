const Store = require('../models/store.model.js');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response.util')
const request = require('request');

// Create and Save a new store
exports.create = async (req, res) => {
    // Validate request
    const { storeId, storeName, storeEmail, storeHeader, aboutStore } = req.body;
    if (!(storeId && storeName && storeEmail && storeHeader && aboutStore)) {
        sendErrorResponse(res, 400, false, "All input is required");
    }

    // check if email already exist
    // Validate if email exist in our database
    const isStore = await Store.findOne({ storeId: req.body.storeId });
    const oldEmail = await Store.findOne({ storeEmail });
    if (isStore) {
        sendErrorResponse(res, 404, false, "storeId Already Exist.");
    }

    else if (oldEmail) {
        sendErrorResponse(res, 409, false, "Email Already Exist.");
    }
    else {
        // Create a store
        Store.create(req.body)
            .then(data => {
                sendSuccessResponse(res, 200, true, data)
            }).catch(err => {
                sendErrorResponse(res, 500, false, "Some error occurred while storing the store.");
            });
    }
};

// Retrieve and return all stores from the database.
exports.findAll = (req, res) => {
    Store.
        find().
         populate('books').
        exec().
        then(store => {
            request(process.env.google_book_api, function (error, response, body) {
                body = JSON.parse(body);
                var resultStore = []
                var resultBook = []
                store.forEach((s,i)=>{
                    s.books.forEach(b=>{
                        var bookData = body.items.find(o => o.id == b.bookId)
                        resultBook.push(bookData)
                    })
                    resultStore.push(resultBook);
                })
                console.log(resultBook)
                sendSuccessResponse(res, 200, true, {store,resultStore});
            });
        })
        .catch(err => {
            sendErrorResponse(res, 500, false, "Some error occurred while retrieving stores.");
        });
};

// Find a single store with a storeId
exports.findOne = (req, res) => {
    Store.findOne({ storeId: req.params.storeId }).
         populate('books').
        exec().
        then(store => {
            if (!store) {
                sendErrorResponse(res, 404, false, "store not found with id " + req.params.storeId);
            }
            request(process.env.google_book_api, function (error, response, body) {
                body = JSON.parse(body);
                var books = []
                if (store && body) {
                    const newArr = store.books.map((obj,i) => {
                        if (obj.bookId) {
                            var bookData = body.items.find(o => o.id == obj.bookId)
                          return bookData;
                        }
                      
                        return obj;
                      });
                      books = newArr
                }
                sendSuccessResponse(res, 200, true, {store,books});
            });
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                sendErrorResponse(res, 404, false, "store not found with id " + req.params.storeId);
            }
            sendErrorResponse(res, 500, false, "Error retrieving store with id " + req.params.storeId);
        });
};

// Update a store identified by the storeId in the request
exports.update = (req, res) => {
    // Validate Request
    const { storeName, storeEmail, storeUrl, storeHeader, category, aboutStore } = req.body;

    // Find store and update it with the request body
    Store.findOneAndUpdate({ storeId: req.params.storeId }, {
        storeName,
        storeEmail,
        storeHeader,
        aboutStore
    }, { new: true })
        .then(store => {
            if (!store) {
                sendErrorResponse(res, 404, false, "store not found with id " + req.params.storeId);
            }
            sendErrorResponse(res, 200, true, "Store Updated successful!");
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                sendErrorResponse(res, 404, false, "store not found with id " + req.params.storeId);
            }
            sendErrorResponse(res, 500, false, "Error updating store with id " + req.params.storeId);
        });
};

// Delete a store with the specified storeId in the request
exports.delete = (req, res) => {
    Store.findOneAndRemove({ storeId: req.params.storeId })
        .then(store => {
            if (!store) {
                sendErrorResponse(res, 404, false, "store not found with id " + req.params.storeId);
            }
            sendErrorResponse(res, 200, true, "store deleted successfully!");
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                sendErrorResponse(res, 404, false, "store not found with id " + req.params.storeId);
            }
            sendErrorResponse(res, 500, false, "Could not delete store with id " + req.params.storeId);
        });
};
