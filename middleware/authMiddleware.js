const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Function which Authenticates the user by checking the correct JWT token when user request for any web page
const requireAuth = (req,res,next) => {
    const token = req.cookies.jwt;

    // If the JWT Token is present
    if(token){
        // Verify that the token is perfect or not
        jwt.verify(token , "It's my own secret" , (err , decodedToken) => {
            if(err){
                console.log(err);
                res.redirect("/login");
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect("/login");
    }
}

// Get the User Information if logedin
const checkUser = (req,res,next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token , "It's my own secret" , async (err,decodedToken) => {
            if(err){
                console.log(err);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken);

                // Taking the user by id present in the token's payload
                let user = await User.findById(decodedToken.id);

                // Through this we can use user variable in our views ejs pages
                res.locals.user = user;
                next();
            }
        });
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = {requireAuth , checkUser} ;