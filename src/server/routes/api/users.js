const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

/**
 * Helper function for getting expiry date
 * @returns date one month from now
 */
const getExpiryDate = () => {
    let date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
};

// Default auth cookie options
const cookieName = "auth";
const cookieOpt = {
    sameSite: 'strict',
    path: '/',
    expires: getExpiryDate(), // one month from now
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
    secure: true 
};

/**
 * Creates a jwt token with payload
 * @param {object} payload - payload of token that contains username only
 * @returns {string} jwt token
 */
const createToken = (payload) => (
    // Sign token
    jwt.sign(
        payload,
        keys.secretOrKey,
        {
            expiresIn: "30d"
        }
    )
);

/**
 * Return jwt token verification result
 * @param {string} rawToken - Raw token received from client
 * @returns {string} decoded form of the original token, of the format:
 *      decoded = {
 *          "success": boolean,
 *          "username": string,
 *          "iat": int (UTC),
 *          "exp": int (UTC)
 *      }
 */
const verifyToken = (token) => {
    let decoded = { success: false };
    // Verify token
    try {
        decoded = jwt.verify(
            token,
            keys.secretOrKey,
            {
                maxAge: "30d"
            }
        );
    } catch (err) {
        return decoded;
    }

    return {
        success: true,
        ...decoded
    }
}

/**
 * Get user info for user of the username specified in jwt token, rawToken
 * @param {string} rawToken - original jwt token
 * @param {boolean} firstName - true iff first name should be included
 * @param {boolean} lastName - true iff last name should be included
 * @param {boolean} email - true iff email name should be included
 */
const getUserInfo = (rawToken, firstName = false, lastName = false, email = false) => {
    return new Promise(async function(resolve, reject) {
        try {
            const decoded = verifyToken(rawToken) || { success: false }
            // If token is valid, return success status and username of account
            if (decoded.success === true && typeof decoded.username === "string") {
                User.findOne({ username: decoded.username }).then(user => {
                    if (user) {
                        let result = {
                            success: true,
                            username: user.username
                        }
                        if (firstName === true) result.firstName = user.firstName;
                        if (lastName === true) result.lastName = user.lastName;
                        if (email === true) result.email = user.email;
                        resolve(result);
                    } else {
                        resolve({ success: false });
                    }
                })
            } else {
                resolve({ success: false });
            }
        } catch (err) {
            // Return success status as false on bad token
            reject("getUserInfo encountered an error: " + err);
        }
    });
};

/**
 * Route handler for POST api/users/register;
 * Registers User to database
 * @returns response that reports operation success status,
 *          errors in case of invalid inputs,
 *      
 */
router.post("/register", (req, res) => {
    // Form validation
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if (!isValid) {
        return res
            .clearCookie(cookieName)
            .json({
                success: false,
                errors
            });
    }

    User.findOne({ username: req.body.username }).then(user => {
        // Return output
        if (user) {
            return res
                .clearCookie(cookieName)
                .json({
                    success: false,
                    errors: {
                        username: "Username already exists" 
                    }
                });
        } else {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
        });

        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res
                        .cookie(cookieName, createToken({ username: user.username }), cookieOpt)
                        .json({ 
                            success: true,
                            username: newUser.username,
                            firstName: newUser.firstName
                        })
                    )
                    .catch(err => console.log(err));
                });
            });
        }
    });
});

/**
 * Route handler for POST api/users/login
 * For login use; returns JWT token
 */
router.post("/login", (req, res) => {
    // Form validation
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if (!isValid) {
        return res.json(errors);
    }

    const username = req.body.username;
    const password = req.body.password;

    // Find user by username
    User.findOne({ username }).then(user => {
        // Check if user exists
        if (!user) {
            // User does not exist
            return res.json({ 
                success: false,
                error: "Error"
            });
        }

        // Check password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User matched
                return res
                    .cookie(cookieName, createToken({ username: user.username }), cookieOpt)
                    .json({
                        success: true,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName
                    });
            } else {
                // Wrong password
                return res
                    .clearCookie(cookieName)    
                    .json({ 
                        success: false,
                        error: "Error" 
                    });
            }
        });
    });
});

/**
 * Route handler for POST api/users/logout
 * For logout use.
 */
router.post("/logout", (_, res) => {
    return res
        .clearCookie(cookieName)
        .json({
            success: true
        });
});

/**
 * Route handler for POST api/users/verify
 * Logged in status verfication use
 * @returns object with the property "success" (boolean)
 *          with added property of "username" (string) on success
 */
router.post("/verify", (req, res) => {
    getUserInfo(req.cookies[cookieName], true, true)
        .then((result) => {
            if (result.success === true) {
                // Successful validation
                return res.json(result);
            } else {
                // Invalid jwt
                return res
                    .clearCookie(cookieName)
                    .json(result);
            }
        })
        .catch((err) => {
            return res
                .clearCookie(cookieName)
                .json({
                    success: false
                });
        });
});

/**
 * Router handler for GET api/users/userinfo
 * Allow logged in users to fetch their account info
 * @returns object with property "success" (boolean)
 *      and user info on success
 */
router.post("/userinfo", (req, res) => {
    getUserInfo(req.body.token, true, true, true)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.json({
                success: false
            });
        });
});

module.exports = router;