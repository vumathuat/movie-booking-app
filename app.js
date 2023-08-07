'use strict';
require("dotenv").config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const validator = require("email-validator");
const uuid = require('uuid');
const https = require('https');
const crypto = require('crypto');
const db_conn = require('./db_connect');
const getToken = require('./getToken');
var cors = require('cors');
const { error } = require('console');
const { ALL } = require('dns');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//test function
app.get('/test', (req, res) => {
    res.status(200).json({ data: '', message: 'Working!' });
});

//user register function
app.post('/register', getToken.validateFields, async (req, res, next) => { //parameter (username,password,email,phone_no); format json
    const obj_keys = Object.keys(req.body);
    for (let i = 0; i < obj_keys.length; i++) { //check for null value
        if (!req.body[obj_keys[i]]) {
            res.status(400).json({ data: '', message: 'Empty fields!' });
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
                            const sql_insert = 'INSERT INTO Users VALUES (?,?,?,?,?,ADDDATE(NOW(), INTERVAL -10 DAY),?)';
                            const user_insert_query = mysql.format(sql_insert, [user_id, username, password, email, phone_no, status]);

                            //execute the insert statement 
                            await conn.query(user_insert_query, async (err) => {
                                conn.release();
                                if (err) throw (err.message)
                                res.status(200).json({ data: '', message: 'User created successful!' });
                            })
                            break;
                        default:
                            conn.release();
                            res.status(400).json({ data: '', message: 'Duplicate values!' });
                    }
                });
            });
            break;
        default:
            res.status(400).json({ data: '', message: 'Missing fields!' });
    }
});

//login function
app.post('/login', async (req, res, next) => { //parameters (username, password), format json
    if (req.cookies['tokens']) {
        res.status(400).json({ data: '', message: 'Already logged in!' });
        return next();
    }

    const username = req.body.username;
    const password = req.body.password;
    var sql_search = 'SELECT password, user_id, status FROM Users where ';
    if (!username) {
        res.status(400).json({ data: '', message: 'Missing username!' });
        return next();
    }

    if (!password) {
        res.status(400).json({ data: '', message: 'Missing password!' });
    }

    db_conn.pool.getConnection(async (err, conn) => {
        if (err) throw (err.message)

        if (validator.validate(username)) {
            sql_search += 'email = ?';
        } else {
            sql_search += 'username = ?';
        }
        if (process.env.PRODUCTION == 'true') {
            sql_search += ' AND NOT username = "admin"';
        }
        const password_search_query = mysql.format(sql_search, [username]);

        await conn.query(password_search_query, async (err, result) => {
            conn.release();
            if (err) throw (err.message)

            switch (result.length) {
                case 1:
                    if (result[0].status == 0) { //check account status
                        res.status(403).json({ data: '', message: 'Account locked!' });
                        return next();
                    }

                    if (await bcrypt.compare(password, result[0].password)) {
                        const access_token = await getToken.getAccessToken({ user_id: result[0].user_id }, '1h'); //create new access token
                        const refresh_token = await getToken.getRefreshToken({ user_id: result[0].user_id }, '1d'); //create new refresh token

                        //res.status(200).json({ access_token: access_token, refresh_token: refresh_token }); for debug purposes
                        res.status(200)
                            .cookie('tokens', JSON.stringify({ "access_token": access_token, "refresh_token": refresh_token }), { httpOnly: true, sameSite: 'strict', secure: false })
                            .json({ data: '', message: 'Login successful!' }).end(); //httpOnly only for development environment, use secure (https cookie) for production environment
                    } else {
                        res.status(401).json({ data: '', message: 'Wrong password!' });
                        return next();
                    }
                    break;
                default:
                    res.status(404).json({ data: '', message: 'Wrong username!' });
            }
        })
    })
});

//logout function
app.delete('/logout', getToken.tokenExist, (req, res, next) => { //parameters (refresh_token), format json
    res.status(200).clearCookie('tokens').json({ data: '', message: 'Logged out!' });
});

//renew login session function
app.post('/renewToken', getToken.tokenExist, async (req, res) => {
    const refresh_token = JSON.parse(req.cookies['tokens']).refresh_token;

    if (!refresh_token) {
        res.status(400).json({ data: '', message: 'Missing refresh token!' });
        return next();
    }

    await jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.status(401).json({ data: '', message: 'Invalid refresh token!' });
            return next();
        }

        const access_token = await getToken.getAccessToken({ user_id: user.user_id }, '1h'); //create new access token
        res.status(200)
            .cookie('tokens', JSON.stringify({ access_token: access_token, refresh_token: refresh_token }), { httpOnly: true, sameSite: 'strict', secure: false })
            .json({ data: '', message: 'Access token refreshed!' });
    })
});

//get login user information
app.get('/account', getToken.tokenExist, getToken.validateToken, async (req, res) => { //no parameters
    const user_id = req.user.user_id;
    const sql_search = 'SELECT username, phone_no, email FROM Users where user_id = ?';
    const getUser_query = mysql.format(sql_search, [user_id]);

    db_conn.pool.getConnection(async (err, conn) => {
        if (err) throw (err.message)

        await conn.query(getUser_query, (err, result) => {
            conn.release();
            if (err) throw (err)

            res.status(200).json(result);
        })
    })
});

//update user information
app.post('/update_user', getToken.tokenExist, getToken.validateToken, getToken.validateFields, async (req, res, next) => { //only send updating field if password then also need to include old_password (send password first)
    const user_id = req.user.user_id;
    const update_fields = Object.keys(req.body);
    const allow_fields = ['username', 'email', 'phone_no', 'password'];

    if (update_fields.length < 1) {
        res.status(400).json({ data: '', message: 'Empty request!' });
        return next();
    }

    for (let i = 0; i < update_fields.length; i++) { //check for null value
        if (!req.body[update_fields[i]]) {
            res.status(400).json({ data: '', message: 'Empty fields!' });
            return next();
        }
    }

    if (!allow_fields.includes(update_fields[0])) {
        res.status(400).json({ data: '', message: 'Unknown field!' });
        return next();
    }

    if (update_fields.includes('password') && update_fields.includes('old_password') && update_fields.length == 2) { //check for password
        const sql_search = 'SELECT password FROM Users where user_id = ?';
        const password_search_query = mysql.format(sql_search, [user_id]);

        await db_conn.pool.getConnection(async (err, conn) => {
            await conn.query(password_search_query, async (err, result) => {
                if (err) throw (err)

                if (await bcrypt.compare(req.body.old_password, result[0].password)) {

                    const sql_update = 'UPDATE Users SET ' + update_fields[0] + ' =? where user_id = ?';
                    const updateUser_query = mysql.format(sql_update, [await bcrypt.hash(req.body[update_fields[0]], 10), user_id]);

                    await conn.query(updateUser_query, async (err) => {
                        conn.release();

                        if (err) throw (err)

                        res.status(200).json({ data: '', message: 'User information updated!' });
                    })
                } else {
                    conn.release();
                    res.status(401).json({ data: '', message: 'Wrong old passowrd!' });
                }
            })
        })
    } else {
        if (update_fields.length != 1) {
            res.status(400).json({ data: '', message: 'Invalid number of fields!' });
            return next();
        }
        const sql_search = 'SELECT * FROM Users where ' + update_fields[0] + ' = ?';
        const user_search_query = mysql.format(sql_search, req.body[update_fields[0]]);
        await db_conn.pool.getConnection(async (err, conn) => {
            await conn.query(user_search_query, async (err, result) => {
                if (err) throw (err)

                switch (result.length) {
                    case 0:
                        //preparing update statement
                        const sql_update = 'UPDATE Users SET ' + update_fields[0] + ' =? where user_id = ?';
                        const updateUser_query = mysql.format(sql_update, [req.body[update_fields[0]], user_id]);

                        //execute the update statement 
                        await conn.query(updateUser_query, async (err) => {
                            conn.release();
                            if (err) throw (err.message)
                            res.status(200).json({ data: '', message: 'User information updated!' });
                        })
                        break;
                    default:
                        conn.release();
                        res.status(400).json({ data: '', message: 'Duplicate values!' });
                }
            })
        })
    }
});

