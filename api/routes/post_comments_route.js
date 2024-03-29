const express = require('express')
const router = express.Router()
const comments_controler = require('../controllers/post_comment_controller')
const check_auth=require("../middleware/check_auth")

router.post('/addComment',check_auth ,comments_controler.addComment)
router.post('/getComments', comments_controler.getComments)
router.post('/deleteComment',check_auth,comments_controler.deleteComment)
router.post('/countComments',comments_controler.countComments)

module.exports = router
