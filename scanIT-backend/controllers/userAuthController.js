const User = require("../models/User");
const Crypto = require("crypto-js");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        if(req.body.password.length < 6) {
            return res.status(400).json({message: 'Password must be at least 6 characters long!'});
        }
        const newUser = new User({
            email: req.body.email,
            password: Crypto.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
            userName: req.body.userName,
            firstName: req.body.firstName,
            lastName: req.body.lastName ? req.body.lastName : null,
            birthday: req.body.birthday ? req.body.birthday : null,
            height: req.body.height ? req.body.height : null,
            weight: req.body.weight ? req.body.weight : null,
            allergies: req.body.allergies ? req.body.allergies : null,
        });

        const user = await newUser.save();
        if(!user) {
            return res.status(400).json({message: 'User registration failed!'});
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            birthday: user.birthday,
            height: user.height,
            weight: user.weight,
            allergies: user.allergies,
            createdAt: user.createdAt,
        }, process.env.JWT_SECRET, { expiresIn: '5d' });

        return res.status(200).json({message: 'User registered successfully!', user, token});

    } catch (error) {
        console.log(error);
        if(error.code === 11000){
            if(error.keyValue.email){
                return res.status(400).json({message: 'Email already in use!'});
            }
            if(error.keyValue.userName){
                return res.status(400).json({message: 'Username already in use!'});
            }
        }
        res.status(500).json({message: 'Internal server error'});
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
        console.log(decryptedPass);
        if(decryptedPass != req.body.password){
            return res.status(400).json({message: 'Invalid credentials!'});
        }

        const token = jwt.sign({
            id: user._id,
            email: user.email,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            birthday: user.birthday,
            height: user.height,
            weight: user.weight,
            allergies: user.allergies,
            createdAt: user.createdAt,
        }, process.env.JWT_SECRET, { expiresIn: '5d' });
        
        return res.status(200).json({message: 'User logged in successfully!', user, token});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}