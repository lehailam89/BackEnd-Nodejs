const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require("express-session");
var flash = require("express-flash");
const multer = require('multer');

require("dotenv").config();

const database = require("./config/database");

const systemConfig = require("./config/system");

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
app.use(methodOverride('_method'));

//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT;

app.set('views', './views');
app.set('view engine', 'pug');

//Flash
app.use(cookieParser("DADWDADWEQE"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
//End Flash

// App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin

app.use(express.static('public'));

route(app);
routeAdmin(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})