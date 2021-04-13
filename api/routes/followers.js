const express = require('express')
const router = express.Router()
const followers_controler = require('../controllers/followers')
const check_auth=require("../middleware/check_auth")
router.post('/getFollowersOfUser',check_auth,followers_controler.getFollowersOfUser)
router.post('/deleteFollow',check_auth,followers_controler.deleteFollow)
module.exports = router
