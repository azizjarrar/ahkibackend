const express = require('express')
const router = express.Router()
const user_controler = require('../controllers/user_controller')
const check_auth=require("../middleware/check_auth")
router.post('/login', user_controler.login)
router.post('/loginfacebook', user_controler.loginFacebook)
router.post('/register', user_controler.register)
router.get('/GetUserData',check_auth, user_controler.getUserData)
module.exports = router
