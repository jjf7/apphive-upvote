require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const exphbs = require("express-handlebars");
const path = require("path");
const { PORT } = require('./config')

// Initializations
const app = express();

const server = require("http").createServer(app);
module.exports =  server 

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
app.get("/",  require('./index.controller'));

app.get('/contacto' , (req, res) => {
  res.render('contact')
})

// Static Files 
app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => console.log("Server on port ", PORT));