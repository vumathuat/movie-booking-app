'use strict';
const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const validator = require("email-validator");
const db_conn = require('./db_connect');
const getToken = require('./getToken');

const app = express();
app.use(express.json());
app.use(cookieParser());

//test function
app.get('/test', (req, res) => {
    const pattern = '^a'
    const sql_search = 'SELECT username, phone_no, email FROM Users where username REGEXP ?';
    const getUser_query = mysql.format(sql_search, [pattern]);

    db_conn.pool.getConnection(async (err, conn) => {
        if (err) throw (err.message)

        await conn.query(getUser_query, (err, result) => {
            conn.release();
            if (err) throw (err)

            res.status(200).json(result);
        })
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
    const allow_fields = ['username', 'email', 'phone_no', 'timer', 'status', 'password'];
    var check;

    if (update_fields.length < 1) {
        res.status(400).send('Empty request!');
        return next();
    }

    for (let i = 0; i < update_fields.length; i++) { //check for null value
        if (!req.body[update_fields[i]]) {
            res.status(400).send('Empty fields!');
            return next();
        }
    }

    if (update_fields.includes('password') && update_fields.includes('old_password')) { //check for password
        const sql_search = 'SELECT password FROM Users where user_id = ?';
        const password_search_query = mysql.format(sql_search, [user_id]);

        await db_conn.pool.getConnection(async (err, conn) => {
            await conn.query(password_search_query, async (err, result) => {
                if (err) throw (err)

                if (await bcrypt.compare(req.body.old_password, result[0].password)) {
                    if (!allow_fields.includes(update_fields[0])) {
                        res.status(400).send('Unknown field!');
                        return next();
                    }

                    const sql_update = 'UPDATE Users SET ' + update_fields[0] + ' =? where user_id = ?';
                    const updateUser_query = mysql.format(sql_update, [await bcrypt.hash(req.body[update_fields[0]], 10), user_id]);

                    await conn.query(updateUser_query, async (err) => {
                        conn.release();

                        if (err) throw (err)

                        res.status(200).send('User information updated!');
                    })
                } else {
                    res.status(401).send('Wrong old passowrd!');
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

            if (req.status == 1) {
                res.status(200).send('User activated!');
                return next();
            }

            res.status(200).send('User deactivated');
        })
    })
});

//admin function see all users
app.get('/manageUsers', getToken.tokenExist, getToken.validateToken, getToken.validateAdmin, async (req, res) => {
    const user_id = process.env.ADMIN_ID;
     const page = req.body.page;
    const end = page * 5;
    const begin = end - 4;

    const sql_search = 'WITH Paging AS ( SELECT *, ROW_NUMBER() OVER (ORDER BY username) AS RowNum FROM Users WHERE NOT user_id = ?) SELECT * FROM Paging WHERE RowNum BETWEEN ? AND ?';
    const user_query = mysql.format(sql_search, [user_id, begin, end]);

    db_conn.pool.getConnection(async (err, conn) => {
        await conn.query(user_query, (err, result) => {
            if (err) throw (err.message)

            res.status(200).json(result);
        })
    })
});

//film list
app.get('/films', async (req, res) => {//paramter: page, search, (array) genre, year 
    let page = 1;
    if (typeof req.body.page != "undefined" && Number.isInteger(req.body.page)) {
        page = req.body.page;
    }
    const end = page * 5 ;
    const begin = end - 4;
    let params = [];

    let sql_search = 'WITH Paging AS ( SELECT m.movie_id, m.title, m.director, m.cast, m.description, DATE_FORMAT(m.release_date, "%Y-%m-%d") AS release_date, m.duration, m.poster, ROW_NUMBER() OVER (ORDER BY movie_id) AS RowNum FROM Movie m INNER JOIN Screening s ON m.movie_id=s.movie_id';
    if (typeof req.body.search != "undefined") {
        sql_search += ' WHERE title REGEXP ?';
        const search = '^' + req.body.search;
        params.push(search);
    }
    if (typeof req.body.date != "undefined" && typeof req.body.time != "undefined") {
        if (!sql_search.match(/where/i)) {
            sql_search += ' WHERE';
        } else {
            sql_search += ' AND';
        }
        sql_search += ' DATE_FORMAT(time_start, "%Y-%m-%d") = ? AND DATE_FORMAT(s.time_start, "%H:%i") > ?';
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

            res.status(200).json({ data : result, message: 'ok'});
        })
    });
})

//query film schedule
app.get('/schedule', async (req, res) => { //parameter: movie_id
    const movie_id = req.body.movie_id;

    const sql_search = 'SELECT screening_id, DATE_FORMAT(time_start, "%Y-%m-%d") AS time_start_d, DATE_FORMAT(time_start, "%H:%i") as time_start_t, price_id FROM Screening where movie_id = ?';
    const movieSearch_query = mysql.format(sql_search, [movie_id]);

    await db_conn.pool.getConnection(async (err, conn) => {
        await conn.query(movieSearch_query, (err, result) => {
            conn.release();
            if (err) throw (err.message)

            res.status(200).json({ data: result, message: 'ok'});
        })
    });
})

app.listen(process.env.API_SERVER_PORT, () => console.log("API Server is running"));
