'use strict';
const app = require("./app");

app.listen(process.env.API_SERVER_PORT, () => console.log("API Server is running"));
