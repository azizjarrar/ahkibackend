const express = require('express')
const router = express.Router()
const image_comments_controller = require('../controllers/image_comments_controller')
const check_auth=require("../middleware/check_auth")

router.post('/addCommentToImage',check_auth ,image_comments_controller.addCommentToImage)
router.post('/getCommentsImage', image_comments_controller.getCommentsImage)
router.post('/deleteCommentFromImage',check_auth,image_comments_controller.deleteCommentFromImage)
router.post('/countComments',check_auth,image_comments_controller.countComments)

module.exports = router
