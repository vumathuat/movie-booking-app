'use strict';
const jwt = require('jsonwebtoken');
const validator = require("email-validator");
require("dotenv").config();

function getAccessToken(id, timeout) {
    const token = jwt.sign(id, process.env.ACCESS_TOKEN_SECRET, { expiresIn: timeout });
    return token;
};

//create refesh token 
function getRefreshToken(id, timeout) {
    const token = jwt.sign(id, process.env.REFRESH_TOKEN_SECRET, { expiresIn: timeout });
    return token;
};

//check for cookie function
function tokenExist(req, res, next) {
    if (!req.cookies['tokens']) {
        res.status(400).json({ data: '', message: 'Missing tokens!' });
    } else {
        next();
    }
}

//token validation function
function validateToken(req, res, next) {
    const access_token = JSON.parse(req.cookies['tokens']).access_token; //get the access token from the header

    if (!access_token) {
        res.status(400).json({ data: '', message: 'Missing access token!' });
        return next();
    }

    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            res.status(401).json({ data: '', message: 'Invalid access token!' });
        } else {
            req.user = user; //generate user json object 
            //the keys are {user_id: 'User id', iat: 'Create date', exp: 'Expire date'}
            next(); //continue the calling funciton
        }
    })
}

//validate admin privilege
function validateAdmin(req, res, next) {
    const user_id = req.user.user_id;

    if (user_id != process.env.ADMIN_ID) {
        res.status(403).json({ data: '', message: 'Wrong crdential!' });
    } else {
        next();
    }
}

//validate input field
function validateFields(req, res, next) {
    const pattern = /[^a-z0-9]/i;

    if (process.env.PRODUCTION === 'false') { //check only for produciton environment
        if (req.body.username && req.body.username.length < 8) { //check username length
            res.status(400).json({ data: '', message: 'Username need to be 8 or more characters!' });
        } else {
            if (req.body.username && req.body.username.match(pattern)) { //check for special character
                res.status(400).json({ data: '', message: 'Username can not contain special character!' });
            } else {
                if (req.body.password && req.body.password.length < 8) { // check password length
                    res.status(400).json({ data: '', message: 'Password need to be 8 or more characters!' });
                } else {
                    if (req.body.email && !validator.validate(req.body.email)) { //validate email
                        res.status(400).json({ data: '', message: 'Email invalid!' });
                    } else {
                        next();
                    }
                }
            }
        }
    }
}


module.exports = {
    getAccessToken,
    getRefreshToken,
    tokenExist,
    validateToken,
    validateAdmin,
    validateFields
};
