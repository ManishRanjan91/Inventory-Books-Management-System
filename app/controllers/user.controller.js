const User = require("../models/user.model.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/response.util')
const userConfig = require('../utils/document.util.js');

exports.register = async (req, res) => {

    // Our register logic starts here
    try {
        // Get user input
        const { firstName, lastName, email, password } = req.body;

        // Validate user input
        if (!(email && password && firstName && lastName)) {
            sendErrorResponse(res, 400, false, "All input is required");
        }

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            sendErrorResponse(res, 409, false, "User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(), // sanitize: convert email to lowercase
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.token_key,
            {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;
        await user.save();

        userConfig.userConfig._id = user._id;
        userConfig.userConfig.firstName = user.firstName;
        userConfig.userConfig.lastName = user.lastName;
        userConfig.userConfig.email = user.email;
        userConfig.userConfig.token = user.token

        // return new user
        sendSuccessResponse(res, 200, true, userConfig.userConfig)
    } catch (err) {
        sendErrorResponse(res, 500, false, "Some error occurred while creating the user.");
    }
    // Our register logic ends here
};

exports.login = async (req, res) => {

    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            sendErrorResponse(res, 400, false, "All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.token_key,
                {
                    expiresIn: "2h",
                }
            );

            // save user token
            user.token = token;
            await user.save();

            userConfig.userConfig._id = user._id;
            userConfig.userConfig.firstName = user.firstName;
            userConfig.userConfig.lastName = user.lastName;
            userConfig.userConfig.email = user.email;
            userConfig.userConfig.token = user.token


            // user
            sendSuccessResponse(res, 200, true, userConfig.userConfig)
        }
        sendErrorResponse(res, 400, false, "Invalid Credentials");
    } catch (err) {
        sendErrorResponse(res, 500, false, "Some error occurred while login the user.");
    }
    // Our register logic ends here
};

