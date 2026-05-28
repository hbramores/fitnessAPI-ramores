const User = require('../models/User');
const bcrypt = require("bcryptjs");
const auth = require("../auth");


module.exports.checkEmailExists = (req, res) => {

    if(req.body.email.includes("@")){

        return User.find({ email : req.body.email })
        .then(result => {

            if (result.length > 0) {

                return res.status(409).send({message : "Duplicate email found"});
            } else {

                return res.status(200).send({message: "No duplicate email found"});
            };
        })
        .catch(error => errorHandler(error, req, res));

    } else {
        res.status(400).send({message : 'Invalid email format'});
    }
};

module.exports.registerUser = (req, res) => {

    if (!req.body.email.includes("@")){
        return res.status(400).send(false);
    }
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send(false);
    }
    else if (req.body.password.length < 8) {
        return res.status(400).send(false);
    } else {

        let newUser = new User({
            firstName : req.body.firstName,
            lastName : req.body.lastName,
            email : req.body.email,
            mobileNo : req.body.mobileNo,
            password : bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send(result))
        .catch(error => errorHandler(error, req, res));
        
    }
};


module.exports.loginUser = (req, res) => {

    if(req.body.email.includes("@")) {  

        return User.findOne({ email: req.body.email })
        .then(result => {


            if(result == null) {

                return res.status(404).send(false);
            } else {

                const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

                if(isPasswordCorrect) {
                    console.log(isPasswordCorrect)
                    return res.status(200).send({ access : auth.createAccessToken(result)});
                } else {
                    return res.status(401).send(false);
                }
            }
        })
        .catch(error => errorHandler(error, req, res));

    } else {
        return res.status(400).send(false);
    }
}


module.exports.getProfile = (req, res) => {

    return User.findById(req.user.id)
    .then(user => {
        user.password = "";
        res.status(200).send(user)
    })
    .catch(error => errorHandler(error, req, res));

};