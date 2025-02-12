const User = require("../models/User");
const Crypto = require("crypto-js");
const crypto = require("crypto");
const ResetPassToken = require("../models/ResetPassToken");
const nodemailer = require("nodemailer");

exports.changePassword = async (req, res) => {
    try{
        const { resetToken, newPassword, confirmNewPassword } = req.body;

        const resetPassToken = await ResetPassToken.findOne({ resetToken });

        if (!resetToken || resetToken.expiresAt < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        if(newPassword !== confirmNewPassword){
            return res.status(400).json({message: 'Passwords do not match!'});
        }

        if(newPassword.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters long!'});
        }

        const user = await User.findById(resetPassToken.userId);
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
        const resetToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30*60*1000); //30 minutes
        
        await ResetPassToken.deleteMany({ userId: user._id });

        await new ResetPassToken({
            userId: user._id,
            resetToken: resetToken,
            expiresAt: expiresAt,
        }).save();

        const resetPassLink = `myapp://reset-password?token=${resetToken}`;

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
                    <p style="color: #666;">Click the button below to reset your password:</p>
                    <a href="${resetPassLink}" 
                       style="display: inline-block; 
                              padding: 10px 20px; 
                              background-color: #007bff; 
                              color: white; 
                              text-decoration: none; 
                              border-radius: 5px; 
                              margin: 20px 0;">
                        Reset Password
                    </a>
                    <p style="color: #666; margin-top: 20px;">
                        If the button doesn't work, copy and paste this link in your app:
                        <br>
                        <span style="color: #007bff;">${resetPassLink}</span>
                    </p>
                </div>
            `,
        });

        res.json({message: 'Reset password link sent to email!'});

    } catch(error){
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}