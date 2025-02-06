const User = require("../models/User");
const Crypto = require("crypto-js");

exports.registerUser = async (req, res) => {
    try {
        if(req.body.password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long'});
        }
        const newUser = new User({
            email: req.body.email,
            password: Crypto.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
            firstName: req.body.firstName,
            lastName: req.body.lastName ? req.body.lastName : null,
            userName: req.body.userName ? req.body.userName : null,
            birthday: req.body.birthday ? req.body.birthday : null,
        });

        const user = await newUser.save();
        if(user) {
            return res.status(201).json({message: 'User registered successfully'});
        } else {
            return res.status(400).json({message: 'User registration failed'});
        }

    } catch (error) {
        console.log(error);
    }
}

exports.loginUser = async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.body.email,
        })
        if(!user){
            return res.status(400).json({message: 'User not found!'});
        }
        const decryptedPass = Crypto.AES.decrypt(user.password, process.env.PASS_SECRET).toString(Crypto.enc.Utf8);
        const password = decryptedPass.toString(Crypto.enc.Utf8);
        if(password === req.body.password){
            const {password, ...others} = user._doc;
            return res.status(200).json({message: 'User logged in successfully', user: others});
        } else {
            return res.status(400).json({message: 'Invalid credentials!'});
        }
    } catch (error) {
        console.log(error);
    }
}