const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport=require('passport');

const app = express();


// Passport Config
require('./config/passport')(passport);

//db config
const db=require('./config/keys').MongoURI;

mongoose.connect(db,{useNewUrlParser:true})
.then(()=>console.log('MongoDB is connected'))
.catch(err=>console.log(err));

var routes =require('./routes/index');
var users =require('./routes/users');

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: false }));

// Express session middleware
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', routes );
app.use('/users', users );
  
const port = process.env.PORT || 8082;
  
  app.listen(port, () =>
   console.log(`Server running on port :http://localhost:${port}`));  