// admin function deactivate/activate user
app.post('/changeUserStatus', getToken.tokenExist, getToken.validateToken, getToken.validateAdmin, async (req, res, next) => {
    const user_id = req.body.user_id;
    const status = req.body.status;

    if (!user_id || !status) {
        res.status(400).send('Missing input fields!');
        return next();
    }

    const sql_update = 'UPDATE Users SET status = ? where user_id = ?';
    const changeStatus_query = mysql.format(sql_update, [status, user_id]);

    db_conn.pool.getConnection(async (err, conn) => {
        await conn.query(changeStatus_query, (err) => {
            if (err) throw (err.message)

            if (status == 1) {
                res.status(200).json({ data: '', message: 'User activated!' });
                return next();
            }

            res.status(200).json({ data: '', message: 'User deactivated!' });
        })
    })
});

//admin function see all users
app.get('/manageUsers', getToken.tokenExist, getToken.validateToken, getToken.validateAdmin, async (req, res) => {
    let page = 1;
    if (typeof req.body.page != "undefined" && Number.isInteger(req.body.page)) {
        page = req.body.page;
    }
    const user_id = process.env.ADMIN_ID;
    const end = page * 10;
    const begin = end - 9;

    const sql_search = 'WITH Paging AS ( SELECT *, ROW_NUMBER() OVER (ORDER BY username) AS RowNum FROM Users WHERE NOT user_id = ?) SELECT * FROM Paging WHERE RowNum BETWEEN ? AND ?';
    const user_query = mysql.format(sql_search, [user_id, begin, end]);

    db_conn.pool.getConnection(async (err, conn) => {
        await conn.query(user_query, (err, result) => {
            if (err) throw (err.message)

            res.status(200).json(result);
        })
    })
});

//search film list
app.get('/search_films', async (req, res) => {//paramter: page, search, (array) genre, date(YYYY-mm-dd), time
    let page = 1;
    if (typeof req.body.page != "undefined" && Number.isInteger(req.body.page)) {
        page = req.body.page;
    }
    const end = page * 8;
    const begin = end - 7;
    let params = [];

    let sql_search = 'WITH Paging AS ( SELECT m.movie_id, m.title, m.director, m.cast, m.description, DATE_FORMAT(m.release_date, "%Y-%m-%d") AS release_date, m.duration, m.poster, ROW_NUMBER() OVER (ORDER BY movie_id) AS RowNum FROM Movie m INNER JOIN Screening s ON m.movie_id=s.movie_id';
    if (typeof req.body.search != "undefined") {
        sql_search += ' WHERE m.title REGEXP ?';
        const search = '^' + req.body.search;
        params.push(search);
    }
    if (typeof req.body.date != "undefined" && typeof req.body.time != "undefined") {
        if (!sql_search.match(/where/i)) {
            sql_search += ' WHERE';
        } else {
            sql_search += ' AND';
        }
        sql_search += ' DATE_FORMAT(s.time_start, "%Y-%m-%d") = ? AND DATE_FORMAT(s.time_start, "%H:%i") > ?';
        params.push(req.body.date, req.body.time);
    }
    if (typeof req.body.genre != "undefined") {
        if (!sql_search.match(/where/i)) {
            sql_search += ' WHERE';
        } else {
            sql_search += ' AND';
        }
        const genre = req.body.genre;
        const genres = string.split(genre, ',');
        for (let i = 0; i < genres.length; i++) {
            if (i > 0) {
                sql_search += ' AND';
            }
            sql_search += ' genre REGEXP ?';
            params.push(genres[i]);
        }
    }

    params.push(begin, end);
    sql_search += ') SELECT * FROM Paging WHERE RowNum BETWEEN ? AND ?';
    const movieSearch_query = mysql.format(sql_search, params);

    await db_conn.pool.getConnection(async (err, conn) => {
        await conn.query(movieSearch_query, (err, result) => {
            conn.release();
            if (err) throw (err.message)

            res.status(200).json(result);
        })
    })
})

