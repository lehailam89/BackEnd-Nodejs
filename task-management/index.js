const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const database = require('./config/database');
require('dotenv').config();
const routesApiVer1 = require("./api/v1/routes/index.router");
const app = express();
const port = process.env.PORT || 3000; 


database.connect();

app.use(cookieParser());

//parse application/json
app.use(bodyParser.json());

// Cấu hình CORS
app.use(cors({
    origin: 'http://localhost:3001', // Địa chỉ frontend của bạn
    credentials: true // Cho phép gửi cookie
}));

//Router version 1
routesApiVer1(app);

app.listen(port, () => {
    console.log(`App is running on port: ${port}`);
});