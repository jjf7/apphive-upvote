require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const { PORT } = require('./config')
// Initializations
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
module.exports = io 

const upvotes = require('./index.controller');

upvotes()

//module.exports =  server 

app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main.hbs",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);

// Middlewares 
app.set("view engine", ".hbs");
app.use(morgan("dev"));

// Routes 
app.get("/",  (req,res) => {
  res.send('Welcome Upvotes Hive by Jfdesousa7!!')
});
app.get("/follow",  require('./follow.controller'));

app.get('/contacto' , (req, res) => {
  res.render('contact')
})

// Static Files 
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT);