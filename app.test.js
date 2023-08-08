const app = require('./app')
const request = require('supertest');
const jwt = require('jsonwebtoken');
const db_conn = require('./db_connect');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

describe("Test /test", () => {
    test("It should response the GET method", async () => {
        const res = await request(app).get("/test");
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ data: '', message: 'Working!' });
    });
});

describe("Test /login", () => {
    test("Login successfully with correct credential", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const res = await request(app).post("/login").send(user);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ data: '', message: 'Login successful!' });
        expect(res.headers['set-cookie']).toBeDefined();
    });

    test("Login failed with incorrect password", async () => {
        const cred = { "username": "test1234", "password": "test1235" };
        const res = await request(app).post("/login").send(cred);
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ data: '', message: 'Wrong password!' });
        expect(res.headers['set-cookie']).toBeUndefined();
    });

    test("Lock account check", async () => {
        db_conn.pool.getConnection(async (err, conn) => {
            const sql_update_lock = 'UPDATE Users SET status = "0" WHERE username = "test1234"';
            const sql_update_open = 'UPDATE Users SET status = "1" WHERE username = "test1234"';

            await conn.query(sql_update_lock, (err) => {
                if (err) throw (err)
            });

            const cred = { "username": "test1234", "password": "test1234" };
            const res = await request(app).post("/login").send(cred);

            await conn.query(sql_update_open, (err) => {
                if (err) throw (err)
            });
            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual({ data: '', message: 'Account locked!' });
            expect(res.headers['set-cookie']).toBeUndefined();
        });
    });
});

describe("Test /register", () => {
    test("Register a new user", async () => {
        const sql_delete = 'DELETE FROM Users WHERE username = "test1236"'; //deleting the testing user in case of duplication
        const sql_check = 'SELECT * FROM Users WHERE username = "test1236"';
        const user = { "username": "test1236", "password": "test1236", "email": "test1236@mail.com", "phone_no": "999999999" };
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err)

            await conn.query(sql_delete, (err) => {
                if (err) throw (err)
            });

            const res = await request(app).post("/register").send(user);
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({ data: '', message: 'User created successful!' });
            conn.query(sql_check, (err, result) => {
                conn.release();
                if (err) throw (err)

                expect(result.length).toBe(1);
            });
        });
    });

    test("Register a duplicate user failed", async () => {
        const user = { "username": "test1234", "password": "test1236", "email": "test1236@mail.com", "phone_no": "999999999" };
        const res = await request(app).post("/register").send(user);
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ data: '', message: 'Duplicate values!' });
    });

    test("Test function validateFields", async () => {
        const invalid_uname = { "username": "test12", "password": "test8888", "email": "test8888@mail.com", "phone_no": "888888888" }; //username is not long enough
        const invalid_password = { "username": "test8888", "password": "test", "email": "test8888@mail.com", "phone_no": "888888888" }; //password is not long enough
        const invalid_email = { "username": "test8888", "password": "test8888", "email": "test8888@mail", "phone_no": "888888888" }; //email is not long enough

        const res1 = await request(app).post("/register").send(invalid_uname);
        const res2 = await request(app).post("/register").send(invalid_password);
        const res3 = await request(app).post("/register").send(invalid_email);

        expect(res1.statusCode).toBe(400);
        expect(res2.statusCode).toBe(400);
        expect(res3.statusCode).toBe(400);
        expect(res1.body).toEqual({ data: '', message: 'Username need to be 8 or more characters!' });
        expect(res2.body).toEqual({ data: '', message: 'Password need to be 8 or more characters!' });
        expect(res3.body).toEqual({ data: '', message: 'Email invalid!' });
    });
});

