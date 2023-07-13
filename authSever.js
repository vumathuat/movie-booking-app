'use strict';
require("dotenv").config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const uuid = require('uuid');
const cookieParser = require('cookie-parser');
const validator = require("email-validator");
const db_conn = require('./db_connect');
const getToken = require('./getToken');

const app = express();
app.use(express.json());
app.use(cookieParser());

//user register function
app.post('/register', getToken.validateFields, async (req, res, next) => { //parameter (username,password,email,phone_no); format json
    const obj_keys = Object.keys(req.body);
    for (let i = 0; i < obj_keys.length; i++) { //check for null value
        if (!req.body[obj_keys[i]]) {
            res.status(400).send('Empty fields!');
            return next();
        }
    }

    //check request body json length
    switch (obj_keys.length) {
        case 4:
            const user_id = uuid.v4();
            const username = req.body.username;
            const password = await bcrypt.hash(req.body.password, 10);
            const email = req.body.email;
            const phone_no = req.body.phone_no;
            const status = 1;

            //get a connection from the Pool
            db_conn.pool.getConnection(async (err, conn) => {
                if (err) throw (err.message)

                const sql_search = 'SELECT * FROM Users where username = ? or email = ? or phone_no = ?';
                const user_search_query = mysql.format(sql_search, [username, email, phone_no]);

                //check for user with duplicate username
                await conn.query(user_search_query, async (err, result) => {
                    if (err) throw (err.message)

                    switch (result.length) {
                        case 0:
                            //preparing insert statement
                            const sql_insert = 'INSERT INTO Users VALUES (?,?,?,?,?,?)';
                            const user_insert_query = mysql.format(sql_insert, [user_id, username, password, email, phone_no, status]);

                            //execute the insert statement 
                            await conn.query(user_insert_query, async (err) => {
                                conn.release();
                                if (err) throw (err.message)
                                res.status(200).send('User created successful!');
                            })
                            break;
                        default:
                            conn.release();
                            res.status(400).send('Duplicate values!');
                    }
                });
            });
            break;
        default:
            res.status(400).send('Missing fields!');
    }
});

//login function
app.post('/login', async (req, res, next) => { //parameters (username, password), format json
    if (req.cookies['tokens']) {
        res.status(400).send('Already logged in!');
        return next();
    }

    if (!req.body.username) {
        res.status(400).send('Missing username!');
        return next();
    }

    if (!req.body.password) {
        res.status(400).send('Missing password!')
    }
    
    const username = req.body.username;
    const password = req.body.password;
    var sql_search = 'SELECT password, user_id, status FROM Users where '

    db_conn.pool.getConnection(async (err, conn) => {
        if (err) throw (err.message)

        if (validator.validate(username)) {
            sql_search += 'email = ? AND NOT username = "admin"';
        } else {
            sql_search += 'username = ?';
        }
        const password_search_query = mysql.format(sql_search, [username]);

        await conn.query(password_search_query, async (err, result) => {
            conn.release();
            if (err) throw (err.message)

            switch (result.length) {
                case 1:
                    if (result[0].status == 0) { //check account status
                        res.status(403).send('Account locked!');
                        return next();
                    }

                    if (await bcrypt.compare(password, result[0].password)) {
                        const access_token = await getToken.getAccessToken({ user_id: result[0].user_id }, '1h'); //create new access token
                        const refresh_token = await getToken.getRefreshToken({ user_id: result[0].user_id }, '1d'); //create new refresh token

                        //res.status(200).json({ access_token: access_token, refresh_token: refresh_token }); for debug purposes
                        res.status(200)
                            .cookie('tokens', JSON.stringify({ access_token: access_token, refresh_token: refresh_token }), { httpOnly: true, sameSite: 'strict', secure: false })
                            .send('Login successful!'); //httpOnly only for development environment, use secure (https cookie) for production environment
                    } else {
                        res.status(401).send('Wrong password!');
                        return next();
                    }
                    break;
                default:
                    res.status(404).send('Wrong username!');
            }
        })
    })
});

//logout function
app.delete('/logout', getToken.tokenExist, (req, res, next) => { //parameters (refresh_token), format json
    res.status(200).clearCookie('tokens').send('Logged out!');
});

//renew login session function
app.post('/renewToken', getToken.tokenExist, async (req, res) => {
    const refresh_token = JSON.parse(req.cookies['tokens']).refresh_token;

    if (!refresh_token) {
        res.status(400).send('Missing refresh token!');
        return next();
    }

    await jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.status(401).send('Invalid refresh token!');
            return next();
        }

        const access_token = await getToken.getAccessToken({ user_id: user.user_id }, '1h'); //create new access token
        res.status(200)
            .cookie('tokens', JSON.stringify({ access_token: access_token, refresh_token: refresh_token }), { httpOnly: true, sameSite: 'strict', secure: false })
            .send('Access token refreshed!');
    })
});

app.listen(process.env.AUTH_SERVER_PORT, () => console.log('Authenthication server online!'))

