const express = require('express')
const router = express.Router()
const likes_controler = require('../controllers/likes_controller')
const check_auth=require("../middleware/check_auth")

router.post('/addLikeToPost',check_auth, likes_controler.addLikeToPost)
router.post('/checklikeToPost', check_auth,likes_controler.checklikeToPost)
router.post('/dislikePost',check_auth,likes_controler.dislikePost)
router.post('/addLikeToComment',check_auth, likes_controler.addLikeToComment)
router.post('/dislikeToComment',check_auth, likes_controler.dislikeToComment)
router.post('/checklikeToComment',check_auth, likes_controler.checklikeToComment)

module.exports = router
