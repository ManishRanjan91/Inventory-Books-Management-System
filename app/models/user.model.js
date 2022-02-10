const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: { type: String},
    lastName: { type: String },
    email: { type: String, unique: true, require: true},
    password: { type: String, require: true },
    token: { type: String },
}, {
    timestamps: true
});

module.exports = mongoose.model("user", userSchema);