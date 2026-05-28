const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const { errorHandler } = require("../auth"); 


module.exports.checkEmailExists = (req, res) => {

    const { email } = req.body;

    if (!email || !email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    }

    return User.find({ email: email })
        .then(result => {

            if (result.length > 0) {
                return res.status(409).send({ message: "Duplicate email found" });
            } else {
                return res.status(200).send({ message: "No duplicate email found" });
            }
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.registerUser = (req, res) => {

    const { firstName, lastName, email, mobileNo, password } = req.body;

    if (!firstName || !lastName || !email || !mobileNo || !password) {
        return res.status(400).send({ message: "All fields are required" });
    }

    if (!email.includes("@")) {
        return res.status(400).send({ message: "Invalid email format" });
    }

    if (mobileNo.length !== 11) {
        return res.status(400).send({ message: "Invalid mobile number" });
    }

    if (password.length < 8) {
        return res.status(400).send({ message: "Password must be at least 8 characters" });
    }

    let newUser = new User({
        firstName,
        lastName,
        email,
        mobileNo,
        password: bcrypt.hashSync(password, 10)
    });

    return newUser.save()
        .then(result => res.status(201).send(result))
        .catch(error => errorHandler(error, req, res));
};


module.exports.loginUser = (req, res) => {

    const { email, password } = req.body;

    if (!email || !email.includes("@") || !password) {
        return res.status(400).send({ message: "Invalid input" });
    }

    return User.findOne({ email: email })
        .then(result => {

            if (!result) {
                return res.status(404).send({ message: "User not found" });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, result.password);

            if (!isPasswordCorrect) {
                return res.status(401).send({ message: "Incorrect password" });
            }

            return res.status(200).send({
                access: auth.createAccessToken(result)
            });
        })
        .catch(error => errorHandler(error, req, res));
};


module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
        .then(user => {

            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }

            user.password = "";
            return res.status(200).send(user);
        })
        .catch(error => errorHandler(error, req, res));
};