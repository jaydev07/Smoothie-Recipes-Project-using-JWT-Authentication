const express = require('express');
const mongoose = require('mongoose');

// S1 -> Use Cookie Pareser
const cookieParser = require("cookie-parser");

const authRoutes = require('./routes/authRoutes');
const {requireAuth , checkUser} = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());

// S2 -> Use Cookie Pareser as middle ware
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://admin-jaydev:jd@123@cluster0.j7bhg.mongodb.net/node-auth';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));


// Adding the checkUser to every routes
app.get("*", checkUser);
// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth , (req, res) => res.render('smoothies'));

/*
app.get("/set-cookies" , (req,res) => {
  
  // Creating a cookie
  //res.setHeader('Set-Cookie' , 'newUser=true');
  // But there is an easy way to work with cookie using "npm install cookie-parser"


  // S3 -> Creating cookie using cookie-Parser
  res.cookie('newUser',false);
  res.cookie("isEmployee" , true , { maxAge: 1000 * 60 * 60 *24 , httpOnly: true});

  res.send("you got the cookies!");
})

app.get("/read-cookies" , (req,res) => {

  // S4 -> Reading the cookies
  const cookies =req.cookies;
  console.log(cookies);

  res.send(cookies);
})
*/

app.use(authRoutes);