describe("Test /update_user", () => {
    test("Update username", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const username = { "username": "test1237" };
        const sql_search = 'SELECT username FROM Users where username = "test1237"';
        const sql_update = 'UPDATE Users SET username = "test1234" WHERE username = "test1237"';
        const res = await request(app).post("/update_user").send(username).set("Cookie", cookie);
        expect(res.status).toBe(200);
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)
            await conn.query(sql_search, (err, result) => {
                if (err) throw (err)
                expect(result[0].username).toEqual("test1237");
            });
            await conn.query(sql_update, (err) => {
                conn.release();
                if (err) throw (err)
            });
        });
    });

    test("Update phone number", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const phone_no = { "phone_no": "1234567894" };
        const sql_search = 'SELECT phone_no FROM Users where username = "test1234"';
        const sql_update = 'UPDATE Users SET phone_no = "1234567891" WHERE username = "test1234"';
        const res = await request(app).post("/update_user").send(phone_no).set("Cookie", cookie);
        expect(res.status).toBe(200);
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)
            await conn.query(sql_search, (err, result) => {
                if (err) throw (err)
                expect(result[0].phone_no).toEqual("1234567894");
            });
            await conn.query(sql_update, (err) => {
                conn.release();
                if (err) throw (err)
            });
        });
    });

    test("Update email", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const email = { "email": "test1237@mail.com" };
        const sql_search = 'SELECT email FROM Users where username = "test1234"';
        const sql_update = 'UPDATE Users SET email = "test1234@mail.com" WHERE username = "test1234"';
        const res = await request(app).post("/update_user").send(email).set("Cookie", cookie);
        expect(res.status).toBe(200);
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)
            await conn.query(sql_search, (err, result) => {
                if (err) throw (err)
                expect(result[0].email).toEqual("test1237@mail.com");
            });
            await conn.query(sql_update, (err) => {
                conn.release();
                if (err) throw (err)
            });
        });
    });
    
    test("Update field beside password with a duplicate value failed", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const username = { "username": "test1236" };
        const res = await request(app).post("/update_user").send(username).set("Cookie", cookie);
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ data: '', message: 'Duplicate values!' });
    });
    
    test("Update password failed with incorrect old_password", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const pass = { "password": "test1237", "old_password": "test1236" };
        const res = await request(app).post("/update_user").send(pass).set("Cookie", cookie);
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({ data: '', message: 'Wrong old passowrd!' });
    });

    test("Update password", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const pass = { "password": "test1237", "old_password":"test1234" };
        const sql_search = 'SELECT password FROM Users where username = "test1234"';
        const old_pass = await bcrypt.hash("test1234", 10);
        const sql_update = 'UPDATE Users SET password = "' + old_pass + '" WHERE username = "test1234"';
        const res = await request(app).post("/update_user").send(pass).set("Cookie", cookie);
        expect(res.status).toBe(200);
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)
            await conn.query(sql_search, async (err, result) => {
                if (err) throw (err)
                expect(await bcrypt.compare("test1237", result[0].password)).toBeTruthy();
            });
            await conn.query(sql_update, (err) => {
                conn.release();
                if (err) throw (err)
            });
        });
    });
});

describe("Test /account", () => {
    test("Fail to get data without accesstoken", async () => {
        const res = await request(app).get("/account");
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual({ data: '', message: 'Missing tokens!' });
    });

    test("Get data after login", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const res = await request(app).post("/login").send(user);
        const cookie = res.headers['set-cookie'];
        const sql_search = 'SELECT username, phone_no, email FROM Users where username = "test1234"';
        const res_02 = await request(app).get("/account").set("Cookie", cookie);
        expect(res_02.statusCode).toBe(200);
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)

            await conn.query(sql_search, (err, result) => {
                conn.release();
                if (err) throw (err)

                expect(res_02.body).toEqual(result);
            });
        });
    });
});

describe("Test /changeUserStatus", () => {
    test("Access failed with incorrect credential", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const searchUser_query = "SELECT user_id from Users WHERE username = 'test1236'";
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)

            const user_id = await conn.query(searchUser_query, (err, result) => {
                if (err) throw (err)
                conn.release();

                return result[0].user_id;
            });

            const command = { "user_id": user_id, "status": "0" };
            const res = await request(app).post("/changeUserStatus").send(command).set("Cookie", cookie);
            expect(res.statusCode).toBe(403);
            expect(res.body).toEqual({ data: '', message: 'Wrong crdential!' });
        });
    });
    
    test("Lock a user", async () => {
        const user = { "username": "admin", "password": "admin" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const searchUser_query = "SELECT user_id from Users WHERE username = 'test1236'";
        const userstatus_query = "SELECT status from Users WHERE username = 'test1236'";
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)

            await conn.query(searchUser_query, async (err, result) => {
                if (err) throw (err)

                const command = { "user_id": result[0].user_id, "status": "0" };
                const res = await request(app).post("/changeUserStatus").send(command).set("Cookie", cookie);
                expect(res.statusCode).toBe(200);
                expect(res.body).toEqual({ data: '', message: 'User deactivated!' });
                await conn.query(userstatus_query, (err, result) => {
                    conn.release();
                    if (err) throw (err)

                    expect(result[0].status).toEqual(0);
                });
            });
        });
    });
    
    test("Unlock a user", async () => {
        const user = { "username": "admin", "password": "admin" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const searchUser_query = "SELECT user_id from Users WHERE username = 'test1236'";
        const userstatus_query = "SELECT status from Users WHERE username = 'test1236'";
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)

            await conn.query(searchUser_query, async (err, result) => {
                if (err) throw (err)

                const command = { "user_id": result[0].user_id, "status": "1" };
                const res = await request(app).post("/changeUserStatus").send(command).set("Cookie", cookie);
                expect(res.statusCode).toBe(200);
                expect(res.body).toEqual({ data: '', message: 'User activated!' });
                await conn.query(userstatus_query, (err, result) => {
                    conn.release();
                    if (err) throw (err)

                    expect(result[0].status).toEqual(1);
                });
            });
        });
    });
});

