const User = require("../models/User");
const Crypto = require("crypto-js");
const ResetPassToken = require("../models/ResetPassToken");
const nodemailer = require("nodemailer");

exports.checkCode = async (req, res) => {
    try{
        await ResetPassToken.deleteMany({ expiresAt: { $lt: Date.now() } });
        const { resetCode } = req.body;
        if(!resetCode || resetCode.length !== 6){
            return res.status(400).json({message: 'Invalid code length!'});
        }
        const resetPassToken = await ResetPassToken.findOne({ resetToken: resetCode });
        if(resetPassToken.expiresAt < Date.now()){
            return res.status(400).json({message: 'Code expired!'});
        }
        if(resetPassToken.resetToken !== resetCode){
            return res.status(400).json({message: 'Invalid code!'});
        }
        await ResetPassToken.deleteOne({ resetToken: resetCode });
        res.status(200).json({message: 'Code verified!', resetPassToken});
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.changePassword = async (req, res) => {
    try{
        const { email, newPassword, confirmNewPassword } = req.body;

        if(newPassword !== confirmNewPassword){
            return res.status(400).json({message: 'Passwords do not match!'});
        }

        if(newPassword.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long!'});
        }

        const user = await User.findOne({ email: email });
        if(!user){
            return res.status(400).json({message: 'User not found!'});
        }

        if(Crypto.AES.decrypt(user.password, process.env.PASS_SECRET).toString(Crypto.enc.Utf8) === req.body.newPassword){
            return res.status(400).json({message: 'Can\'t use the old password!'});
        }

        user.password = Crypto.AES.encrypt(newPassword, process.env.PASS_SECRET).toString();
        await user.save();

        res.status(200).json({message: 'Password changed successfully!'});        
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.forgotPasswordEmail = async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            return res.status(404).json({message: 'User not found!'});
        }
        const resetCode = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 2*60*1000); // 2 minutes
        
        await ResetPassToken.deleteMany({ userId: user._id });

        await new ResetPassToken({
            userId: user._id,
            resetToken: resetCode,
            expiresAt: expiresAt,
        }).save();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Reset Password',
            html: `
                <div style="padding: 20px; background-color: #f5f5f5;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p style="color: #666;">Your password reset code is: <b>${resetCode}</b></p>
                    <p style="color: #666;">This code will expire in 2 minutes.</p>
                    <p style="color: #666;">If you didn't request a password reset, you can ignore this email.</p>
                </div>
            `,
        });

        res.json({message: 'Reset code sent to email!'});

    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.addAllergy = async (req, res) => {
    try{
        const { email, allergy } = req.body;

        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({message: 'User not found!'});
        }
        if(user.allergies && user.allergies.includes(allergy)){
            return res.status(400).json({message: 'Allergy already existst!'});
        }
        if(!user.allergies){
            user.allergies = [];
        }
        user.allergies.push(allergy);
        await user.save();

        res.status(200).json({message: 'Allergy added successfully!'});
    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.removeAllergy = async (req, res) => {
    try{
        const { email, allergy } = req.body;

        const user = await User.findOne({email: email});
        if(!user){
            return res.status(404).json({message: 'User not found!'});
        }
        if(!user.allergies || !user.allergies.includes(allergy)){
            return res.status(400).json({message: 'Allergy not found!'});
        }
        user.allergies = user.allergies.filter((a) => a !== allergy);
        await user.save();

        res.status(200).json({message: 'Allergy removed successfully!'});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

exports.getUserData = async (req, res) => {
    try{
        const email = req.params.email;
        console.log(email);
        const user = await User.findOne({email: email});
        console.log(user);
        if(!user){
            return res.status(404).json({message: 'User not found!'});
        }
        res.status(200).json(user);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}