const express = require('express')
const router = express.Router()
const followers_controler = require('../controllers/followers')
const check_auth=require("../middleware/check_auth")
router.post('/getFollowersOfUser',check_auth,followers_controler.getFollowersOfUser)
router.post('/deleteFollow',check_auth,followers_controler.deleteFollow)
router.post('/countFollowersOfUser',check_auth,followers_controler.countFollowersOfUser)
module.exports = router