//flims list
app.get('/films', async (req, res) => {//return up to 8 newest films and 8 upcoming films
    if (typeof movie_id != "undefined") {
        const movie_id = req.body.movie_id;
        const film_detail = 'SELECT * FROM Movie WHERE movie_id = ?';
        const query_one_film = mysql.format(film_detail, [movie_id]);

        db_conn.pool.getConnection(async (err, conn) => {
            await conn.query(new_films_query, async (err, film) => {
                if (err) throw (err)

                res.status(200).json(film);
            })
        });
    } else {
        const new_films_query = 'WITH Paging AS ( SELECT *, ROW_NUMBER() OVER (ORDER BY release_date) AS RowNum FROM Movie WHERE DATE_FORMAT(NOW(), "%Y-%m-%d") > release_date) SELECT * FROM Paging WHERE RowNum BETWEEN 1 AND 8';
        const upcoming_films_query = 'WITH Paging AS ( SELECT *, ROW_NUMBER() OVER (ORDER BY release_date) AS RowNum FROM Movie WHERE DATE_FORMAT(NOW(), "%Y-%m-%d") < release_date) SELECT * FROM Paging WHERE RowNum BETWEEN 1 AND 8';

        db_conn.pool.getConnection(async (err, conn) => {
            await conn.query(new_films_query, async (err, new_films) => {
                if (err) throw (err)

                await conn.query(upcoming_films_query, (err, upcoming_films) => {
                    conn.release();
                    if (err) throw (err)

                    res.status(200).json(Object.assign(new_films, upcoming_films));
                })
            })
        });
    }
});

//query film schedule
app.get('/schedule', async (req, res) => {
    if (typeof req.query.id != "undefined") {
        const movie_id = req.query.id;
        const sql_search = 'SELECT screening_id, DATE_FORMAT(time_start, "%Y-%m-%d") AS time_start_d, DATE_FORMAT(time_start, "%H:%i") as time_start_t FROM Screening WHERE movie_id = ?';
        const query_one_film = mysql.format(sql_search, [movie_id]);
        await db_conn.pool.getConnection(async (err, conn) => {
            await conn.query(query_one_film, (err, result) => {
                conn.release();
                if (err) throw (err.message)

                res.status(200).json(result);
            })
        });
    } else {
        const sql_search = 'SELECT s.screening_id, DATE_FORMAT(s.time_start, "%Y-%m-%d") AS time_start_d, DATE_FORMAT(s.time_start, "%H:%i") as time_start_t, s.price_id, m.title, m.rating, m.duration FROM Screening s INNER JOIN Movie m ON m.movie_id = s.movie_id';

<<<<<<< HEAD
            res.status(200).json(result);
        })
    });
=======
        await db_conn.pool.getConnection(async (err, conn) => {
            await conn.query(sql_search, (err, result) => {
                conn.release();
                if (err) throw (err.message)

                res.status(200).json(result);
            })
        });
    }
>>>>>>> 4656664b82119e9e6f76fbf920b15c5cdde32b22
});

