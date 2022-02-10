const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    storeId: { type: String, require: true },
    storeName: { type: String, require: true },
    storeEmail: { type: String, require: true },
    storeHeader: { type: String, require: true },
    aboutStore: { type: String, require: true },
    books:[{ type: mongoose.Schema.Types.ObjectId, ref: "book" }]
}, {
    timestamps: true
});

module.exports = mongoose.model('store', storeSchema);
