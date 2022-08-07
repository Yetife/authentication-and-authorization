const {User} = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {SECRET} = process.env

exports.registerNewUser = async (req, res) => {
    //fetch user detail from req body
    User.findOne({username: req.body.username}, (err, existingUser) => {
        if(err){
            return  res.status(500).json({err})
        }
        if(existingUser){
            return res.status(400).json({message: "A user with this username already exist"})
        }
        User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
        },(err, newUser )=>{
            if(err){
                return  res.status(500).json({err})
            }
            //hash password
            bcrypt.genSalt(10, (err, salt) => {
                if (err){
                    return res.status(500).json({err})
                }
                bcrypt.hash(req.body.password, salt, (err, hashedPassword) => {
                    if (err){
                        return res.status(500).json({err})
                    }
                    //save password to database
                    newUser.password = hashedPassword
                    newUser.save((err, savedUser) => {
                        if (err){
                            return res.status(500).json({err})
                        }
                        //create jwt for users
                        jwt.sign({
                                id:  newUser.id,
                                username: newUser.username,
                                firstName: newUser.firstName,
                                lastName: newUser.lastName
                            },
                            SECRET,
                            {
                                expiresIn: 360000
                            }, (err, token) => {
                                if (err){
                                    return res.status(500).json({err})
                                }
                                //send token to user
                                return res.status(200).json(
                                    {message: "User registration successful"},
                                    token
                                )
                            })
                    })
                })
            })
        })

    })
    //check if username exist
    //check if there is no existing username, create a new user



}

// @route POST api/auth/login
// @desc Auth User( staff, managers, admin) and get token
// @access Public
exports.loginUser = async (req, res) => {
// check for error
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()})

    //else
    // destructure request body
    const {email, password } = req.body

    try{
        //initialise user
        let user = await User.findOne({email: email})
        if(!user) return res
            .status(400)
            .json({
                statusCode: 400,
                message: "Invalid credentials"
            });
        //else
        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res
            .status(400)
            .json({
                statusCode: 400,
                message: "Invalid credentials"
            });
        //else
        //there's a match, send token
        //Send payload and signed token
        const payload = {
            user: {
                id: user.id,
            }
        };

        jwt.sign(
            payload,
            SECRET,
            {
                expiresIn: 360000
            },
            (err, token) =>{
                if (err) throw err;
                res.json({
                    statusCode: 200,
                    message: "Logged in successfully",
                    user: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        userRole: user.userRole,
                        isManager: user.isManager,
                        isAdmin: user.isAdmin
                    },
                    token
                })
            }
        )

    }catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
}

// route GET api/auth
// @desc Auth User( staff, managers, admin) and get token
// @access Public
exports.getLoggedInUser = async(req, res) => {
    try{
        // Get user from db
        const user = await User.findById(req.user.id).select(".password");
        res.json({
            statusCode: 200,
            message: "User gotten successfully",
        })
    }catch (err) {
        console.error(err.message)
        res.status(500).send("Server Error")
    }
}