const User = require("../models/User");

// Requiring JWT
const jwt = require("jsonwebtoken");

const maxAge= 3*24*60*60;

// Creating JWT after the user is logedin
const createToken = (id) => {
    // 1.Payload 2.Secret 3.Options
    return jwt.sign({ id } , "It's my own secret" , { expiresIn : maxAge })
}

//handle errror
const handleError = (err) => {
    console.log(err.message , err.code);

    let errors = {email:'' , password:''}

    // For login incorrect email and password
    if(err.message === "incorrect email"){
        errors.email = "that email is not registered";
    }

    if(err.message === "incorrect password"){
        errors.password = "that password is incorrect";
    }

    // duplicate error code
    if(err.code === 11000){
        errors.email = 'The email id already registered.';
    }

    // validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach( e => {
            errors[e.properties.path] = e.properties.message
        });
    }

    return errors;
}

module.exports.signup_get = (req,res) => {
    res.render('signup');
}

module.exports.login_get = (req,res) => {
    res.render('login');
}

module.exports.signup_post = async (req,res) => {
    const {email,password} = req.body;
    
    try{
        const user = await User.create({email,password});

        // S2 -> When the user is created then srever should create JWT
        const token = createToken(user._id);

        // S3 -> After creating the token server should send the tokenn in cookie to user's browser
        res.cookie("jwt" , token , { maxAge: maxAge*1000 });
        res.status(201).json({user: user._id});

    }catch(err){
        const error = handleError(err);
        res.status(400).json(error);
    }
    res.send('new signup');
}

module.exports.login_post = async (req,res) => {
    const {email,password} = req.body;

    try{
        const user = await User.login(email,password);

        // After login JWT token shuld be created
        const token = createToken(user._id);

        // And token should be sended in a cookie
        res.cookie('jwt' , token , { maxAge: maxAge*1000 });
        res.status(200).json({user: user._id});
    }catch(err){
        const errors = handleError(err);
        res.status(400).json(errors)
    }
}

module.exports.logout_get = (req,res) => {
    // We cannot delete the cookie from the server. We have to replace the token and reduce it's age
    res.cookie('jwt','',{maxAge:1});
    res.redirect('/');
}
    