describe("Test /manageUsers", () => {
    test("Access failed with incorrect credential", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const res = await request(app).get("/manageUsers").set("Cookie", cookie);
        expect(res.statusCode).toBe(403);
        expect(res.body).toEqual({ data: '', message: 'Wrong crdential!' });
    });

    test("Access successful with correct credential", async () => {
        const user = { "username": "admin", "password": "admin" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const res = await request(app).get("/manageUsers").set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
    });
});

describe("Test /films", () => {
    test("Getting one films", async () => {
        const res = await request(app).get("/films?id=1");
        const search_film = 'select * from Movie where movie_id = 1';
        expect(res.statusCode).toBe(200);
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)

            await conn.query(search_film, async (err, result) => {
            	conn.release();
                if (err) throw (err)

                expect(res.body[0].title).toEqual(result[0].title);
            });
        });
    });

    test("Getting all films", async () => {
        const res = await request(app).get("/films");
        const search_film = 'select * from Movie';
        expect(res.statusCode).toBe(200);
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)

            await conn.query(search_film, async (err, result) => {
                if (err) throw (err)

                expect(res.body.length).toEqual(result.length);
            });
        });
    });
});

describe("Test /booking", () => {
    test("Book a ticket", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const reservation = { "screening_id": "02", "seat_id": "1" };
        const screening_id = { "screening_id": "01" };
        const update_timer = await request(app).get("/seatLayout?all_seat=1").send(screening_id).set("Cookie", cookie);
        const res = await request(app).post("/booking").send(reservation).set("Cookie", cookie);
        const searchSRS_query = 'SELECT * FROM Seat_Reservation WHERE screening_id = "02" AND seat_id = "1"';
        const del_reverse_query = 'DELETE FROM Ticket_transac WHERE transaction_id = (SELECT transaction_id FROM Seat_Reservation WHERE screening_id = "02" AND seat_id = "1"); DELETE FROM Seat_Reservation WHERE screening_id = "02" AND seat_id = "1";';
        db_conn.pool.getConnection(async (err, conn) => {
            await conn.query(searchSRS_query, (err, result) => {
                if (err) throw (err)

                expect(result.length).toEqual(1);
            })

            await conn.query(del_reverse_query, (err) => {
            	conn.release();
                if (err) throw (err)
            });
        });
        expect(res.statusCode).toBe(200);
    });
});

describe("Test /schedule", () => {
    test("Getting the first movie schedule", async () => {
        const res = await request(app).get("/schedule?id=1");
        const search_schedule = 'select * from Screening where movie_id = 1';
        expect(res.statusCode).toBe(200);
        db_conn.pool.getConnection(async (err, conn) => {
            if (err) throw (err.message)

            await conn.query(search_schedule, async (err, result) => {
                conn.release();
                if (err) throw (err)

                expect(res.body.length).toEqual(result.length);
            });
        });
    });
    
    test("Fail to query schedule without inserting movie_id", async () => {
        const res = await request(app).get("/schedule");
        expect(res.statusCode).toBe(400);
    });
});

describe("Test /seatLayout", () => {
    test("Getting all seat", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const screening_id = { "screening_id": "01" };
        const res = await request(app).get("/seatLayout?all_seat=1").send(screening_id).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
    });
    
    test("Getting reserved seat", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const screening_id = { "screening_id": "01" };
        const res = await request(app).get("/seatLayout?all_seat=0").send(screening_id).set("Cookie", cookie);
        expect(res.statusCode).toBe(200);
    });
    
    test("Fail to get seat layout without all_seat parameter", async () => {
        const user = { "username": "test1234", "password": "test1234" };
        const login = await request(app).post("/login").send(user);
        const cookie = login.headers['set-cookie'];
        const screening_id = { "screening_id": "01" };
        const res = await request(app).get("/seatLayout?").send(screening_id).set("Cookie", cookie);
        expect(res.statusCode).toBe(400);
    });
});
