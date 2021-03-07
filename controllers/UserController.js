const UserModel = require('../models/UserModel');
const bcrypt = require("bcrypt");

const SALT_ITERATIONS = 10;

/**
 * @deprecated For debug purposes
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const getAllUsers = async (request, response) => {
    await UserModel.find({}, (error, users) => {
        if (error) {
            return response.status(400).json({
                success: false,
                error: error
            });
        }

        if (!users.length) {
            return response.status(404).json({
                success: false,
                error: "No users found"
            });
        }

        return response.status(200).json({
            success: true,
            data: users.map((user) => {
                return {
                    id: user._id,
                    username: user.username
                };
            })
        });
    });
};

/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @returns 
 */
const createUser = async (request, response) => {
    const body = request.body;
    if (!body) {
        return response.status(400).json({
            success: false,
            error: "User object invalid"
        });
    }

    try {
        let existingUser = await UserModel.findOne({ username: body.username });
        if (existingUser !== null) {
            return response.status(400).json({
                success: false,
                message: "Username already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(request.body.password, SALT_ITERATIONS);
        const user = new UserModel({
            username: request.body.username,
            password: hashedPassword
        });

        user.save().then(() => {
                return response.status(201).json({
                    success: true,
                    id: user._id,
                    message: "User created"
                });
            }).catch(error => {
                return response.status(400).json({
                    error,
                    success: false,
                    message: "User could not be created"
                });
            });
    } catch (e) {
        return response.status(500).json({
            success: false,
            error: e
        });
    }
};

/**
 * 
 * @param {*} request 
 * @param {*} response 
 */
const authorizeUser = async (request, response) => {
    const body = request.body;
    if (!body) {
        return response.status(400).json({
            success: false,
            error: "User object invalid"
        });
    }

    const user = await UserModel.findOne({ username: request.body.username });
    if (user == null) {
        return response.status(400).json({
            success: false,
            error: "User could not be found"
        });
    }

    try {
        if (await bcrypt.compare(request.body.password, user.password)) {
            return response.status(201).json({
                success: true,
                message: "User authenticated"
            }); 
        } else {
            return response.status(400).send("Password incorrect");
        }
    } catch {
        response.status(500).send();
    }
};

module.exports = {
    getAllUsers,
    createUser,
    authorizeUser
};