//query seat layout
app.get('/seatLayout', getToken.tokenExist, getToken.validateToken, async (req, res) => { //parameter: screening_id
    const screening_id = req.body.screening_id;
    const user_id = req.user.user_id;

    const timer_update = 'UPDATE Users SET timer = NOW() WHERE user_id = ?';
    const timer_query = mysql.format(timer_update, [user_id]);
    const rsSeat = 'SELECT * FROM Seat_Reservation WHERE screening_id = ?';
    const rsSeat_query = mysql.format(rsSeat, [screening_id]);

    await db_conn.pool.getConnection(async (err, conn) => {
        await conn.query(timer_query, (err) => {
            if (err) throw (err.message)
        })

        await conn.query(rsSeat_query, (err, rsSeat) => {
            if (err) throw (err.message)
<<<<<<< HEAD
            await conn.query(rsSeat_query, (err, rsSeat) => {
                if (err) throw (err.message)
                res.status(200).json({ data: { allSeat: allSeat, taken: rsSeat }, message: 'ok' });
            })
=======

            res.status(200).json(rsSeat);
>>>>>>> 4656664b82119e9e6f76fbf920b15c5cdde32b22
        })
    });
});

//create ticket reservation
app.post('/booking', getToken.tokenExist, getToken.validateToken, async (req, res, next) => { //parameter: screening_id, seat_id
    const user_id = req.user.user_id;
    const screening_id = req.body.screening_id;
    const seat_id = req.body.seat_id.split(",");
    const transaction_id = uuid.v4(); //need to create a unique id here
    let amount = '';
    let input = [];
    let search = [];
    input.push(transaction_id, user_id);
    search.push(screening_id);

    if (!screening_id || !seat_id) {
        res.status(400).json({ data: '', message: 'Fields Missing!' });
    }

    const timer_search = 'SELECT NOW() - (SELECT timer from Users WHERE user_id =?) AS time';
    const timer_query = mysql.format(timer_search, [user_id]);

    let reservation_check = 'SELECT screening_id, seat_id FROM Seat_Reservation WHERE screening_id = ?';

    let booking_insert = 'INSERT INTO Ticket_transac VALUES (?,NOW(),?);';//create the seat reservation and transaction
    seat_id.forEach((item) => {
        reservation_check += ' OR seat_id = ?';
        search.push(item);
        booking_insert += ' INSERT INTO Seat_Reservation VALUES (?,?,?,?);';
        input.push(uuid.v4(), item, transaction_id, screening_id);
    })
    const booking_query = mysql.format(booking_insert, input);
    const reservation_query = mysql.format(reservation_check, search);

    const price_search = 'SELECT pr.price_amt FROM Screening sr INNER JOIN Price pr ON sr.price_id = pr.price_id WHERE screening_id = ?';
    const price_query = mysql.format(price_search, [screening_id]);

    await db_conn.pool.getConnection(async (err, conn) => {
        if (err) throw (err)

        await conn.query(timer_query, async (err, result) => { //check if the customer out of time for booking
            if (err) throw (err)

            if (result[0].time > 300) { //check whether the timer has ran out (300 seconds)
                conn.release();
                if (err) throw (err)
                res.status(401).json({ data: '', message: 'Timer ran out!' });
            } else {
                await conn.beginTransaction(async (err) => {
                    if (err) throw (err)

                    await conn.query(reservation_query, async (err, taken) => {
                        if (err) throw (err)

                        if (taken.length != 0) { //check for duplicate reservation
                            conn.rollback();
                            conn.release();
                            if (err) throw (err)
                            res.status(401).json({ data: '', message: 'Seats are unavailable!' });
                        } else {
                            await conn.query(price_query, async (err, price) => { //get price of the seat
                                if (err) throw (err)

                                amount = price['pr.price_amt'];

                                await conn.query(booking_query, (err) => {
                                    if (err) throw (err)

                                    conn.commit((err) => {
                                        if (err) {
                                            conn.rollback();
                                            conn.release();
                                            res.status(500).json({ data: '', message: 'Booking failed!' });
                                        } else {
                                            conn.release();
                                            res.status(200).json({ data: '', message: 'Booking successful!' });
                                        }
                                    })
                                })
                            })
                        }
                    })
                })
            }
        })
    })
});

module.exports = app;
