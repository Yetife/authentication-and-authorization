const router = require('express').Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth')

//import the router controller
const userController = require('../controllers/userController');

//register user route
router.post('api/auth/signup', userController.registerNewUser)

//login user route
router.post('api/auth/login', [
        check("email", "Please enter a valid email").isEmail(),
        check("password", "A valid password is required").exists()
    ], userController.loginUser
);

router.get("/api/auth", auth, userController.getLoggedInUser)

module.exports = router;