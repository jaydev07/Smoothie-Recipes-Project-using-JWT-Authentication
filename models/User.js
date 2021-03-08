const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true , 'Please enter email'],
        unique: true,
        lowercase: true,
        validate: [isEmail , 'Please enter a valid email']
    },
    password:{
        type:String,
        required:[true , 'Please enter password'],
        minlength:[6 , 'Min characters required are 6']
    }
});

// For hashing the passwords before saving
userSchema.pre('save' , async function(next){
    // Creating the salt
    const salt = await bcrypt.genSalt();

    // hashing thepassword with the salt
    this.password = await bcrypt.hash(this.password , salt);
    next();
});

// Creating own login function
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error("incorrect password");
    }
    throw Error("incorrect email");
}

const User = mongoose.model('user', userSchema);

module.exports = User;

