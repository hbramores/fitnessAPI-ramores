const express = require('express');
const userController = require('../controllers/user');

const { verify } = require("../auth");

const router = express.Router();

router.post("/check-email", userController.checkEmailExists);
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/details", verify, userController.getProfile);

router.get("/logout", (req, res)=> {
	req.session.destroy((err) => {
		if(err){
			console.log(err)
		}
		else{
			req.logout(()=>{
				console.log("You are logged out");
				res.redirect("/")
			})
		}
	})
})

module.exports = router;
