const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { generateUsername } = require("unique-username-generator");

module.exports.register = async (req,res, next) => {
    try {
        const { email, password } = req.body;
        const username = generateUsername("-", 3);
        const emailCheck = await User.findOne({ email });
        if (emailCheck)
            return res.json({ msg: "Email Already Exists", status: false });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            username,
            password: hashedPassword,
        });
        delete user.password;
        return res.json({ status: true, user });
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req,res, next) => {
    try {
        const { email, password } = req.body;
        const emailCheck = await User.findOne({ email });
        if (!emailCheck)
            return res.json({ msg: "User Doesnt Exist", status: false });
        const passValid = await bcrypt.compare(password, emailCheck.password);
        if (!passValid)
            return res.json({ msg: "Wrong Pasword", status: false });
        delete emailCheck.password;
        return res.json({ status: true, emailCheck });
    } catch (error) {
        next(error);
    }
};

module.exports.getAllUsers = async (req, res, next) =>{
    try {
        const users = await User.find({_id:{$ne:req.params.id}}).select([
            "_id",
            "email",
            "username",
            "avatarImage",
        ]);
        return res.json(users);
    } catch (error) {
        next(error);
    }
};